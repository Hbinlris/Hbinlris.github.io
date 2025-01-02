<!-- Enroll 注册 -->

<template>
  <div class="Enroll">

    <div class="enroll-header">
      <van-icon name="cross" @click="$router.back()" />
      <div class="enroll-title">修改密码</div>
    </div>

    <div class="enroll-center">

      <div class="input-enroll">
        <input type="text" placeholder="请输入用户名" v-model="username" />
        <input type="password" placeholder="请输入密码" v-model="password" />
        <input type="password" placeholder="请输入密码" v-model="twopassword" />
      </div>

      <div class="btn">
        <div class="enroll-btn" @click="resetPassword">修改</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant';

const router = useRouter()

import { ref } from 'vue'

const username = ref('')
const password = ref('')
const twopassword = ref('')

const resetPassword = () => {
  // 获取存储的用户列表
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  // 检查用户名是否存在
  const userIndex = storedUsers.findIndex(user => user.username === username.value);

  if (userIndex === -1) {
    showToast('用户名不存在');
    return;
  }

  // 判断密码是否为空
  if (!username.value || !password.value || !twopassword.value) {
    showToast('请填完内容');
    return;
  }

  // 判断两次输入的密码
  if (password.value !== twopassword.value) {
    showToast('两次输入的密码不一致');
    return;
  }

  // 更新用户密码
  storedUsers[userIndex].password = password.value;
  localStorage.setItem('users', JSON.stringify(storedUsers));

  showToast('修改成功，正在跳转...');
  setTimeout(() => {
    router.push({ path: '/Login' });
  }, 1000);
}
</script>



<style lang="less" scoped>
.Enroll {
  padding: 15rem;

  .enroll-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .van-icon {
      color: #000;
      font-size: 30rem;
      // width: 22vw;
    }

    .enroll-title {
      text-align: center;
      font-weight: bold;
      font-size: 25rem;
      // width: 50vw;

    }
  }

  .enroll-center {

    padding: 180rem 0;

    .input-enroll {

      padding: 15rem;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      input {
        width: 80vw;
        height: 25rem;
        margin: 5rem 0;
        padding: 5rem 15rem;

        border-radius: 50rem;
        border: 1px solid #000;
      }

    }

    .btn {

      .enroll-btn {
        color: white;
        background-color: red;
        text-align: center;
        padding: 10rem 30rem;
        border-radius: 50rem;
        margin: 5rem 0;
      }
    }
  }

}
</style>
