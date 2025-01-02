<!--LoginRead  -->

<template>
  <div class="LoginRead">
    <div class="title">
      <van-icon name="cross" class="close" @click="$router.go(-1)" />
      <div class="title-login">登录</div>
    </div>

    <div class="login">
      <input type="number" placeholder="账号" v-model="username" />
      <input type="password" placeholder="密码" v-model="password" />

      <div class="login_btn" @click="login" :class="{ active: isinput }">
        登录
      </div>

      <div class="enrollforget">
        <!-- <div class="forget">忘记密码</div> -->
        <div class="enroll" @click="gotoEnrollAccount">注册账号</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },

  computed: {
    isinput() {
      return this.username && this.password;
    },
  },

  methods: {
    // 登录验证
    loginVerification() {
      // 关闭提示
      Toast.clear();

      // 输入验证
      if (!this.username) {
        Toast.fail("请输入账号");
        return false;
      }
      if (!this.password) {
        Toast.fail("请输入密码");
        return false;
      }

      return true;
    },

    // 登录
    login() {
      if (!this.loginVerification()) {
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = users.find((user) => user.username === this.username);

      if (!foundUser) {
        Toast.fail("用户不存在");
        return;
      }

      if (foundUser.password !== this.password) {
        Toast.fail("密码错误");
        return;
      }

      // 成功提示
      Toast.success("登录成功！");
      // 清空输入框
      this.username = "";
      this.password = "";

      // 调用 Vuex actions
      this.$store.dispatch("login", foundUser);

      this.$router.push({
        path: "/",
      });
    },

    // 跳转注册
    gotoEnrollAccount() {
      this.$router.push({
        path: "/EnrollAccount",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.LoginRead {
  height: 100vh;

  padding: 0 15px;
  // background-color: antiquewhite;
  .title {
    // background-color: aliceblue;
    display: flex;
    padding: 5px 0;
    align-items: center;
    .close {
      font-size: 25px;
      // background-color: aqua;
      width: 40vw;
    }
    .title-login {
      width: 50vw;
      font-size: 25px;
      // background-color: gold;
    }
  }
  .login {
    // background-color: aliceblue;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    padding-top: 60rem;

    input {
      width: 70vw;

      margin-top: 15rem;
      padding: 10rem 20rem;

      border-radius: 50rem;
      border: 1px solid #ccc;

      &::placeholder {
        color: #ccc;
      }
    }
    .login_btn {
      width: 70vw;
      background-color: #ff00006b;
      color: white;

      margin-top: 15rem;
      padding: 15px;

      text-align: center;
      border-radius: 50rem;

      &.active {
        background-color: red;
      }
    }
    .enrollforget {
      width: 70vw;
      margin-top: 15rem;
      // display: flex;
      // justify-content: space-between;
      text-align: center;
      // .forget {
      //   color: #646161;
      // }
      .enroll {
        color: red;
      }
    }
  }
}
</style>
