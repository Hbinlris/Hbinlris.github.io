<!--   登录 -->

<template>
  <div class="Login">
    <div class="login-header">
      <van-icon name="arrow-left" @click="$router.push({ path: '/ItsMine' })" />
    </div>
    <div class="top">
      <h1>密码登录</h1>
      <p>Hi,欢迎来到简单美食，会做饭很酷~</p>
    </div>
    <div class="login-center">
      <div class="input-login">
        <input type="text" placeholder="请输入用户名" v-model="username" />
        <input type="password" placeholder="请输入密码" v-model="password" />
      </div>

      <div class="btn">
        <div class="login-btn" @click="Login">登录</div>
        <div class="small">
          <div class="register-btn" @click="$router.push({ path: '/forgotPassword' })">
            忘记密码
          </div>
          <div class="register-btn" @click="$router.push({ path: '/Enroll' })">
            注册
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
import { showToast } from "vant";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
// const checked = ref(true);
const username = ref("");
const password = ref("");
// 新的用户名
const newuserName = ref();

const Login = () => {
  // 读取本地存储的用户数据
  let users = JSON.parse(localStorage.getItem("users")) || [];
  // 验证用户名和密码
  const user = users.find(
    (user) =>
      user.username === username.value && user.password === password.value
  );

  if (!user) {
    showToast("用户名或密码错误");
    return;
  }

  showToast("登录成功，正在跳转...");

  userStore.setUserInfo(user.username); // 更新用户信息

newuserName.value = localStorage.setItem('newuserName',user.username);


  setTimeout(() => {
    router.push({ path: "/" });
  }, 1000);

  // 登录成功后，如果存在 redirect 参数，则跳转到该参数指定的路由
  if (userStore.isLoggedIn) {
    const redirectUrl = router.currentRoute.value.query.redirect;
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push("/");
    }
  }
};
</script>

<style lang="less" scoped>
.Login {
  padding: 15rem;

  .top {
    margin-top: 35rem;

    h1 {
      margin: 0;
      font-size: 20rem;
      font-weight: 500;
    }

    p {
      font-size: 12rem;
      font-weight: normal;
      color: #9d9d9d;
    }
  }

  .login-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .van-icon {
      color: #000;
      font-size: 20rem;
      // width: 22vw;
    }

    .login-title {
      text-align: center;
      font-weight: bold;
      font-size: 25rem;
      // width: 50vw;
    }
  }

  .login-center {
    padding-top: 20rem;

    .input-login {
      padding: 15rem;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      input {
        width: 80vw;
        height: 25rem;
        margin: 5rem 0;
        padding: 5rem 15rem;

        border: none;
        border-bottom: 1px solid #f4f4f4;
      }
    }

    .btn {
      .login-btn {
        color: white;
        background-color: red;
        text-align: center;
        padding: 10rem 30rem;
        border-radius: 50rem;
        margin: 5rem 0;
      }

      .small {
        margin-top: 20rem;
        display: flex;
        justify-content: space-between;
        color: #9d9d9d;

        .register-btn {
          font-size: 12rem;
        }
      }
    }

    .foot {
      margin-top: 200rem;

      p.pic {
        font-size: 20rem;
        margin: 0;
        margin: 10rem;
        padding-left: 10rem;
      }

      p.text {
        font-size: 10rem;
        display: flex;
        align-items: center;
        color: #9d9d9d;
        margin: 0;
      }
    }
  }
}
</style>
