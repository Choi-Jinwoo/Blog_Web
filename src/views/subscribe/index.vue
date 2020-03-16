<template>
  <subscribe-form />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { API_ADDR } from "../../../config/server";
import SubscribeForm from "../../components/subscribe/SubscribeForm.vue";

@Component({
  components: {
    "subscribe-form": SubscribeForm
  }
})
export default class Subscribe extends Vue {}
</script>