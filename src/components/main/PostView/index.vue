<template>
  <div class="post-view">
    <post-card v-for="(post, index) in posts" :key="index" :post="post"></post-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Token } from "@/lib/Storage";
import getPosts from "@/lib/request/getPosts";

import PostCard from "@/components/main/PostView/PostCard.vue";

import IPost from "@/interface/IPost";
import getCategories from "../../../lib/request/getCategories";
import ICategoryResp from "../../../interface/ICategoryResp";
import ICategory from "../../../interface/ICategory";

@Component({
  components: {
    "post-card": PostCard
  }
})
export default class PostView extends Vue {
  posts: IPost[] = [];
  page: number = 1;

  async created() {
    // FIXME: 중복의 제거가 필요해 보임(초기 받아오는 코드 & 이벤트 발생 코드)
    // FIXME: Error Handling
    let posts = await getPosts(Token.getToken(), {
      page: this.page,
      limit: 8
    });
    this.page += 1;

    if (!posts) posts = [];

    this.posts = await this.initPosts(posts);

    /**
     * Scroll Event(Paging)
     */
    window.addEventListener("scroll", async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // FIXME: Error Handling
        let posts = await getPosts(Token.getToken(), {
          page: this.page,
          limit: 8
        });
        this.page += 1;

        if (!posts) posts = [];

        this.posts = [...this.posts, ...(await this.initPosts(posts))];
      }
    });
  }

  async initPosts(posts: IPost[]): Promise<IPost[]> {
    let categories: ICategoryResp[] | undefined = await getCategories();
    if (!categories) categories = [];

    // 내부 카테고리 map
    const wrappedCategoires: ICategory[] = [];
    categories.forEach(category => {
      wrappedCategoires.push(...category.categories);
    });

    const categoryIdxMap: number[] = wrappedCategoires.map(
      category => category.idx
    );

    posts.forEach(post => {
      let strCategory = "기타";
      if (post.fk_category_idx) {
        const idx = categoryIdxMap.indexOf(post.fk_category_idx);
        if (idx !== -1) {
          strCategory = wrappedCategoires[idx].name;
        }
      }
      post.strCategory = strCategory;
    });

    return posts;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.post-view {
  @media only screen and (max-width: 1300px) {
    width: 100%;
  }

  margin: 80px auto;
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}
</style>