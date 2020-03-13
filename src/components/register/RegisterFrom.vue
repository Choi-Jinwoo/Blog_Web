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

        <div class="email-container">
          <div class="email-form">
            <p>이메일</p>

            <div class="input-box">
              <input type="text" v-model="email" @change="isAuth=false" />
              <Btn text="번호 발송" size="small" @click="sendAuthCode" />
            </div>
          </div>

          <div class="email-form">
            <p>인증번호</p>

            <div class="input-box">
              <input type="text" v-model="authCode" :placeholder="timer + '초'" />
              <Btn text="번호 확인" size="small" @click="checkAuthCode" />
            </div>
          </div>
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
  email: string;
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
  email: string = "";
  authCode: string = "";
  timer: number = 0;

  isAuth: boolean = false;

  get isPwChecked(): boolean {
    return this.pw === this.rePw;
  }

  async sendAuthCode() {
    if (!this.email) {
      this.$toasted.error("이메일을 입력하세요").goAway(800);
      return;
    }

    this.authCode = "";

    try {
      this.isAuth = false;
      await axios.post(`${API_ADDR}/auth/email/send`, {
        email: this.email,
        type: 0
      });
      this.startTimer();
      this.$toasted.info("인증번호가 발송되었습니다.").goAway(800);
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("이메일을 입력하세요").goAway(800);
          break;
        case 404:
          this.$toasted.error("정확한 메일 주소를 입력해주세요").goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
      }
    }
  }

  async checkAuthCode() {
    if (this.isAuth) {
      this.$toasted.error("이미 인증되었습니다").goAway(800);
      return;
    }

    if (!this.authCode) {
      this.$toasted.error("인증번호를 입력하세요").goAway(800);
      return;
    }

    try {
      await axios.post(`${API_ADDR}/auth/email/check`, {
        email: this.email,
        code: this.authCode,
        type: 0
      });

      this.timer = 0;
      this.$toasted.error("인증이 완료되었습니다").goAway(800);
      this.isAuth = true;
    } catch (err) {
      this.isAuth = false;
      switch (err.response.status) {
        case 400:
          this.$toasted.error("이메일 혹은 인증번호를 입력하세요").goAway(800);
          return;
        case 401:
          this.$toasted.error("인증번호가 틀렸습니다").goAway(800);
          return;
        case 404:
          this.$toasted.error("인증번호를 발송해주세요").goAway(800);
          return;
        case 410:
          this.$toasted.error("인증번호가 만료되었습니다").goAway(800);
          return;
      }
    }
  }

  async register() {
    if (!(this.id && this.pw && this.name && this.email)) {
      this.$toasted.error("양식이 비었습니다").goAway(800);
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

    if (!this.isAuth) {
      this.$toasted.error("이메일 인증을 완료해주세요").goAway(800);
      return;
    }

    const castedPw: Message = String(this.pw);

    const userData: User = {
      id: this.id,
      pw: sha512(castedPw),
      name: this.name,
      email: this.email
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
          console.log(err.response.status);
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
          break;
      }
    }
  }

  startTimer() {
    this.timer = 180;
    setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    this.timer = 0;
    clearInterval();
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

      .email-container {
        @media only screen and (max-width: 945px) {
          display: block;
          width: 95%;
        }
        display: flex;
        align-items: center;
        justify-content: center;

        .email-form {
          @media only screen and (max-width: 945px) {
            align-items: flex-start;
          }
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

          .input-box {
            @media only screen and (max-width: 945px) {
              justify-content: flex-start;
            }
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;

            input {
              box-sizing: border-box;
              width: calc(90% - 5.5rem);
              padding: 0.5rem;
              font-size: 1rem;
              border: $gray3 1px solid;
              border-radius: 3px;
            }

            .Btn {
              width: 5rem;
              padding: 0;
              margin: 0;
              margin-left: 0.5rem;
            }
          }
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