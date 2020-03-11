<template>
  <div class="main">
    <post-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import PostView from "@/components/main/PostView/index.vue";

@Component({
  components: {
    "post-view": PostView
  }
})
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
</style>