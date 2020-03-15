<template>
  <div class="Notice">
    <div class="title">
      <h3>{{ notice.title }}</h3>

      <div class="notice-info">
        <img :src="author.profileImage" alt />

        <div class="detail">
          <p class="author-id">{{ author.id }}</p>
          <p>{{ notice.created_at }}</p>
        </div>
      </div>
    </div>

    <div class="content">{{ notice.content }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../../config/server";
import getDataFromResp from "../../../lib/util/getDataFromResp";

type NoticeType = {
  idx: number;
  title: string;
  content: string;
  fk_user_id: string;
  created_at: string;
};

type UserType = {
  id: string;
  profileImage: string;
};

@Component
export default class Notice extends Vue {
  @Prop({ type: Object })
  notice!: NoticeType;

  user: UserType = {} as UserType;
  author: UserType = {} as UserType;

  async mounted() {
    this.getAuthor();
    this.getProfile();
  }

  async getProfile() {
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/profile/my`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      });

      const { user: resUser } = getDataFromResp(resp);

      const user: UserType = {
        id: resUser.id,
        profileImage: resUser.profile_image
      };

      this.user = user;
    } catch (err) {}
  }

  async getAuthor() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/profile?user=${this.notice.fk_user_id}`
      );

      const { user } = getDataFromResp(resp);

      const author: UserType = {
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
    const author: UserType = {
      id: "삭제된 사용자",
      profileImage: profile_image
    };
    this.author = author;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.Notice {
  box-sizing: border-box;
  padding: 1rem;
  box-shadow: 0px 0px 4px 0px rgba($color: #000000, $alpha: 0.125);
  .title {
    h3 {
      margin: 0;
      padding: 0;
    }
    .notice-info {
      display: flex;
      align-items: center;
      margin: 1rem 0.5rem;
      img {
        width: 2rem;
        height: 2rem;
        object-fit: cover;
        border-radius: 100%;
      }

      .detail {
        margin-left: 0.25rem;
        p {
          margin: 0;
          padding: 0;
          font-size: 0.5rem;
        }

        .author-id {
          font-weight: bold;
          font-size: 0.75rem;
        }
      }
    }
  }

  .content {
    padding: 1rem;
  }
}
</style>