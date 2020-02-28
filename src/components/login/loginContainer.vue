<template>
  <div class="login-container">
    <h1>Hello!</h1>
    <div class="login-form">
      <div class="id-form">
        아이디
        <br />
        <input type="text" class="id-input" @keypress.enter="login" v-model="id" />
      </div>
      <div class="pw-form">
        비밀번호
        <br />
        <input type="password" class="pw-input" @keypress.enter="login" v-model="pw" />
      </div>
      <div class="btn-forn">
        <button class="login-btn" @click="login">로그인</button>
      </div>
      <div class="register-text-form">
        아직 계정이 없으신가요?
        <span class="register-text">회원가입</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../../env/server";

export default {
  data: function() {
    return {
      id: "",
      pw: ""
    };
  },
  methods: {
    login: function() {
      axios
        .post(`${SERVER_ENV.API_ADDR}/auth/login`, {
          id: this.id,
          pw: this.pw
        })
        .then(resp => {
          const { data } = resp.data;
          const token = data["x-access-token"];
          localStorage.setItem("x-access-token", token);
          this.$swal("로그인 성공", "블로그 방문에 감사드립니다.", "success");
          // Success Login
        })
        .catch(err => {
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "아이디 혹은 비밀번호를 입력해주세요!";
              break;
            case 401:
              message = "아이디 혹은 비밀번호가 일치하지 않습니다!";
              break;
            default:
              message = "다시 시도해주세요!";
          }

          this.$swal("로그인 실패", message, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  .login-form {
    text-align: left;
    background-color: #ffffff;
    width: 40%;
    margin: 0 auto;
    padding-top: 5%;
    .id-form,
    .pw-form {
      color: #808080;
      font-size: 12px;
      width: 50%;
      margin: 0 auto;
      text-align: left;
      margin-bottom: 3%;
      input {
        border: none;
        border-bottom: #808080 solid 1px;
        padding: 3%;
        margin-top: 2%;
        color: #808080;
        font-size: 16px;
        width: 94%;
        &:focus {
          outline: none;
          border-bottom: #597cff solid 1px;
        }
      }
    }
    .login-btn {
      display: block;
      background-color: #597cff;
      border: none;
      color: #ffffff;
      font-size: 18px;
      padding: 1%;
      width: 50%;
      margin: 0 auto;
    }
    .register-text-form {
      width: 50%;
      margin: 3% auto;
      font-size: 13px;
      .register-text {
        color: #597cff;
        font-weight: bold;
      }
    }
  }
}
</style>