<template>
  <div class="not-found">
    <h2>아무것도 없어요..</h2>
    <p @click="$router.push('/')">홈으로</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class NotFound extends Vue {}
</script>

<style lang="scss" scoped>
.not-found {
  padding: 3rem;

  p {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>