<template>
  <div class="side-bar">
    <div class="notice-bar">
      <div class="notice-btn">공지</div>
      <p @click="$router.push('/notice')">{{ noticeTitle }}</p>
    </div>

    <div class="title-bar">
      <h1>Jinu blog</h1>
      <div v-show="user.id" class="profile">
        <p>{{ user.id }}</p>
        <img :src="user.profileImage" />
      </div>
    </div>

    <div class="search-bar">
      <img src="../../assets/svg/search_bar_searcher.svg" alt />
      <input type="text" placeholder="검색어를 입력하세요" v-model="findQuery" @keydown.enter="findPost" />
    </div>

    <div class="category-container">
      <h3>Category</h3>
      <p @click="selectCategory(null)">전체</p>
      <p v-for="(category, index) in categories" :key="index" @click="selectCategory(category.idx)">
        {{ category.name }}
      </p>
    </div>

    <div class="bottom-bar">
      <p v-show="user.isAdmin" @click="$router.push('/write')">글쓰기</p>
      <p v-show="user.isAdmin" @click="$router.push('/admin')">관리자</p>
      <p v-if="!user.id" @click="$router.push('/login')">로그인</p>
      <p v-else @click="logout">로그아웃</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { eventBus } from '@/lib/evnetBus';
import { API_ADDR } from '../../../config/server';
import { Token } from '../../lib/Storage';

type UserType = {
  id: string;
  profileImage: string;
  isAdmin: boolean;
};

type CategoryType = {
  idx: number;
  name: string;
};

@Component
export default class SideBar extends Vue {
  user: UserType = {} as UserType;
  categories: CategoryType[] = [];
  findQuery: string = '';
  noticeTitle: string = '';

  async mounted() {
    this.getProfile();
    this.getCategories();
    this.getRecentNotice();
  }

  async getProfile() {
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/profile/my`, {
        headers: {
          'x-access-token': Token.getToken(),
        },
      });

      const { user: resUser } = getDataFromResp(resp);

      const user: UserType = {
        id: resUser.id,
        profileImage: resUser.profile_image,
        isAdmin: resUser.is_admin,
      };

      this.user = user;
    } catch (err) {
      switch (err.response.status) {
        case 400:
        case 401:
        case 404:
          break;
        case 410:
          this.$toasted.error('로그인 정보 만료로 재 로그인 후 사용해주세요.').goAway(800);
          break;
        default:
          this.$toasted.error('오류가 발생하였습니다').goAway(800);
      }
    }
  }

  async getRecentNotice() {
    try {
      const resp: AxiosResponse = await axios.get(`${API_ADDR}/notice/recent`);
      const { notice } = getDataFromResp(resp);
      this.noticeTitle = notice.title;
    } catch (err) {
      switch (err.response.status) {
        case 404:
          this.noticeTitle = '공지사항 없음';
          break;
        default:
          this.noticeTitle = '공지사항 오류 발생';
      }
    }
  }

  async getCategories() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories } = getDataFromResp(resp);
    this.categories = categories;
  }

  selectCategory(idx: number) {
    eventBus.$emit('select-category', idx);
  }

  findPost() {
    eventBus.$emit('find-post', this.findQuery);
  }

  logout() {
    Token.removeToken();
    Token.removeSavedToken();
    location.href = './';
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/palette.scss';
.side-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  user-select: none;

  @media only screen and (max-width: 945px) {
    width: 100%;
    height: auto;
  }

  .notice-bar {
    @media only screen and (max-width: 945px) {
      padding-left: 1rem;
    }
    box-sizing: border-box;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    margin-top: 0.5rem;
    width: 100%;
    height: 1.75rem;
    cursor: pointer;

    .notice-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      border-radius: 1rem;
      border: $gray5 solid 2px;
      font-weight: bold;
    }

    p {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      margin-left: 0.5rem;
      padding: 0;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .title-bar {
    @media only screen and (max-width: 945px) {
      width: 100%;
    }
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
      @media only screen and (max-width: 945px) {
        padding-right: 1rem;
      }
      box-sizing: border-box;
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
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;

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
    flex-grow: 2.5;
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

  .bottom-bar {
    @media only screen and (max-width: 945px) {
      padding-right: 1rem;
      margin-top: 0.5rem;
    }
    box-sizing: border-box;
    flex-grow: 0.4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;

    p {
      margin: 0;
      margin-left: 0.5rem;
      padding: 0;
      font-size: 0.8rem;
      color: $gray5;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
