<template>
  <div class="post-view">
    <post-card v-for="(post, index) in posts" :key="index" :post="post"></post-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { API_ADDR } from "../../../../config/server";

import PostCard from "@/components/main/PostView/PostCard.vue";

type Category = {
  idx: number;
  name: string;
};

type PostResponseType = {
  title: string;
  fk_category_idx: number;
  thumbnail: string;
  fk_user_id: string;
  view: number;
  created_at: Date;
};

type PostType = {
  title: string;
  category: string;
  thumbnail: string;
  authorId: string;
  view: number;
  createdAt: Date;
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

  async mounted() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories } = getDataFromResp(resp);
    this.categories = categories;
    this.categoryIdxMapped = categories.map((category: Category) => {
      return category.idx;
    });

    while (window.innerHeight >= document.body.offsetHeight) {
      this.currentPage += 1;
      const newPosts = await this.getPosts();
      if (!(newPosts && newPosts.length)) {
        break;
      }
    }

    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight * 0.9
      ) {
        this.currentPage += 1;
        this.getPosts();
      }
    });
  }

  async getPosts() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/post?page=${this.currentPage}&limit=10`
      );

      const { posts } = getDataFromResp(resp);

      const newPosts: PostType[] = posts.map((resPost: PostResponseType) => {
        const categoryIdx = this.categoryIdxMapped.indexOf(
          resPost.fk_category_idx
        );
        const categoryName =
          categoryIdx !== -1 ? this.categories[categoryIdx].name : "기타";

        console.log(resPost);
        const post: PostType = {
          title: resPost.title,
          category: categoryName,
          thumbnail: resPost.thumbnail,
          authorId: resPost.fk_user_id,
          view: resPost.view,
          createdAt: resPost.created_at
        };
        return post;
      });

      this.posts = [...this.posts, ...newPosts];
      return newPosts;
    } catch (err) {
      // TODO: Catch Error
      console.log(err);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.post-view {
  display: flex;
  flex-wrap: wrap;
  background-color: $gray2;
  min-height: 100vh;
  .post-card {
    @media only screen and (max-width: 945px) {
      max-width: 100%;
    }
    flex-grow: 1;
    margin: 1rem;
    width: calc(20% - 2rem);
    min-width: 14rem;
    max-width: calc(50% - 2rem);
    max-height: 20rem;
  }
}
</style>