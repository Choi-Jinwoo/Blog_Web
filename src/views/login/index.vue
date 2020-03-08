<template>
  <div class="login">
    <side-intro />
    <login-form />
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
.login {
  .side-intro {
    width: 20%;
  }
}
</style>