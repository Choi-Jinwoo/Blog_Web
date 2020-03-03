<template>
  <div class="post">
    <img
      src="https://img.icons8.com/material-rounded/24/000000/home.png"
      class="home-btn"
      @click="$router.push('/')"
    />
    <div class="post-container">
      <div class="post-title">{{ post.title }}</div>
      <div class="ctrl-box" v-show="this.post.fk_user_id === this.user.id">
        <button @click="$router.push(`/write?idx=${post.idx}`)">수정</button>
        <button @click="deletePost">삭제</button>
      </div>
      <div class="post-content" v-html="convertedContent"></div>
    </div>
    <div class="comment-box">
      <div class="comment-container">
        <span class="comment-text">Comment</span>
        <div class="comment-input-form">
          <textarea class="comment-input" v-model="createContent" placeholder="댓글을 작성하세요"></textarea>
          <button class="write-btn" @click="createComment">작성</button>
        </div>
      </div>
      <comment
        @delete-comment="getComments"
        v-for="(comment, index) in comments"
        :key="index"
        :comment="comment"
        :user="user"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../env/server";
import marked from "marked";
import comment from "@/components/post/comment";

export default {
  data() {
    return {
      post: Object,
      convertedContent: "",
      comments: [],
      user: {},
      createContent: ""
    };
  },
  mounted() {
    axios
      .get(`${SERVER_ENV.API_ADDR}/profile/my`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
      .then(resp => {
        const { data } = resp.data;
        this.user = data.user;
      })
      .catch(err => {
        if (err.response.status === 410) {
          this.$swal("만료", "로그인 후 다시 사용해주세요", "error");
        }
      });
    axios
      .get(`${SERVER_ENV.API_ADDR}/post/${this.$route.params.idx}`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
      .then(resp => {
        const { data } = resp.data;
        const { post } = data;
        this.post = post;
        this.convertedContent = marked(this.post.content);
        this.getComments();
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
  },
  methods: {
    deletePost() {
      this.$swal({
        title: "정말 삭제하시겠습니까?",
        text: "삭제 시 댓글과 모든 답글이 삭제됩니다.",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      }).then(result => {
        if (!result.value) return;
        axios
          .delete(`${SERVER_ENV.API_ADDR}/post/${this.post.idx}`, {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          })
          .then(resp => {
            this.$router.push("/");
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
                message = "본인 글만 삭제 할 수 있습니다.";
                break;
              case (410, 401):
                message = "로그인 후 사용해주세요.";
                break;
              default:
                message = "오류가 발생하였습니다.";
                break;
            }
          });
      });
    },
    createComment() {
      const content = this.createContent;
      const post_idx = this.$route.params.idx;
      axios
        .post(
          `${SERVER_ENV.API_ADDR}/comment`,
          {
            content,
            post_idx
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          }
        )
        .then(resp => {
          this.createContent = "";
          this.getComments();
        })
        .catch(err => {
          let message = "";

          switch (err.response.status) {
            case 400:
              message = "댓글을 작성해주세요";
              break;
            case 403:
              message = "비공개 글입니다.";
              break;
            case 404:
              message = "새로고침 후 사용해주세요";
              break;
            case 410:
              message = "로그인 후 사용해주세요";
              break;
            default:
              message = "오류가 발생하였습니다.";
          }

          this.$swal("오류", message, "error");
        });
    },
    getComments() {
      axios
        .get(`${SERVER_ENV.API_ADDR}/comment?post=${this.post.idx}`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          const { data } = resp.data;
          const { comments } = data;
          this.comments = comments;
        })
        .catch(err => {
          let message = "";

          switch (err.response.status) {
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
  components: {
    comment
  }
};
</script>

<style lang="scss" scoped>
.post {
  display: flex;
  text-align: center;
  background-color: #f5f6fa;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  .ctrl-box {
    display: flex;
    justify-content: flex-end;
    button {
      margin-left: 1%;
      min-width: 30px;
      margin-top: 2%;
      width: 8%;
      border: none;
      background-color: #597cff;
      color: #ffffff;
      padding: 0.5%;
      margin-bottom: 2%;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
        background-color: rgba($color: #597cff, $alpha: 0.8);
      }
      &:focus {
        outline: none;
      }
    }
  }
  .home-btn {
    width: 30px;
    height: 30px;
    margin: 0;
    margin-left: 2%;
    margin-top: 2%;
    &:hover {
      cursor: pointer;
    }
  }
  .comment-box {
    padding-bottom: 10%;
    .comment-container {
      display: flex;
      flex-direction: column;
      font-size: 20px;
      width: 60%;
      margin: 0 auto;
      text-align: left;
      font-weight: bold;
      color: #000000;

      .comment-text {
        display: block;
        margin-bottom: 1%;
      }
      .comment-input-form {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .comment-input {
          display: block;
          padding: 2%;
          resize: none;
          width: 96%;
        }
        .write-btn {
          min-width: 30px;
          margin-top: 2%;
          width: 8%;
          border: none;
          background-color: #597cff;
          color: #ffffff;
          padding: 0.5%;
          margin-bottom: 2%;
          border-radius: 5px;
          &:hover {
            cursor: pointer;
            background-color: rgba($color: #597cff, $alpha: 0.8);
          }
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
  .post-container {
    width: 60%;
    margin: 0 auto;
    padding-top: 3%;
    .post-title {
      font-size: 35px;
      font-weight: bold;
    }
    .post-content {
      text-align: left;
    }
  }
}
</style>