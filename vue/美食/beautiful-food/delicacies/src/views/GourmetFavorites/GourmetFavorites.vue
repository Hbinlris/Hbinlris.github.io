<!-- 收藏夹 GourmetFavorites -->

<template>
  <div class="GourmetFavorites">
    <nav>
      <van-tabs v-model:active="active">
        <!-- <van-tab title="分组" to="/GourmetFavorites/GroupView"></van-tab> -->
        <van-tab title="菜谱" to="/GourmetFavorites/CaiMenu"></van-tab>
        <van-tab title="笔记" to="/GourmetFavorites/NoteView"> </van-tab>
        <!-- <van-tab title="课程" to="/GourmetFavorites/ClassView"></van-tab> -->
      </van-tabs>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { useRoute } from "vue-router";
import { watch } from "vue";
const route = useRoute();
const active = ref(0);
console.log(route.path);

// 初始化 active 值
onMounted(() => {
  updateActiveIndex(route.path);
});
const titles = ref([
  { title: "菜谱", to: "/GourmetFavorites/CaiMenu" },
  { title: "笔记", to: "/GourmetFavorites/NoteView" },
]);
// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    updateActiveIndex(newPath);
  }
);
function updateActiveIndex(path) {
  const index = titles.value.findIndex((item) => item.to === path);
  if (index !== -1) {
    active.value = index;
    console.log(active.value);
  }
}
</script>

<style lang="less" scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 999;
}
:deep(.van-tabs__line){
  background-color: red;
}
</style>
