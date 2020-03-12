<template>
  <div class="side-bar">
    <div class="title-bar">
      <h1>꼬꼬마 블로그</h1>
      <div v-show="user.id" class="profile">
        <p>{{ user.id }}</p>
        <img :src="user.profileImage" />
      </div>
    </div>

    <div class="search-bar">
      <img src="../../assets/svg/search_bar_searcher.svg" alt />
      <input type="text" placeholder="검색어를 입력하세요" />
    </div>

    <div class="category-container">
      <h3>Category</h3>
      <p @click="selectCategory(null);">전체</p>
      <p
        v-for="(category, index) in categories"
        :key="index"
        @click="selectCategory(category.idx)"
      >{{ category.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { eventBus } from "@/lib/evnetBus";
import { API_ADDR } from "../../../config/server";

type UserType = {
  id: string;
  profileImage: string;
  isAdmin: boolean;
};

type Category = {
  idx: number;
  name: string;
};

@Component
export default class SideBar extends Vue {
  user: UserType = {} as UserType;
  categories: Category[] = [];

  async mounted() {
    this.getProfile();
    this.getCategories();
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
        profileImage: resUser.profile_image,
        isAdmin: resUser.is_admin
      };

      this.user = user;
    } catch (err) {
      console.log(err);
      switch (err.response.status) {
        case 400:
        case 401:
        case 404:
          break;
        default:
          this.$toasted.error("오류가 발생하였습니다").goAway(800);
      }
    }
  }

  async getCategories() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories } = getDataFromResp(resp);
    this.categories = categories;
  }

  async selectCategory(idx: number) {
    eventBus.$emit("select-category", idx);
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";
.side-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  @media only screen and (max-width: 945px) {
    height: auto;
  }
  .title-bar {
    flex-grow: 0.8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
      margin: 0;
      padding: 0;
      font-size: 2.5rem;
    }

    .profile {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 0.25rem;
      width: 100%;

      p {
        margin: 0;
        margin-right: 0.5rem;
        font-size: 0.75rem;
        color: $gray4;
      }

      img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 100%;
      }
    }
  }

  .search-bar {
    flex-grow: 0.4;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;

    img {
      width: 1.25rem;
      height: 1.25rem;
    }

    input {
      margin-left: 0.5rem;
      padding: 0.25rem;
      border: none;
      border-bottom: $gray4 solid 1px;

      &:focus {
        outline: none;
      }
    }
  }

  .category-container {
    @media only screen and (max-width: 945px) {
      display: none;
    }
    flex-grow: 3;
    width: 100%;

    h3 {
      margin: 0;
      margin-top: 4rem;
      margin-bottom: 1rem;
      padding: 0;
      color: $gray5;
    }

    p {
      margin: 0;
      padding: 0;
      padding: 0.25rem 0.5rem;
      color: $gray4;
      font-size: 1rem;
      cursor: pointer;
      &:hover {
        color: $gray5;
        text-decoration: underline;
      }
    }
  }
}
</style>