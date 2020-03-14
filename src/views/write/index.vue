<template>
  <write-form />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import WriteForm from "@/components/write/WriteForm.vue";

@Component({
  components: {
    "write-form": WriteForm
  }
})
export default class Write extends Vue {}
</script>

<style lang="scss" scoped>
</style>