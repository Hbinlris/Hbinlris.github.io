<template>

  <van-tabbar v-model="active" route v-if="!isContentXqPage, $route.meta.shownav" style="bottom: -1px !important; z-index: 99;">
    <!-- 首页 Tab -->
    <van-tabbar-item replace to="/">
      <img :src="active === 0 ? homeActiveImage : homeImage" alt="首页" />
    </van-tabbar-item>

    <!-- 发布 Tab replace to="/publishPage"-->
    <van-tabbar-item @click="gotopublishPage">
      <img width="43rem" :src="active === 1 ? plus : plus" alt="发布">
    </van-tabbar-item>

    <!-- 消息 Tab-->
    <!-- <van-tabbar-item replace to="/Message">
      <img :src="active === 2 ? meActivessage : message" alt="消息" />
    </van-tabbar-item> -->

    <!-- 个人中心 Tab -->
    <van-tabbar-item replace to="/PersonalCenter">
      <img :src="active === 3 ? myActiveImage : myImage" alt="个人中心" />
    </van-tabbar-item>
  </van-tabbar>
  <router-view />

</template>



<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { showConfirmDialog } from 'vant';
import router from './router';

const userToken = localStorage.getItem('userToken');

const gotopublishPage = () => {
  if (!userToken) {
    showConfirmDialog({
      title: '提示',
      message:
        '当前未登录，是否前去登录',
    })
      .then(() => {
        // on confirm
        router.push('/DengLu');
      })
      .catch(() => {
        // on cancel
      });
  } else {
     router.push('/publishPage');
  }
}

// 强制刷新





// 默认激活第一个 Tab
const active = ref(0);

// 图片路径
const homeImage = new URL('@/images/home.png', import.meta.url).href;
const homeActiveImage = new URL('@/images/@home.png', import.meta.url).href;
const myImage = new URL('@/images/my.png', import.meta.url).href;
const myActiveImage = new URL('@/images/@my.png', import.meta.url).href;
// const message = new URL('@/images/message.png', import.meta.url).href;
// const meActivessage = new URL('@/images/@message.png', import.meta.url).href;
const plus = new URL('@/images/plus.png', import.meta.url).href;

// 路由对象
const route = useRoute();

const isContentXqPage = computed(() => route.name === 'ContentXq' || route.name === 'Search');


// 在组件加载时根据路由设置激活的 Tab
onMounted(() => {
  const storedActive = sessionStorage.getItem('activeTab');
  if (storedActive !== null) {
    active.value = parseInt(storedActive, 10);
  } else {
    const tabRoutes = ['/', '/PersonalCenter', '/Message', '/publishPage'];
    active.value = tabRoutes.indexOf(route.path);
  }
});


// 监听 active 变化并保存到本地存储
watch(active, (newActive) => {
  sessionStorage.setItem('activeTab', newActive.toString());
});
</script>




<style lang="less" scoped>
:deep(.van-tabbar-item__text) {
  font-weight: bold;
}

:deep(.van-tabbar-item) {
  color: gray;
}

:deep(.van-tabbar-item--active) {
  color: black;
  font-size: 18rem;
}
</style>
