<!-- PersonalCenter  个人中心 -->

<template>
  <div class="PersonalCenter">

    <!-- 个人信息 -->
    <header :style="{ backgroundImage: `url(${backgroundImageUrl})` }">

      <div class="masked">
        <!-- 标题 -->
        <div class="head" :style="headStyle">
          <van-icon name="wap-nav" color="black" style="font-size: 25rem;" />
          <div class="share"></div>
          <div class="share-icon">
            <van-icon name="scan" color="black" style="font-size: 25rem;" />
            <van-icon name="share-o" color="black" style="font-size: 25rem;" />
          </div>
        </div>

        <div class="placeholding"></div>

        <!-- 头像 -->
        <div class="individual">
          <!-- 头像名字 -->
          <div class="imgname">
            <div class="tx" style="margin-right: 10rem;">
              <van-image style="margin-right: 20rem;" width="70rem" height="70rem" :src="imageSrc" />
            </div>
            <div class="name">
              <div class="bigname">{{ mingz }}</div>
              <div class="account">小红书号：{{ username }}</div>
            </div>
          </div>
          <!-- 简介编辑 -->
          <div class="briefIntroduction">
            {{ jianjie }}
          </div>
          <!-- 粉丝编辑 -->
          <div class="edit">
            <div class="fans" v-for="fan in fans" :key="fan.englishname">
              <div class="number">{{ fan.number }}</div>
              <div class="name">{{ fan.name }}</div>
            </div>

            <div class="infosetUp">
              <div class="information" @click="tiaozhuanbianj">编辑资料</div>
              <div class="setUp" @click="$router.push('/setUp')">
                <van-icon name="setting-o" style="font-size: 20rem;" />
              </div>
            </div>
          </div>

          <!-- 订单 购物-->
          <!-- <div class="order">
            <div class="title" v-for="order in orders" :key="order.name">
              <div class="titlename">{{ order.title }}</div>
              <div class="introduce">{{ order.introduce }}</div>
            </div>
          </div> -->
        </div>
      </div>

    </header>

    <main>

      <!-- 导航栏 -->
      <nav>
        <div class="title-name">
          <div class="title" v-for="(title, index) in titles" @click="gotopublish(index)"
            :class="{ active: index === activeIndex }">{{ title.name }}</div>
        </div>
        <van-icon name="search" style="font-size: 25rem;" @click="gotosearch()" />
      </nav>
      <!-- 二级列表 -->
      <div>
        <router-view></router-view>
      </div>
    </main>

  </div>


</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Jianjie from './jianjie.vue';

const username = localStorage.getItem('userToken');
const userData = ref(null);

const router = useRouter();
const backgroundImageUrl = ref('/public/背景图1.jpg');
const mingz = ref("小红薯1234F67A");

// 搜索
const gotosearch = () => {
  router.push({ path: "/search" })
}


const jianjie = ref("点击这里，填写简介");
const defaultAvatar = '/wdl.jpg';
const imageSrc = ref(defaultAvatar);
axios
  .get(`http://localhost:8080/api/clientusers/${username}`)
  .then((response) => {
    userData.value = response.data.usersData;
    console.log('用户数据:', userData.value);
    if (userData.value && userData.value.avatar) {
      imageSrc.value = `http://localhost:8080/${userData.value.avatar}`;
    } else {
      imageSrc.value = "/wdl.jpg";
    }
    if (userData.value && userData.value.grzl.mingcheng) {
      mingz.value = userData.value.grzl.mingcheng;
    } else {
      mingz.value = "小红薯1234F67A";
    }
    if (userData.value && userData.value.grzl.jianjie) {
      jianjie.value = userData.value.grzl.jianjie;
    }else {
      jianjie.value = "点击这里，填写简介";
    }
  })
  .catch((error) => {
    console.log("请求错误");
  });

// 初始背景色
const headStyle = ref({ backgroundColor: 'transparent' });

const handleScroll = () => {
  const scrollPosition = window.scrollY;


  const threshold = 100;

  if (scrollPosition > threshold) {
    headStyle.value.backgroundColor = 'gainsboro';
    headStyle.value.backgroundColor = 'white';
  } else {
    // headStyle.value.backgroundColor = 'transparent';
    headStyle.value.backgroundColor = 'white';

  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 粉丝
const fans = ref([
  { name: '粉丝', number: 0, englishname: 'concern' },
  { name: '关注', number: 0, englishname: 'aFanOfSomeone' },
  { name: '获赞与收藏', number: 0, englishname: 'support' },
]);


// 购物 订单
const orders = ref([
  { title: '购物', introduce: '好逛好玩又好买', name: 'shopping' },
  { title: '订单', introduce: '查看我的订单', name: 'orders' },
  { title: '购物车', introduce: '查看推荐好物', name: 'shoppingCart' },
  { title: '创作灵感', introduce: '学创作找灵感', name: 'creation' },
  { title: '浏览记录', introduce: '看过的笔记', name: 'browse' },
]);

// 笔记初始默认索引
const activeIndex = ref(0);

const titles = ref([
  // Note
  { name: '笔记', path: '/Note' },
  // Collection
  // { name: '收藏', path: '/Collection' },
  // Liked
  // { name: '赞过', path: '/Liked' },

]);
const savedActiveIndex = localStorage.getItem('activeIndex');
if (savedActiveIndex) {
  activeIndex.value = Number(savedActiveIndex);
}
watch(activeIndex, (newVal) => {
  localStorage.setItem('activeIndex', newVal.toString());
});

const gotopublish = (index) => {
  console.log(index);
  activeIndex.value = index;
  // 路由跳转
  const path = titles.value[index].path;
  router.push(path);

}

const tiaozhuanbianj = () => {
  router.push({ path: "/edit" })
}


</script>

<style lang="less" scoped>
.tx {
  width: 70rem;
  height: 70rem;
  border-radius: 50%;
  overflow: hidden;
}

.PersonalCenter {
  width: 100vw;


  header {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

    .masked {
      // background: linear-gradient(to top, rgba(128, 128, 128, 0.8), rgba(128, 128, 128, 0));



      .head {
        width: 375rem;
        height: 50rem;
        padding: 0 15rem;
        box-sizing: border-box;
        // background-color: gainsboro;
        display: flex;
        align-items: center;
        justify-content: space-between;

        // position: sticky;
        position: fixed;
        top: 0;
        z-index: 100;
        transition: background-color 0.5s ease;


        .share {
          width: 200rem;
          // background-color: aquamarine;

        }

        .share-icon {
          width: 80rem;
          // background-color: beige;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .placeholding {
        width: 100vw;
        height: 50rem;
      }

      .individual {
        padding: 15rem 0;
        // height: 200rem;
        // background-color: #705d42;


        .imgname {
          padding: 0 15rem;
          display: flex;
          align-items: center;

          :deep(.van-image__img) {
            border-radius: 50rem;
          }

          .name {
            padding: 15rem 0;
            // color: white;
            color: black;

            .bigname {
              font-size: 18rem;
            }

            .account {
              font-size: 12rem;
              margin-top: 10rem;
            }
          }
        }

        .briefIntroduction {
          padding: 10rem 15rem;
          font-size: 12rem;
          // color: white;
          color: black;
        }

        .edit {
          // background-color: aqua;
          // color: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4rem 15rem;

          .fans {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12rem;
          }

          .infosetUp {

            display: flex;
            align-items: center;

            .information {
              // border: 1rem solid white;
              border: 1rem solid black;
              border-radius: 50rem;
              padding: 5rem 20rem;
              font-size: 12rem;
              margin-right: 10rem;
            }

            .setUp {
              // border: 1rem solid white;
              border: 1rem solid black;
              border-radius: 50rem;
              padding: 2rem 10rem;
              display: flex;
              align-items: center;
            }
          }

        }

        .order {
          padding-top: 15rem;
          display: flex;
          overflow-x: auto;
          white-space: nowrap;
          -ms-overflow-style: none;
          scrollbar-width: none;

          .title {
            background-color: #ffffff3a;
            margin-right: 10rem;
            padding: 5rem 30rem 5rem 15rem;
            border-radius: 10rem;

            &:nth-child(1) {
              margin-left: 15rem;
            }

            .titlename {
              color: white;
              font-size: 13rem;

            }

            .introduce {
              color: #d6d6d6;
              font-size: 12rem;
              margin-top: 10rem;
            }
          }
        }
      }
    }


  }

  main {
    // background-color: #fafafa;
    background-color: white;

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      padding: 10rem 15rem;
      // border-radius: 10rem 10rem 0 0;
      border-bottom: 1rem solid #c7c7c7;
      position: sticky;
      top: 49rem;
      z-index: 100;

      .title-name {
        width: 95rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: gray;
        position: relative;

        .title {
          padding: 5rem 0;
        }
      }

      .active {
        color: black;
        display: flex;
        justify-content: center;

        &::before {
          content: '';
          background-color: red;
          width: 30rem;
          height: 2rem;
          border-radius: 50rem;
          position: absolute;
          bottom: 0rem;

        }
      }
    }


  }

}
</style>
