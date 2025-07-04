<!-- 我的 ItsMine -->

<template>
  <div class="ItsMine">
    <!-- 顶部栏 -->
    <div class="topBar">
      <!-- 侧边栏 -->
      <van-icon name="wap-nav" class="wap-nav" @click="showPopup" />
      <!-- 左侧弹出 -->
      <van-popup v-model:show="showLeft" position="left"
        :style="{ width: '60%', height: '100%', padding: '60rem 30rem' }">
        <div class="purchaseList">
          <van-icon name="bag-o" />
          <div class="name" @click="gotoShop">采购清单</div>
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
    </div>

    <!-- 个人信息 -->
    <div class="personalInformation" v-if="userStore.isLoggedIn">
      <div class="left">
        <p>{{ userStore.username }}</p>
        <p class="age">
          <span>豆龄 0.1岁 </span>
          <span> IP归属地 广东省</span>
        </p>
        <p class="age">吃货不是在吃就是在去吃的路上，没时间签名</p>
      </div>
      <div class="right">
        <van-image width="60rem" height="60rem" src="/洛天依.jpg" />
      </div>
    </div>

    <div class="concern" v-if="userStore.isLoggedIn">
      <div class="mymsg">
        <!-- 勋章-->
        <div class="focusOnTheSection">
          <div class="concern-number">0</div>
          <div class="concern-text">勋章</div>
        </div>
        <!-- 关注 -->
        <div class="focusOnTheSection">
          <div class="concern-number">{{ leg ? leg : 0 }}</div>
          <div class="concern-text" @click="gotoguanzhu">关注</div>
        </div>
        <!-- 粉丝 -->
        <div class="focusOnTheSection">
          <div class="concern-number">0</div>
          <div class="concern-text">粉丝</div>
        </div>
      </div>
      <div class="bigcard">
        <div class="cardnav">
          <van-tabs v-model:active="active">
            <van-tab title="菜谱">
              <div class="card">
                <p>您还没有菜谱</p>
              </div>
            </van-tab>
            <van-tab title="笔记">
              <div class="card">您还没有笔记</div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>

    <div class="clickSignIn" v-else>
      <van-image width="100rem" height="100rem" src="/未登录.jpg" />

      <!-- 新用户名 -->
      <div class="newUsername">
        <van-image width="20" height="20" src="/礼炮.webp" />
        {{ newuserName ? "欢迎回来" + newuserName : "欢迎登陆" }}
      </div>

      <div class="signIn" @click="gotologin">点击登录</div>

      <div class="other">
        <div class="title" style="font-size: 13rem; color: #999">
          其他登录方式
        </div>
      </div>
      <div class="icon">
        <div class="box1">
          <div class="iamge" style="background-color: #24ce24">
            <van-icon name="wechat" />
          </div>
          <div class="iamge" style="background-color: #00aaff">
            <van-icon name="qq" />
          </div>
          <div class="iamge" style="background-color: #fb5f5f">
            <van-icon name="weibo" />
          </div>
          <div class="iamge" style="background-color: #00aaff">
            <div class="iconfont icon-shouji"></div>
          </div>
        </div>
      </div>

      <!-- 同意条款 -->
      <div class="article" style="font-size: 11rem">
        <van-checkbox v-model="checked" checked-color="#ee0a24" icon-size="14px">登录即同意
          <span style="color: rgb(3 105 108)">《中国移动认证服务条款》&nbsp;《用户协议》&nbsp;《隐私条款》</span></van-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { showToast } from "vant";
const router = useRouter();
const userStore = useUserStore();
const active = ref(0);
// 弹出层
const showLeft = ref(false);

//复选框
const checked = ref(false);

// 点击弹出
const showPopup = () => {
  showLeft.value = true;
};

// 跳转设置
const gotosetUp = () => {
  router.push("/gotosetUp");
};

// 跳转采购
const gotoShop = () => {
  router.push("/ShopList");
};

// 跳转关注
const gotoguanzhu = () => {
  // router.push("/GuanZhu");
  router.push("/guanzhuttwo");
};
// 跳转登录
const gotologin = () => {
  if (!checked.value) {
    showToast("请先同意条款");
    return;
  }
  router.push("/Login");
};

const leg = ref();

// 获取本地存储
if (JSON.parse(localStorage.getItem("guanzhulist"))) {
  leg.value = JSON.parse(localStorage.getItem("guanzhulist")).length;
}

const newuserName = ref();
newuserName.value = localStorage.getItem("newuserName");
</script>

<style lang="less" scoped>
.ItsMine {
  padding: 15rem;

  .topBar {
    // background-color: white;

    .wap-nav {
      font-size: 20rem;
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
  }

  :deep(.van-tabs__line) {
    background-color: red;
  }

  .personalInformation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10rem;

    .left {
      font-size: 20rem;
      font-weight: bold;

      p.age {
        margin-top: 3rem;
        font-weight: normal;
        font-size: 12rem;
        color: #4b4b4b;
      }
    }
  }

  .concern {
    .mymsg {
      display: flex;
      justify-content: space-around;
      text-align: center;
      width: 160rem;
      font-size: 12rem;
    }

    .bigcard {
      margin-top: 20rem;

      .cardnav {}

      .card {
        background-color: #f6f6f6;
        // width: 200rem;
        height: 190rem;
        width: 300rem;
        margin: 50rem auto;
        border-radius: 10rem;
        font-size: 12rem;
        color: #999999;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .focusOnTheSection {
      width: 45rem;
      // display: flex;
      align-items: center;
      justify-content: center;
      // flex-direction: column;
    }
  }

  .clickSignIn {
    margin-top: 120rem;

    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;

    .van-image {
      :deep(.van-image__img) {
        border-radius: 70rem;
      }
    }

    .newUsername {
      font-size: 20rem;
      // font-weight: bold;
      margin-top: 20rem;
      display: flex;
      align-items: center;
    }

    // 登录按钮
    .signIn {
      width: 100%;
      background-color: red;
      color: white;
      text-align: center;
      padding: 15rem 0;
      border-radius: 50rem;
      margin-top: 40rem;
    }

    // 其他登录方式
    .other {
      width: 100%;
      margin-top: 35rem;
      background-color: white;
    }

    // 图标
    .icon {
      width: 100%;
      // background-color: aqua;
      padding: 20rem 0rem 10rem 0rem;

      .box1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // background-color: antiquewhite;

        width: 60%;

        .iamge {
          padding: 8rem;
          // border: 1px solid #999;
          border-radius: 50rem;
          color: white;
        }
      }
    }

    // 同意
  }
}
</style>
