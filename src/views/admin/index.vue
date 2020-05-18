<template>
  <div class="admin">
    <category-form />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Token } from "../../lib/Storage";

import CategoryForm from "@/components/admin/CategoryForm/index.vue";

@Component({
  components: {
    CategoryForm
  }
})
export default class Admin extends Vue {
  created() {
    if (!Token.getToken()) {
      alert("관리자만 이용가능합니다");
      this.$router.push("/");
    }
  }
}
</script>

<style lang="scss" scoped>
.admin {
  padding: 3.5rem;
}
</style>