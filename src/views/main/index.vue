<template>
  <div class="main">
    <post-view :categories="categories" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";

import PostView from "@/components/main/PostView/index.vue";
import getDataFromResp from "../../lib/util/getDataFromResp";

@Component({
  components: {
    "post-view": PostView
  }
})
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
</style>