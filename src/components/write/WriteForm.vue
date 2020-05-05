<template>
  <div class="write-form">
    <div class="write-box">
      <div class="input-box">
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

      <div class="content">
        <h1>{{ post.title }}</h1>
        <div class="marked-content" v-html="markedContent"></div>
      </div>

      <div class="side-nav-wrapper">
        <div class="side-nav-btn-wrapper">
          <button class="side-nav-btn" @click="changeSideNavStatus">&lt;</button>
        </div>

        <nav class="side-nav" :style="sideNavStyle">
          <div class="side-nav-container">
            <select v-model="post.fk_category_idx">
              <option
                v-for="(category, index) in categories"
                :key="index"
                :value="category.idx"
              >{{ category.name }}</option>
            </select>
            <input type="file" @change="uploadThumbnail" />
            <p>
              비공개
              <input type="checkbox" v-model="this.post.is_private" />
            </p>

            <button @click="writePost(false)">업로드</button>
            <button @click="writePost(true)">임시저장</button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import marked from "marked";
import { Token } from "@/lib/Storage";
import { renderer, markedOptions } from "@/lib/markedOptions";

import uploadFile from "@/lib/request/uploadFile";
import createURL from "@/lib/request/createURL";

import IPost from "../../interface/IPost";
import getPost from "../../lib/request/getPost";
import ICategory from "../../interface/ICategory";
import getCategories from "../../lib/request/getCategories";
import ICategoryResp from "../../interface/ICategoryResp";
import IPostWrite from "@/interface/IPostWrite";
import createPost from "../../lib/request/createPost";
import modifyPost from "../../lib/request/modifyPost";
import router from "../../router";

marked.setOptions(markedOptions);

type SideNavStyle = {
  width: string;
};

@Component
export default class Write extends Vue {
  post: IPost = {} as IPost;
  categories: ICategory[] = [];
  sideNavStyle = {
    display: "none"
  };

  async created() {
    window.onbeforeunload = function(e: any) {
      e.returnValue = "";
    };

    try {
      // 글 수정 시
      const modifyIdx: number = Number(this.$route.query.idx);
      if (Number.isInteger(modifyIdx)) {
        const post: IPost | undefined = await getPost(
          Token.getToken(),
          modifyIdx,
          true
        );

        if (!post) throw new Error("삭제된 글입니다");
        this.post = post;
      }

      const categories: ICategoryResp[] = (await getCategories()) || [];
      const wrappedCategories: ICategory[] = [];
      categories.forEach(category => {
        wrappedCategories.push(...category.categories);
      });

      this.categories = wrappedCategories;
    } catch (err) {
      alert(err.message);
      this.$router.push("/");
    }
  }

  get markedContent(): string {
    return marked(String(this.post.content || ""), { renderer });
  }

  async uploadWithDrop(e: any) {
    const reqFiles = e.target.files || e.dataTransfer.files;
    const file = await this.uploadFile(reqFiles);
    const fileURL = await createURL(file);
    this.post.content += `![이미지](${encodeURI(fileURL)})`;
  }

  async uploadWithPaste(e: any) {
    const reqFiles = e.clipboardData.files;
    if (!reqFiles.length) return;
    e.prevent();
    const file = await this.uploadFile(reqFiles);
    const fileURL = await createURL(file);
    this.post.content += `![이미지](${encodeURI(fileURL)})`;
  }

  async uploadThumbnail(e: any) {
    const reqFiles = e.target.files;
    const file = await this.uploadFile(reqFiles);
    this.post.thumbnail = file;
  }

  async uploadFile(reqFiles: File[]): Promise<string> {
    const formData = new FormData();
    formData.append("files", reqFiles[0]);
    const [file]: string[] = await uploadFile(formData);
    return file;
  }

  changeSideNavStatus() {
    if (this.sideNavStyle.display === "none") this.sideNavStyle.display = "";
    else this.sideNavStyle.display = "none";
  }

  async writePost(isTemp: boolean) {
    const post: IPostWrite = {
      title: this.post.title,
      content: this.post.content,
      is_temp: isTemp,
      is_private: !!this.post.is_private,
      category_idx: this.post.fk_category_idx,
      thumbnail: this.post.thumbnail || null
    } as IPostWrite;

    try {
      if (this.post.idx) {
        await modifyPost(Token.getToken(), this.post.idx, post);
        alert("글 수정에 성공하셨습니다");
      } else {
        await createPost(Token.getToken(), post);
        alert("글 생성에 성공하셨습니다");
      }
      this.$router.push("/");
    } catch (err) {
      this.$toasted.error(err.message).goAway(800);
    }
  }
}
</script>

<style lang="scss">
@import "~highlight.js/styles/atom-one-dark.css";
@import "../../style/palette.scss";

.write-form {
  min-height: calc(100vh - 3.5rem);
  max-height: calc(100vh - 3.5rem);
  width: 100vw;
  margin-top: 3.5rem;

  .write-box {
    display: flex;
    min-height: calc(100vh - 3.5rem);
    max-height: calc(100vh - 3.5rem);

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
          font-size: 1rem;
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

    .content {
      overflow: auto;
      box-sizing: border-box;
      padding: 2rem;
      width: 50%;
      max-width: 50%;
      background-color: $gray1;
    }

    .side-nav-wrapper {
      display: flex;
      position: absolute;
      right: 0;
      height: calc(100vh - 3.5rem);

      .side-nav {
        display: flex;
        justify-content: center;
        background-color: #ffffff;
        height: 100%;

        .side-nav-container {
          margin-top: 30px;
          width: 80%;
          display: flex;
          flex-direction: column;

          input {
            margin: 0 auto;
            margin-top: 15px;
          }

          p {
            margin: 0 auto;
            margin-top: 15px;
            font-size: 0.75rem;
          }

          button {
            margin-top: 15px;
          }
        }
      }

      .side-nav-btn {
        position: relative;
        right: 0;
        margin: 0;
        border: none;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        outline: none;
        font-size: 16px;
        background-color: $gray5;
        color: $gray1;
        cursor: pointer;
      }
    }
  }
}
</style>