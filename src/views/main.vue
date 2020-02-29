<template>
  <div class="main">
    <title-bar></title-bar>
    <ul class="category-list">
      <li class="category-item">전체</li>
      <li
        class="category-itme"
        v-for="(category, index) in categories"
        :key="index"
      >{{ category.name }}</li>
    </ul>
    <div class="post-container">
      <post-card v-for="(post, index) in posts" :key="index" :post="post" />
    </div>
    <footer class="end-bar">풋바</footer>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import SERVER_ENV from "../../env/server";

import postCard from "@/components/main/postCard";
import titleBar from "@/components/main/titleBar";

export default {
  data() {
    return {
      posts: [],
      categories: []
    };
  },
  mounted() {
    // category 조회
    axios
      .get(`${SERVER_ENV.API_ADDR}/category`)
      .then(resp => {
        const { data } = resp.data;
        this.categories = data.categories;
        this.getPosts();
      })
      .catch(err => {
        this.$swal("오류", "다시 시도주세요", "error");
      });
  },
  methods: {
    getPosts(category, order) {
      let url = `${SERVER_ENV.API_ADDR}/post`;
      if (category) {
        url = `${url}?category=${category}`;
        if (order) {
          url = `${url}&order=${order}`;
        }
      } else if (order) {
        url = `${url}?order=${order}`;
      }
      console.log(url);
      axios
        .get(url, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          const { data } = resp.data;
          const { posts } = data;
          this.posts = data.posts.map(data => {
            const post = {
              idx: data.idx,
              title: data.title,
              thumbnail: data.thumbnail,
              createdAt: moment(data.created_at).format("YYYY-MM-DD"),
              category: this.getCategoryByIdx(data.fk_category_idx)
            };
            return post;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCategoryByIdx(category_idx) {
      const categoriesIdx = this.categories.map(category => {
        return category.idx;
      });

      const categoryIdxInArr = categoriesIdx.indexOf(category_idx);
      if (categoryIdxInArr === -1) {
        return "";
      }
      return this.categories[categoryIdxInArr].name;
    }
  },
  components: {
    "post-card": postCard,
    "title-bar": titleBar
  }
};
</script>

<style lang="scss" scoped>
.main {
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
  min-height: 100vh;
  position: relative;
  .category-list {
    display: flex;
    list-style: none;
    width: 60%;
    margin: 0 auto;
    margin-bottom: 3%;
    .category-item {
      margin-left: 3%;
      padding-right: 2%;
    }
  }
  .post-container {
    width: 60%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: left;
    flex-wrap: wrap;
    .post-card {
      margin: 0 4.16%;
      margin-bottom: 8%;
    }
  }
  .end-bar {
    position: absolute;
    background-color: black;
    bottom: 0;
    width: 100%;
  }
}
</style>