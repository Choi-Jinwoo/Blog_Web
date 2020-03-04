<template>
  <div class="title-bar">
    <div class="tool-bar">
      <button
        @click="$router.push('/admin')"
        class="adminpage-btn"
        v-show="this.isAdmin === true"
      >Admin</button>
      <button class="subscribe-btn" @click="$router.push('/subscribe')">Subscribe</button>
      <button class="login-btn" v-if="this.id !== null" @click="logout">Logout</button>
      <button class="logout-btn" v-else @click="login">Login</button>
      <button class="about-btn">About</button>
    </div>
    <div class="title-box">
      <h1>Tech Blog</h1>
      <h4>Hi, I'm jinwoo in dgsw. Enjoy showing my tech blog!</h4>
    </div>
    <div class="profile" v-show="this.name !== null">
      <img class="profile-img" :src="this.profileImage" alt="profile" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../../env/server";

export default {
  data() {
    return {
      name: null,
      profileImage: null,
      id: null,
      isAdmin: null
    };
  },
  mounted() {
    axios
      .get(`${SERVER_ENV.API_ADDR}/profile/my`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
      .then(resp => {
        const { data } = resp.data;
        const { user } = data;
        this.name = user.name;
        this.profileImage = user.profile_image;
        this.id = user.id;
        this.isAdmin = user.is_admin;
      })
      .catch(err => {
        if (err.response.status === 410) {
          this.$swal("만료", "로그인 후 사용해주세요", "error");
        }
      });
  },
  methods: {
    logout() {
      localStorage.removeItem("x-access-token");
      window.location.reload();
    },
    login() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.title-bar {
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: #0097e6;
  color: #ffffff;
  .profile {
    margin-right: 2%;
    margin-bottom: 1%;
    .profile-img {
      background-color: #ffffff;
      height: 50px;
      width: 50px;
      object-fit: cover;
      border-radius: 50%;
      border: solid 3px #ffffff;
      @media only screen and (max-width: 768px) {
        height: 30px;
        width: 30px;
        border: solid 2px #ffffff;
      }
    }
  }
  h1,
  h4 {
    margin: 0;
    padding: 0;
  }
  .title-box {
    margin: 0 auto;
    margin-top: 1%;
    margin-bottom: 2%;
    h1 {
      font-size: 40px;
      margin-bottom: 5%;
    }
    h4 {
      font-weight: normal;
      font-size: 12px;
    }
  }
  .tool-bar {
    margin: 0.5% 2%;
    button {
      font-size: 15px;
      width: 10%;
      min-width: 80px;
      border: none;
      background-color: transparent;
      color: white;
      text-align: center;
      padding: 0;
      &:hover {
        cursor: pointer;
        font-weight: 600;
      }
      @media only screen and (max-width: 768px) {
        padding: 0;
        font-size: 12px;
        min-width: 70px;
      }
    }
    @media only screen and (max-width: 768px) {
      margin: 0 auto;
    }
  }
}
</style>