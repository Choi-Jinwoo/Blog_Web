<template>
  <div class="post-box">
    <div class="title">
      <p>{{ post.strCategory }}</p>
      <h1>{{ post.title }}</h1>

      <div class="post-info">
        <p>{{ strReleasedAt }} 작성</p>
        <p v-show="strUpdatedAt">{{ strUpdatedAt }} 수정</p>
      </div>
    </div>

    <div class="content">
      <div class="thumbnail" v-show="post.thumbnail">
        <img :src="post.thumbnail" />
      </div>
      <div class="marked-content" v-html="markedContent" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import getPost from "@/lib/request/getPost";
import getCategory from "@/lib/request/getCategory";
import moment from "moment";
import marked from "marked";
import { renderer, markedOptions } from "@/lib/markedOptions";

import IPost from "../../interface/IPost";
import { Token } from "../../lib/Storage";

/**
 * Set Marked Options
 */
marked.setOptions(markedOptions);

@Component
export default class PostBox extends Vue {
  post: IPost = {} as IPost;

  async created() {
    try {
      const post = await getPost(
        Token.getToken(),
        Number(this.$route.params.idx)
      );

      if (!post) throw new Error("새로 고침 후 이용해주세요");

      const category = await getCategory(Number(post.fk_category_idx));

      if (!category) post.strCategory = "기타";
      else post.strCategory = category.name;

      this.post = post;
    } catch (err) {
      alert(err.message);
      this.$router.push("/");
    }
  }

  get strReleasedAt(): string {
    if (!this.post.released_at) return "";
    return moment(this.post.released_at).format("YYYY년 MM월 DD일");
  }

  get strUpdatedAt(): string | null {
    if (!this.post.updated_at) return null;
    return moment(this.post.updated_at).format("YYYY년 MM월 DD일");
  }

  get markedContent(): string {
    return marked(String(this.post.content), { renderer });
  }
}
</script>

<style lang="scss" scoped>
.post-box {
  margin-top: 3.5rem;
}
</style>

