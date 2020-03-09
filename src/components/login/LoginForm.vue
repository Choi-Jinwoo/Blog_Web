<template>
  <div class="login-form">
    <div class="input-container">
      <h1>로그인</h1>
      <div class="input-form">
        <p>아이디</p>
        <input type="text" v-model="id" />
      </div>

      <div class="input-form">
        <p>비밀번호</p>
        <input type="password" v-model="pw" @keydown.enter="login" />
      </div>
      <Button text="로그인" @click="login"></Button>
    </div>

    <div class="util-container">
      <p class="no-login-btn" @click="$router.push('/')">로그인 없이 둘러보기</p>
      <p>
        아직 게정이 없으신가요?
        <span @click="$router.push('/register')">회원가입</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { sha512, Message } from "js-sha512";
import { SweetAlertOptions } from "sweetalert2";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";
import generateSwalOption from "@/lib/util/generateSwalOption";
import Button from "@/components/common/Button/index.vue";

@Component({
  components: {
    Button
  }
})
export default class LoginForm extends Vue {
  id: string = "";
  pw: string = "";

  async login() {
    const castedPw: Message = String(this.pw);

    try {
      const resp: AxiosResponse = await axios.post(`${API_ADDR}/auth/login`, {
        id: this.id,
        pw: sha512(castedPw)
      });

      const data = getDataFromResp(resp);
      const token = data["x-access-token"];

      localStorage.setItem("x-access-token", token);
      this.$router.push("/");
    } catch (err) {
      const defaultOption: SweetAlertOptions = generateSwalOption();

      switch (err.response.status) {
        case 400:
          defaultOption.title = "로그인 실패";
          defaultOption.text = "아이디, 비밀번호가 비었습니다";
          defaultOption.icon = "warning";
          this.$swal(defaultOption);
          break;
        case 401:
          defaultOption.title = "로그인 실패";
          defaultOption.text = "아이디, 비밀번호가 일치하지 않습니다";
          defaultOption.icon = "error";
          this.$swal(defaultOption);
          break;
        default:
          defaultOption.title = "로그인 실패";
          defaultOption.text = "오류가 발생하였습니다";
          defaultOption.icon = "error";
          this.$swal(defaultOption);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.login-form {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .input-container {
    display: flex;
    flex-direction: column;
    margin-top: 10%;
    margin-bottom: 5%;
    width: 80%;
    h1 {
      font-size: 2rem;
      margin: 0;
      margin-bottom: 8%;
      padding: 0;
      text-align: center;
    }

    .input-form {
      margin-top: 1rem;
      p {
        margin: 0;
        margin-bottom: 0.5rem;
        padding: 0;
        font-size: 0.75rem;
        font-weight: bold;
        color: $gray5;
      }

      input {
        box-sizing: border-box;
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        border: $gray3 1px solid;
        border-radius: 3px;
      }
    }

    button {
      margin-top: 2rem;
    }
  }

  .util-container {
    width: 80%;
    margin-bottom: 10%;

    .no-login-btn {
      display: inline;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    p {
      margin: 0;
      padding: 0;
      font-size: 0.8rem;
      color: $gray5;

      span {
        font-weight: bold;
        color: $blue3;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>