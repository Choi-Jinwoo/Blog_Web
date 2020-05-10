<template>
  <div class="login-form">
    <div class="input-container">
      <h1>로그인</h1>
      <div class="input-form">
        <p>인증번호</p>
        <input type="text" v-model="code" @keydown.enter="login" />
      </div>

      <div class="save-id">
        <input type="checkbox" v-model="idSave" />
        <p @click="idSave = !idSave">로그인 정보 저장</p>
      </div>

      <button @click="login">로그인</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import { Token } from "@/lib/Storage";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { eventBus, BusEvent } from "../../lib/evnetBus";

@Component
export default class LoginForm extends Vue {
  code!: string;
  idSave: Boolean = false;

  async login() {
    // FIXME: Request 부분 모듈 빼기
    try {
      const resp: AxiosResponse = await axios.post(`${API_ADDR}/auth/login`, {
        code: this.code
      });

      const data = getDataFromResp(resp);
      const token = data["x-access-token"];

      Token.setToken(token);

      /**
       * ID Save 옵션 true > token 저장
       * ID Save 옵션 false > 저장된 token 삭제
       */
      if (this.idSave) {
        Token.setSavedToken(token);
      } else {
        Token.removeSavedToken();
      }

      eventBus.$emit(BusEvent.ADMIN_LOGIN);
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("코드를 입력해주세요").goAway(800);
          break;
        case 401:
          this.$toasted.error("코드가 옳지 않습니다").goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  .input-container {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 6rem 0;
    h1 {
      margin: 0;
      margin-bottom: 2rem;
      padding: 0;
      font-size: 2rem;
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

    .save-id {
      display: flex;
      align-items: center;
      margin-top: 0.75rem;

      input {
        width: 0.75rem;
        height: 0.75rem;
        cursor: pointer;
      }

      p {
        margin: 0;
        padding: 0;
        font-size: 0.75rem;
        color: $gray5;
        cursor: pointer;
      }
    }

    button {
      margin-top: 1.25rem;
      padding: 0.5rem 0;
      font-size: 1rem;
      background-color: $gray2;
      border: none;
    }
  }
}
</style>
