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
  display: block;
  max-width: 100%;
  padding: 0;
  margin: 0 auto;
}
blockquote {
  border-left: 5px solid #597cff;
  margin: 0;
  padding-left: 2%;
  background-color: #e2e2e2;
}
table {
  text-align: center;
  width: 100%;
  border: solid 1px #000000;
  max-width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: center;
  border: solid 1px #000000;
  padding: 0;
}
code {
  font-size: 90%;
  background-color: #dff9fb;
  padding: 0.2%;
  /* color: #ffffff; */
  display: inline-block;
  overflow: auto;
  font-family: "Nanum Gothic Coding";
}
pre code {
  font-size: 100%;
  border-radius: 5px;
  background-color: #ffffff;
  padding: 1%;
  width: 98%;
  margin: 0 auto;
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
