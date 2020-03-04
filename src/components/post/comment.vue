<template>
  <div class="comment">
    <div class="user-info">
      <img class="user-image" :src="this.profile_image" alt="프로필" />
      <span class="user-name">{{ this.name }}</span>
    </div>

    <!-- Edit mode -->
    <div class="edit-box" v-if="this.editMode && this.id === this.user.id">
      <textarea id="edit-content" class="content" :value="this.comment.content"></textarea>
      <div class="ctrl-box" v-show="this.id == this.user.id">
        <button class="modify-btn" @click="editMode=false">취소</button>
        <button class="delete-btn" @click="modify">수정 완료</button>
      </div>
    </div>

    <!-- Normal mode -->
    <div class="normal-box" v-else>
      <div class="content">{{ this.comment.content }}</div>
      <div class="ctrl-box" v-show="this.id == this.user.id">
        <button class="modify-btn" @click="editMode=true">수정</button>
        <button class="delete-btn" @click="deleteComment">삭제</button>
      </div>
      <div
        v-if="this.comment.has_replies && !this.showReply"
        class="show-reply"
        @click="showReplyBtnClicked"
      >답글 보기</div>
      <div
        v-if="this.comment.has_replies && this.showReply"
        @click="showReplyBtnClicked"
        class="show-reply"
      >숨기기</div>
      <div v-if="this.comment.has_replies && this.showReply" class="reply-container">
        <reply
          @delete-reply="getReplies"
          v-for="(reply, index) in replies"
          :key="index"
          :reply="reply"
          :user="user"
        />
      </div>
      <div class="reply-input-form" v-if="showCreateReply">
        <textarea class="reply-input" v-model="createContent" placeholder="답글을 작성하세요"></textarea>
        <button @click="showCreateReply=false">취소</button>
        <button @click="createReply" class="reply-write-btn">작성</button>
      </div>
      <div class="show-create-reply" v-if="!showCreateReply">
        <button class="create-reply-btn" @click="changeShowCreateReply">답글 작성</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../../env/server";
import reply from "./reply";

export default {
  data() {
    return {
      name: "",
      id: "",
      profile_image: "",
      showReply: false,
      editMode: false,
      editContent: "",
      replies: [],
      showCreateReply: false,
      createContent: ""
    };
  },
  props: {
    comment: Object,
    user: Object
  },
  methods: {
    createReply() {
      const content = this.createContent;
      const comment_idx = this.comment.idx;
      axios
        .post(
          `${SERVER_ENV.API_ADDR}/reply`,
          {
            content,
            comment_idx
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          }
        )
        .then(resp => {
          this.createContent = "";
          this.showCreateReply = false;
          this.comment.has_replies = true;
          this.getReplies();
        })
        .catch(err => {
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "답글을 작성해주세요";
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
    changeShowCreateReply() {
      this.showCreateReply = !this.showCreateReply;
    },
    deleteComment() {
      this.$swal({
        title: "정말 삭제하시겠습니까?",
        text: "삭제 시 댓글과 모든 답글이 삭제됩니다.",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      }).then(result => {
        if (!result.value) {
          return;
        }
        axios
          .delete(`${SERVER_ENV.API_ADDR}/comment/${this.comment.idx}`, {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          })
          .then(resp => {
            this.$emit("delete-comment");
          })
          .catch(err => {
            let message = "";
            switch (err.response.status) {
              case 401:
                message = "로그인 후 사용해주세요";
                break;
              case 403:
                message = "본인 댓글만 삭제 가능합니다";
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
      });
    },
    modify() {
      const content = document.getElementById("edit-content").value;
      axios
        .put(
          `${SERVER_ENV.API_ADDR}/comment/${this.comment.idx}`,
          {
            content
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          }
        )
        .then(resp => {
          this.editMode = false;
          this.comment.content = content;
        })
        .catch(err => {
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "댓글이 비어있습니다.";
              break;
            case 401:
              message = "로그인 후 사용해주세요";
              break;
            case 403:
              message = "본인 댓글만 수정 가능합니다";
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
      this.editMode = false;
    },
    showReplyBtnClicked() {
      this.showReply = !this.showReply;
      if (this.showReply) {
        this.getReplies();
      }
    },
    getReplies() {
      axios
        .get(`${SERVER_ENV.API_ADDR}/reply?comment=${this.comment.idx}`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          const { data } = resp.data;
          this.replies = data.replies;
          if (!this.replies.length) {
            this.comment.has_replies = false;
          }
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
        });
    }
  },
  mounted() {
    // 익명 작성
    if (!this.comment.fk_user_id) {
      this.name = "익명";
      this.id = "";
      axios
        .get(`${SERVER_ENV.API_ADDR}/file/basic-profile`)
        .then(resp => {
          const { data } = resp.data;
          this.profile_image = data.profile_image;
        })
        .catch(err => {
          this.profile_image = "";
        });
      return;
    }

    axios
      .get(`${SERVER_ENV.API_ADDR}/profile?user=${this.comment.fk_user_id}`)
      .then(resp => {
        const { data } = resp.data;
        const { user } = data;
        this.name = user.name;
        this.id = user.id;
        this.profile_image = user.profile_image;
      })
      .catch(err => {
        this.name = "익명";
        this.id = "";
        axios
          .get(`${SERVER_ENV.API_ADDR}/file/basic-profile`)
          .then(resp => {
            const { data } = resp.data;
            this.profile_image = data.profile_image;
          })
          .catch(err => {
            this.profile_image = "";
          });
      });
  },
  components: {
    reply
  }
};
</script>

<style lang="scss" scoped>
.comment {
  @media only screen and (max-width: 768px) {
    width: 90%;
  }
  border-top: 1px #e2e2e2 solid;
  width: 60%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 1%;
  .user-info {
    padding: 5%;
    padding-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .user-image {
      @media only screen and (max-width: 768px) {
        width: 30px;
        height: 30px;
      }
      margin: 0;
      width: 40px;
      height: 40px;
      border-radius: 100%;
    }
    .user-name {
      margin-left: 2%;
    }
  }
  .ctrl-box {
    button {
      border: none;
      background-color: transparent;
      border: 1px solid transparent;
      &:hover {
        cursor: pointer;
        border: 1px solid #e2e2e2;
      }
      &:focus {
        outline: none;
      }
    }
  }

  .normal-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .reply-input-form {
      margin: 0 auto;
      width: 80%;
      margin-top: 2%;
      .reply-input {
        padding: 0;
        padding: 2%;
        resize: none;
        width: 96%;
        &:focus {
          outline: none;
        }
      }

      button {
        min-width: 30px;
        width: 10%;
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
    .show-create-reply {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 80%;
      margin: 0 auto;
      margin-top: 1%;
      font-size: 14px;
      .create-reply-btn {
        @media only screen and (max-width: 768px) {
        }
        min-width: 70px;
        width: 10%;
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
    .ctrl-box {
      margin-top: 3%;
      margin-left: 5%;
    }
    .reply-container {
      background-color: #e2e2e2;
      width: 80%;
      margin: 0 auto;
    }
  }
  .edit-box {
    .content {
      padding: 2%;
      width: 80%;
      resize: none;
      &:focus {
        outline: none;
      }
    }
  }
  .content {
    text-align: left;
    clear: both;
    margin-top: 2%;
    margin-left: 8%;
    margin-right: 8%;
  }
  .show-reply {
    @media only screen and (max-width: 768px) {
      font-size: 12px;
    }
    width: 20%;
    margin: 0 auto;
    color: #597cff;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>