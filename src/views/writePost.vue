<template>
  <div class="write-post">
    <div class="write-container">
      <div class="write-form">
        <div class="title-container">
          <input type="text" class="title" v-model="title" placeholder="제목을 입력하세요" />
        </div>
        <div class="util-box"></div>
        <textarea class="content-input" :value="content" @input="update"></textarea>
      </div>
      <div class="result-form">
        <h1 class="result-title">{{ title }}</h1>
        <div class="result-content" v-html="convertedContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import marked from "marked";
export default {
  data() {
    return {
      content: "",
      title: ""
    };
  },
  computed: {
    convertedContent() {
      return marked(this.content);
    }
  },
  methods: {
    update(e) {
      this.content = e.target.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.write-post {
  .write-container {
    height: 100vh;
    display: flex;
    .write-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 50%;
      .title-container {
        width: 100%;
        .title {
          width: 100%;
          padding: 2% 5%;
          padding-top: 5%;
          background-color: transparent;
          border: none;
          font-size: 30px;
          font-weight: bolder;
          &:focus {
            outline: none;
          }
        }
      }
      .content-input {
        max-width: 90%;
        padding: 5%;
        font-size: 18px;
        resize: none;
        height: 100%;
        width: 100%;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .result-form {
      padding-top: 3%;
      width: 50%;
      background-color: #f5f6fa;
      overflow: auto;
      max-width: 95%;
      text-align: left;
      .result-title {
        padding: 0 5%;
      }
      .result-content {
        padding: 0 5%;
        font-size: 18px;
        max-height: 100vh;
      }
    }
  }
}
</style>