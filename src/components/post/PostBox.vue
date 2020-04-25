<template>
  <div class="post-box">
    <div class="title">
      <p class="category">{{ post.strCategory }}</p>
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

    <div id="disqus_thread"></div>
    <!-- <noscript>
      Please enable JavaScript to view the
      <a
        href="https://disqus.com/?ref_noscript"
      >comments powered by Disqus.</a>
    </noscript>-->
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
    (function() {
      // DON'T EDIT BELOW THIS LINE
      var d = document,
        s = d.createElement("script");
      s.src = "https://blog-wlswoo-com.disqus.com/embed.js";
      s.setAttribute("data-timestamp", new Date().toString());
      (d.head || d.body).appendChild(s);
    })();

    //
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

<style lang="scss">
@import "../../style/post.scss";

.post-box {
  @media only screen and (max-width: 945px) {
    width: 90%;
  }
  margin-top: 3.5rem;
  padding-top: 120px;
  width: 60%;
  margin: 0 auto;

  .title {
    border-bottom: 1px solid $gray3;
    padding-bottom: 1rem;
    color: $gray6;

    h1 {
      margin: 0;
      padding: 0;
      font-size: 3rem;
    }

    .post-info {
      display: flex;
      align-items: center;

      margin-top: 1rem;
      p {
        font-size: 0.75rem;
        padding: 0 0.5rem;
      }
    }
  }

  .content {
    margin-top: 5rem;
  }
}
</style>

