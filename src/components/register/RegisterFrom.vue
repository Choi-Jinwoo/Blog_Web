<template>
  <div class="register-form">
    <div class="input-container">
      <h1>회원가입</h1>

      <div class="input-form-container">
        <div class="input-form" title="숫자 혹은 알파벳 소문자 조합 4~20자로 구성되어야 합니다.">
          <p>아이디</p>
          <input type="text" v-model="id" />
        </div>
        <div class="input-form">
          <p>이름</p>
          <input type="text" v-model="name" />
        </div>
        <div class="input-form" title="8자 이상으로 구성되어야 합니다.">
          <p>비밀번호</p>
          <input
            type="password"
            v-model="pw"
            :style="!this.isPwChecked ? 'border: #ff0000 1px solid' : ''"
          />
        </div>
        <div class="input-form">
          <p>비밀번호 확인</p>
          <input
            type="password"
            v-model="rePw"
            :style="!this.isPwChecked ? 'border: #ff0000 1px solid' : ''"
          />
        </div>
      </div>

      <Btn text="회원가입" @click="register"></Btn>
    </div>

    <div class="util-container">
      <p class="no-register-btn" @click="$router.push('/')">회원가입 없이 둘러보기</p>
      <p>
        이미 계정이 있으신가요?
        <span @click="$router.push('/login')">로그인</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { sha512, Message } from "js-sha512";
import { API_ADDR } from "../../../config/server";
import Btn from "@/components/common/Btn/index.vue";

type User = {
  id: string;
  pw: string;
  name: string;
};

@Component({
  components: {
    Btn
  }
})
export default class RegisterForm extends Vue {
  id: string = "";
  name: string = "";
  pw: string = "";
  rePw: string = "";

  get isPwChecked(): boolean {
    return this.pw === this.rePw;
  }

  async register() {
    if (!(this.id && this.pw && this.name)) {
      this.$toasted.error("양식이 비었습니다.").goAway(800);
      return;
    }

    if (!this.isPwChecked) {
      this.$toasted.error("비밀번호가 다릅니다").goAway(800);
      return;
    }

    if (this.pw.length < 8) {
      this.$toasted.error("비밀번호 길이가 맞지 않습니다").goAway(800);
      return;
    }

    const castedPw: Message = String(this.pw);

    const userData: User = {
      id: this.id,
      pw: sha512(castedPw),
      name: this.name
    };

    try {
      await axios.post(`${API_ADDR}/auth/register`, userData);
      this.$router.push("/login");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해 주세요").goAway(800);
          break;
        case 409:
          this.$toasted.error("이미 존재하는 아이디입니다").goAway(800);
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

.register-form {
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

    .input-form-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .input-form {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;
        p {
          margin: 0;
          margin-bottom: 0.5rem;
          padding: 0;
          width: 90%;
          font-size: 0.75rem;
          font-weight: bold;
          color: $gray5;
        }

        input {
          box-sizing: border-box;
          width: 90%;
          padding: 0.5rem;
          font-size: 1rem;
          border: $gray3 1px solid;
          border-radius: 3px;
        }
      }
    }

    .Btn {
      width: 95%;
      margin: 0 auto;
      margin-top: 2rem;
    }
  }

  .util-container {
    width: 75%;
    margin-bottom: 3rem;

    .no-register-btn {
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