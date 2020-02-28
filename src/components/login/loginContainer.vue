<template>
  <div class="login-container">
    <div class="input-form">
      <div class="id-form">
        <input type="text" class="id-input" @keypress.enter="login" v-model="id" />
      </div>
      <div class="pw-form">
        <input type="password" class="pw-input" @keypress.enter="login" v-model="pw" />
      </div>
    </div>
    <button class="login-btn" @click="login">Sign-In</button>
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
  background-color: #6c5ce7;
}
</style>