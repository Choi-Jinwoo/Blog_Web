<template>
  <div class="post-card">
    <div class="thumbnail-wrapper">
      <img :src="post.thumbnail" alt />
    </div>

    <div class="post-info">
      <div class="top-bar">
        <p class="category">{{ post.strCategory }}</p>
        <p class="released-at">{{ strReleasedAt }}</p>
      </div>

      <h1 class="title">{{ post.title }}</h1>
      <p class="view">{{ post.view }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import moment from "moment";
import IPost from "../../../interface/IPost";

@Component
export default class PostCard extends Vue {
  @Prop(Object)
  post!: IPost;

  get strReleasedAt(): string {
    if (!this.post.released_at) return "";
    return moment(this.post.released_at).format("YYYY년 MM월 DD일");
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

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

  .post-info {
    padding: 0 1rem;
    p,
    h1 {
      padding: 0;
      margin: 0;
    }

    p {
      font-size: 0.75rem;
      color: $blue2;
    }

    h1 {
      font-size: 1.5rem;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .category {
        width: 3rem;
      }
    }
  }
}
</style>