<template>
  <div class="notice">
    <top-bar />
    <notice-form />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import NoticeForm from "@/components/notice/NoticeForm/index.vue";
import TopBar from "@/components/common/TopBar/index.vue";

@Component({
  components: {
    "notice-form": NoticeForm,
    "top-bar": TopBar
  }
})
export default class PostCard extends Vue {}
</script>