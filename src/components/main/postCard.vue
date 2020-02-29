<template>
  <div class="post-card">
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
  data: function() {
    return {};
  },
  props: {
    post: Object
  }
};
</script>

<style lang="scss" scoped>
.post-card {
  box-shadow: 0 5px 20px rgba($color: #000000, $alpha: 0.3);
  display: inline-block;
  background-color: #ffffff;
  width: 25%;
  border-radius: 5px;
  margin: 0;
  padding: 0;
  min-width: 180px;
  max-height: 400px;
  img {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
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
      font-size: 25px;
      margin-top: 4%;
      text-align: right;
      padding-right: 8%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .created-at {
      color: #636e72;
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