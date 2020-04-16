<template>
  <div class="post-card">
    <div class="thumbnail-wrapper">
      <img :src="post.thumbnail" alt />
    </div>

    <div class="post-info">
      <p>{{ post.strCategory }}</p>
      <h1>{{ post.title }}</h1>
      <p>{{ post.released_at }}</p>
      <p>{{ post.view }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import IPost from "../../../interface/IPost";

@Component
export default class PostCard extends Vue {
  @Prop(Object)
  post!: IPost;
}
</script>

<style lang="scss" scoped>
.post-card {
  box-sizing: border-box;
  width: calc(100% / 3);
  padding: 0 20px;

  .thumbnail-wrapper {
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }
}
</style>