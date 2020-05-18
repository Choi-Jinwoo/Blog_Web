<template>
  <div class="category-form">
    <div class="category-container">
      <WrapperCategory
        v-for="(category, index) in categories"
        :key="index"
        :wrapperCategory="category"
      ></WrapperCategory>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ICategoryResp from "../../../interface/ICategoryResp";
import getCategories from "../../../lib/request/getCategories";

import WrapperCategory from "./WrapperCategory.vue";

@Component({
  components: {
    WrapperCategory
  }
})
export default class CategoryForm extends Vue {
  categories: ICategoryResp[] = [];

  createName: string = "";

  async created() {
    const categories: ICategoryResp[] = (await getCategories()) || [];
    this.categories = categories;
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
