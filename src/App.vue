<template>
  <div id="app">
    <Header></Header>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Token } from "./lib/Storage";

import Header from "@/components/common/Header/index.vue";

@Component({
  components: {
    Header
  }
})
export default class App extends Vue {
  mounted() {
    const savedToken: string | null = Token.getSavedToken();
    if (!Token.getToken() && savedToken) {
      Token.setToken(savedToken);
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap");

html,
body {
  margin: 0;
  padding: 0;
}

input,
textarea {
  font-family: "Noto Sans KR";
}

#app {
  font-family: "Noto Sans KR";
}
</style>