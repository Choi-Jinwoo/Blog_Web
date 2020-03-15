<template>
  <div class="category-form">
    <h2>Category</h2>
    <div class="category-input">
      <input type="text" v-model="createName" />
      <p @click="createCategory">등록</p>
    </div>
    <div class="category-container">
      <Category
        v-for="(category, index) in categories"
        :key="index"
        :category="category"
        @category-change="getCategories"
      ></Category>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Category from "./Category.vue";
import { API_ADDR } from "../../../../config/server";
import getDataFromResp from "../../../lib/util/getDataFromResp";

type CategoryType = {
  idx: number;
  name: string;
};

@Component({
  components: {
    Category
  }
})
export default class CategoryForm extends Vue {
  categories: CategoryType[] = [];
  createName!: string;
  async mounted() {
    await this.getCategories();
  }

  async getCategories() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories } = getDataFromResp(resp);
    this.categories = categories;
  }

  async createCategory() {
    try {
      await axios.post(
        `${API_ADDR}/category`,
        {
          name: this.createName
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        }
      );

      this.getCategories();
      this.$toasted.success("등록되었습니다").goAway(800);
      this.createName = "";
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 401:
        case 403:
          this.$toasted.error("관리자만 이용가능합니다").goAway(800);
          this.$router.push("/");
          break;
        case 409:
          this.$toasted.error("중복된 카테고리입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.category-form {
  box-sizing: border-box;
  padding: 1rem;
  border: 1px $gray3 solid;
  h2 {
    margin: 0;
    margin-bottom: 1.25rem;
    padding: 0;
    color: $gray6;
  }
  .category-input {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    input {
      border: 1px $gray3 solid;
      border-radius: 3px;
      padding: 0.25rem;
      &:focus {
        outline: none;
      }
    }

    p {
      margin: 0;
      margin-left: 1rem;
      padding: 0;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .category-container {
    .category {
      margin: 0.25rem 0;
    }
  }
}
</style>
