<template>
  <div class="top-bar">
    <div class="home">
      <span @click="$router.push('/')">Home</span>
    </div>
    <div class="subscribe">
      <div class="subscribe-btn" @click="$router.push('/subscribe')">Subscribe</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Post extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";
.top-bar {
  box-sizing: border-box;
  display: flex;
  padding: 0.75rem 1.5rem;
  width: 100%;
  border-bottom: 1px $gray3 solid;
  background-color: #ffffff;

  .home {
    display: flex;
    align-items: center;
    flex-grow: 1;
    color: $gray6;

    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .subscribe {
    box-sizing: border-box;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .subscribe-btn {
      box-sizing: border-box;
      padding: 0.25rem 1rem;
      border: 1.5px $gray5 solid;
      border-radius: 1.5rem;
      cursor: pointer;

      &:hover {
        background-color: $gray1;
      }
    }
  }
}
</style>