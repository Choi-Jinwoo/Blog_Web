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

      <div class="save-id">
        <input type="checkbox" v-model="idSave" />
        <p>아이디 저장</p>
      </div>

      <Btn text="로그인" @click="login"></Btn>
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
import { API_ADDR } from "../../../config/server";
import { Token } from "@/lib/Storage";
import getDataFromResp from "@/lib/util/getDataFromResp";
import Btn from "@/components/common/Btn/index.vue";

@Component({
  components: {
    Btn
  }
})
export default class LoginForm extends Vue {
  id: string = "";
  pw: string = "";
  idSave: Boolean = false;

  async login() {
    const castedPw: Message = String(this.pw);

    try {
      const resp: AxiosResponse = await axios.post(`${API_ADDR}/auth/login`, {
        id: this.id,
        pw: sha512(castedPw)
      });

      const data = getDataFromResp(resp);
      const token = data["x-access-token"];

      Token.setToken(token);
      if (this.idSave) {
        Token.setSavedToken(token);
      } else {
        Token.removeSavedToken();
      }

      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("아이디, 비밀번호가 비었습니다").goAway(800);
          break;
        case 401:
          this.$toasted.error("아이디, 비밀번호가 틀렸습니다").goAway(800);
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
  background-color: #ffffff;
  .input-container {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    width: 80%;
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
      }

      p {
        margin: 0;
        padding: 0;
        font-size: 0.75rem;
        color: $gray5;
      }
    }

    .Btn {
      margin-top: 1rem;
    }
  }

  .util-container {
    width: 80%;
    margin-bottom: 3rem;

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