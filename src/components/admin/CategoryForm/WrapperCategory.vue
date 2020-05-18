<template>
  <div class="wrapper-category">
    <div class="util-box">
      {{ wrapperCategory.name }}
      <button>수정</button>
      <button>삭제</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ICategoryResp from "../../../interface/ICategoryResp";

@Component
export default class WrapperCategory extends Vue {
  @Prop({ type: Object })
  wrapperCategory!: ICategoryResp;
}
</script>