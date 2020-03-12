<template>
  <div class="post-card">
    <img v-show="post.thumbnail" :src="post.thumbnail" :alt="post.title" />
    <div class="post-info">
      <!-- if thumbnail exist -->
      <div class="img-exist" v-if="post.thumbnail">
        <p class="category">{{ post.category}}</p>
        <p class="created-at">{{ post.createdAt}}</p>
        <h3>{{ post.title }}</h3>
      </div>

      <div class="img-not-exist" v-else>
        <p class="category">{{ post.category}}</p>
        <h3>{{ post.title }}</h3>
        <p class="created-at">{{ post.createdAt}}</p>
      </div>

      <div class="bottom-info-container">
        <div class="author-info">
          <img :src="author.profileImage" />
          <p>{{ author.id }}</p>
        </div>
        <div class="view-info">
          <img src="../../../assets/svg/post_card_view.svg" />
          <p>{{ post.view }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { API_ADDR } from "../../../../config/server";

type PostType = {
  title: string;
  category: string;
  thumbnail: string;
  authorId: string;
  view: number;
  createdAt: Date | string;
};

type AuthorType = {
  id: string;
  profileImage: string;
};

@Component
export default class PostCard extends Vue {
  @Prop({ type: Object })
  post!: PostType;

  author: AuthorType = {
    id: "",
    profileImage: ""
  };

  async mounted() {
    this.post.createdAt = moment(this.post.createdAt).format("YYYY-MM-DD");
    this.getAuthor();
  }

  async getAuthor() {
    try {
      const resp: AxiosResponse = await axios.get(
        `${API_ADDR}/profile?user=${this.post.authorId}`
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
      id: "삭제된 사용자",
      profileImage: profile_image
    };
    this.author = author;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.post-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 8px 2px rgba($color: $gray5, $alpha: 0.2);

  img {
    width: 100%;
    height: 12rem;
    object-fit: cover;
  }

  .post-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    margin-top: 0.25rem;
    width: 90%;

    .category,
    .created-at {
      margin: 0;
      padding: 0;
      font-size: 0.75rem;
      color: $gray5;
    }

    .img-exist {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .category {
        text-align: left;
      }
      .created-at {
        text-align: right;
      }

      h3 {
        margin: 0;
        padding: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        overflow: hidden;
        font-size: 1.75rem;
      }
    }

    .img-not-exist {
      display: flex;
      flex-direction: column;
      height: 16rem;
      align-items: center;
      justify-content: center;

      h3 {
        flex-grow: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 1.75rem;
      }

      .category,
      .created-at {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .created-at {
        justify-content: flex-end;
        width: 100%;
      }
    }

    .bottom-info-container {
      display: flex;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
      .author-info,
      .view-info {
        display: flex;
        align-items: center;
        width: 50%;

        p {
          display: inline-block;
          margin: 0;
          padding: 0;
          margin-left: 0.5rem;
          font-size: 0.75rem;
          color: $gray5;
        }
      }

      .author-info {
        justify-content: flex-start;
        img {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 100%;
        }
      }

      .view-info {
        justify-content: flex-end;
        img {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 8px 4px rgba($color: $gray5, $alpha: 0.5);
  }
}
</style>