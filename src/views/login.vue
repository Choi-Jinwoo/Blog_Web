<template>
  <div class="login">
    <div class="login-container">
      <h1>Hello!</h1>
      <div class="login-form">
        <div class="input-form">
          아이디
          <br />
          <input type="text" class="id-input" @keypress.enter="login" v-model="id" />
        </div>
        <div class="input-form">
          비밀번호
          <br />
          <input type="password" class="pw-input" @keypress.enter="login" v-model="pw" />
        </div>
        <div class="btn-form">
          <button class="login-btn" @click="login">로그인</button>
        </div>
        <div class="register-text-form">
          <span class="main-text" @click="goMain">로그인 없이 둘러보기</span>
          <br />
          <span class="register-text" @click="goRegister">회원가입</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { sha512 } from "js-sha512";
import SERVER_ENV from "../../env/server";
import { user } from "../singleton/index";

export default {
  data() {
    return {
      id: "",
      name: "",
      pw: "",
      pwCheck: ""
    };
  },
  methods: {
    login() {
      axios
        .post(`${SERVER_ENV.API_ADDR}/auth/login`, {
          id: this.id,
          pw: sha512(this.pw)
        })
        .then(resp => {
          const { data } = resp.data;
          const token = data["x-access-token"];
          const isAdmin = data.is_admin;
          const name = data.name;

          localStorage.setItem("x-access-token", token);
          user.setInstance({
            isAdmin
          });

          this.$swal("로그인 성공", `안녕하세요, ${data.name} 님`, "success");
          this.$router.push("/");
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
          this.id = "";
          this.pw = "";
          this.$swal("로그인 실패", message, "error");
        });
    },
    goRegister() {
      this.$router.push("/register");
    },
    goMain() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  user-select: none;
  background-color: #597cff;
  height: 100vh;
  margin: 0;
  padding: 0;
  .login-container {
    h1 {
      padding: 3% 0;
      color: white;
      margin: 0;
    }
    .login-form {
      min-width: 300px;
      text-align: left;
      background-color: #ffffff;
      width: 40%;
      margin: 0 auto;
      padding: 5% 0;
      .input-form {
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
        &:hover {
          cursor: pointer;
        }
      }
      .register-text-form {
        width: 50%;
        margin: 2% auto;
        font-size: 13px;
        @media only screen and (max-width: 768px) {
          font-size: 10px;
        }
        .main-text {
          &:hover {
            cursor: pointer;
          }
        }
        .register-text {
          color: #597cff;
          font-weight: bold;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>