<template>
  <div class="comment">
    <div class="comment-info-container">
      <img :src="author.profileImage" />
      <div class="comment-info">
        <p>{{ author.id }}</p>
        <p class="created-at">{{ createdAt }}</p>
      </div>

      <!-- 일반 모드 -->
      <div class="comment-ctrl-box" v-show="author && user && author.id === user.id && !editMode">
        <p @click="editMode=true">수정</p>
        <p @click="deleteComment">삭제</p>
      </div>

      <!-- 수정 모드 -->
      <div class="comment-ctrl-box" v-show="editMode">
        <p @click="editMode=false">취소</p>
        <p @click="editComment">완료</p>
      </div>
    </div>

    <!-- 일반 모드 -->
    <div class="content" v-if="!editMode">{{ comment.content }}</div>

    <!-- 수정 모드 -->
    <div class="edit-box" v-else>
      <textarea :value="this.comment.content" id="edit-content"></textarea>
    </div>

    <!-- 일반 모드 -->
    <div v-show="!editMode" class="show-reply-text">
      <div v-if="comment.has_replies">
        <span v-if="showReplies" @click="showReplies = false">숨기기</span>
        <span v-else @click="showReplies = true">답글보기</span>
      </div>
      <div v-else>
        <span v-if="!showReplies" @click="showReplies = true">답글작성</span>
        <span v-else @click="showReplies = false">취소</span>
      </div>
    </div>

    <div class="reply-box" v-show="showReplies">
      <reply-box :user="user" :comment-idx="comment.idx" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { API_ADDR } from "../../../../config/server";
import getDataFromResp from "../../../lib/util/getDataFromResp";

import ReplyBox from "@/components/post/CommentBox/ReplyBox/index.vue";

type AuthorType = {
  id: string;
  profileImage: string;
};

type CommentType = {
  idx: number;
  content: string;
  fk_user_id: string | null;
  fk_post_idx: number;
  created_at: Date | string;
  has_replies: boolean;
};

type UserType = {
  id: string;
  profileImage: string;
  isAdmin: boolean;
};

@Component({
  components: {
    "reply-box": ReplyBox
  }
})
export default class Comment extends Vue {
  @Prop({ type: Object })
  comment!: CommentType;

  @Prop({ type: Object })
  user!: UserType;

  author: AuthorType = {} as AuthorType;

  editMode: boolean = false;

  showReplies: boolean = false;

  async mounted() {
    if (!this.comment.fk_user_id) {
      this.getBasicProfile();
    } else {
      this.getAuthor();
    }
  }

  get createdAt() {
    return moment(this.comment.created_at).format("YYYY-MM-DD hh:mm:ss");
  }

  async editComment() {
    const editInputElement = document.getElementById("edit-content") as any;
    if (!editInputElement) return;

    if (!editInputElement.value.length) {
      this.$toasted.error("댓글을 일력하세요").goAway(800);
      return;
    }
    try {
      await axios.put(
        `${API_ADDR}/comment/${this.comment.idx}`,
        {
          content: editInputElement.value
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        }
      );

      this.editMode = false;
      this.$emit("comment-change");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("댓글을 입력하세요").goAway(800);
          break;
        case 401:
          this.$toasted.error("로그인 후 이용해주세요").goAway(800);
          break;
        case 403:
          this.$toasted.error("비공개로 전환된 글입니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 댓글(글)입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다");
      }
    }
  }

  async deleteComment() {
    if (confirm("삭제시 댓글과 답글이 영구히 삭제됩니다") === false) return;

    try {
      await axios.delete(`${API_ADDR}/comment/${this.comment.idx}`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      });
      this.$emit("comment-change");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("댓글을 입력하세요").goAway(800);
          break;
        case 401:
          this.$toasted.error("로그인 후 이용해주세요").goAway(800);
          break;
        case 403:
          this.$toasted.error("비공개로 전환된 글입니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 댓글(글)입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다");
      }
    }
  }

  async getAuthor() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/profile?user=${this.comment.fk_user_id}`
      );

      const { user } = getDataFromResp(resp);

      const author: AuthorType = {
        id: user.id,
        profileImage: user.profile_image
      };
      this.author = author;
    } catch (err) {
      switch (err.response.status) {
        case 404:
          this.getBasicProfile();
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
      }
    }
  }

  async getBasicProfile() {
    const resp: AxiosResponse = await axios.get(
      `${API_ADDR}/file/basic-profile`
    );

    const { profile_image } = getDataFromResp(resp);
    const author: AuthorType = {
      id: "익명",
      profileImage: profile_image
    };
    this.author = author;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.comment {
  padding: 3rem 0;

  .comment-info-container {
    display: flex;
    align-items: center;

    img {
      width: 3rem;
      height: 3rem;
      border-radius: 100%;
    }

    .comment-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-left: 1rem;

      p {
        margin: 0;
        margin-top: 0.25rem;
        padding: 0;
      }

      .created-at {
        margin: 0;
        margin-bottom: 0.25rem;
        font-size: 0.75rem;
      }
    }

    .comment-ctrl-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
      p {
        margin: 0;
        margin-left: 1rem;
        padding: 0;
        font-size: 0.75rem;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .content {
    margin-top: 1rem;
  }

  .edit-box {
    textarea {
      box-sizing: border-box;
      resize: none;
      margin-top: 1rem;
      width: 100%;
    }
  }

  .show-reply-text {
    span {
      margin: 0;
      margin: 0.5rem;
      padding: 0;
      color: $blue3;
      font-size: 0.75rem;
      width: auto;
      cursor: pointer;
    }
  }

  .reply-box {
    @media only screen and (max-width: 945px) {
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem;
    }
    width: 80%;
    margin: 0 auto;
    background-color: $gray1;
  }
}
</style>