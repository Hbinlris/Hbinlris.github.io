<!--ActingView 活动 -->

<template>
  <div class="ActingView">
    <div class="data" v-if="data">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- 公告 -->
          <div class="gonggao">
            <van-notice-bar
              :scrollable="false"
              color="#000"
              background="#e9e9e9"
            >
              <van-tag type="danger">公告</van-tag>
              <van-swipe
                vertical
                class="notice-swipe"
                :autoplay="3000"
                :touchable="false"
                :show-indicators="false"
              >
                <van-swipe-item
                  v-for="(banneer, index) in data?.banner"
                  :key="index"
                >
                  <div
                    class="name"
                    v-html="
                      `<b>${banneer.nickname}</b>&nbsp;刚刚参加了活动&nbsp;<b>${banneer.name}</b>`
                    "
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 100%;
                    "
                  ></div>
                </van-swipe-item>
              </van-swipe>
            </van-notice-bar>
          </div>

          <div class="ongoing">
            <div class="title">热门活动上线中</div>

            <div class="list">
              <div
                class="content"
                v-for="ongoing in data?.ongoing?.events"
                :key="ongoing.id"
              >
                <van-image width="100%" height="auto" :src="ongoing.image" />
                <div class="list-title">
                  <div class="left">
                    <span class="collecting">{{ ongoing.time_text }}</span>
                    {{ ongoing.name }}
                  </div>
                  <div class="right" @click="gotoactivity(ongoing.url)">
                    立即参与<van-icon name="arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ended">
            <div class="title">往期回顾</div>

            <div class="list">
              <div
                class="content"
                v-for="ended in data?.ended?.events"
                :key="ended.id"
              >
                <van-image width="100%" height="auto" :src="ended.image" />
                <div class="list-title">
                  <div class="left">
                    <span class="collecting">{{ ended.time_text }}</span>
                    {{ ended.name }}
                  </div>
                  <div class="right" @click="gotoreview(ended.url)">
                    查看详情>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="nodata" v-else>
      <van-image src="/loading.gif" />
    </div>
  </div>
</template>

<script setup>
import { activity } from "@/api/axios";
import router from "@/router";
import { ref, onMounted } from "vue";

const offset = ref(0);
const limit = ref(20);
const data = ref();

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onRefresh = () => {
  offset.value = 0;

  loading.value = true;
  finished.value = false;

  activity(offset.value, limit.value).then((res) => {
    data.value = res.data.data;
    console.log("data.value活动", data.value);

    loading.value = false;

    refreshing.value = false;
  });
};

const onLoad = () => {
  if (finished.value) {
    return;
  }

  // 增加偏移量
  offset.value += limit.value;

  activity(offset.value, limit.value)
    .then((res) => {
      if (res.data.data.length > 0) {
        data.value.ongoing.events.push(...res.data.data.ongoing.events);
        data.value.ended.events.push(...res.data.data.ended.events);
      } else {
        finished.value = true;
      }

      // 结束加载状态
      loading.value = false;
    })
    .catch(() => {
      // 结束加载状态
      loading.value = false;
    });
};

onMounted(() => {
  onRefresh();
});

// 活动
const gotoactivity = (url) => {
  console.log("url", url);

  window.location.href = url;
};
// 回顾
const gotoreview = (url) => {
  console.log("url", url);

  window.location.href = url;
};
</script>

<style lang="less" scoped>
.gonggao {
  border-radius: 5rem;
  overflow: hidden;
}
.ActingView {
  padding: 0 15rem;
  margin-bottom: 50rem;

  :deep(.van-ellipsis) {
    transition-duration: 0s;
    display: flex;
    align-items: center;
  }

  .notice-swipe {
    padding-left: 15rem;
    height: 40px;
    line-height: 40px;
  }

  .ongoing {
    .title {
      font-weight: bold;
      font-size: 20rem;
      padding: 15rem 0;
    }

    .content {
      .van-image {
        margin-bottom: 5rem;

        :deep(.van-image__img) {
          border-radius: 10rem;
        }
      }

      .list-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15rem;

        .left {
          width: 65vw;

          font-weight: bold;
          font-size: 12rem;

          line-height: 22rem;

          .collecting {
            background-color: red;
            color: white;
            padding: 2rem 3rem;
            border-radius: 0 5rem 0 5rem;
            font-size: 10rem;
            padding: 5rem;
          }
        }

        .right {
          color: #09a9a4;
          font-size: 12rem;
          font-weight: bold;
        }
      }
    }
  }

  .ended {
    .title {
      font-weight: bold;
      font-size: 18rem;
      padding: 15rem 0;
    }

    .content {
      .van-image {
        margin-bottom: 5rem;

        :deep(.van-image__img) {
          border-radius: 10rem;
        }
      }

      .list-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15rem;

        .left {
          width: 65vw;

          font-weight: bold;
          font-size: 13rem;

          line-height: 22rem;

          .collecting {
            background-color: gray;
            color: white;
            padding: 2rem 3rem;
            border-radius: 0 5rem 0 5rem;
          }
        }

        .right {
          color: #09a9a4;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
