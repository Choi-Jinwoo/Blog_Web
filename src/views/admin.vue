<template>
  <div class="admin">
    <div class="top-bar">
      <span @click="$router.push('/')">Home</span>
      <span @click="$router.push('/write')">Write</span>
    </div>

    <div class="content-box">
      <div class="subscribe-box">
        <div class="subscribe-container">
          <h3>Subscribe</h3>
          <div class="subscribe-form">
            <div
              class="subscribe"
              v-for="(subscription, index) in subscriptions"
              :key="index"
            >{{subscription.email}}</div>
          </div>
        </div>
      </div>

      <div class="category-box">
        <div class="category-container">
          <h3>Category</h3>
          <div class="category-input-form">
            <input v-model="createName" type="text" placeholder="이름을 입력하세요" />
            <button @click="create">추가</button>
          </div>
          <div class="category-form">
            <category
              @delete-category="getCategories"
              v-for="(category, index) in categories"
              :key="index"
              :category="category"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SERVER_ENV from "../../env/server";
import axios from "axios";
import category from "@/components/admin/category";

export default {
  data() {
    return {
      categories: [],
      subscriptions: [],
      createName: ""
    };
  },
  methods: {
    create() {
      axios
        .post(
          `${SERVER_ENV.API_ADDR}/category`,
          {
            name: this.createName
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("x-access-token")
            }
          }
        )
        .then(async resp => {
          this.createName = "";
          await this.getCategories();
        })
        .catch(err => {
          let message = "";
          switch (err.response.status) {
            case 400:
              message = "내용을 입력해주세요";
              break;
            case 404:
              message = "새로고침 후 이용해주세요";
              break;
            case 409:
              message = "이미 존재하는 카테고리입니다.";
              break;
            case 410:
              message = "로그인 후 이용해주세요";
              break;
            case 500:
              message = "오류가 발생하였습니다.";
              break;
            default:
              message = "관리자만 이용가능합니다.";
          }

          this.$swal("오류", message, "error");
        });
    },
    getCategories() {
      axios
        .get(`${SERVER_ENV.API_ADDR}/category`)
        .then(resp => {
          const { data } = resp.data;
          this.categories = data.categories;
        })
        .catch(err => {
          this.$swal("오류", "다시 시도주세요", "error");
        });
    }
  },
  mounted() {
    axios
      .get(`${SERVER_ENV.API_ADDR}/profile/my`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
      .then(resp => {
        const { data } = resp.data;
        const { user } = data;
        const isAdmin = user.is_admin;
        if (isAdmin !== true) throw err;
      })
      .catch(err => {
        if (err.response && err.response.status === 410) {
          this.$swal("만료", "로그인 후 사용해주세요", "error");
          return;
        }

        this.$swal("권한 없음", "관리자만 이용가능합니다.", "warning");
        this.$router.push("/");
      });
    this.getCategories();
    axios
      .get(`${SERVER_ENV.API_ADDR}/subscription`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
      .then(resp => {
        const { data } = resp.data;
        this.subscriptions = data.subscriptions;
      })
      .catch(err => {
        switch (err.response.status) {
          case 500: {
            this.$swal("오류", "오류가 발생하였습니다.", "error");
            return;
          }
          case 410: {
            this.$swal("만료", "로그인 후 사용해주세요.", "info");
            return;
          }
        }
        this.$swal("권한 없음", "관리자만 이용 가능합니다.", "warning");
      });
  },
  components: {
    category
  }
};
</script>

<style lang="scss" scoped>
.admin {
  display: flex;
  flex-direction: column;
  .content-box {
    margin-top: 2%;
    display: flex;
    .category-box {
      margin: 0 auto;
      width: 60%;
      .category-container {
        h3 {
          color: #597cff;
          font-size: 30px;
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
        .category-input-form {
          width: 100%;
          margin: 0 auto;
          margin-top: 3%;
          border: 1px #597cff solid;
          padding: 1% 0;
          input {
            width: 38%;
            border: none;
            text-align: center;
            &:focus {
              outline: none;
            }
          }
          button {
            background-color: #ffffff;
            width: 8%;
            padding: 0.5% 0;
            border-radius: 5px;
            color: #597cff;
            font-weight: bold;
            border: none;
            &:hover {
              cursor: pointer;
              background-color: #e2e2e2;
            }
            &:focus {
              outline: none;
            }
          }
        }
        .category-form {
          margin-top: 5%;
          .category {
            margin-bottom: 2%;
          }
        }
      }
    }
    .subscribe-box {
      margin: 0 auto;
      color: #597cff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 30%;
      font-size: 30px;
      font-weight: bold;
      .subscribe-container {
        color: #597cff;
        width: 100%;
        background-color: #ffffff;
        // box-shadow: 0px 4px 4px 4px rgba($color: #000000, $alpha: 0.3);
        h3 {
          margin: 0;
          padding: 0;
        }
        .subscribe-form {
          font-size: 15px;
          max-height: 75vh;
          overflow: auto;
          .subscribe {
            border: #597cff 1px solid;
            color: #597cff;
            text-align: left;
            background-color: #ffffff;
            border-radius: 5px;
            margin: 4% 2%;
            padding: 3%;
          }
        }
      }
    }
  }
  .top-bar {
    display: flex;
    justify-content: flex-end;
    color: #ffffff;
    background-color: #597cff;
    padding: 1% 0;
    padding-right: 5%;
    box-shadow: 0 3px 3px rgba($color: #000000, $alpha: 0.3);
    span {
      margin-left: 2%;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>