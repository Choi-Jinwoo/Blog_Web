<template>
  <div class="side-intro">
    <div class="intro-text-form">
      <h1>Hello</h1>
      <p>안녕하세요</p>
    </div>
    <img src="../../assets/svg/login_joyride.svg" alt="Hello" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.side-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $blue1;

  .intro-text-form {
    h1 {
      padding: 0;
      margin: 0;
      font-size: 3rem;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: 1rem;
    }
  }

  img {
    width: 100%;
  }
}
</style>