<template>
  <div class="wrapper-category">{{ wrapperCategory.name }}</div>
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