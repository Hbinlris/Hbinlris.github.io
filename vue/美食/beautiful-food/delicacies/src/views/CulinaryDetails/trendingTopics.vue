<!-- trendingTopics 热门话题 -->

<template>

  <van-pull-refresh v-model="loading" @refresh="onRefresh">

    <van-list v-model:loading="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">


      <div class="trendingTopics">

        <div class="top">
          <van-icon name="arrow-left" class="return" @click="$router.back()" />
        </div>

        <van-image width="100vw" :src="result?.topic?.cover_image" />

        <div class="list">

          <div class="title">
            <div class="label">#{{ result?.topic?.tag_list[0].name }}</div>
            <div class="text-title">{{ result?.topic?.name }}</div>
          </div>

          <div class="participate">

            <div class="avatar" v-for="(avatar, index) in result?.topic?.users" :key="avatar.id"
              :style="{ transform: `translateX(${displacement(index)})` }">
              <van-image width="20rem" height="20rem" :src="avatar.p" />
            </div>

            <div class="text">
              {{ `已有${result?.topic?.content_count}人参与` }}
            </div>
          </div>

          <div class="briefIntroduction">
            {{ result?.topic?.description }}
          </div>

          <div class="list-content">
            <div class="content" v-for="note in result?.list" @click="gotoNoteDetailPage(note.note?.id)">
              <van-image width="45vw" height="60vw" :src="note.note?.image_u" />

              <div class="clock" v-if="note.note?.straight_text">{{ note.note?.straight_text }}</div>
              <div class="personalInformation">
                <van-image width="20rem" height="20rem" :src="note.note?.author?.p" />
                <div class="name">{{ note.note?.author?.n }}</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </van-list>

  </van-pull-refresh>

</template>

<script setup>

import { topicDetails } from '@/api/index'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter()
const route = useRoute()

const topicid = ref(route.query.id)
const offset = ref(0)
const limit = ref(10)

const result = ref()

const loading = ref(false);
const listLoading = ref(false);
const finished = ref(false);



const onRefresh = () => {
  loading.value = true;
  offset.value = 0; // 重置偏移量
  listLoading.value = true;


  topicDetails(topicid.value, offset.value, limit.value).then((res) => {

    result.value = res.data.result
    console.log('res', result.value);

    showToast('刷新成功');
    loading.value = false;
    listLoading.value = false;
  })

};

const onLoad = () => {
  if (finished.value) return;

  listLoading.value = true; // 开始加载
  offset.value += limit.value; // 增加偏移量

  topicDetails(topicid.value, offset.value, limit.value).then((res) => {

    const newResults = res.data.result.list;
    if (newResults.length < limit.value) {
      finished.value = true;
    }
    if (result.value) {
      result.value.list = [...result.value.list, ...newResults]; // 追加新数据到结果中
    } else {
      result.value = { ...res.data.result, list: newResults };
    }
    listLoading.value = false; // 加载完成
  }).catch((error) => {
    showToast('加载失败', error);
    listLoading.value = false; // 加载失败也结束加载状态
  });
};

const gotoNoteDetailPage = (id) => {
  console.log("热门话题", id);
  router.push({
    path: '/NoteDetailPage', 
    query: {
      id:id
    }
  })
  
}

const displacement = (index) => {
  return `${index * -10}px`;
};

onMounted(() => {
  onRefresh();
});




</script>

<style lang="less" scoped>
.trendingTopics {
  .top {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100vw;

    background-color: rgba(255, 255, 255, 0);

    padding: 15rem;

    .return {
      font-size: 30rem;
      width: 40rem;
      color: white;
    }
  }


  .list {
    padding: 15rem 5rem 0rem 5rem;
    background-color: #f7f7f7;

    .title {
      padding: 0 10rem;
      display: flex;

      .label {
        background-color: red;
        color: white;
        padding: 3rem 5rem;
        margin-right: 15rem;

        border-radius: 50rem;
      }

      .text-title {
        font-weight: bold;
        font-size: 23rem;
      }
    }

    .participate {
      display: flex;
      align-items: center;
      justify-content: start;
      margin: 15rem;



      .avatar {
        display: flex;
        align-items: center;
        position: relative;

        .van-image {
          :deep(.van-image__img) {
            border-radius: 50rem;

          }
        }

      }

      .text {
        position: absolute;
        left: 102rem;
        color: #9999;
        font-size: 13rem;

      }
    }

    .briefIntroduction {
      font-size: 15rem;
      margin: 15rem;
    }

    .list-content {
      padding: 15rem 0;
      // background-color: aqua;

      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;

      .content {
        margin: 5rem 0;

        .van-image {
          :deep(.van-image__img) {
            border-radius: 10rem 10rem 0 0;
          }
        }

        .clock {
          font-size: 12rem;
          color: #ccc;
          margin: 5rem 0;
        }

        .personalInformation {
          display: flex;
          align-items: center;

          .van-image {
            margin-right: 5rem;

            :deep(.van-image__img) {
              border-radius: 50rem;
            }
          }

          .name {
            font-size: 12rem;
            color: #9d9d9d;
          }
        }


      }
    }


  }

}
</style>
