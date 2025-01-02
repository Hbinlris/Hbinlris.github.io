<template>
  <div class="shop-list">
    <!-- 采购清单 -->
    <van-nav-bar
      title="采购清单"
      left-text="返回"
      right-text="清空"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <van-tabs v-model="active" v-if="userStore.isLoggedIn">
      <van-tab title="按菜谱">
        <div class="c" v-for="item in datalist" :key="item.index">
          <van-swipe-cell>
            <van-cell :border="false" />
            <div class="pic">
              <div class="img">
                <van-image
                  width="330rem"
                  height="120rem"
                  fit="cover"
                  :src="item.photo_path"
                />
              </div>
              <div class="mask">{{ item.title }}</div>
            </div>

            <div class="msg" v-for="item2 in item.major" :key="item2.index">
              <div class="box1">
                <div class="box2">{{ item2.title }}</div>
                <div class="box2">{{ item2.note }}</div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                @click="deleteItem(item.cook_id)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-tab>

      <van-tab title="全部">
        <div class="msg" v-for="item in datalist" :key="item.index">
          <div class="box1" v-for="item2 in item.major" :key="item2.index">
            <div class="box2">{{ item2.title }}</div>
            <div class="box2">{{ item2.note }}</div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <div class="text" v-else>请登录后查看</div>
  </div>
</template>

<style lang="less" scoped>
:deep(.van-tabs__line) {
  background: #ff0000;
}
.shop-list {
  .c {
    .pic {
      position: relative;
      background-color: red;
      width: 330rem;
      height: 120rem;
      border-radius: 10rem;
      margin: 10rem auto;
      display: block;

      .mask {
        color: white;
        position: absolute;
        left: 0;
        top: 0;
        width: 330rem;
        height: 120rem;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .img {
        position: absolute;
        left: 0;
        top: 0;
        width: 330rem;
        height: 120rem;
      }
    }
  }

  .msg {
    .box1 {
      // background-color: antiquewhite;
      overflow: hidden;
      border-bottom: 2px dashed #edeeee;
      display: flex;
      justify-content: space-around;
      padding: 5rem 0;
    }

    .box2 {
      // background-color: aqua;
      text-align: center;
      width: 160rem;
    }
  }

  .text {
    text-align: center;
  }

  // p {
  //   // display: flex;
  //   // justify-content: space-around;
  // }
  :deep(.van-tabs__line){
    background-color: red;
  }
}
</style>





<script setup>
import { ref } from "vue";
import { RecipeDetail } from "@/api/axios";

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const active = ref(0);
const datalist = ref([]);
// 从 localStorage 获取已收藏的菜谱 ID
const shopList = ref();
if (JSON.parse(localStorage.getItem("addList"))) {
  shopList.value = JSON.parse(localStorage.getItem("addList"));
}

// console.log("初始化shopList", shopList.value);

if (shopList.value) {
  console.log("shopList存在", shopList.value);
  shopList.value.forEach(async (id) => {
    try {
      // 调用 API 获取菜谱详情
      const res = await RecipeDetail(id);
      // console.log(res);

      // 将结果添加到 datalist 数组中
      datalist.value.push(res.data.result.recipe);
    } catch (error) {
      console.error("请求失败：", error);
    }
  });
  console.log("datalist", datalist.value);
} else {
  console.log("参数错误", shopList.value);
}

// 删除
const deleteItem = (id) => {
  console.log("删除", id);
  if (shopList.value.some((collected) => collected === id)) {
    // 取消
    shopList.value = shopList.value.filter((collectedId) => collectedId !== id);
  }
  localStorage.setItem("addList", JSON.stringify(shopList.value));
  // 刷新页面
  window.location.reload();
};
// fanhui
const onClickLeft = () => history.back();
// 清空
const onClickRight = () => {
  shopList.value = [];
  localStorage.setItem("addList", JSON.stringify(shopList.value));
  // 刷新页面
  window.location.reload();
};
</script>
