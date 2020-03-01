<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" /> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap");
@import url("https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding&display=swap");
img {
  max-width: 100%;
}
code {
  max-width: 95%;
  padding: 0 1%;
  display: inline-block;
  overflow: auto;
  font-family: "Nanum Gothic Coding";
}

html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Noto Sans KR";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
input,
button,
textarea {
  font-family: "Noto Sans KR";
}
</style>
