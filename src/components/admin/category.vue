<template>
  <div class="category">
    <div class="normal-mode" v-if="!isEditMode">
      <div class="category-name">{{ category.name }}</div>
      <button @click="deleteCategory">삭제</button>
      <button @click="isEditMode = true">수정</button>
    </div>

    <div class="edit-mode" v-else>
      <input class="edit-input" type="text" :placeholder="this.category.name" v-model="editName" />
      <button @click="modify">완료</button>
      <button @click="isEditMode=false">취소</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../../env/server";

export default {
  data() {
    return {
      isEditMode: false,
      editName: ""
    };
  },
  props: {
    category: Object
  },
  methods: {
    deleteCategory() {
      this.$swal({
        title: "정말 삭제하시겠습니까?",
        text: "삭제시 해당 카테고리의 글들이 삭제됩니다.",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      }).then(result => {
        if (!result.value) {
          return;
        }
        axios
          .delete(`${SERVER_ENV.API_ADDR}/category/${this.category.idx}`, {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          })
          .then(resp => {
            this.$emit("delete-category");
          })
          .catch(err => {
            let message = "";
            switch (err.response.status) {
              case 400:
                message = "내용을 입력해주세요";
                break;
              case 404:
                message = "새로고침 후 이용해주세요";
                break;
              case 410:
                message = "로그인 후 이용해주세요";
                break;
              case 500:
                message = "오류가 발생하였습니다.";
                break;
              default:
                message = "관리자만 이용가능합니다.";
            }

            this.$swal("오류", message, "error");
          });
      });
    },
    modify() {
      axios
        .put(
          `${SERVER_ENV.API_ADDR}/category/${this.category.idx}`,
          {
            name: this.editName
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          }
        )
        .then(resp => {
          this.isEditMode = false;
          this.category.name = this.editName;
        })
        .catch(err => {
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "내용을 입력해주세요";
              break;
            case 404:
              message = "새로고침 후 이용해주세요";
              break;
            case 410:
              message = "로그인 후 이용해주세요";
              break;
            case 500:
              message = "오류가 발생하였습니다.";
              break;
            default:
              message = "관리자만 이용가능합니다.";
          }

          this.$swal("오류", message, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.category {
  button {
    background-color: #ffffff;
    width: 8%;
    padding: 0.5% 0;
    border-radius: 5px;
    color: #597cff;
    font-weight: bold;
    border: none;
    &:hover {
      cursor: pointer;
      background-color: #e2e2e2;
    }
    &:focus {
      outline: none;
    }
  }
  .normal-mode {
    .category-name {
      width: 30%;
      margin: 0 auto;
      display: inline-block;
    }
  }
  .edit-mode {
    .edit-input {
      width: 30%;
      text-align: center;
      border: #597cff 1px solid;
      &:focus {
        outline: none;
      }
    }
  }
}
</style>