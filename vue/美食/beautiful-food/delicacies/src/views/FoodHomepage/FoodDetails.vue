<template>
  <div class="fooddetails">
    <!-- 顶部导航栏 -->
    <nav>
      <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
    </nav>
    <div class="data" v-if="data">
      <!-- <p id="parentElement" v-html="data" ref="parentElement"></p> -->
      <!-- <p id="parentElement" ref="parentElement2">hello</p> -->
      <iframe :src="`https://apis.netstart.cn/douguo/recipe/material/${route.query.title}`" frameborder="0"></iframe>
    </div>

    <div class="else" v-else>
      <van-skeleton>
        <template #template>
          <div :style="{ display: 'flex', width: '100%' }">
            <div :style="{ flex: 1, marginLeft: '16px' }">
              <van-skeleton-paragraph row-width="60%" />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
            </div>
          </div>
        </template>
      </van-skeleton>
    </div>
  </div>
</template>

<style lang="less">
.fooddetails {
  // &::-webkit-scrollbar {
  //   width: 0;
  // }
  position: relative;

  .data {
    margin-top: 75rem;
    width: 100vw;
    overflow: hidden;

    iframe {
      width: 104%;
      height: 100vh;
      overflow: auto;
    }
  }
}

nav {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 375rem;
}
</style>
<script setup>
import { onMounted } from "vue";
import { foodDetails } from "@/api/index";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const title = route.query.title;
const data = ref();
const parentElement = ref();
const parentElement2 = ref();

if (title) {
  console.log("title", title);
  foodDetails(title).then((res) => {
    console.log(res.data);
    data.value = res.data;
  });
}

// 返回
// fanhui
const onClickLeft = () => history.back();
// const parentElement = ref();

onMounted(() => {
  let parentElement = document.getElementById("parentElement");
  console.log(parentElement);
});
</script>
