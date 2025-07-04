<template>
  <div class="enroll">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="$router.back()" />
      </div>
      <!-- <div class="title">注册</div> -->
    </header>

    <div class="img">
      <van-image width="176rem" height="100rem" src="/public/小红书.png" />
    </div>

    <div class="inputText">
      <div class="account">
        <div class="name">账号</div>
        <input type="text" placeholder="请输入账号" minlength="6" maxlength="11" v-model="username">
      </div>
      <div class="password">
        <div class="name">密码</div>
        <div class="password-input">
          <input :type="isPasswordVisible ? 'text' : 'password'" placeholder="请输入密码" minlength="6" maxlength="15"
            v-model="password">
          <van-icon name="eye" class="eye-icon" @click="togglePasswordVisibility" />
        </div>
      </div>
      <div class="confirm">
        <div class="name">确认密码</div>
        <div class="password-input">
          <input :type="isConfirmPasswordVisible ? 'text' : 'password'" placeholder="再次确认密码" minlength="6"
            maxlength="15" v-model="confirmPassword">
          <van-icon name="eye" class="eye-icon" @click="toggleConfirmPasswordVisibility" />
        </div>
      </div>

      <div class="register" @click="zhuce">注册</div>
    </div>
  </div>
</template>

<script setup>
import { showSuccessToast, showFailToast } from 'vant';
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const isPasswordVisible = ref(false);  // 控制密码可见性的状态
const isConfirmPasswordVisible = ref(false);  // 控制确认密码可见性的状态

// 切换密码可见性
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// 切换确认密码可见性
const toggleConfirmPasswordVisibility = () => {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
};

// 注册方法
const zhuce = () => {
  if (username.value === '') {
    showFailToast('注册账号不能为空');
  }
  else if (username.value.length < 6 || username.value.length > 10) {
    showFailToast('账号长度必须在6-10位之间');
  } else if (password.value === '') {
    showFailToast('注册密码不能为空');
  } else if (password.value !== confirmPassword.value) {
    showFailToast('两次密码输入不一致');
  } else if (password.value.length < 8 || password.value.length > 15) {
    showFailToast('密码长度必须在8-15位之间');
  } else if (!/^[a-zA-Z0-9]{6,10}$/.test(username.value)) {
    showFailToast('账号必须是英文或数字，且长度在6到10之间');
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/.test(password.value)) {
    showFailToast('密码必须是英文和数字的组合，且长度在8到15之间');
  } else {
    const data = {
      username: username.value,
      password: password.value
    };

    axios.post('http://localhost:8080/api/register', data)
      .then(response => {
        if (response.data.success) {
          showSuccessToast('注册成功');
          router.push('/DengLu');
        } else {
          if (response.data.message === '该用户名已存在') {
            showFailToast('该用户名已存在');
          } else {
            showSuccessToast('注册成功');
            router.push('/DengLu');
          }
        }
      })
      .catch(error => {
        showFailToast('注册请求失败');
        console.error('注册请求失败:', error);
      });
  }
};
</script>

<style lang="less" scoped>
.enroll {
  // background-color: #f8f8f8;
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

    input {
      border: 0;
      // background-color: #f8f8f8;
      margin: 0 15rem;
      width: 140rem;

    }

    .account {
      padding: 10rem 0;
      border-bottom: 1rem solid lightgrey;
      display: flex;

      .name {
        width: 70rem;
        text-align: center;
      }
    }

    .password {
      padding: 10rem 0;
      border-bottom: 1rem solid lightgrey;
      display: flex;

      .name {
        width: 70rem;
        text-align: center;
      }

      .password-input {
        display: flex;
        align-items: center;

        .eye-icon {
          margin-left: 10rem;
          cursor: pointer;
        }
      }
    }

    .confirm {
      padding: 10rem 0;
      border-bottom: 1rem solid lightgrey;
      display: flex;

      .name {
        width: 70rem;
        text-align: center;
      }

      .password-input {
        display: flex;
        align-items: center;

        .eye-icon {
          margin-left: 10rem;
          cursor: pointer;
        }
      }
    }

    .register {
      width: 255rem;
      background-color: red;

      margin-top: 60rem;
      padding: 10rem 0;
      text-align: center;
      border-radius: 50rem;
    }
  }
}
</style>
