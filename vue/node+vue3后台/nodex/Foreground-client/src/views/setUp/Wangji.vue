<!--忘记密码 -->
<template>
  <div class="forget">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="$router.back()" />
      </div>
      <!-- <div class="title">修改密码</div> -->
    </header>



    <div class="img">
      <van-image width="100rem" height="80rem" src="/public/小红书.png" />
    </div>



    <div class="inputText">
      <div class="account">
        <div class="name">账号</div>
        <input type="number" placeholder="请输入账号" min="6" max="11" v-model="account">
      </div>
      <div class="password">
        <div class="name">密码</div>
        <input type="password" placeholder="请输入密码" minlength="6" maxlength="15" v-model="password">
      </div>

      <div class="forgetBtn" @click="forget()">修改</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant';

const account = ref('')
const password = ref('')

const forget = () => {
  console.log(account.value, password.value)
  if (!account.value || !password.value) {
    showToast('请输入账号或密码');
    return;
  }
  showToast('修改成功');
}

</script>

<style lang="less" scoped>
.forget {
  // background-color: #ffffff;
  // height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  header {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10rem 0;
    font-size: 18rem;

    .back {
      padding-left: 15rem;
      width: 38%;
    }

    .title {
      width: 62%;
    }
  }

  .img {
    margin: 70rem 0;
  }

  .inputText {
    padding: 15rem;
    // height: 50rem;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 15rem;

    .account {
      padding: 10rem 0;
      border-bottom: 1rem solid lightgrey;
      // background-color: antiquewhite;
      display: flex;

      .name {
        width: 50rem;
        text-align: center;
        // background-color: aqua;
      }

      input {
        border: 0;
        // background-color: #ffffff;
        margin: 0 15rem;
        width: 200rem;
      }

    }

    .password {
      padding: 10rem 0;
      border-bottom: 1rem solid lightgrey;
      // background-color: antiquewhite;
      display: flex;

      .name {
        width: 50rem;
        text-align: center;
        // background-color: aqua;
      }

      input {
        border: 0;
        // background-color: #ffffff;
        margin: 0 15rem;
        width: 140rem;
      }

    }

    // 修改
    .forgetBtn {
      width: 255rem;
      background-color: red;
      color: white;

      margin-top: 60rem;
      padding: 10rem 0;

      text-align: center;
      border-radius: 50rem;
    }

  }
}
</style>
