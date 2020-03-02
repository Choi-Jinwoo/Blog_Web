<template>
  <div class="main">
    <title-bar></title-bar>
    <ul class="category-list">
      <li class="category-item" @click="getPosts()">전체</li>
      <li
        class="category-item"
        v-for="(category) in categories"
        :key="category.idx"
        @click="getPostsByCategory(category.idx)"
      >{{ category.name }}</li>
    </ul>
    <div class="post-container">
      <post-card v-for="(post, index) in posts" :key="index" :post="post" />
    </div>
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
    getPostsByCategory(categoryIdx) {
      this.getPosts(categoryIdx);
    },
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
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "오류가 발생하였습니다.";
              break;
            case 404:
              message = "새로고침 후 사용해주세요.";
              break;
            case 410:
              message = "로그인 후 사용해주세요";
              break;
            default:
              message = "다시 시도해주세요!";
          }
          this.$swal("오류", message, "error");
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
    @media only screen and (max-width: 768px) {
      font-size: 13px;
      justify-content: center;
    }
    display: flex;
    width: 80%;
    margin: 0 auto;
    padding-left: 2%;
    padding-right: 2%;
    margin-top: 3%;
    margin-bottom: 2%;
    list-style: none;
    .category-item {
      margin-left: 2%;
      &:hover {
        cursor: pointer;
        color: #597cff;
      }
    }
  }
  .post-container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: left;
    flex-wrap: wrap;
    .post-card {
      flex-grow: 1;
      margin: 0 2%;
      margin-bottom: 8%;
    }
  }
}
</style>