<!--EnrollAccount  注册账号-->

<template>
  <div class="EnrollAccount">
    <div class="title">
      <van-icon name="cross" class="close" @click="$router.go(-1)" />
      <div class="title-enroll">注册</div>
    </div>
    <div class="enroll">
      <input type="number" placeholder="账号" v-model="username" />
      <input type="password" placeholder="密码" v-model="password" />
      <input type="password" placeholder="确认密码" v-model="confirmpassword" />

      <div class="enroll_btn" @click="enroll" :class="{ active: isinput }">
        注册
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      username: "", //账号
      password: "", //密码
      confirmpassword: "", //确认密码
    };
  },

  computed: {
    isinput() {
      return this.username && this.password && this.confirmpassword;
    },
  },

  methods: {
    // 注册验证
    registrationVerification() {
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
      if (this.password !== this.confirmpassword) {
        Toast.fail("两次输入的密码不一致");
        return false;
      }

      return true;
    },

    // 注册
    enroll() {
      if (!this.registrationVerification()) {
        return;
      }

      const User = {
        username: this.username,
        password: this.password,
      };

      // 从 localStorage 中获取现有用户数据
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // 检查用户名是否已存在
      if (users.some((user) => user.username === User.username)) {
        Toast.fail("该账号已存在");
        return;
      }

      // 将新用户添加到用户列表中
      users.push(User);

      localStorage.setItem("users", JSON.stringify(users));

      // 成功提示
      Toast.success("注册成功！");

      // 清空输入框
      this.username = "";
      this.password = "";
      this.confirmpassword = "";

      this.$router.push({
        path: "/LoginRead",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.EnrollAccount {
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
    .title-enroll {
      width: 50vw;
      font-size: 25px;
      // background-color: gold;
    }
  }
  .enroll {
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
    .enroll_btn {
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
  }
}
</style>
