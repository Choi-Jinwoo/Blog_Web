<template>
  <div class="main">
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
    <post-card :post="post" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import PostCard from "@/components/main/PostView/PostCard.vue";

@Component({
  components: {
    "post-card": PostCard
  }
})
export default class Main extends Vue {
  post = {
    title: "제목",
    category: "개발",
    createdAt: "2020-08-28",
    view: 19,
    authorId: "chlwlsdn",
    thumbnail: "https://avatars1.githubusercontent.com/u/49791336?s=460&v=4"
  };
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #000000;
  display: flex;
  flex-wrap: wrap;
  .post-card {
    box-sizing: border-box;
    flex-grow: 1;
    width: 20%;
    margin: 2%;
    min-width: 18rem;
    max-width: 50%;
  }
}
</style>