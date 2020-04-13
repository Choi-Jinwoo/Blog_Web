<template>
  <div class="post-view">
    <post-card v-for="(post, index) in posts" :key="index" :post="post"></post-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import moment from "moment";
import { Token } from "../../../lib/Storage";

import PostCard from "@/components/main/PostView/PostCard.vue";

@Component({
  components: {
    "post-card": PostCard
  }
})
export default class PostView extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";
</style>