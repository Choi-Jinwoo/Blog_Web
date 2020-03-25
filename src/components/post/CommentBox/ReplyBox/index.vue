<template>
  <div class="reply-box">
    <div class="reply-container">
      <Reply
        @reply-change="getReplies"
        v-for="(reply, index) in replies"
        :key="index"
        :reply="reply"
        :user="user"
      />
      <div class="input-form">
        <textarea placeholder="익명 작성이 가능합니다" v-model="content"></textarea>
        <Btn text="작성" size="small" @click="createReply" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../../../config/server";
import getDataFromResp from "../../../../lib/util/getDataFromResp";

import Btn from "@/components/common/Btn/index.vue";
import Reply from "@/components/post/CommentBox/ReplyBox/Reply.vue";
import { Token } from "../../../../lib/Storage";

type ReplyType = {
  idx: number;
  content: string;
  fk_user_id: string | null;
  fk_comment_idx: number;
};

type UserType = {
  id: string;
  name: string;
  isAdmin: boolean;
  thumbnail: string;
};

@Component({
  components: {
    Reply,
    Btn
  }
})
export default class ReplyBox extends Vue {
  @Prop({ type: Number })
  commentIdx!: number;

  @Prop({ type: Object })
  user!: UserType;

  content: string = "";

  replies: ReplyType[] = [];

  async mounted() {
    setTimeout(() => {
      this.getReplies();
    }, 100);
  }

  async createReply() {
    if (!this.content.length) {
      this.$toasted.error("답글을 입력하세요").goAway(800);
      return;
    }
    try {
      await axios.post(
        `${API_ADDR}/reply`,
        {
          content: this.content,
          comment_idx: this.commentIdx
        },
        {
          headers: {
            "x-access-token": Token.getToken()
          }
        }
      );

      this.content = "";
      this.getReplies();
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("댓글을 입력하세요").goAway(800);
          break;
        case 403:
          this.$toasted.error("비공개로 전환된 글입니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 댓글입니다").goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
      }
    }
  }

  async getReplies() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/reply?comment=${this.commentIdx}`,
        {
          headers: {
            "x-access-token": Token.getToken()
          }
        }
      );

      const { replies } = getDataFromResp(resp);
      this.replies = replies;
    } catch (err) {
      switch (err.response.status) {
        case 403:
          alert("비공개 글입니다");
          this.$router.push("/");
          break;
        case 404:
          break;
        default:
          alert("오류가 발생하였습니다");
          this.$router.push("/");
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-box {
  .input-form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 2rem 0;
    textarea {
      box-sizing: border-box;
      resize: none;
      padding: 1rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }

    .Btn {
      margin: 0.25rem;
      width: 4rem;
    }
  }
}
</style>