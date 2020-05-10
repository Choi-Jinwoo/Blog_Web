<template>
  <div class="category-form">
    <h2>Category</h2>
    <div class="category-input">
      <input type="text" v-model="createName" />
      <p @click="createCategory">등록</p>
    </div>
    <div class="category-container">
      <Category v-for="(category, index) in categories" :key="index" :category="category"></Category>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Category from "./Category.vue";
import { API_ADDR } from "../../../../config/server";
import { Token } from "@/lib/Storage";
import getDataFromResp from "../../../lib/util/getDataFromResp";
import ICategory from "../../../interface/ICategory";
import ICategoryResp from "../../../interface/ICategoryResp";
import getCategories from "../../../lib/request/getCategories";
import { eventBus } from "../../../lib/evnetBus";

@Component({
  components: {
    Category
  }
})
export default class CategoryForm extends Vue {
  categories: ICategoryResp[] = [];
  wrappedCategories: ICategory[] = [];

  createName: string = "";

  async created() {
    const categories: ICategoryResp[] = (await getCategories()) || [];
    const wrappedCategories: ICategory[] = [];

    // 내부 카테고리 map
    categories.forEach(categories => {
      wrappedCategories.push(...categories.categories);
    });

    this.categories = categories;
    this.wrappedCategories = wrappedCategories;
  }

  // CreateCategory
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
