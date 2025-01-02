<!-- gastronomyClassification 美食分类 (寄)-->

<template>
  <div class="gastronomyClassification">
    <div class="top">
      <van-icon name="arrow-left" class="return" @click="$router.back()" />
      <!-- 标题 -->
      <div class="title">菜谱分类</div>

      <van-icon name="search" style="font-size: 25rem;" @click="$router.push('/JumpSearch')" />
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();



</script>

<style lang="less" scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 100;

  background-color: bisque;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15rem ;

  .return {
    font-size: 30rem;
  }

  .title {
    font-weight: bold;
    font-size: 20rem;
  }
}
</style>
