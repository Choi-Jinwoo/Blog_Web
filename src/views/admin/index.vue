<template>
  <div class="admin">
    <notice-form />
    <category-form />
    <temp-post-form />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import NoticeForm from "@/components/admin/NoticeForm.vue";
import CategoryForm from "../../components/admin/CategoryForm/index.vue";
import TempPostForm from "../../components/admin/TempPostForm.vue";

@Component({
  components: {
    "notice-form": NoticeForm,
    "category-form": CategoryForm,
    "temp-post-form": TempPostForm
  }
})
export default class Admin extends Vue {}
</script>

<style lang="scss" scoped>
.admin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80rem;
  min-height: 100vh;
  margin: 0 auto;

  .notice-form,
  .category-form,
  .temp-post-form {
    margin: 0.25rem;
  }
}
</style>