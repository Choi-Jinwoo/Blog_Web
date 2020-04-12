<template>
  <div class="title-box"></div>
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

  async created() {
    let categories: ICategoryResp[] | undefined = await getCategories();
    if (!categories) categories = [];
    this.categories = categories;
  }
}
</script>

<style lang="scss" scoped>
</style>