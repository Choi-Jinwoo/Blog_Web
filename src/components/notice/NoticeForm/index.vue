<template>
  <div class="notice-form">
    <h2>공지사항</h2>
    <div class="notice-box">
      <Notice v-for="(notice, index) in notices" :key="index" :notice="notice" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import getDataFromResp from "@/lib/util/getDataFromResp";
import { API_ADDR } from "../../../../config/server";
import Notice from "./Notice.vue";

type NoticeType = {
  idx: number;
  title: string;
  content: string;
  fk_user_id: string;
  created_at: Date | string;
};

@Component({
  components: {
    Notice
  }
})
export default class NoticeForm extends Vue {
  notices: NoticeType[] = [];

  async mounted() {
    this.getNotices();
  }

  async getNotices() {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/notice`);
    const { notices } = getDataFromResp(resp);
    notices.forEach((notice: NoticeType) => {
      notice.created_at = moment(notices.created_at).format("YYYY-MM-DD");
    });
    this.notices = notices;
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.notice-form {
  @media only screen and (max-width: 945px) {
    width: 90%;
  }
  margin: 0 auto;
  width: 70%;
  padding-top: 4rem;

  h2 {
    margin: 0;
    padding: 0;
    padding-bottom: 0.5rem;
    font-size: 2rem;
    color: $gray6;
    border-bottom: 1px $gray6 solid;
  }

  .notice-box {
    .Notice {
      margin: 2rem 0;
    }
  }
}
</style>