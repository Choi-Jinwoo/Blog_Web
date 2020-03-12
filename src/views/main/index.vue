<template>
  <div class="main">
    <div class="side-bar-container">
      <side-bar></side-bar>
    </div>
    <post-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import getDataFromResp from "../../lib/util/getDataFromResp";
import { API_ADDR } from "../../../config/server";

import SideBar from "@/components/main/SideBar.vue";
import PostView from "@/components/main/PostView/index.vue";

@Component({
  components: {
    "side-bar": SideBar,
    "post-view": PostView
  }
})
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
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
    width: 25%;
    .side-bar {
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
    width: 75%;
  }
}
</style>