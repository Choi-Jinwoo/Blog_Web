<template>
  <div class="post-box"></div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import getPost from "@/lib/request/getPost";

import IPost from "../../interface/IPost";
import { Token } from "../../lib/Storage";

@Component
export default class PostBox extends Vue {
  post!: IPost;
  async created() {
    try {
      const post = await getPost(
        Token.getToken(),
        Number(this.$route.params.idx)
      );

      if (!post) throw new Error("새로 고침 후 이용해주세요");
    } catch (err) {
      alert(err.message);
      this.$router.push("/");
    }
  }
}
</script>

