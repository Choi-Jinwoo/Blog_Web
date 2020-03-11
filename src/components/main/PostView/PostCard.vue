<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { API_ADDR } from "../../../../config/server";

type PostType = {
  title: string;
  category: string;
  thumbnail: string;
  authorId: string;
  view: number;
  createdAt: string;
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
    this.getAuthor();
  }

  async getAuthor() {
    try {
      const resp = await axios.get(
        `${API_ADDR}/profile?user=${this.post.authorId}`
      );

      const { user } = getDataFromResp(resp);

      const author: AuthorType = {
        id: user.id,
        profileImage: user.profile_image
      };
      this.author = author;
    } catch (err) {
      console.log(err);
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
    const resp = await axios.get(`${API_ADDR}/file/basic-profile`);

    const { proifle_image } = getDataFromResp(resp);

    const author: AuthorType = {
      id: "삭제된 사용자",
      profileImage: proifle_image
    };
    this.author = author;
  }
}
</script>

<template>
  <div class="post-card">
    <img v-show="post.thumbnail" :src="post.thumbnail" :alt="post.title" />
    <div class="post-info">
      <p class="category">{{ post.category}}</p>
      <p class="created-at">{{ post.createdAt}}</p>
      <h3>{{ post.title }}</h3>

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

<style lang="scss" scoped>
@import "../../../style/palette.scss";
.post-card {
  display: inline-block;
  width: 100%;
  background-color: #ffffff;
  img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
  }

  .post-info {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 90%;

    .category,
    .created-at {
      margin: 0;
      padding: 0;
      font-size: 0.75rem;
      color: $gray5;
    }

    .category {
      text-align: left;
    }
    .created-at {
      text-align: right;
    }

    h3 {
      margin: 0;
      padding: 0;
      text-align: right;
      font-size: 1.75rem;
    }

    .bottom-info-container {
      display: flex;
      margin-top: 0.25rem;
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
}
</style>