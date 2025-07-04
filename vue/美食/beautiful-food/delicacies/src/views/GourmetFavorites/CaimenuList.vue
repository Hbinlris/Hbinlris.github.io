<template>
  <div class="caimenu-list">
    <div class="info" v-if="datalist.length != 0">
      <van-swipe-cell v-for="item in datalist" :key="item.cook_id">
        <van-cell :border="false" />
        <!-- <p>{{ item.cook_id }}</p> -->
        <!-- 内容 -->
        <!-- <p>{{ item }}</p> -->
        <div class="left" @click="gotoCulinaryDetails(item.cook_id)">
          <van-image width="140rem" height="90rem" :src="item.photo_path" fit="cover" radius="10rem" />
        </div>

        <div class="right">
          <div class="up">
            <h4>{{ item.title }}</h4>

            <span>{{ item.views_count_text }}人看过</span>
          </div>
          <div class="user">
            <van-image width="5vw" style="border-radius: 50%; overflow: hidden" :src="item.user.user_photo" alt="" />
            <span class="nickname">{{ item.user.nickname }}</span>
          </div>
        </div>
        <!-- 内容end -->
        <template #right>
          <van-button square type="danger" text="删除" @click="deleteItem(item.cook_id)" />
        </template>
      </van-swipe-cell>
    </div>

    <div class="no-data" v-else>
      <img src="/caipubg.png" />
      <p>您还没有收藏的菜谱</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.van-tabs__line {
  background: #ff0000;
}

.caimenu-list {
  width: 375rem;
  //   height: 150rem;
  justify-content: space-between;

  //   align-items: center;
  .no-data {
    text-align: center;
    color: #adadad;
  }

  overflow: hidden;

  .info {
    margin: 10rem;

    // display: flex;
    // justify-content: space-between;
    .left {
      border-radius: 10rem;
      width: 150rem;
      overflow: hidden;
      float: left;
    }

    overflow: hidden;

    .right {
      padding: 5rem;
      width: 190rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // align-items: center;
      float: left;

      .up {
        h4 {
          margin: 0rem;
          font-weight: normal;
          font-size: 14rem;
        }

        span {
          font-size: 10rem;
          padding: 1rem;
          // text-align: center;
        }
      }

      .user {
        height: 35rem;
        display: flex;
        // justify-content: center;
        align-items: center;
        // margin-top: 10rem;
        position: relative;
        top: 18%;

        span {
          line-height: 100%;
          padding: 1rem;
          font-size: 12rem;
          color: #adadad;
        }
      }
    }
  }
}
</style>

<script setup>
import { ref } from "vue";
import { RecipeDetail } from "@/api/axios";
import { useRouter } from "vue-router";

// 确保 datalist 是一个数组
const datalist = ref([]);

const recipeid = ref();
// 从 localStorage 获取已收藏的菜谱 ID
if (JSON.parse(localStorage.getItem("isCollected"))) {
  recipeid.value = JSON.parse(localStorage.getItem("isCollected"));
}

// 如果 recipeid 存在，遍历并请求每个菜谱的详情
if (recipeid.value) {
  console.log("recipeid存在", recipeid.value);
  recipeid.value.forEach(async (id) => {
    try {
      // 调用 API 获取菜谱详情
      const res = await RecipeDetail(id);
      // 将结果添加到 datalist 数组中
      datalist.value.push(res.data.result.recipe);
    } catch (error) {
      // console.error("请求失败：", error);
    }
  });
  console.log("datalist", datalist.value);
} else {
  console.log("参数错误", recipeid.value);
  console.log(JSON.parse(localStorage.getItem("isCollected")));
}
// 删除
const isCollected = ref(JSON.parse(localStorage.getItem("isCollected")));
const deleteItem = (id) => {
  console.log("删除", id);
  if (isCollected.value.some((collected) => collected === id)) {
    // 删除
    isCollected.value = isCollected.value.filter(
      (collectedId) => collectedId !== id
    );
  }
  localStorage.setItem("isCollected", JSON.stringify(isCollected.value));
  // 刷新页面
  window.location.reload();
};
// 跳转商品详情
const router = useRouter();
const gotoCulinaryDetails = (id) => {
  console.log("id", id);
  router.push({
    path: "/CulinaryDetails",
    query: {
      id: id,
    },
  });
};
</script>
