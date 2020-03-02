<template>
  <div class="post-card" @click="goPostPage">
    <img v-bind:src="post.thumbnail" v-bind:alt="post.title" />
    <div class="info-container">
      <h5 class="category">{{ post.category }}</h5>
      <h2 class="title" v-bind:title="post.title">{{ post.title }}</h2>
      <h6 class="created-at">{{ post.createdAt }}</h6>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    post: Object
  },
  methods: {
    goPostPage() {
      this.$router.push(`/post/${this.post.idx}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.post-card {
  @media only screen and (max-width: 768px) {
    max-width: 100%;
  }
  box-shadow: 0 5px 20px rgba($color: #000000, $alpha: 0.15);
  display: inline-block;
  background-color: #ffffff;
  width: 21%;
  border-radius: 2px;
  margin: 0;
  padding: 0;
  min-width: 200px;
  max-width: 46%;
  max-height: 400px;
  color: #597cff;
  img {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    width: 100%;
    height: 28vh;
    object-fit: cover;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
      padding: 0;
    }

    .category {
      text-align: left;
      margin-left: 5%;
      color: #b2bec3;
      margin-top: 3%;
      font-weight: normal;
    }

    .title {
      margin-left: 4%;
      font-size: 20px;
      margin-top: 4%;
      text-align: right;
      padding-right: 8%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .created-at {
      color: #30336b;
      font-weight: normal;
      text-align: right;
      padding-right: 8%;
      margin-bottom: 8%;
    }
  }
  &:hover {
    cursor: pointer;
    transform: scale(1.03);
  }
}
</style>