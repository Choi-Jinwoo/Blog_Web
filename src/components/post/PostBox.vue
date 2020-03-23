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
      <div class="post-ctrl-bar" v-show="post.fk_user_id === user.id">
        <p @click="$router.push(`/write?post=${post.idx}`)">수정</p>
        <p @click="deletePost">삭제</p>
      </div>
    </div>

    <div class="content">
      <div class="thumbnail">
        <img :src="post.thumbnail" />
      </div>
      <div class="marked-content" v-html="convertedContent" />
    </div>

    <comment-box :user="user" :post-idx="post.idx" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import marked, { MarkedOptions } from "marked";
import hljs from "highlight.js";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { eventBus } from "../../lib/evnetBus";

import CommentBox from "@/components/post/CommentBox/index.vue";
import router from "../../router";

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

type UserType = {
  id: string;
  name: string;
  isAdmin: boolean;
  thumbnail: string;
};

const markedOptions: MarkedOptions = {
  highlight: function(code, lang) {
    if (hljs.getLanguage(lang)) return hljs.highlight(lang, code).value;
    return hljs.highlightAuto(code).value;
  }
};

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  return (
    '<a target="_blank" href="' +
    href +
    '" title="' +
    title +
    '">' +
    text +
    "</a>"
  );
};

marked.setOptions(markedOptions);

@Component({
  components: {
    "comment-box": CommentBox
  }
})
export default class PostBox extends Vue {
  post: PostType = {} as PostType;
  category: CategoryType = {} as CategoryType;
  convertedContent: string = "";
  user: UserType = {} as UserType;

  async mounted() {
    await this.getPost();
    this.getCategory();

    this.convertedContent = marked(this.post.content, { renderer });
    this.getProfile();
  }

  async getProfile() {
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/profile/my`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      });
      const { user } = getDataFromResp(resp);
      this.user = user;
    } catch (err) {}
  }

  async getPost() {
    const idx = this.$route.params.idx;
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/post/${idx}`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      });
      const { post } = getDataFromResp(resp);

      if (post.is_temp) {
        this.$router.push("/notfound");
        return;
      }
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
          this.$router.push("/");
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

  async deletePost() {
    if (!confirm("정말 글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_ADDR}/post/${this.post.idx}`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      });
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 401:
          this.$toasted.error("관리자만 이용할 수 있습니다").goAway(800);
          break;
        case 403:
          this.$toasted.error("본인 글만 삭제할 수 있습니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 글 입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
          break;
      }
    }
  }
}
</script>

<style lang="scss">
@import "~highlight.js/styles/atom-one-dark.css";
@import "../../style/palette.scss";

.post-box {
  color: $gray6;
  padding-bottom: 20rem;

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
        font-size: 0.75rem;
      }
      .user-id {
        font-weight: bold;
        margin-right: 2rem;
      }
    }

    .post-ctrl-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 0.5rem;
      width: 100%;
      p {
        margin-right: 0.5rem;
        font-size: 0.75rem;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
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
        border-radius: 3px;
        background-color: $gray6;

        code {
          padding: 0;
          font-weight: normal;
          font-size: 0.75rem;
          color: $gray1;
          background-color: transparent;
        }
      }

      a {
        text-decoration: underline;
        color: $blue3;
      }

      blockquote {
        box-sizing: border-box;
        margin: 1rem 0;
        padding: 0.25rem 0;
        padding-left: 2%;
        border-left: 5px solid $blue3;
        background-color: $gray0;
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

  .comment-box {
    margin-top: 15rem;
  }
}
</style>