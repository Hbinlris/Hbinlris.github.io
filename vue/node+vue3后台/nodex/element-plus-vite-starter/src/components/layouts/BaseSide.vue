<script lang="ts" setup>
import {
  Menu as IconMenu,
  Notebook,
  Monitor,
  User,
  Finished,
  Reading,
  ChatLineSquare,
  Setting,
} from "@element-plus/icons-vue";

import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

// 假设你已经在登录时设置了 localStorage 中的 isSuperUser
const isSuperUser = ref(localStorage.getItem("isSuperUser") === "true");

const router = useRouter();
const route = useRoute(); // 获取当前路由对象

// 计算属性，根据 isSuperUser 的值决定是否禁用管理员菜单项
const isDisabled = computed(() => {
  return !isSuperUser.value;
});

// 动态设置 default-active 为当前路由路径
const defaultActive = ref(route.path);

function handleOpen(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log(key, keyPath);
}

function handleClose(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log(key, keyPath);
}
</script>

<template>
  <el-menu
    router
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="/">
      <el-icon>
        <Monitor />
      </el-icon>
      <template #title> 数据首页 </template>
    </el-menu-item>

    <el-menu-item index="/nav/0">
      <el-icon>
        <Monitor />
      </el-icon>
      标签管理
    </el-menu-item>

    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Notebook />
        </el-icon>
        <span>笔记管理</span>
      </template>
      <el-menu-item index="/nav/1/item-3">
        <el-icon>
          <Finished />
        </el-icon>
        审核管理
      </el-menu-item>
      <el-menu-item index="/nav/1/item-1">
        <el-icon>
          <Reading />
        </el-icon>
        内容管理
      </el-menu-item>
      <el-menu-item index="/nav/1/item-2">
        <el-icon>
          <ChatLineSquare />
        </el-icon>
        评论管理
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="1-5">
      <template #title>
        <el-icon>
          <User />
        </el-icon>
        <span>用户管理</span>
      </template>
      <el-menu-item index="/nav/3/item-1">
        <el-icon>
          <User />
        </el-icon>
        普通用户
      </el-menu-item>
      <el-menu-item index="/nav/3/item-2" :disabled="isDisabled">
        <el-icon>
          <User />
        </el-icon>
        管理员
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.is-active {
  color: #ff2442;
}
</style>