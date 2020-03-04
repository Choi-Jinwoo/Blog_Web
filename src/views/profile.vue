<template>
  <div class="profile">
    <div class="top-bar">
      <span @click="$router.push('/')">Home</span>
    </div>

    <div class="user-container">
      <div class="profile-image">
        <img :src="user.profile_image" alt="이미지" />
        <button class="upload-profile-image-btn">프로필 변경</button>
      </div>
      <div class="user-info-container">
        <div class="user-info">
          <span>{{ user.name }}</span>
          <span>{{ user.id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SERVER_ENV from "../../env/server";

export default {
  data() {
    return {
      user: {}
    };
  },
  methods: {
    getMyProfile() {
      axios
        .get(`${SERVER_ENV.API_ADDR}/profile/my`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          const { data } = resp.data;
          this.user = data.user;
        })
        .catch(err => {
          if (err.response.status === 500) {
            this.$swal("오류", "오류가 발생하였습니다.", "error");
            return;
          }
          if (err.response.status === 410) {
            this.$swal("만료", "오류가 발생하였습니다.", "warning");
            this.$router.push("/");
            return;
          }
          this.$swal("경고", "로그인 후 사용가능합니다.", "warning");
          this.$router.push("/");
        });
    }
  },
  mounted() {
    this.getMyProfile();
  }
};
</script>

<style lang="scss" scoped>
.profile {
  .top-bar {
    display: flex;
    justify-content: flex-start;
    color: #ffffff;
    background-color: #597cff;
    padding: 1% 0;
    padding-right: 5%;
    box-shadow: 0 2px 2px rgba($color: #000000, $alpha: 0.3);
    span {
      margin-left: 2%;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .user-container {
    display: flex;
    width: 80%;
    margin: 4% auto;

    .profile-image {
      width: 40%;
      img {
        object-fit: cover;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>