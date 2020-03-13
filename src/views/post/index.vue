<template>
  <div class="post">
    <top-bar />
    <post-box />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import PostBox from "@/components/post/PostBox.vue";
import TopBar from "@/components/post/TopBar.vue";

@Component({
  components: {
    "post-box": PostBox,
    "top-bar": TopBar
  }
})
export default class Post extends Vue {}
</script>

<style lang="scss" scoped>
.post {
  .top-bar {
    position: fixed;
    top: 0;
  }
  .post-box {
    @media only screen and (max-width: 945px) {
      width: 90%;
    }
    width: 60%;
    margin: 0 auto;
    margin-top: 8rem;
  }
}
</style>