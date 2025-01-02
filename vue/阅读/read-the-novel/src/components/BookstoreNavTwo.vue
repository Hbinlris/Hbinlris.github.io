<!-- 排行 人气 完结 奇文 精品 -->

<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div class="bookstorenavtwo">
      <!-- <nav>
        <div
          class="bookstorenavtwo-nav"
          v-for="shortCut in shortCuts"
          :key="shortCut.msgId"
        >
          <van-image class="img" :src="shortCut.cover" alt="" />
          <div>{{ shortCut.name }}</div>
        </div>
      </nav> -->

      <main>
        <div
          class="bookstorenavtwo-name"
          v-for="module in BookstoreNavTwos"
          :key="module.index"
        >
          <van-swipe
            class="my-swipe"
            :autoplay="3000"
            indicator-color="white"
            v-if="module.banners && module.banners.length > 0"
          >
            <van-swipe-item v-for="item in module.banners" :key="item.id">
              <img :src="item.cover" alt="" />
            </van-swipe-item>
          </van-swipe>

          <img
            v-if="module.cover"
            v-lazy="module.cover"
            alt=""
          />
          <h3 v-else>{{ module.name }}</h3>

          <div v-if="module.module === 36" class="everyonelook">
            <div
              class="imagelook"
              v-for="book in module.list"
              :key="book.id"
              @click="
                gotobookDetails(book.id, book.title, book.cover, book.extra)
              "
            >
              <img v-lazy="book.cover" alt="" />
              <div class="bookright">
                <div class="looktitle">{{ book.title }}</div>

                <div class="classificationOfAuthors">
                  {{ ` ${book.author}/${book.category} ` }}
                </div>
                <div class="briefIntroduction">{{ book.content }}</div>
              </div>
            </div>
          </div>

          <div class="bookstorenavtwo-list" v-else>
            <div
              class="image"
              v-for="book in module.list"
              :key="book.id"
              @click="
                gotobookDetails(book.id, book.title, book.cover, book.extra)
              "
            >
              <van-image
                class="img"
                :src="book.cover"
                alt=""
                :style="{
                  width: module.list.length > 3 ? '20vw' : '30vw',
                  height: module.list.length > 3 ? '30vw' : '40vw',
                }"
              />
              <div
                class="title"
                :style="{
                  width: module.list.length > 3 ? '20vw' : '30vw',
                }"
              >
                {{ book.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="prompt" v-if="isprompt">我是有底线的≧∇≦</div>
      </main>

      <!-- 加载动画 -->
      <div class="load" v-if="load">
        <span>加</span>
        <span>载</span>
        <span>中</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import { BookstoreNavTwo } from "@/api/axios";
import { Toast } from "vant";

export default {
  name: "BookstoreNavTwo",

  props: ["url"],

  data() {
    return {
      shortCuts: [],
      BookstoreNavTwos: [],

      cover: "",
      banners: "",

      isprompt: false,

      isLoading: false,

      load: true,
    };
  },
  created: function () {
    this.onRefresh(this.url);
  },

  computed: {},

  watch: {
    url: {
      immediate: true, // 立即执行一次watcher
      handler(newUrl) {
        this.onRefresh(newUrl); // 当url变化时调用onRefresh方法
      },
    },
  },

  methods: {
    onRefresh(url) {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;

        // 第二导航
        BookstoreNavTwo(url).then((res) => {
          console.log("二级111", res);

          this.BookstoreNavTwos = res.data.data.list;
          console.log("二级555", this.BookstoreNavTwos);

          this.shortCuts = this.extractShortcuts(this.BookstoreNavTwos);
          // console.log("shortCut", this.shortCuts);

          this.isprompt = true;

          this.load = false;
        });
      }, 2000);
    },

    // 第二导航，提取 shortCut
    extractShortcuts(list) {
      return list.reduce((acc, item) => {
        //  || item.banners
        const shortcuts = item.shortCut;
        if (shortcuts) {
          acc.push(...shortcuts); // 使用扩展运算符合并数组
        }
        if (item.list && Array.isArray(item.list)) {
          // 如果 item.list 存在且为数组，递归提取 shortCut
          acc.push(...this.extractShortcuts(item.list));
        }
        return acc;
      }, []);
    },

    gotobookDetails(id, title, cover, extra) {
      console.log("gotobookDetails", id, title, cover, extra);

      this.$router.push({
        path: "/bookDetails",
        query: {
          id: id,
          title: title,
          cover: cover,
          extra: extra,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bookstorenavtwo {
  .no-books {
    position: fixed;
    left: 40%;
    top: 50%;
  }

  nav {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #cccccc3b;

    .bookstorenavtwo-nav {
      // background-color: cadetblue;
      text-align: center;
      margin: 5rem;

      .img {
        width: 40rem;
      }
    }
  }
  main {
    .bookstorenavtwo-name {
      .my-swipe {
        img {
          width: 100vw;
          height: 40vw;
        }
      }

      h3 {
        padding: 0 15px;
      }
      img {
        width: 100vw;
        height: 25vw;
      }
      .everyonelook {
        padding: 0 15px;
        .imagelook {
          margin-bottom: 15px;
          display: flex;

          img {
            width: 25vw;
            height: 25vw;
            margin-right: 15px;
          }
          .bookright {
            .looktitle {
              font-weight: bold;
              font-size: 17rem;
              letter-spacing: 2px;
              margin-bottom: 10px;
            }
            .classificationOfAuthors {
              font-size: 10rem;
              letter-spacing: 2px;
              color: #b7b7b7;
              margin-bottom: 20px;
            }
            .briefIntroduction {
              font-size: 11rem;
              letter-spacing: 2px;
              color: #b7b7b7;

              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; /* 限制为两行 */
              overflow: hidden; /* 隐藏溢出的内容 */
            }
          }
        }
      }

      .bookstorenavtwo-list {
        display: flex;
        justify-content: space-between;

        margin-bottom: 15px;

        padding: 0 15px;

        .image {
          .img {
            width: 30vw;
            height: 40vw;
          }
          .title {
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;

            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1; /* 限制为2行 */
            overflow: hidden; /* 隐藏溢出的内容 */
            text-overflow: ellipsis; /* 溢出时显示省略号 */
          }
        }
      }

      .list {
        display: flex;
        justify-content: center;
        font-size: 11rem;
        letter-spacing: 2px;
        color: #7d7d7d;
      }
    }
    .prompt {
      width: 100vw;
      height: 5vw;
      background-color: #efefef;
      font-size: 13rem;
      text-align: center;
      padding: 15px 0;
      // padding-top: 15px;
      // padding-bottom: 65px;
      color: gray;
      margin-bottom: 45px;
    }
  }

  .load {
    position: fixed;
    top: 300rem;
    left: 150rem;

    span {
      display: inline-block;
      animation: bounce 2s infinite;
      animation-timing-function: cubic-bezier(
        0.42,
        0,
        0.58,
        1
      ); // 先快后慢再快再慢

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }

      &:nth-child(4) {
        animation-delay: 0.6s;
      }

      &:nth-child(5) {
        animation-delay: 0.8s;
      }

      &:nth-child(6) {
        animation-delay: 1s;
      }
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }

    25%,
    75% {
      transform: translateY(-15px); // 一三五上
    }

    50% {
      transform: translateY(-10px); // 二四六上
    }

    12.5%,
    37.5%,
    62.5%,
    87.5% {
      transform: translateY(-5px); // 二四六下
    }

    37.5%,
    62.5% {
      transform: translateY(-1px); // 一三五下
    }
  }
}
</style>


