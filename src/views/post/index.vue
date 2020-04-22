<template>
  <div class="post">
    <Header></Header>
    <post-box />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import PostBox from "@/components/post/PostBox.vue";
import Header from "../../components/common/Header/index.vue";

@Component({
  components: {
    "post-box": PostBox,
    Header
  }
})
export default class Post extends Vue {}
</script>
