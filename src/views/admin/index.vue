<template>
  <div class="admin">
    <div class="notice-box"></div>
    <div class="category-box"></div>
    <notice-form />
    <category-form />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";

import NoticeForm from "@/components/admin/NoticeForm.vue";
import CategoryForm from "../../components/admin/CategoryForm/index.vue";

@Component({
  components: {
    "notice-form": NoticeForm,
    "category-form": CategoryForm
  }
})
export default class Admin extends Vue {}
</script>

<style lang="scss" scoped>
.admin {
}
</style>