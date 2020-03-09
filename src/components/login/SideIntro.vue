<template>
  <div class="side-intro">
    <div class="intro-text-form">
      <h1>Welcome</h1>
      <p>안녕하세요</p>
    </div>
    <!-- <img src="../../assets/svg/login_joyride.svg" alt="Hello" /> -->
    <div class="img-form">
      <img src="../../assets/svg/login_highfive.svg" alt="Hello" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class SideIntro extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.side-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $gray1;

  .intro-text-form {
    box-sizing: border-box;
    padding: 8%;
    width: 100%;
    h1 {
      padding: 0;
      margin: 0;
      font-size: 1.5rem;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: 0.75rem;
      color: $gray4;
    }
  }

  .img-form {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    img {
      width: 80%;
    }
  }
}
</style>