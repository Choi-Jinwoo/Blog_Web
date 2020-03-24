<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>아무것도 없어요</h2>
    <p @click="$router.push('/')">홈으로</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class NotFound extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/palette";

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;

  h1,
  h2 {
    margin: 0;
  }

  h1 {
    color: $blue3;
  }

  p {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>