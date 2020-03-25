<template>
  <div class="reply">
    <div class="reply-info-container">
      <img :src="author.profileImage" />
      <div class="reply-info">
        <p>{{ author.id }}</p>
        <p class="created-at">{{ createdAt }}</p>
      </div>

      <!-- 일반 모드 -->
      <div class="reply-ctrl-box" v-show="author && user && author.id === user.id && !editMode">
        <p @click="editMode=true">수정</p>
        <p @click="deleteReply">삭제</p>
      </div>

      <!-- 수정 모드 -->
      <div class="reply-ctrl-box" v-show="editMode">
        <p @click="editMode=false">취소</p>
        <p @click="editReply">완료</p>
      </div>
    </div>

    <!-- 일반 모드 -->
    <div class="content" v-if="!editMode">{{ reply.content }}</div>

    <!-- 수정 모드 -->
    <div class="edit-box" v-else>
      <textarea :value="this.reply.content" id="edit-content"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { API_ADDR } from "../../../../../config/server";
import { Token } from "@/lib/Storage";
import getDataFromResp from "../../../../lib/util/getDataFromResp";

type AuthorType = {
  id: string;
  profileImage: string;
};

type ReplyType = {
  idx: number;
  content: string;
  fk_user_id: string | null;
  fk_comment_idx: number;
  created_at: Date | string;
};

type UserType = {
  id: string;
  profileImage: string;
  isAdmin: boolean;
};

@Component
export default class Reply extends Vue {
  @Prop({ type: Object })
  reply!: ReplyType;

  @Prop({ type: Object })
  user!: UserType;

  author: AuthorType = {} as AuthorType;

  editMode: boolean = false;

  async mounted() {
    if (!this.reply.fk_user_id) {
      this.getBasicProfile();
    } else {
      this.getAuthor();
    }
  }

  get createdAt() {
    return moment(this.reply.created_at).format("YYYY-MM-DD hh:mm:ss");
  }

  async editReply() {
    const editInputElement = document.getElementById("edit-content") as any;
    if (!editInputElement) return;

    if (!editInputElement.value.length) {
      this.$toasted.error("답글을 일력하세요").goAway(800);
      return;
    }

    try {
      await axios.put(
        `${API_ADDR}/reply/${this.reply.idx}`,
        {
          content: editInputElement.value
        },
        {
          headers: {
            "x-access-token": Token.getToken()
          }
        }
      );

      this.editMode = false;
      this.$emit("reply-change");
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("답글을 입력하세요").goAway(800);
          break;
        case 401:
          this.$toasted.error("로그인 후 이용해주세요").goAway(800);
          break;
        case 403:
          this.$toasted.error("비공개로 전환된 글입니다").goAway(800);
          break;
        case 404:
          this.$toasted.error("삭제된 답글/댓글 입니다").goAway(800);
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

  async deleteReply() {
    if (confirm("삭제시 댓글과 답글이 영구히 삭제됩니다") === false) return;

    try {
      await axios.delete(`${API_ADDR}/reply/${this.reply.idx}`, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });
      this.$emit("reply-change");
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
        `${API_ADDR}/profile?user=${this.reply.fk_user_id}`
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
@import "../../../../style/palette.scss";

.reply {
  @media only screen and (max-width: 945px) {
    padding: 1.25rem 0;
  }
  padding: 3rem 0;

  .reply-info-container {
    display: flex;
    align-items: center;

    img {
      width: 3rem;
      height: 3rem;
      border-radius: 100%;
    }

    .reply-info {
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

    .reply-ctrl-box {
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
}
</style>