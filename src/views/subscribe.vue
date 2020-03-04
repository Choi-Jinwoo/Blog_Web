<template>
  <div class="subscribe">
    <div class="subscribe-container">
      <div class="select-container">
        <button>구독</button>
        <button>구독 해지</button>
      </div>
      <div class="subscribe-input-form">
        <input type="text" placeholder="example@example.com" />
        <button>완료</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.subscribe {
  background-color: #597cff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .subscribe-container {
    width: 50%;
    .select-container {
      display: flex;
      align-items: flex-start;

      :hover {
        cursor: pointer;
      }
      button {
        border: none;
      }
    }
    .subscribe-input-form {
      background-color: #ffffff;
      width: 100%;
      padding: 2% 0;
      input {
        width: 90%;
      }
    }
  }
}
</style>