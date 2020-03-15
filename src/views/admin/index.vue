<template>
  <notice-form />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import getDataFromResp from "@/lib/util/getDataFromResp";

import NoticeForm from "@/components/admin/NoticeForm.vue";

@Component({
  components: {
    "notice-form": NoticeForm
  }
})
export default class Admin extends Vue {}
</script>