<template>
  <div class="notice-form">
    <h2>Notice</h2>
    <div class="notice-input">
      <input type="text" placeholder="공지 제목을 입력하세요" v-model="notice" />
      <textarea placeholder="공지 내용을 입력하세요" v-model="notice.content" />
      <div class="create-btn">
        <p @click="createNotice">등록</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import createNotice from "@/lib/request/createNotice";

import INotice from "@/interface/INotice";
import { Token } from "../../lib/Storage";

@Component
export default class NoticeForm extends Vue {
  notice: INotice = {} as INotice;

  async createNotice() {
    try {
      await createNotice(Token.getToken(), this.notice);
      this.$toasted.info("공지를 생성하였습니다").goAway(800);
    } catch (err) {
      this.$toasted.error(err.message).goAway(800);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";

.notice-form {
  box-sizing: border-box;
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

    .create-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
}
</style>