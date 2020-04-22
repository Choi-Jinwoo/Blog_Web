<template>
  <div class="title-box">
    <div class="title">
      <h1>適者生存</h1>
      <p>적는 자만이 살아남는다</p>
    </div>

    <div class="category-box">
      <div
        class="wrapper-category"
        v-for="(wrapperCategory) in categories"
        :key="wrapperCategory.idx"
        @mouseover="showCategoryIdx = wrapperCategory.idx"
        @mouseleave="showCategoryIdx = null"
      >
        <b>
          <p>{{ wrapperCategory.name }}</p>
        </b>

        <div
          class="wrapped-category-box"
          v-show="showCategoryIdx === wrapperCategory.idx"
          @mouseleave="showCategoryIdx = null"
        >
          <div
            class="wrapped-category"
            v-for="(wrappedCategory) in wrapperCategory.categories"
            :key="wrappedCategory.idx"
          >
            <p>{{ wrappedCategory.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import getCategories from "@/lib/request/getCategories";

import ICategory from "@/interface/ICategory";
import ICategoryResp from "@/interface/ICategoryResp";

@Component
export default class TitleBox extends Vue {
  /**
   * categories - 응답 받은 카테고리 배열
   */
  categories: ICategoryResp[] = [];
  showCategoryIdx: number | null = null;

  async created() {
    // FIXME: Error Handling
    let categories: ICategoryResp[] | undefined = await getCategories();
    if (!categories) categories = [];
    this.categories = categories;
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.title-box {
  display: flex;
  position: relative;
  flex-direction: column;
  margin-top: 3.5rem;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  color: $gray6;

  .title {
    h1,
    p {
      margin: 0;
      padding: 0;
    }

    h1 {
      font-size: 2.5rem;
    }
  }

  .category-box {
    position: absolute;
    top: 6rem;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    .wrapper-category {
      margin-top: 2rem;
      width: 6rem;
      font-size: 1rem;
      color: $gray3;
      border: 1px solid transparent;
      background-color: $gray0;
      cursor: pointer;

      &:hover {
        color: $gray6;
        border: 1px solid $gray3;
        border-radius: 3px;
      }

      p {
        margin: 0 !important;
        padding: 0.25rem 0 !important;
      }

      .wrapped-category-box {
        margin: 1rem 0;

        .wrapped-category {
          font-size: 0.75rem;
          color: $gray5;

          &:hover {
            color: $gray6;
          }
        }
      }
    }
  }
}
</style>