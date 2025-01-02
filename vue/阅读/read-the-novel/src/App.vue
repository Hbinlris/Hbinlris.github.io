<template>
  <div id="app">
    <nav>
      <van-tabbar route v-if="$route.meta.keepAlive">
        <van-tabbar-item replace to="/" class="iconfont icon-shuben"
          >书城</van-tabbar-item
        >
        <van-tabbar-item replace to="/ClassLfy" class="iconfont icon-fenlei"
          >分类</van-tabbar-item
        >
        <van-tabbar-item replace to="/BookShelf" class="iconfont icon-shujia"
          >书架</van-tabbar-item
        >
        <van-tabbar-item replace to="/ItsMine" class="iconfont icon-wode"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>

import { Tabbar, TabbarItem } from "vant";

export default {
  components: {
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
  },
  data() {
    return {

    };
  },
  created() {

  },

  methods: {

  },
  mounted() {},
};
</script>


<style lang="less" scoped>
.app {
  .icon-shujia:before {
    font-size: 22px;
  }
  .icon-shuben:before {
    font-size: 22px;
  }
  .icon-fenlei:before {
    font-size: 22px;
  }
  .icon-wode:before {
    font-size: 22px;
  }
}
</style>

