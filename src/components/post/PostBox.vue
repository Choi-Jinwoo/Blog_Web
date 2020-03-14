<template>
  <div class="post-box">
    <div class="title">
      <p
        class="category"
        @click="$router.push(`/?category=${post.fk_category_idx}`)"
      >{{ category.name }}</p>
      <h1>{{ post.title }}</h1>
      <div class="post-info">
        <p class="user-id">{{ post.fk_user_id }}</p>
        <p>{{ post.created_at }}</p>
      </div>
    </div>

    <div class="content">
      <div class="thumbnail">
        <img :src="post.thumbnail" />
      </div>
      <div class="marked-content" v-html="convertedContent" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import marked from "marked";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { eventBus } from "../../lib/evnetBus";

type PostType = {
  idx: number;
  title: string;
  content: string;
  thumbnail: string;
  fk_category_idx: number;
  fk_user_id: string;
  created_at: Date | string;
};

type CategoryType = {
  idx: number | null;
  name: string;
};

@Component
export default class PostBox extends Vue {
  post: PostType = {} as PostType;
  category: CategoryType = {} as CategoryType;
  convertedContent: string = "";

  async mounted() {
    await this.getPost();
    this.getCategory();
    this.convertedContent = marked(this.post.content);
  }

  async getPost() {
    const idx = this.$route.params.idx;
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/post/${idx}`);
      const { post } = getDataFromResp(resp);
      post.created_at = moment(post.created_at).format("YYYY-MM-DD");
      this.post = post;
    } catch (err) {
      switch (err.response.status) {
        case 400:
        case 404:
          this.$router.push("/notfound");
          return;
        case 403:
          alert("비공개 글입니다");
          return;
        default:
          alert("오류가 발생하였습니다");
          return;
      }
    }
  }

  async getCategory() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/category/${this.post.fk_category_idx}`
      );
      const { category } = getDataFromResp(resp);
      this.category = category;
    } catch (err) {
      this.category = {
        idx: null,
        name: "기타"
      };
    }
  }
}
</script>

<style lang="scss">
@import "../../style/palette.scss";
@import url("https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding&display=swap");

.post-box {
  color: $gray6;

  .title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-bottom: 1rem;
    border-bottom: 1px $gray3 solid;

    .category {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    p {
      margin: 0;
      margin-left: 2rem;
      padding: 0;
      font-size: 1rem;
    }

    h1 {
      @media only screen and (max-width: 945px) {
        font-size: 2rem;
      }
      margin: 0;
      margin-bottom: 0.75rem;
      padding: 0;
      font-size: 4rem;
    }
    .post-info {
      display: flex;

      p {
        margin: 0;
        font-size: 0.75rem;
      }
      .user-id {
        font-weight: bold;
        margin-right: 2rem;
      }
    }
  }

  .content {
    max-width: 100%;
    font-size: 110%;
    .thumbnail {
      img {
        display: block;
        max-width: 100%;
        margin: 0 auto;
        margin-top: 4rem;
        margin-bottom: 4rem;
      }
    }

    .marked-content {
      img {
        display: block;
        max-width: 100%;
      }

      code {
        padding: 0.3rem;
        font-weight: bold;
        font-family: "Nanum Gothic Coding";
        background-color: $red1;
        color: $red6;
      }

      pre {
        overflow: auto;
        box-sizing: border-box;
        width: 100%;
        padding: 1rem;
        border: $gray3 1px solid;
        border-radius: 3px;
        background-color: $gray1;

        code {
          padding: 0;
          font-weight: normal;
          color: #000000;
          background-color: transparent;
        }
      }

      a {
        text-decoration: none;
        color: $blue3;
      }

      blockquote {
        box-sizing: border-box;
        margin: 0;
        padding-left: 2%;
        border-left: 5px solid $blue3;
        background-color: $gray1;
      }

      table {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        border: solid 1px $gray6;
        border-collapse: collapse;
        text-align: center;
      }

      th,
      td {
        padding: 0;
        text-align: center;
        border: solid 1px $gray6;
      }
    }
  }
}
</style>