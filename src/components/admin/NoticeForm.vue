<template>
  <div class="notice-form">
    <h2>Notice</h2>
    <div class="notice-input">
      <input type="text" placeholder="공지 제목을 입력하세요" v-model="notice.title" />
      <textarea placeholder="공지 내용을 입력하세요" v-model="notice.content" />
      <p @click="createNotice">등록</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";

type NoticeType = {
  title: string;
  content: string;
};

@Component
export default class NoticeForm extends Vue {
  notice: NoticeType = {} as NoticeType;

  async createNotice() {
    try {
      await axios.post(`${API_ADDR}/notice`, this.notice, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      });
      this.$toasted.success("공지 등록이 완료되었습니다").goAway(800);
      this.notice = {} as NoticeType;
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 401:
        case 403:
          alert("관리자만 이용가능합니다");
          this.$router.push("/");
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.notice-form {
  box-sizing: border-box;
  width: 50%;
  margin: 0 auto;
  padding: 1rem;
  border: 1px $gray3 solid;
  h2 {
    margin: 0;
    padding: 0;
    color: $gray6;
  }
  .notice-input {
    display: flex;
    flex-direction: column;

    input {
      border: none;
      font-size: 1.25rem;
      font-weight: bold;
      &:focus {
        outline: none;
      }
    }

    textarea {
      box-sizing: border-box;
      margin-top: 1rem;
      padding: 0.75rem;
      resize: none;
      border: none;
      &:focus {
        outline: none;
      }
    }

    p {
      margin: 0;
      padding: 0;
      font-size: 0.75rem;
      text-align: right;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>