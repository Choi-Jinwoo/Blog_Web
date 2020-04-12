<template>
  <div class="main">
    <Header></Header>
    <title-box></title-box>
    <post-view />
    <div class="subscribe-btn" @click="$router.push('/subscribe')">Subscribe</div>
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
@import "../../style/palette";

.main {
  @media only screen and (max-width: 945px) {
    flex-direction: column;
  }
  display: flex;
  .side-bar-container {
    @media only screen and (max-width: 945px) {
      width: 100%;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 24%;
    .side-bar {
      margin-top: 3.5rem;
      @media only screen and (max-width: 945px) {
        position: initial;
      }
      position: fixed;
      overflow: auto;
    }
  }
  .post-view {
    @media only screen and (max-width: 945px) {
      width: 100%;
    }
    width: 76%;
  }

  .subscribe-btn {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 6rem;
    height: 2.5rem;
    bottom: 1.5rem;
    right: 1.5rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    border: 1.2px $gray6 solid;
    background-color: #ffffff;
    color: $gray6;
    cursor: pointer;
    &:hover {
      background-color: $gray6;
      color: #ffffff;
    }
  }
}
</style>