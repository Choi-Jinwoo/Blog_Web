<template>
  <div class="register">
    <div class="register-container">
      <h1>Welcome!</h1>
      <div class="register-form">
        <div class="input-form">
          아이디
          <br />
          <input type="text" class="id-input" v-model="id" title="4자리 ~ 20자리, 알바벳 소문자/숫자로 생성해주세요" />
        </div>
        <div class="input-form">
          이름
          <br />
          <input type="text" class="name-input" v-model="name" />
        </div>
        <div class="input-form">
          비밀번호
          <br />
          <input
            type="password"
            class="pw-input"
            v-model="pw"
            title="8자 이상으로 생성해주세요"
            v-bind:style="!this.isPwValidated ? { borderBottom: '1px solid #ff0000'} : ''"
          />
        </div>
        <div class="input-form">
          비밀번호 확인
          <br />
          <input
            type="password"
            class="pw-input"
            v-model="pwCheck"
            v-bind:style="!this.isPwValidated ? { borderBottom: '1px solid #ff0000'} : ''"
          />
        </div>
        <div class="pw-check-info" v-if="!this.isPwValidated">비밀번호가 일치하지 않습니다.</div>
        <div class="btn-form">
          <button class="register-btn" @click="register" :disabled="!this.isPwValidated">회원가입</button>
        </div>
        <div class="login-text-form">
          이미 계정이 있으신가요?
          <span class="login-text" @click="goLogin">로그인</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { sha512 } from "js-sha512";
import SERVER_ENV from "../../env/server";

export default {
  data: function() {
    return {
      id: "",
      name: "",
      pw: "",
      pwCheck: ""
    };
  },
  computed: {
    isPwValidated: function() {
      return this.pw === this.pwCheck;
    }
  },
  methods: {
    register: function() {
      // pw length validate
      if (this.pw.length < 8) {
        this.$swal("회원가입 실패", "양식을 확인해주세요!", "error");
        return;
      }

      axios
        .post(`${SERVER_ENV.API_ADDR}/auth/register`, {
          id: this.id,
          pw: sha512(this.pw),
          name: this.name
        })
        .then(resp => {
          this.$swal("회원가입 성공", "블로그 가입에 감사드립니다.", "success");
          // Success Login
        })
        .catch(err => {
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "양식을 확인해주세요!";
              break;
            case 409:
              message = "이미 가입된 아이디입니다!";
              break;
            default:
              message = "다시 시도해주세요!";
          }

          this.$swal("로그인 실패", message, "error");
        });
    },
    goLogin: function() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.register {
  background-color: #597cff;
  height: 100vh;
  margin: 0;
  padding: 0;
  .register-container {
    h1 {
      padding: 3% 0;
      color: white;
      margin: 0;
    }
    .register-form {
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
      .register-btn {
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
      .login-text-form {
        width: 50%;
        margin: 3% auto;
        font-size: 13px;
        .login-text {
          color: #597cff;
          font-weight: bold;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .pw-check-info {
        color: #ff0000;
        font-size: 13px;
        width: 50%;
        margin: 0 auto;
        margin-bottom: 1%;
      }
    }
  }
}
</style>