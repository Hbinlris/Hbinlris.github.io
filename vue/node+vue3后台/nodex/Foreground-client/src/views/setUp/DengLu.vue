<template>
  <div class="login">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="$router.push('/')" />
      </div>
      <!-- <div class="title">登录</div> -->
    </header>

    <div class="img">
      <van-image width="176rem" height="100rem" src="/public/小红书.png" />
    </div>

    <div class="inputText">
      <div class="account">
        <!-- <div class="name">账号</div> -->
        <input
          type="text"
          v-model="username"
          placeholder="请输入账号"
          minlength="6"
          maxlength="11"
        />
      </div>
      <div class="password">
        <!-- <div class="name">密码</div> -->
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码"
          minlength="6"
          maxlength="15"
        />
        <div class="placeholding">忘记密码</div>
      </div>

      <div class="loginBtn" @click="login">登录</div>

      <div class="register" @click="$router.push('/Zhuce')">
        注册账号
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { showSuccessToast, showFailToast } from "vant";
import { ref } from "vue";
import axios from "axios";
import router from "@/router";

const username = ref("");
const password = ref("");

const login = () => {
  if (username.value === "" || password.value === "") {
    showFailToast("账号或密码不能为空");
  } else {
    const data = {
      username: username.value,
      password: password.value,
    };

    axios
      .post("http://localhost:8080/api/login", data)
      .then((response) => {
        console.log(
          "登录请求成功:",
          response.data.success,
          response.data.message
        );
        if (response.data.success) {
          showSuccessToast("登录成功");

          localStorage.setItem("userToken", data.username);

          // 跳转到个人中心
          router.push({ path: "/PersonalCenter" }).then(() => {
            location.reload();
          });
        } else {
          showFailToast(response.data.message || "登录失败");
        }
      })
      .catch((error) => {
        showFailToast("登录失败，账号或者密码错误");
        console.error("登录请求失败:", error);
      });
  }
};
</script>

<style lang="less" scoped>
.login {
  // background-color: #f8f8f8;
  // height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  header {
    display: flex;
    align-items: center;
    // background-color: antiquewhite;
    width: 100%;
    padding: 10rem 0;
    font-size: 18rem;

    .back {
      padding: 0 15rem;
      width: 43%;
    }

    .title {
      width: 57%;
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
      display: flex;

      .name {
        width: 50rem;
        text-align: center;
      }

      input {
        border: 0;
        // background-color: #f8f8f8;
        margin: 0 15rem;
        width: 200rem;
      }
    }

    .password {
      padding: 10rem 0;
      border-bottom: 1rem solid lightgrey;
      display: flex;

      .name {
        width: 50rem;
        text-align: center;
      }

      input {
        border: 0;
        // background-color: #f8f8f8;
        margin: 0 15rem;
        width: 140rem;
      }

      .placeholding {
        // width: 70rem;
        color: red;
      }
    }

    .loginBtn {
      // width: 320rem;
      width: 255rem;
      background-color: red;
      margin-top: 60rem;
      padding: 10rem 0;
      text-align: center;
      border-radius: 50rem;
    }

    .register {
      margin-top: 20rem;
      width: 255rem;
      text-align: center;
    }
  }
}
</style>
