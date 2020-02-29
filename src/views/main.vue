<template>
  <div class="post-container">
    <post-card v-for="(post, index) in posts" :key="index" :post="post" />
  </div>
</template>

<script>
import postCard from "@/components/main/postCard";

export default {
  data: function() {
    return {
      posts: [
        {
          title: "2019 회고",
          thumbnail:
            "https://img.velog.io/post-images/yoop/3737f300-3554-11ea-b1db-cd1c49888397/3-Summer-iPhone-Wallpapers-by-Preppy-Wallpapers.jpg?w=768",
          createdAt: "2020-02-28",
          category: "개발"
        },
        {
          title: "2019 회",
          thumbnail:
            "https://img.velog.io/post-images/yoop/3737f300-3554-11ea-b1db-cd1c49888397/3-Summer-iPhone-Wallpapers-by-Preppy-Wallpapers.jpg?w=768",
          createdAt: "2020-02-28",
          category: "개발"
        },
        {
          title: "2019 회고",
          thumbnail:
            "https://img.velog.io/post-images/yoop/3737f300-3554-11ea-b1db-cd1c49888397/3-Summer-iPhone-Wallpapers-by-Preppy-Wallpapers.jpg?w=768",
          createdAt: "2020-02-28",
          category: "개발"
        },
        {
          title: "2019 회고",
          thumbnail:
            "https://img.velog.io/post-images/yoop/3737f300-3554-11ea-b1db-cd1c49888397/3-Summer-iPhone-Wallpapers-by-Preppy-Wallpapers.jpg?w=768",
          createdAt: "2020-02-28",
          category: "개발"
        },
        {
          title: "2019 회고",
          thumbnail:
            "https://img.velog.io/post-images/yoop/3737f300-3554-11ea-b1db-cd1c49888397/3-Summer-iPhone-Wallpapers-by-Preppy-Wallpapers.jpg?w=768",
          createdAt: "2020-02-28",
          category: "개발"
        }
      ]
    };
  },
  components: {
    "post-card": postCard
  }
};
</script>

<style lang="scss" scoped>
.post-container {
  width: 60%;
  margin: 0 auto;
  background-color: #dfe6e9;
  display: flex;
  align-items: center;
  justify-content: left;
  flex-wrap: wrap;
  margin-top: 20%;
  .post-card {
    margin: 5% 4.16%;
  }
}
</style>