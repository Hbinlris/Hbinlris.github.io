<template>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
    <el-menu-item index="/">
      <div class="flex items-center justify-center gap-2">
        <div class="logo"><img src="../../assets/logo.png" alt="" /></div>
        <span>红薯后台管理系统</span>
      </div>
    </el-menu-item>

    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="w-full cursor-pointer border-none bg-transparent"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>

    <el-menu-item h="full">
      <el-popover placement="bottom" :width="200" trigger="click">
        <template #reference>
          <div i-ri-github-fill />
        </template>
        <div>
          <el-button @click="logout">退出登录</el-button>
        </div>
      </el-popover>
    </el-menu-item>
  </el-menu>
  <div style="height: 3rem; width: 100%;"></div>
</template>


<script lang="ts" setup>
import { ro } from "element-plus/es/locale/index.mjs";
import { repository } from "~/../package.json";
import { useRouter } from 'vue-router';
const router = useRouter();
import { toggleDark } from "~/composables";

const logout = () => {
  console.log("退出登录");
  localStorage.removeItem("isLoggedIn");
  router.push("/login");
};
</script>


<style lang="scss">
.el-menu-demo {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
    margin-right: auto;
  }
}

.logo {
  display: inline-block;
  line-height: 16px;
  img {
    width: 65px;
    height: auto;
  }
}
</style>
