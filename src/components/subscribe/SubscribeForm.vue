<template>
  <div class="subscribe-form">
    <div class="top-box">
      <img src="../../assets/svg/subscribe_post_box.svg" alt />
    </div>

    <div class="subscribe-box">
      <div class="subscribe-input">
        <input type="text" placeholder="example@example.com" v-model="email" />

        <div class="subscribe-btn">
          <p @click="subscribe">구독</p>
          <p @click="unsubscribe">구독 해지</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";

@Component
export default class SubscribeForm extends Vue {
  email: string = "";

  async subscribe() {
    try {
      await axios.post(`${API_ADDR}/subscription`, {
        email: this.email
      });

      alert("구독되었습니다");
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 409:
          this.$toasted.error("이미 구독된 이메일 입니다").goAway(800);
          break;
      }
    }
  }

  async unsubscribe() {
    try {
      await axios.post(`${API_ADDR}/subscription/cancel`, {
        email: this.email
      });

      alert("구독 해지되었습니다");
      this.$router.push("/");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 404:
          this.$toasted.error("구독 되지 않은 이메일 입니다").goAway(800);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.subscribe-form {
  box-sizing: border-box;
  padding-top: 2rem;
  width: 100%;
  height: 100vh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .top-box {
    img {
      height: 15rem;
    }
  }

  .subscribe-box {
    flex-grow: 1;
    display: flex;
    width: 100%;
    background-color: $blue2;
    .subscribe-input {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 1rem;
      input {
        box-sizing: border-box;
        padding: 0.5rem;
        width: 60%;
        font-size: 1rem;
        border: none;
        border-radius: 3px;
      }

      .subscribe-btn {
        margin-left: 2rem;
        p {
          margin: 0;
          padding: 0;
          font-weight: bold;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>