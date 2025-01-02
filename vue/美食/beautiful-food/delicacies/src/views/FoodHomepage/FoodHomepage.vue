<!-- 首页 FoodHomepage -->

<template>
  <div class="FoodHomepage">
    <!-- FoodHomepage -->

    <div class="Top">
      <!-- 顶部栏 -->
      <div class="topBar">
        <!-- 侧边栏 -->
        <van-icon name="wap-nav" class="wap-nav" @click="showPopup" />
        <!-- 左侧弹出 -->
        <van-popup v-model:show="showLeft" position="left"
          :style="{ width: '60%', height: '100%', padding: '60rem 30rem' }">
          <div class="purchaseList">
            <van-icon name="bag-o" />
            <div class="name" @click="gotoshop">采购清单</div>
          </div>
          <div class="purchaseList">
            <van-icon name="clock-o" />
            <div class="name" @click="gotosetUp">最近游览</div>
          </div>
          <div class="purchaseList">
            <van-icon name="shop-o" />
            <div class="name" @click="gotosetUp">商城</div>
          </div>

          <div class="purchaseList">
            <van-icon name="cash-o" />
            <div class="name" @click="gotosetUp">钱包</div>
          </div>
          <div class="purchaseList">
            <van-icon name="records-o" />
            <div class="name" @click="gotosetUp">草稿箱</div>
          </div>
          <div class="purchaseList">
            <van-icon name="setting-o" />
            <div class="name" @click="gotosetUp">设置</div>
          </div>
        </van-popup>

        <!-- logInToRegister-->

        <!-- 搜索 -->
        <div class="topBar-centre">
          <span class="searchIcon iconfont icon-sousuo"></span>
          <input type="text" @click="search" />
        </div>
        <!-- 菜谱分类 -->
        <!-- <div class="classify">
          <span class="classifyIcon iconfont icon-shujishubenshu" @click="$router.push({ path: '/gastronomyClassification'})"></span>
        </div> -->
        <!-- 消息中心 -->
        <!-- <div class="message">
          <span class="messageIcon iconfont icon-lingdang"></span>
        </div> -->
      </div>
      <!-- 导航栏 -->
      <div class="navigationBar">
        <!-- concern 关注,recommend 推荐,note 笔记,activity 活动 -->
        <van-tabs v-model:active="active" swipeable>
          <van-tab v-for="(item, index) in titles" :to="item.to" :title="item.title" :key="index">
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";

const route = useRoute();
const router = useRouter(); // 引入 router

const active = ref(1);
const titles = ref([
  { title: "关注", to: "/HomeConcern" },
  { title: "推荐", to: "/HomeRecommend" },
  { title: "笔记", to: "/HomeNode" },
  { title: "活动", to: "/ActingView" },
]);

// 弹出层
const showLeft = ref(false);
// 点击弹出
const showPopup = () => {
  showLeft.value = true;
};
// 跳转购物
const gotoshop = () => {
  router.push("/ShopList");
};
// 跳转设置
const gotosetUp = () => {
  router.push("/gotosetUp");
};

// 初始化 active 值
onMounted(() => {
  updateActiveIndex(route.path);
});

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
  }
}

function search() {
  router.push("/JumpSearch");
}
</script>

<style lang="less" scoped>
.FoodHomepage {
  .Top {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 100;

    .topBar {
      padding-top: 10rem;
      background-color: white;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      justify-content: space-around;

      .wap-nav {
        font-size: 30rem;
      }

      .van-popup {
        .purchaseList {
          display: flex;
          align-items: center;
          padding-bottom: 15rem;

          .van-icon {
            font-size: 20rem;
          }

          .name {
            font-weight: bold;
            margin-left: 10rem;
            font-size: 12rem;
          }
        }
      }

      .topBar-centre {
        // position: relative;
        display: flex;
        align-items: center;

        .searchIcon {
          font-size: 25rem;
          position: relative;
          left: 33rem;
        }

        input {
          padding: 6rem 10rem 6rem 35rem;
          background-color: #cccccc66;
          border: 0 solid #ccc;
          border-radius: 50rem;
          width: 245rem;
        }
      }

      .classify {
        .classifyIcon {
          font-size: 30rem;
        }
      }

      .message {
        .messageIcon {
          font-size: 35rem;
        }
      }
    }

    .navigationBar {
      .van-tabs {
        :deep(.van-tab) {
          font-size: 16rem;

          .van-tab__text {
            overflow: none;
          }
        }
      }

      :deep(.van-tabs__line) {
        background-color: red;
      }
    }
  }
}
</style>
