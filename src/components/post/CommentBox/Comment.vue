<template>
  <div class="comment">
    <div class="comment-info-container">
      <img :src="author.profileImage" />
      <div class="comment-info">
        <p>{{ author.id }}</p>
        <p class="created-at">{{ createdAt }}</p>
      </div>
    </div>

    <div class="content">{{ comment.content }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { API_ADDR } from "../../../../config/server";
import getDataFromResp from "../../../lib/util/getDataFromResp";

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
};

type UserType = {
  id: string;
  profileImage: string;
  isAdmin: boolean;
};

@Component
export default class Comment extends Vue {
  @Prop({ type: Object })
  comment!: CommentType;

  @Prop({ type: Object })
  user!: UserType;

  author: AuthorType = {} as AuthorType;

  async mounted() {
    this.getAuthor();
  }

  get createdAt() {
    return moment(this.comment.created_at).format("YYYY-MM-DD hh:mm:ss");
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
  }

  .content {
    margin-top: 1rem;
  }
}
</style>