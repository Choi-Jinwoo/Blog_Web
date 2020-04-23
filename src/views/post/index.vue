<template>
  <div class="post">
    <post-box />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import PostBox from "@/components/post/PostBox.vue";

@Component({
  components: {
    "post-box": PostBox
  }
})
export default class Post extends Vue {}
</script>
