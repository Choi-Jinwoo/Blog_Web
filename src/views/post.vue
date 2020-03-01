<template>
  <div class="post">
    <div class="post-container">
      <div class="post-title">{{ post.title }}</div>
      <div class="post-content">{{ convertedContent }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../env/server";
import marked from "marked";

export default {
  data() {
    return {
      post: Object,
      convertedContent: ""
    };
  },
  mounted() {
    axios
      .get(`${SERVER_ENV.API_ADDR}/post/${this.$route.params.idx}`)
      .then(resp => {
        const { data } = resp.data;
        const { post } = data;
        this.post = post;
        marked.setOptions({
          renderer: new marked.Renderer(),
          gfm: true,
          headerIds: false,
          tables: true,
          breaks: true,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false
        });
        this.convertedContent = marked(this.post.content);
      })
      .catch(err => {});
  }
};
</script>

<style lang="scss" scoped>
.post {
  text-align: center;
  background-color: #f5f6fa;
  .post-container {
    width: 60%;
    margin: 0 auto;
    .post-title {
      font-size: 35px;
      font-weight: bold;
    }
    .post-content {
      text-align: left;
    }
  }
}
</style>