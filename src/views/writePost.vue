<template>
  <div class="write-post">
    <input type="file" id="upload-form" @change="addFile" style="display: none" />
    <input type="file" id="upload-thumbnail" @change="uploadThumbnail" style="display: none" />
    <div class="write-container">
      <div class="write-form">
        <img
          src="https://img.icons8.com/material-rounded/24/000000/home.png"
          class="home-btn"
          @click="goMain"
        />
        <div class="title-container">
          <input type="text" class="title" v-model="title" placeholder="제목을 입력하세요" />
        </div>
        <div class="util-box">
          <button class="file-btn" @click="clickUploadBtn">
            <svg class="file-svg">
              <path
                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
              />
            </svg>
          </button>
          <select class="category-select" v-model="category">
            <option
              v-for="category in categories"
              :key="category.idx"
              :value="category.idx"
            >{{ category.name }}</option>
          </select>
          <button class="thumbnail-btn" @click="clickUploadThumbnail">대표사진</button>
          <input type="checkbox" class="is-private-btn" v-model="isPrivate" />
          <span class="is-private-label">비공개</span>
          <button class="submit-btn" @click="submit">작성</button>
        </div>
        <textarea class="content-input" :value="content" @input="update" placeholder="글을 작성하세요"></textarea>
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
import SERVER_ENV from "../../env/server";

export default {
  data() {
    return {
      content: "",
      title: "",
      categories: [],
      category: Number,
      thumbnail: "",
      isPrivate: false
    };
  },
  computed: {
    updateIdx() {
      return this.$route.query.idx;
    },
    convertedContent() {
      return marked(this.content);
    }
  },
  mounted() {
    axios
      .get(`${SERVER_ENV.API_ADDR}/category`)
      .then(resp => {
        const { data } = resp.data;
        this.categories = data.categories;
      })
      .catch(err => {
        this.$swal("오류", "다시 시도주세요", "error");
      });

    if (this.updateIdx) {
      axios
        .get(`${SERVER_ENV.API_ADDR}/post/${this.updateIdx}?image=raw`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          const { data } = resp.data;
          const { post } = data;
          this.title = post.title;
          this.content = post.content;
          this.thumbnail = post.thumbnail;
          this.category = post.category_idx;
          this.isPrivate = post.is_private;
        })
        .catch(err => {
          let message = "";

          switch (err.response.status) {
            case 400:
              message = "오류가 발생하였습니다.";
              break;
            case 404:
              message = "새로고침 후 이용해주세요.";
              break;
            case 403:
              message = "비공개 글입니다.";
              break;
            default:
              message = "다시 시도해주세요";
          }
          this.$swal("오류", message, "error");
          this.$router.push("/");
        });
    }
  },
  methods: {
    goMain() {
      this.$swal({
        title: "정말 이동하시겠습니까?",
        text: "현재 내용은 저장되지 않습니다.",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      }).then(result => {
        if (result.value) {
          this.$router.push("/");
        }
      });
    },
    submit() {
      const post = {};
      post.title = this.title;
      post.content = this.content;
      post.is_private = this.isPrivate;
      post.thumbnail = this.thumbnail;
      post.category_idx = this.category;

      if (this.updateIdx) {
        axios
          .put(`${SERVER_ENV.API_ADDR}/post/${this.updateIdx}`, post, {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          })
          .then(resp => {
            this.$swal("글 수정 성공", "소중한 글 감사합니다.", "success");
            this.$router.push("/");
          })
          .catch(err => {
            let message = "";

            switch (err.response.status) {
              case 400:
                message = "양식을 확인해주세요";
                break;
              case 401:
                message = "로그인 후 사용해주세요";
                break;
              case 403:
                message = "접근 권한이 없습니다";
                break;
              case 404:
                message = "새로고침 후 사용해주세요";
                break;
              case 410:
                message = "로그인 후 사용해주세요";
                break;
              default:
                message = "다시 시도해주세요";
            }
            this.$swal("오류", message, "error");
          });
        return;
      }
      axios
        .post(`${SERVER_ENV.API_ADDR}/post`, post, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          this.$swal("글 작성 성공", "소중한 글 감사합니다.", "success");
          this.$router.push("/");
        })
        .catch(err => {
          let message = "";

          switch (err.response.status) {
            case 400:
              message = "양식을 확인해주세요";
              break;
            case 401:
              message = "로그인 후 사용해주세요";
              break;
            case 403:
              message = "접근 권한이 없습니다";
              break;
            case 404:
              message = "새로고침 후 사용해주세요";
              break;
            case 410:
              message = "로그인 후 사용해주세요";
              break;
            default:
              message = "다시 시도해주세요";
          }
          this.$swal("오류", message, "error");
        });
    },
    clickUploadThumbnail() {
      document.getElementById("upload-thumbnail").click();
    },
    update(e) {
      this.content = e.target.value;
    },
    uploadThumbnail(e) {
      const formData = new FormData();
      const files = e.target.files;
      formData.append("files", files[0]);
      axios
        .post(`${SERVER_ENV.API_ADDR}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(resp => {
          const { data } = resp.data;
          const { files } = data;
          this.thumbnail = files[0];
        })
        .catch(err => {
          this.$swal("오류", "파일 업로드 중 오류가 발생하였습니다.", "error");
        });
    },
    addFile(e) {
      const formData = new FormData();
      const files = e.target.files;
      formData.append("files", files[0]);
      axios
        .post(`${SERVER_ENV.API_ADDR}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(resp => {
          const { data } = resp.data;
          const { files } = data;

          files.forEach(file => {
            axios
              .post(`${SERVER_ENV.API_ADDR}/file/create-url`, {
                file_name: file
              })
              .then(resp => {
                const { data } = resp.data;
                const { url } = data;
                this.content += `![image](${encodeURI(url)})`;
              })
              .catch(err => {
                let message = "";
                switch (err.response.status) {
                  case 400:
                    message = "오류가 발생하였습니다.";
                    break;
                  default:
                    message = "다시 시도해주세요!";
                }
                this.$swal("오류", message, "error");
              });
          });
        })
        .catch(err => {
          this.$swal("오류", "파일 업로드 중 오류가 발생하였습니다.", "error");
        });
    },
    clickUploadBtn() {
      document.getElementById("upload-form").click();
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
      .home-btn {
        margin-top: 2%;
        margin-left: 5%;
        resize: 20%;
        &:hover {
          cursor: pointer;
        }
      }
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 50%;
      .util-box {
        border-bottom: solid 1.1px #e2e2e2;
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-end;
        .thumbnail-btn,
        .submit-btn {
          margin-left: 2%;
          background-color: transparent;
          border: none;
          &:hover {
            background-color: #e2e2e2;
            cursor: pointer;
          }
        }
        .is-private-btn {
          background-color: none;
          width: 15px;
          height: 15px;
          margin: 0;
          padding: 0;
          margin-top: 0.7%;
          margin-left: 2%;
        }
        .is-private-label {
          font-size: 13px;
          margin-top: 0.1%;
          margin-left: 1%;
        }
        .category-select {
          margin-left: 2%;
          width: 12%;
          background-color: #ffffff;
          border: none;
          text-align-last: center;
          text-align: center;
          min-width: 50px;
          &:hover {
            cursor: pointer;
          }
          &:focus {
            outline: none;
          }
        }
        .file-btn {
          height: 24px;
          background-color: transparent;
          padding: 0%;
          border: none;
          .file-svg {
            padding: 0;
            width: 24px;
            height: 24px;
          }
          &:hover {
            background-color: #e2e2e2;
            cursor: pointer;
          }
          &:focus {
            outline: none;
          }
        }
      }
      .title-container {
        width: 90%;
        .title {
          width: 100%;
          padding: 5% 0;
          margin: 0 5%;
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