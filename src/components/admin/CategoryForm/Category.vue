<template>
  <div class="category">
    <div class="normal-mode" v-if="!editMode">
      {{ category.name }}
      <div class="ctrl-btn">
        <p @click="editMode = true">수정</p>
        <p @click="deleteCategory">삭제</p>
      </div>
    </div>

    <div class="edit-mode" v-else>
      <input type="text" :placeholder="category.name" v-model="editName" />
      <div class="ctrl-btn">
        <p @click="editMode = false, editName = ''">취소</p>
        <p @click="modifyCategory">완료</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { Token } from "@/lib/Storage";
import { API_ADDR } from "../../../../config/server";

type CategoryType = {
  idx: number;
  name: number;
};

@Component
export default class Category extends Vue {
  @Prop({ type: Object })
  category!: CategoryType;

  editMode: boolean = false;
  editName: string = "";

  async modifyCategory() {
    try {
      await axios.put(
        `${API_ADDR}/category/${this.category.idx}`,
        {
          name: this.editName
        },
        {
          headers: {
            "x-access-token": Token.getToken()
          }
        }
      );

      this.$emit("category-change");
      this.$toasted.success("변경이 완료되었습니다").goAway(800);
      this.editMode = false;
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 401:
        case 403:
          this.$toasted.error("관리자만 이용가능합니다").goAway(800);
          this.$router.push("/");
          break;
        case 404:
          this.$toasted.error("삭제된 카테고리입니다").goAway(800);
          break;
        case 409:
          this.$toasted.error("중복된 카테고리입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
      }
    }
  }

  async deleteCategory() {
    if (!confirm("삭제 시 관련글도 모두 삭제됩니다")) return;
    try {
      await axios.delete(`${API_ADDR}/category/${this.category.idx}`, {
        headers: {
          "x-access-token": Token.getToken()
        }
      });

      this.$emit("category-change");
      this.$toasted.success("삭제가 완료되었습니다").goAway(800);
    } catch (err) {
      switch (err.response.status) {
        case 400:
          this.$toasted.error("양식을 확인해주세요").goAway(800);
          break;
        case 401:
        case 403:
          this.$toasted.error("관리자만 이용가능합니다").goAway(800);
          this.$router.push("/");
          break;
        case 404:
          this.$toasted.error("삭제된 카테고리입니다").goAway(800);
          break;
        case 410:
          this.$toasted
            .error("로그인 정보 만료로 재 로그인 후 이용해주세요")
            .goAway(800);
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/palette.scss";

.category {
  border: 1px $gray3 solid;
  border-radius: 3px;
  padding: 0.25rem;

  .ctrl-btn {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      margin-right: 0.25rem;
      padding: 0;
      font-size: 0.75rem;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .normal-mode {
    display: flex;
    width: 100%;
  }

  .edit-mode {
    box-sizing: border-box;
    display: flex;
    width: 100%;

    input {
      box-sizing: border-box;
      padding: 0.125rem;
      border: none;
      &:focus {
        outline: none;
      }
    }
  }
}
</style>