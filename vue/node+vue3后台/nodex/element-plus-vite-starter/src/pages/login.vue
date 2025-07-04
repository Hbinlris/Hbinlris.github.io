<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <img class="logo" src="../assets/logo.png" />
      <h2 class="title">红薯后台管理系统</h2>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="用户名"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          type="info"
          style="width: 100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登录</span>
          <span v-else>登录中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <div class="login-footer">
      <span>Copyright © 2024 Your Company Name All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Calendar, Search } from '@element-plus/icons-vue'
export default {
  setup() {
    const router = useRouter();
    const loginForm = ref({
      username: "",
      password: "",
    });
    const loginRules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };
    const loading = ref(false);

    const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await axios.post("http://localhost:8080/adminlogin", {
      username: loginForm.value.username,
      password: loginForm.value.password,
    });

    if (response.data.success) {
      ElMessage.success("登录成功");
      
      // 设置第一个本地存储项表示用户已登录
      localStorage.setItem("isLoggedIn", "true");
      
      // 设置第二个本地存储项，其值为用户的 sup 字段的值
      localStorage.setItem("isSuperUser", response.data.sup.toString());

      // 假设 nav/2 是登录后的跳转路由
      router.push("/");
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error("登录失败，请重试");
    console.error("登录失败", error);
  } finally {
    loading.value = false;
  }
};

    return {
      loginForm,
      loginRules,
      loading,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/login-background.jpg");
  background-size: cover;
  flex-direction: column;
}

.logo {
  margin-bottom: 10px;
  width: 100px;
  height: 50px;
}

.title {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #707070;
  font-weight: normal;
  font-size: 16px;
}

.login-form {
  background: #ffffff;
  border-radius: 6px;
  padding: 25px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #878787;
  font-size: 12px;
  background: #dee4fb72;
  padding: 10px 0;
}
</style>
