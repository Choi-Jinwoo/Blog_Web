<template>
  <div class="post-card">
    <div class="thumbnail-wrapper">
      <img :src="post.thumbnail" alt />
      asdf
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
  background-color: red;

  .thumbnail-wrapper {
    img {
      height: 12rem;
      object-fit: cover;
    }
  }
}
</style>