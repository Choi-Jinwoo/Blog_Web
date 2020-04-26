<template>
  <div class="write-form">
    <div class="upload-box">업로드하기</div>

    <div class="write-box">
      <div class="input-box">
        <div class="title">
          <input type="text" placeholder="제목을 입력하세요" v-model="post.title" />
        </div>

        <div class="content-container">
          <textarea v-model="post.content" placeholder="내용을 작성해주세요" @drop.prevent="uploadWithDrop"></textarea>
        </div>
      </div>

      <div class="result-box">
        <h1>{{ post.title }}</h1>
        <div class="result-container" v-html="markedContent"></div>
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

marked.setOptions(markedOptions);

@Component
export default class Write extends Vue {
  post: IPost = {} as IPost;

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
    } catch (err) {
      alert(err.message);
      this.$router.push("/");
    }
  }

  get markedContent(): string {
    return marked(String(this.post.content), { renderer });
  }

  async uploadWithDrop(e: any) {
    const reqFiles = e.target.files || e.dataTransfer.files;
    const formData = new FormData();
    formData.append("files", reqFiles[0]);
    const [file]: string[] = await uploadFile(formData);
    const fileURL = await createURL(file);
    this.post.content += `![이미지](${encodeURI(fileURL)})`;
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
  }

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