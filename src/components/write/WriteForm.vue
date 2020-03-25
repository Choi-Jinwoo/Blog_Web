<template>
  <div class="write-form">
    <div class="input-box" v-if="!activeWriteOption">
      <div class="title">
        <input type="text" placeholder="제목을 입력하세요" v-model="post.title" />
      </div>

      <div class="content-container">
        <textarea
          v-model="post.content"
          placeholder="내용을 작성해주세요"
          @drop.prevent="uploadWithDrop"
          @paste="uploadWithPaste"
        ></textarea>
      </div>
    </div>

    <!-- Upload Post Mode -->
    <div class="upload-post-box" v-else>
      <input
        type="file"
        id="thumbnail-upload-input"
        @change="uploadThumbnail"
        style="display: none"
      />
      <h2>{{ post.title }}</h2>

      <div class="thumbnail-box">
        <div class="upload-thumbnail">
          <img :src="thumbnailURL" />
        </div>
        <Btn text="썸네일 업로드" size="medium" @click="onClickUploadThumbnail" />
      </div>

      <div class="private-box">
        <div
          class="private"
          @click="post.is_private = !post.is_private"
        >{{ post.is_private ? '비공개' : '공개' }}</div>
      </div>

      <div class="category-box">
        <select class="category-select" v-model="post.category_idx">
          <option
            v-for="category in categories"
            :key="category.idx"
            :value="category.idx"
          >{{ category.name }}</option>
        </select>
      </div>

      <div class="save-box">
        <Btn text="업로드" size="medium" @click="createPost" />
        <Btn text="임시저장" size="medium" @click="tempSave" />
      </div>
    </div>

    <div class="result-box">
      <h1>{{ post.title }}</h1>
      <div class="result-container" v-html="convertedContent"></div>
    </div>

    <div class="write-option">
      <img
        class="active-option-btn"
        src="../../assets/svg/write_upload.svg"
        v-show="!activeWriteOption"
        @click="activeWriteOption = true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import marked, { MarkedOptions } from "marked";
import hljs from "highlight.js";
import axios, { AxiosResponse } from "axios";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { Token } from "@/lib/Storage";
import { API_ADDR } from "../../../config/server";

import Btn from "@/components/common/Btn/index.vue";

type PostType = {
  title: string;
  content: string;
  thumbnail: string;
  category_idx: number;
  is_private: boolean;
  is_temp: boolean;
};

type CategoryType = {
  idx: number;
  name: string;
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
    Btn
  }
})
export default class Write extends Vue {
  post: PostType = {
    content: "",
    is_private: false
  } as PostType;

  modifyIdx!: number;

  categories: CategoryType[] = [];

  thumbnailURL: string = "";

  activeWriteOption: boolean = false;

  async mounted() {
    const isAdmin = await this.getProfile();
    if (!isAdmin) {
      alert("관리자만 접근 가능합니다");
      this.$router.push("/");
    }

    if (this.$route.query.post) {
      this.getPost();
    }

    this.getCategories();
  }

  get convertedContent() {
    return marked(this.post.content, { renderer });
  }

  async getPost() {
    const idx = this.$route.query.post;
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/post/${idx}?image=raw`,
        {
          headers: {
            "x-access-token": Token.getToken()
          }
        }
      );
      const { post } = getDataFromResp(resp);

      this.modifyIdx = post.idx;
      this.post.title = post.title;
      this.post.content = post.content;
      this.post.thumbnail = post.thumbnail;
      this.post.category_idx = post.fk_category_idx;
      this.post.is_private = post.is_private;
      if (post.thumbnail)
        this.thumbnailURL = await this.createURL(post.thumbnail);
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

  async getProfile() {
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/profile/my`, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });

      const { user: resUser } = getDataFromResp(resp);

      return resUser.is_admin;
    } catch (err) {
      switch (err.response.status) {
        case 400:
        case 401:
        case 404:
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
      }
      this.$router.push("/");
    }
  }

  async getCategories() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories } = getDataFromResp(resp);
    this.categories = categories;
  }

  async modifyPost(post: any) {
    try {
      await axios.put(`${API_ADDR}/post/${this.modifyIdx}`, post, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });

      alert("글 수정이 완료되었습니다");
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          return;
        case 401:
        case 403:
          this.$toasted.error("관리자만 이용할 수 있습니다").goAway(800);
          return;
        case 404:
          this.$toasted.error("삭제된 카테고리 입니다").goAway(800);
          return;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          return;
      }
    }
  }

  async createPost() {
    const post: PostType = {
      title: this.post.title,
      content: this.post.content,
      thumbnail: this.post.thumbnail,
      is_private: this.post.is_private,
      category_idx: this.post.category_idx,
      is_temp: false
    };

    if (this.modifyIdx) {
      this.modifyPost(post);
      return;
    }

    delete post.is_temp;

    try {
      await axios.post(`${API_ADDR}/post`, post, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });
      alert("글 업로드가 완료되었습니다");
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 401:
        case 403:
          this.$toasted.error("관리자만 이용할 수 있습니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 카테고리 입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
      }
    }
  }

  async tempSave() {
    const post: any = {
      title: this.post.title,
      content: this.post.content,
      thumbnail: this.post.thumbnail,
      is_private: this.post.is_private,
      category_idx: this.post.category_idx,
      is_temp: true
    };

    if (this.modifyIdx) {
      post.is_temp = true;
      this.modifyPost(post);
      return;
    }

    delete post.is_temp;

    try {
      await axios.post(`${API_ADDR}/post/temp`, post, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });
      alert("임시저장이 완료되었습니다");
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("제목이 필요합니다").goAway(800);
          break;
        case 401:
        case 403:
          this.$toasted.error("관리자만 이용할 수 있습니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 카테고리 입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
      }
    }
  }

  async uploadWithDrop(e: any) {
    const reqFiles = e.target.files || e.dataTransfer.files;
    const formData = new FormData();
    formData.append("files", reqFiles[0]);
    this.uploadFiles(formData, e);
  }

  async uploadWithPaste(e: any) {
    const reqFiles = e.clipboardData.files;
    if (!reqFiles.length) {
      return;
    }
    e.prevent;
    const formData = new FormData();
    formData.append("files", reqFiles[0]);
    this.uploadFiles(formData, e);
  }

  async onClickUploadThumbnail() {
    document.getElementById("thumbnail-upload-input")!.click();
  }

  async uploadThumbnail(e: any) {
    const formData = new FormData();
    const [file] = e.target.files;
    formData.append("files", file);

    const resp: AxiosResponse = await axios.post(
      `${API_ADDR}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const { files } = getDataFromResp(resp);
    this.post.thumbnail = files[0];
    this.thumbnailURL = await this.createURL(files[0]);
  }

  async uploadFiles(formData: FormData, e: any) {
    const resp: AxiosResponse = await axios.post(
      `${API_ADDR}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const { files } = getDataFromResp(resp);
    files.forEach(async (file: string) => {
      const url = await this.createURL(file);
      const cursorStart = e.target.selectionStart;
      const cursorEnd = e.target.selectionEnd;

      const beforeText = this.post.content.substring(0, cursorStart);
      const afterText = this.post.content.substring(
        cursorEnd,
        this.post.content.length
      );

      this.post.content = `${beforeText} ![이미지](${encodeURI(
        url
      )}) ${afterText}`;
    });
  }

  async createURL(fileName: string): Promise<string> {
    const resp: AxiosResponse = await axios.post(
      `${API_ADDR}/file/create-url`,
      {
        file_name: fileName
      }
    );

    const { url } = getDataFromResp(resp);
    return url;
  }
}
</script>

<style lang="scss">
@import "~highlight.js/styles/atom-one-dark.css";
@import "../../style/palette.scss";

.write-form {
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
  max-width: 100vw;

  .input-box {
    display: flex;
    flex-direction: column;
    width: 50%;
    .title {
      width: 100%;

      input {
        box-sizing: border-box;
        padding: 1rem;
        width: 100%;
        border: none;
        font-size: 2rem;
        font-weight: bold;

        &:focus {
          outline: none;
        }
      }
    }

    .content-container {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      textarea {
        flex-grow: 1;
        box-sizing: border-box;
        resize: none;
        padding: 1rem;
        width: 100%;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
  }

  .upload-post-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;

    .thumbnail-box {
      width: 90%;
      .upload-thumbnail {
        margin-bottom: 1rem;
        height: 15rem;
        overflow: hidden;

        img {
          display: block;
          max-width: 100%;
          object-fit: cover;
        }
      }
    }

    .private-box {
      display: flex;
      width: 90%;
      margin-top: 2rem;
      font-size: 1rem;
      font-weight: bold;
      color: #ffffff;

      .private {
        box-sizing: border-box;
        padding: 0.25rem 2rem;
        border-radius: 3px;
        background-color: $blue2;
        cursor: pointer;
      }
    }

    .category-box {
      width: 90%;
      margin-top: 2rem;
      .category-select {
        padding: 0.25rem;
        width: 8rem;
        border: $gray5 1px solid;
        background-color: #ffffff;
        text-align: center;
      }
    }

    .save-box {
      width: 90%;
      margin-top: 2rem;

      .Btn {
        margin-right: 1rem;
      }
    }
  }

  .result-box {
    overflow: auto;
    box-sizing: border-box;
    padding: 2rem;
    width: 50%;
    max-width: 50%;
    background-color: $gray1;

    h1 {
      word-break: break-all;
      display: block;
      margin: 0;
      padding: 0;
    }

    .result-container {
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

  .write-option {
    position: fixed;
    bottom: 2rem;
    right: 2rem;

    img {
      width: 3rem;
      height: 3rem;
      cursor: pointer;
    }
  }
}
</style>