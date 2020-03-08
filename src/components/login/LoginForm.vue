<template>
  <div class="login-form">
    <div class="input-container">
      <div class="input-form">
        <p>아이디</p>
        <input type="text" v-model="id" />
      </div>

      <div class="input-form">
        <p>비밀번호</p>
        <input type="password" v-model="pw" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import { sha512, Message } from "js-sha512";
import { SweetAlertOptions } from "sweetalert2";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";
import generateSwalOption from "@/lib/util/generateSwalOption";

@Component
export default class LoginForm extends Vue {
  id: string = "";
  pw: string = "";

  async login() {
    const castedPw: Message = String(this.pw);

    try {
      const resp: AxiosResponse = await axios.post(`${API_ADDR}/auth/login`, {
        id: this.id,
        pw: sha512(castedPw)
      });

      const data = getDataFromResp(resp);
      const token = data["x-access-token"];
      this.$router.push("/");
    } catch (err) {
      const defaultOption: SweetAlertOptions = generateSwalOption();

      switch (err.response.status) {
        case 400:
          defaultOption.title = "로그인 실패";
          defaultOption.text = "아이디, 비밀번호가 비었습니다";
          defaultOption.icon = "warning";
          this.$swal(defaultOption);
          break;
        case 401:
          defaultOption.title = "로그인 실패";
          defaultOption.text = "아이디, 비밀번호가 일치하지 않습니다";
          defaultOption.icon = "error";
          this.$swal(defaultOption);
          break;
        default:
          defaultOption.title = "로그인 실패";
          defaultOption.text = "오류가 발생하였습니다";
          defaultOption.icon = "error";
          this.$swal(defaultOption);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .input-container {
  }
}
</style>