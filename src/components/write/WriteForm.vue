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
          <button class="side-nav-btn" @click="changeSideNavStatus">버튼</button>
        </div>

        <nav class="side-nav" :style="sideNavStyle">
          <select>
            <option
              v-for="(category, index) in categories"
              :key="index"
              :value="category.idx"
            >{{ category.name }}</option>
          </select>
          <input type="file" name id />
          <img src alt />
          <p>
            비공개
            <input type="checkbox" name id />
          </p>

          <button>업로드</button>
          <button>임시저장</button>
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

marked.setOptions(markedOptions);

type SideNavStyle = {
  width: string;
};

@Component
export default class Write extends Vue {
  post: IPost = {} as IPost;
  categories: ICategory[] = [];
  sideNavStyle = {
    width: "200px"
  };

  async created() {
    try {
      /**
       * 글 수정 시
       */
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

  async uploadFile(reqFiles: File[]): Promise<string> {
    const formData = new FormData();
    formData.append("files", reqFiles[0]);
    const [file]: string[] = await uploadFile(formData);
    return file;
  }

  changeSideNavStatus() {
    console.log("hi");

    if (this.sideNavStyle.width === "0px") this.sideNavStyle.width = "200px";
    else this.sideNavStyle.width = "0px";
  }
}
</script>

<style lang="scss">
@import "~highlight.js/styles/atom-one-dark.css";
@import "../../style/palette.scss";

.write-form {
  min-height: 100vh;
  max-height: 100vh;
  max-width: 100vw;
  margin-top: 3.5rem;

  .write-box {
    display: flex;
    min-height: 100vh;
    max-height: 100vh;

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
      height: 100%;

      .side-nav {
        background-color: #ffffff;
        height: 100%;
      }

      .side-nav-btn-wrapper {
      }

      .side-nav-btn {
      }
    }
  }
}
</style>