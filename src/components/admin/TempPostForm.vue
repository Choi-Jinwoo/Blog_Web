<template>
  <div class="temp-post-form">
    <h2>임시 글</h2>
    <div class="temp-post-box">
      <div
        class="temp-post"
        v-for="(post, index) in posts"
        :key="index"
        @click="$router.push(`/write?post=${post.idx}`)"
      >{{ post.title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import { Token } from "@/lib/Storage";
import getDataFromResp from "@/lib/util/getDataFromResp";

@Component
export default class TempPostForm extends Vue {
  posts = [];

  async mounted() {
    this.getTempPost();
  }

  async getTempPost() {
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/post/temp`, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });
      const { posts } = getDataFromResp(resp);
      this.posts = posts;
    } catch (err) {
      switch (err.response.status) {
        case 401:
        case 403:
          alert("관리자만 이용가능합니다");
          this.$router.push("/");
          return;
        case 410:
          alert("로그인 정보 만료로 재 로그인 후 이용해주세요");
          return;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.temp-post-form {
  box-sizing: border-box;
  padding: 1rem;
  border: 1px $gray3 solid;
  h2 {
    margin: 0;
    padding: 0;
    color: $gray6;
  }

  .temp-post-box {
    .temp-post {
      box-sizing: border-box;
      margin: 0.25rem;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>