<template>
  <div class="notice">
    <top-bar />
    <notice-form />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import NoticeForm from "@/components/notice/NoticeForm/index.vue";
import TopBar from "@/components/common/TopBar/index.vue";
import Footer from "@/components/common/Footer/index.vue";

@Component({
  components: {
    "notice-form": NoticeForm,
    "top-bar": TopBar,
    Footer
  }
})
export default class PostCard extends Vue {}
</script>

<style lang="scss" scoped>
.notice {
  position: relative;
  min-height: 100vh;
}
</style>