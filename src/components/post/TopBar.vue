<template>
  <div class="top-bar">topbar</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Post extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/palette.scss";
.top-bar {
  padding: 1rem;
  width: 100%;
  border-bottom: 1px $gray3 solid;
  background-color: #ffffff;
}
</style>