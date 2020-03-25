<template>
  <div class="post-view">
    <post-card v-for="(post, index) in posts" :key="index" :post="post"></post-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { eventBus } from "@/lib/evnetBus";
import { API_ADDR } from "../../../../config/server";

import PostCard from "@/components/main/PostView/PostCard.vue";
import moment from "moment";
import { Token } from "../../../lib/Storage";

type Category = {
  idx: number;
  name: string;
};

type PostResponseType = {
  idx: number;
  title: string;
  fk_category_idx: number;
  thumbnail: string;
  fk_user_id: string;
  view: number;
  created_at: Date;
};

type PostType = {
  idx: number;
  title: string;
  category: string;
  thumbnail: string;
  authorId: string;
  view: number;
  createdAt: string;
};

type GetPostOptionsType = {
  category: number;
  order: number;
};

@Component({
  components: {
    "post-card": PostCard
  }
})
export default class PostView extends Vue {
  posts: PostType[] = [];
  currentPage: number = 0;
  categories!: Category[];
  categoryIdxMapped!: number[];
  loadAll: Boolean = false;
  category!: number | null;

  async mounted() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories } = getDataFromResp(resp);
    this.categories = categories;
    this.categoryIdxMapped = categories.map((category: Category) => {
      return category.idx;
    });

    if (this.$route.query.category) {
      const categoryIdx = Number(this.$route.query.category);

      if (this.categoryIdxMapped.indexOf(categoryIdx) === -1) {
        this.$router.push("/notfound");
        return;
      }

      this.category = categoryIdx;
    }

    this.getPosts();

    window.addEventListener("scroll", async () => {
      if (this.loadAll) {
        return;
      }

      if (
        document.body.scrollTop + document.body.clientHeight >=
        document.body.offsetHeight
      ) {
        const newPosts = await this.getPosts();
        this.loadAll = newPosts && newPosts.length ? false : true;
      }
    });

    eventBus.$on("select-category", async (idx: number) => {
      if (idx === null) {
        this.$router.push({
          path: "/",
          query: {}
        });
      }
      this.category = idx;
      this.posts = [];
      this.initView();
      this.getPosts();
    });

    eventBus.$on("find-post", async (query: string) => {
      this.findPost(query);
    });
  }

  async initView() {
    this.currentPage = 0;
    this.loadAll = false;
  }

  formatPost(posts: PostResponseType[]): PostType[] {
    return posts.map((resPost: PostResponseType) => {
      const categoryIdx = this.categoryIdxMapped.indexOf(
        resPost.fk_category_idx
      );
      const categoryName =
        categoryIdx !== -1 ? this.categories[categoryIdx].name : "기타";

      const post: PostType = {
        idx: resPost.idx,
        title: resPost.title,
        category: categoryName,
        thumbnail: resPost.thumbnail,
        authorId: resPost.fk_user_id,
        view: resPost.view,
        createdAt: moment(resPost.created_at).format("YYYY-MM-DD")
      };

      return post;
    });
  }

  async getPosts() {
    this.currentPage += 1;
    let url = `${API_ADDR}/post?page=${this.currentPage}&limit=10`;
    if (this.category) {
      url += `&category=${this.category}`;
    }
    try {
      const resp: AxiosResponse = await axios.get(url, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });

      const { posts } = getDataFromResp(resp);

      const newPosts: PostType[] = this.formatPost(posts);
      this.posts.push(...newPosts);
      return newPosts;
    } catch (err) {
      switch (err.response.status) {
        case 404:
          this.$toasted.error("삭제된 카테고리 입니다").goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
          break;
      }
    }
  }

  async findPost(query: string) {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/post/find?query=${query}`,
        {
          headers: {
            "x-access-token": Token.getToken()
          }
        }
      );
      const { posts } = getDataFromResp(resp);
      this.posts = this.formatPost(posts);
    } catch (err) {
      this.$toasted.error("오류가 발생하였습니다").goAway(800);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";
.post-view {
  display: flex;
  flex-wrap: wrap;
  .post-card {
    @media only screen and (max-width: 945px) {
      max-width: 100%;
    }
    flex-grow: 1;
    margin: 1rem;
    width: calc(25% - 2rem);
    min-width: 14rem;
    max-width: calc(50% - 2rem);
    max-height: 20rem;
    cursor: pointer;
  }
}
</style>