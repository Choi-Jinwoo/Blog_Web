<template>
  <div class="comment-box">
    <h3>Comments</h3>
    <div class="input-form">
      <textarea placeholder="익명 작성이 가능합니다" v-model="content"></textarea>
      <Btn text="작성" size="small" @click="createComment" />
    </div>

    <div class="comment-container">
      <Comment
        @comment-change="getComments"
        v-for="(comment, index) in comments"
        :key="index"
        :comment="comment"
        :user="user"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../../config/server";
import getDataFromResp from "../../../lib/util/getDataFromResp";

import Btn from "@/components/common/Btn/index.vue";
import Comment from "@/components/post/CommentBox/Comment.vue";

type CommentType = {
  idx: number;
  content: string;
  fk_user_id: string | null;
  fk_post_idx: number;
  has_replies: boolean;
};

type UserType = {
  id: string;
  name: string;
  isAdmin: boolean;
  thumbnail: string;
};

@Component({
  components: {
    Btn,
    Comment
  }
})
export default class CommentBox extends Vue {
  @Prop({ type: Number })
  postIdx!: number;

  @Prop({ type: Object })
  user!: UserType;

  content: string = "";

  comments: CommentType[] = [];

  async mounted() {
    setTimeout(() => {
      this.getComments();
    }, 100);
  }

  async createComment() {
    if (!this.content.length) {
      this.$toasted.error("댓글을 입력하세요").goAway(800);
      return;
    }
    try {
      await axios.post(
        `${API_ADDR}/comment`,
        {
          content: this.content,
          post_idx: this.postIdx
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        }
      );

      this.content = "";
      this.getComments();
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("댓글을 입력하세요").goAway(800);
          break;
        case 403:
          this.$toasted.error("비공개로 전환된 글입니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 글입니다").goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
      }
    }
  }

  async getComments() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/comment?post=${this.postIdx}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        }
      );

      const { comments } = getDataFromResp(resp);
      this.comments = comments;
    } catch (err) {
      switch (err.response.status) {
        case 403:
          alert("비공개 글입니다");
          this.$router.push("/");
          break;
        case 404:
          this.$router.push("/notfound");
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
.comment-box {
  width: 100%;
  .input-form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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