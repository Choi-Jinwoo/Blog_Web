<template>
  <div class="login">
    <div class="login-box">
      <side-intro />
      <login-form />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import SideIntro from "@/components/login/SideIntro.vue";
import LoginForm from "../../components/login/LoginForm.vue";
@Component({
  components: {
    "side-intro": SideIntro,
    "login-form": LoginForm
  }
})
export default class Login extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/palette";

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-width: 300px;
  background-color: $gray6;
  user-select: none;

  .login-box {
    @media only screen and (max-width: 768px) {
      width: 80%;
    }

    display: flex;
    width: 50%;
    max-width: 800px;

    .side-intro {
      @media only screen and (max-width: 768px) {
        display: none;
      }

      width: 40%;
    }
    .login-form {
      width: 60%;
      @media only screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }
}
</style>
