<template>
  <div class="register">
    <div class="register-box">
      <register-form />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import RegisterForm from "@/components/register/RegisterFrom.vue";

@Component({
  components: {
    "register-form": RegisterForm
  }
})
export default class Register extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/palette";

.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 300px;
  background-color: $blue3;
  user-select: none;

  .register-box {
    @media only screen and (max-width: 768px) {
      width: 90%;
    }
    width: 50%;
  }
}
</style>