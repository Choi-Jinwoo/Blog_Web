<template>
  <header class="Header">
    <div class="content">
      <div class="link-box">
        <div class="home-btn" @click="$router.push('/')">홈</div>
        <div class="aboutme-btn">소개</div>
        <div class="admin-btn" v-show="isAdmin" @click="$router.push('/admin')">관리자</div>
      </div>
      <div class="sns-box">
        <img
          src="../../../assets/svg/github_icon.svg"
          @click="openWindow('https://github.com/Choi-jinwoo')"
        />
        <img
          src="../../../assets/svg/facebook_icon.svg"
          @click="openWindow('https://www.facebook.com/ChoiJinwoo03')"
        />
        <img src="../../../assets/svg/mail_icon.svg" alt />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Token } from "../../../lib/Storage";
import { eventBus, BusEvent } from "../../../lib/evnetBus";

@Component
export default class Header extends Vue {
  isAdmin: boolean = false;

  created() {
    if (Token.getToken()) this.isAdmin = true;

    eventBus.$on(BusEvent.ADMIN_LOGIN, () => {
      this.isAdmin = true;
    });
  }

  openWindow(url: string) {
    const win = window.open(url, "_blank");
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.Header {
  box-sizing: border-box;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 3.5rem;
  background-color: $gray6;
  color: $gray0;

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    height: 3.5rem;

    .link-box {
      display: flex;
      align-items: center;

      div {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 3.5rem;
        margin-right: 1rem;
        color: $gray2;
        border-bottom: 2.5px solid transparent;
        cursor: pointer;

        &:hover {
          color: #ffffff;
          border-bottom: 2.5px solid #ffffff;
        }
      }
    }

    .sns-box {
      img {
        width: 1.375rem;
        height: 1.375rem;
        margin-left: 0.5rem;
        cursor: pointer;
      }
    }
  }
}
</style>
