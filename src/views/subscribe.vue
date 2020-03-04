<template>
  <div class="subscribe">
    <div class="subscribe-container">
      <h5>구독시 새로운 글을 메일로 받아 보실 수 있습니다.</h5>
      <div class="subscribe-input-form">
        <input type="text" placeholder="example@example.com" v-model="email" />
        <button @click="subscribe">구독 완료</button>
        <button @click="cancelSubscribe">구독 해지</button>
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
      email: ""
    };
  },
  methods: {
    subscribe() {
      axios
        .post(`${SERVER_ENV.API_ADDR}/subscription`, {
          email: this.email
        })
        .then(resp => {
          this.$swal(
            "구독 성공",
            "감사합니다. 새로운 글을 메일을 통해 확인 가능합니다.",
            "success"
          );
          this.$router.push("/");
        })
        .catch(err => {
          const { status } = err.response;
          if (status === 400) {
            this.$swal("오류", "메일을 입력해주세요.", "warning");
            return;
          }
          if (status === 409) {
            this.$swal("오류", "이미 구독한 메일입니다.", "warning");
            return;
          }
        });
    },
    cancelSubscribe() {
      axios
        .post(`${SERVER_ENV.API_ADDR}/subscription/cancel`, {
          email: this.email
        })
        .then(resp => {
          this.$swal("구독 취소", "구독을 취소하였습니다.", "success");
          this.$router.push("/");
        })
        .catch(err => {
          const { status } = err.response;
          if (status === 400) {
            this.$swal("오류", "메일을 입력해주세요.", "warning");
            return;
          }
          if (status === 404) {
            this.$swal("오류", "구독 되지 않은 메일입니다.", "warning");
            return;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.subscribe {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #597cff;

  .subscribe-container {
    width: 50%;
    h5 {
      margin: 0;
      padding: 0;
      color: #ffffff;
      font-weight: normal;
      margin-bottom: 2%;
    }
    .subscribe-input-form {
      width: 100%;
      input {
        color: #597cff;
        margin: 0 auto;
        display: block;
        width: 90%;
        padding: 1%;
        border: none;
        border-radius: 5px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      button {
        width: 46%;
        background-color: #ffffff;
        border: none;
        margin-top: 1%;
        padding: 1% 0;
        border-radius: 5px;
        color: #597cff;
        font-weight: bold;
        &:hover {
          color: #ffffff;
          background-color: rgba($color: #000000, $alpha: 0.2);
          cursor: pointer;
        }
      }
    }
  }
}
</style>