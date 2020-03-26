<template>
  <div class="Footer">
    <div class="copyright">
      <p>ⓒ 2020. wlswoo blog. All rights reserved</p>
    </div>

    <div class="sns">
      <img src="../../../assets/svg/footer_github.svg" alt @click="openGithub" />
      <img src="../../../assets/svg/footer_facebook.svg" alt @click="openFacebook" />
      <img src="../../../assets/svg/footer_blog.png" alt @click="openNaverBlog" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Post extends Vue {
  openGithub() {
    this.openWindow("https://github.com/Choi-jinwoo");
  }

  openNaverBlog() {
    this.openWindow("https://blog.naver.com/chlwlsdn0828");
  }

  openFacebook() {
    this.openWindow("https://www.facebook.com/ChoiJinwoo03");
  }

  openWindow(url: string) {
    window.open(url);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.Footer {
  box-sizing: border-box;
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 0;
  width: 100%;
  background-color: $gray6;
  color: $gray5;
  padding: 0.75rem 3rem;

  .copyright {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.75rem;
  }

  .sns {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    user-select: none;
    img {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      margin: 0 0.25rem;
      cursor: pointer;
    }
  }
}
</style>