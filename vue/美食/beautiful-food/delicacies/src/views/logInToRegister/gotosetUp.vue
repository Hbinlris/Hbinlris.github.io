<!-- gotosetUp 设置 -->

<template>
  <div class="gotosetUp">
    <div class="top">
      <van-icon name="arrow-left" @click="router.back()" />
      <div class="title">设置</div>
    </div>
    <!--个人信息-->
    <div class="personalInformation" v-if="userStore.isLoggedIn">
      <van-image width="50rem" height="50rem" src="/洛天依.jpg" />
      <div class="name">{{ userStore.username }}</div>
    </div>

    <div class="bottom" v-if="userStore.isLoggedIn">
      <div class="signOut" @click="gotosetUpsignOut">退出登录</div>
    </div>

    <div class="text" v-else>请登录后查看</div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/user";

import { showToast } from "vant";
import { ref, watch, onMounted } from "vue";
const userStore = useUserStore();

const router = useRouter();

const gotosetUpsignOut = () => {
  console.log("设置注销前:", userStore.isLoggedIn); // 调试日志
  // 清除用户信息
  userStore.signOut();
  console.log("设置注销后:", userStore.isLoggedIn); // 调试日志
  router.push({ path: "/ItsMine" });
  showToast("退出成功");
};

// 监听 userStore.isLoggedIn 的变化
watch(
  () => userStore.isLoggedIn,
  (newValue) => {
    console.log("isLoggedIn 已更改为:", newValue);
  }
);

onMounted(() => {
  console.log("组件挂载时 isLoggedIn 的值:", userStore.isLoggedIn);
});
</script>

<style lang="less" scoped>
.gotosetUp {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .top {
    padding: 15rem 15rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dcdcdc;

    .van-icon {
      font-size: 20rem;
      width: 40rem;
    }

    .title {
      font-size: 20rem;
      font-weight: normal;
    }
  }

  .personalInformation {
    padding: 15rem 15rem;
    display: flex;
    background-color: #fafafa;
    align-items: center;

    .van-image {
      margin-right: 15rem;
    }

    .name {
      font-weight: bold;
    }
  }

  .bottom {
    padding: 15rem 15rem;

    // background-color: aquamarine;
    .signOut {
      color: white;
      background-color: red;
      text-align: center;
      padding: 10rem 30rem;
      border-radius: 50rem;
    }
  }

  .text {
    text-align: center;
  }
}
</style>
