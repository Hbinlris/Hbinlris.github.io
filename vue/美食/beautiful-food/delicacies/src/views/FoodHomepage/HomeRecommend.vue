<!-- HomeRecommend 推荐 -->
<template>
  <div class="HomeRecommend">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <template #pulling="props">
        <img
          class="doge"
          src="/loading.gif"
          :style="{ transform: `scale(${props.distance / 80})` }"
        />
      </template>

      <!-- 释放提示 -->
      <template #loosing>
        <img
          style="position: relative; bottom: 20rem"
          class="doge"
          src="/loading.gif"
        />
      </template>

      <!-- 加载提示 -->
      <template #loading>
        <img class="doge" src="/loading.gif" />
      </template>

      <!-- 轮播图 -->
      <div class="carousel">
        <!-- <van-image class="image" :src="HomeRecommends?.clear_image_url"></van-image> -->

        <van-swipe :autoplay="3000" lazy-render>
          <van-swipe-item
            v-for="image in HomeRecommends.banner"
            :key="image.url"
          >
            <!-- 骨架屏 -->
            <van-skeleton :loading="skeletonloading" row="1">
              <van-image class="Carouselimg" :src="image.i" fit="contain" />
            </van-skeleton>
          </van-swipe-item>
        </van-swipe>
      </div>

      <van-list
        v-model:loading="listLoading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 列表 -->
        <div class="list" v-if="HomeRecommendstitle[0]">
          <template v-for="item in HomeRecommendstitle[0]">
            <div class="item" :key="item.video_url" v-if="item.type == 1">
              <!-- 骨架屏 -->
              <van-skeleton :loading="skeletonloading" row="2" avatar title>
                <div class="item-content">
                  <!-- 图片 -->
                  <van-image
                    class="image"
                    :src="item.r.p"
                    fit="cover"
                    width="180rem"
                    @click="gotoCulinaryDetails(item.r.id)"
                  />
                  <!--标题 -->
                  <div class="title">{{ item.r.stdname }}</div>
                  <!-- 名字 -->
                  <div class="bottom">
                    <div class="let">
                      <van-image
                        :src="item.r.a.p"
                        width="15rem"
                        fit="cover"
                        round
                      />
                      <div class="name">{{ item.r.a.n }}</div>
                    </div>
                    <!-- 收藏 -->
                    <div class="fc">
                      <van-icon name="star-o" /> {{ item.r.fc }}
                    </div>
                  </div>
                </div>
              </van-skeleton>
            </div>
          </template>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { HomeRecommend } from "@/api/axios.js";
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { showLoadingToast } from "vant";

// 获取数据
const HomeRecommends = ref([]);
const HomeRecommendstitle = ref([]);

// 引入路由
const router = useRouter();

// 下拉刷新
const loading = ref(false);
// 骨架屏
const skeletonloading = ref(true);

// 初始分页参数
const offset = ref(0);
const limit = ref(10);

const finished = ref(false);
const listLoading = ref(false);

// 跳转商品详情
const gotoCulinaryDetails = (id) => {
  console.log("id", id);

  router.push({
    path: "/CulinaryDetails",
    query: {
      id: id,
    },
  });
};

// 删除
const showFlags = ref([]);
const isshow = (index) => {
  return showFlags.value[index];
};

function showdelete(index) {
  if (index >= 0 && index < HomeRecommendstitle.value[0].length) {
    HomeRecommendstitle.value[0].splice(index, 1);
    showFlags.value.splice(index, 1);

    // 重新计算 showFlags 长度
    if (showFlags.value.length < HomeRecommendstitle.value[0].length) {
      showFlags.value.push(true);
    }
  }
}

const onRefresh = () => {
  loading.value = true; // 开始加载
  // 骨架屏
  skeletonloading.value = true;

  offset.value = 0; // 重置偏移量

  // 生成一个 0 到 10 之间的随机整数作为偏移量
  const randomOffset = Math.floor(Math.random() * (20 - 10 + 1) + 20);
  offset.value += randomOffset;

  showLoadingToast({
    message: "加载中...",
    forbidClick: true,
  });

  HomeRecommend(offset.value, limit.value)
    .then((res) => {
      HomeRecommends.value = res.data.result;
      // console.log("HomeRecommend", HomeRecommends);

      HomeRecommendstitle.value = [res.data.result.list];
      // console.log("HomeRecommendstitle", HomeRecommendstitle.value);
      showFlags.value = HomeRecommendstitle.value[0].map(() => true); // 初始化 showFlags

      loading.value = false;
      // 骨架屏
      skeletonloading.value = false;

      showToast("刷新成功");
    })
    .catch((error) => {
      // console.error("获取数据失败", error);
      showToast("刷新失败");

      loading.value = false;
    });
};

const onLoad = () => {
  listLoading.value = true;

  offset.value += limit.value;

  HomeRecommend(offset.value, limit.value)
    .then((res) => {
      nextTick(() => {
        HomeRecommendstitle.value[0] = [
          ...HomeRecommendstitle.value[0],
          ...res.data.result.list,
        ];
      });
      // console.log("HomeRecommendstitle[0]", HomeRecommendstitle.value[0]);

      showFlags.value = [
        ...showFlags.value,
        ...res.data.result.list.map(() => true),
      ];

      listLoading.value = false;

      if (res.data.result.list.length < limit.value) {
        finished.value = true;
      }
    })
    .catch((error) => {
      // console.error("获取数据失败", error);
      listLoading.value = false;
    });
};

onMounted(() => {
  onRefresh();
});
</script>

<style lang="less" scoped>
.HomeRecommend {
  .carousel {
    // background-color: beige;
    padding: 15rem 15rem;

    .image {
      margin-bottom: 15rem;
    }

    .van-swipe {
      border-radius: 10rem;

      .van-image {
        :deep(.van-image__img) {
          border-radius: 10rem;
        }
      }
    }
  }

  .doge {
    width: 140px;
    height: 72px;
    margin-top: 8px;
    border-radius: 4px;
  }

  .list {
    margin-bottom: 40rem;
    display: flex;
    flex-wrap: wrap;
    padding: 12rem;
    justify-content: space-between;

    .item {
      width: 45vw;

      // 美食
      .item-content {
        margin-bottom: 5rem;
        // height: 65vw;
        border-radius: 10rem;
        overflow: hidden;

        .image {
          width: 45vw;
          height: 50vw;
          // border-radius: 10rem 10rem 0 0;
          margin-bottom: 10rem;

          .van-image__img {
            border-radius: 10rem 10rem 0 0;
          }
        }

        // 标题
        .title {
          font-size: 12rem;
          font-weight: normal;
          // margin-bottom: 10rem;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;

          // 图片/名
          .let {
            display: flex;
            align-items: center;
            // background-color: aqua;

            .name {
              font-size: 12rem;
              color: #ccc;
              margin: 10rem 0;
              width: 70%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }

            .van-image {
              margin-right: 5rem;

              .van-image__img {
                border-radius: 5rem 5rem 0 0;
              }
            }
          }

          .like_count {
            font-size: 13rem;
            color: #ccc;
            display: flex;
            align-items: center;
            // background-color: aquamarine;
          }

          .fc {
            font-size: 13rem;
            color: #ccc;
            display: flex;
            align-items: center;
          }
        }
      }

      //广告
      .item-ad {
        margin-bottom: 5rem;
        position: relative;
        width: 45vw;
        // height: 65vw;

        .delete {
          position: absolute;
          top: 10rem;
          right: 10rem;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .image {
          width: 45vw;
          height: 50vw;
          margin-bottom: 10rem;

          .van-image__img {
            border-radius: 5rem 5rem 0 0;
          }
        }

        .positioning {
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 10rem;
          border-radius: 15rem;
          padding: 2rem 5rem;
          position: absolute;
          right: 10rem;
          bottom: 20%;
        }

        .title {
          font-size: 12rem;
          font-weight: bold;
          margin-bottom: 10rem;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;

          // background-color: aqua;
          .let {
            display: flex;
            align-items: center;

            .name {
              font-size: 13rem;
              color: #ccc;
              // background-color: antiquewhite;

              width: 70%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
          }

          .like_count {
            font-size: 13rem;
            color: #ccc;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
