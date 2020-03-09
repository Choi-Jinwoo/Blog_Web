<template>
  <div class="side-intro">
    <div class="intro-text-form">
      <h1>Welcome</h1>
      <p>안녕하세요</p>
    </div>
    <img src="../../assets/svg/login_joyride.svg" alt="Hello" />
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
  justify-content: center;
  background-color: #ffffff;

  .intro-text-form {
    h1 {
      padding: 0;
      margin: 0;
      font-size: 2rem;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: 1rem;
      color: $gray5;
    }
  }

  img {
    width: 80%;
  }
}
</style>