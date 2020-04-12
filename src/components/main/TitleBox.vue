<template>
  <div class="title-box">
    <div class="title">
      <h1>適者生存</h1>
      <p>적는 자만이 살아남는다</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";
import getCategories from "@/lib/request/getCategories";

import ICategory from "@/interface/ICategory";
import ICategoryResp from "@/interface/ICategoryResp";

@Component
export default class TitleBox extends Vue {
  /**
   * categories - 응답 받은 카테고리 배열
   */
  categories: ICategoryResp[] = [];
  showDetailCategory: boolean = false;

  async created() {
    let categories: ICategoryResp[] | undefined = await getCategories();
    if (!categories) categories = [];
    this.categories = categories;
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.title-box {
  margin-top: 3.5rem;
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
}
</style>