<template>
  <div class="reply">
    <div class="user-info">
      <img class="user-image" :src="this.profile_image" alt="프로필" />
      <span class="user-name">{{ this.name }}</span>
    </div>

    <!-- Edit mode -->
    <div class="edit-box" v-if="this.editMode && this.id === this.user.id">
      <textarea id="edit-content" class="content" :value="this.reply.content"></textarea>
      <div class="ctrl-box" v-show="this.id == this.user.id">
        <button class="modify-btn" @click="editMode=false">취소</button>
        <button class="delete-btn" @click="modify">수정 완료</button>
      </div>
    </div>

    <!-- Normal mode -->
    <div class="normal-box" v-else>
      <div class="content">{{ this.reply.content }}</div>
      <div class="ctrl-box" v-show="this.id == this.user.id">
        <button class="modify-btn" @click="editMode=true">수정</button>
        <button class="delete-btn" @click="deleteReply">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../../env/server";

export default {
  data() {
    return {
      name: "",
      id: "",
      profile_image: "",
      editMode: false
    };
  },
  props: {
    reply: Object,
    user: Object
  },
  methods: {
    deleteReply() {
      this.$swal({
        title: "정말 삭제하시겠습니까?",
        text: "삭제 시 답글이 영구 삭제됩니다.",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      }).then(result => {
        if (!result.value) {
          return;
        }
        axios
          .delete(`${SERVER_ENV.API_ADDR}/reply/${this.reply.idx}`, {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          })
          .then(resp => {
            this.$emit("delete-reply");
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
          `${SERVER_ENV.API_ADDR}/reply/${this.reply.idx}`,
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
          this.reply.content = content;
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
    }
  },
  mounted() {
    // 익명 작성
    if (!this.reply.fk_user_id) {
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
      .get(`${SERVER_ENV.API_ADDR}/profile?user=${this.reply.fk_user_id}`)
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
  }
};
</script>

<style lang="scss" scoped>
.reply {
  border-top: 1px #e2e2e2 solid;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2%;
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
        border: 1px solid #f5f6fa;
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
    .ctrl-box {
      margin-top: 3%;
      margin-left: 5%;
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
}
</style>