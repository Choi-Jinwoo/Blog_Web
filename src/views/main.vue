<template>
  <div class="main">
    <div class="title-bar">
      <button>로그인</button>
      <h1>Jinwoo Tech Blog</h1>
    </div>
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
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import postCard from "@/components/main/postCard";
import SERVER_ENV from "../../env/server";

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

        axios
          .get(`${SERVER_ENV.API_ADDR}/post`, {
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
      })
      .catch(err => {
        this.$swal("오류", "다시 시도주세요", "error");
      });
  },
  methods: {
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
    "post-card": postCard
  }
};
</script>

<style lang="scss" scoped>
.main {
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .title-bar {
    background-color: #0097e6;
    color: #ffffff;
  }
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
      margin-bottom: 3%;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>