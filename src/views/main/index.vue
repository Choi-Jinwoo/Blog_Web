<template>
  <div class="main">
    <title-box></title-box>
    <post-view></post-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import getDataFromResp from "../../lib/util/getDataFromResp";
import { API_ADDR } from "../../../config/server";

import Header from "@/components/common/Header/index.vue";
import TitleBox from "@/components/main/TitleBox.vue";
import PostView from "@/components/main/PostView/index.vue";

@Component({
  components: {
    TitleBox,
    PostView,
    Header
  }
})
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.main {
  background-color: $gray0;
  .title-box {
    z-index: 200;
  }
}
</style>