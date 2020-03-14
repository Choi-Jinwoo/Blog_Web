<template>
  <div class="write-form">
    <div class="input-box">
      <div class="title">
        <input type="text" placeholder="제목을 입력하세요" v-model="post.title" />
      </div>

      <div class="util-bar">
        <img src="../../assets/svg/write_image_upload.svg" alt />
      </div>

      <div class="content-container">
        <textarea v-model="post.content" placeholder="내용을 작성해주세요"></textarea>
      </div>
    </div>
    <div class="result-box">
      <h1>{{ post.title }}</h1>
      <div class="result-container" v-html="convertedContent"></div>
    </div>

    <div class="write-option">
      <img src="../../assets/svg/write_upload.svg" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import marked from "marked";

type PostType = {
  title: string;
  content: string;
  thumbnail: string;
  category_idx: number;
};

@Component
export default class Write extends Vue {
  post: PostType = {
    content: ""
  } as PostType;

  get convertedContent() {
    return marked(this.post.content);
  }
}
</script>

<style lang="scss">
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

    .util-bar {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      padding-right: 5rem;
      img {
        width: 1.75rem;
        height: 1.75rem;
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

  .write-option {
    position: fixed;
    bottom: 2rem;
    right: 2rem;

    img {
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>