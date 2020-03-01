<template>
  <div class="title-bar">
    <div class="tool-bar">
      <button class="adminpage-btn" v-show="this.isAdmin">Admin</button>
      <button class="subscribe-btn">Subscribe</button>
      <button class="login-btn" v-if="this.isLogin" @click="logout">Logout</button>
      <button class="logout-btn" v-else @click="login">Login</button>
      <button class="about-btn">About</button>
    </div>
    <div class="title-box">
      <h1>Tech Blog</h1>
      <h4>Hi, I'm jinwoo in dgsw. Enjoy showing my tech blog!</h4>
    </div>
  </div>
</template>

<script>
import { user, count } from "../../singleton/index";
export default {
  data() {
    return {
      isAdmin: false,
      isLogin: false
    };
  },
  mounted() {
    if (localStorage.getItem("x-access-token")) {
      this.isLogin = true;
    }
    if (user.getInstance() && user.getInstance().isAdmin === true) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
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
  h1,
  h4 {
    margin: 0;
    padding: 0;
  }
  .title-box {
    margin: 0 auto;
    margin-top: 1%;
    margin-bottom: 4%;
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