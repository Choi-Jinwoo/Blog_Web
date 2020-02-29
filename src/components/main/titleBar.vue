<template>
  <div class="title-bar">
    <h1>Title</h1>
    <button class="subscribe-btn">구독</button>
    <button class="login-btn" v-if="this.isLogin">로그아웃</button>
    <button class="logout-btn" v-else>로그인</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false
    };
  },
  mounted() {
    if (localStorage.getItem("x-access-token")) {
      this.isLogin = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.title-bar {
  background-color: #597cff;
  color: #ffffff;
  h1 {
    margin: 0;
  }
}
</style>