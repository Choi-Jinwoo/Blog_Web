<template>
  <div class="post-view">
    <post-card v-for="(post, index) in posts" :key="index" :post="post"></post-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import moment from "moment";
import { Token } from "@/lib/Storage";
import getPosts from "@/lib/request/getPosts";

import PostCard from "@/components/main/PostView/PostCard.vue";

import IPost from "@/interface/IPost";

@Component({
  components: {
    "post-card": PostCard
  }
})
export default class PostView extends Vue {
  posts: IPost[] = [];
  page: number = 1;

  async created() {
    let posts = await getPosts(Token.getToken(), {
      page: this.page,
      limit: 20
    });
    if (!posts) posts = [];
    this.posts = posts;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";
</style>