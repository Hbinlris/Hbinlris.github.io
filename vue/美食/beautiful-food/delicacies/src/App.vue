<!--首页 FoodHomepage  收藏夹 GourmetFavorites  我的 ItsMine-->
<template>
  <div id="app">
    <van-tabbar route v-if="route.meta.isshow">
      <van-tabbar-item replace to="/">首页</van-tabbar-item>
      <van-tabbar-item replace to="/GourmetFavorites">收藏夹</van-tabbar-item>
      <van-tabbar-item replace to="/ItsMine">我的</van-tabbar-item>
    </van-tabbar>

    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>


<style lang="less" scoped>
#app {
  .van-tabbar {
    height: 45rem;

    .van-tabbar-item {
      font-size: 16rem;

      &.van-tabbar-item--active {
        color: red;
      }
    }
  }
}
</style>
