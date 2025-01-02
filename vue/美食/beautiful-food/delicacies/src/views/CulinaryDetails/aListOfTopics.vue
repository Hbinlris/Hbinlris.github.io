<!-- aListOfTopics 话题列表 -->
<template>
  <div class="aListOfTopics">

    <div class="top">
      <van-icon name="arrow-left" class="return" @click="$router.back()" />
      <div class="title">热门话题</div>
    </div>

    <van-pull-refresh v-model="listLoading" @refresh="onRefresh">

      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

        <div class="list">
          <div class="list-label" v-for="lists in list" :key="lists.id" @click="gototrendingTopics(lists.id)">
            <van-image width="80rem" height="80rem" :src="lists.cover_image" />

            <div class="text">
              <div class="title">{{ lists.name }}</div>
              <div class="number">{{ `${lists.content_count}篇笔记` }}</div>
            </div>

          </div>
        </div>
      </van-list>
    </van-pull-refresh>


  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

import { aListOfTrendingTopics } from '@/api/index';
import { ref, onMounted } from 'vue';
import { showToast } from 'vant';

const offset = ref(0);
const limit = ref(20);

const list = ref();
const loading = ref(false);

const listLoading = ref(false);
const finished = ref(false);

const onRefresh = () => {
  loading.value = true;
  offset.value = 0; // 重置偏移量
  listLoading.value = true;


  aListOfTrendingTopics(offset.value, limit.value).then((res) => {

    list.value = res.data.result.list;
    console.log('list初始数组', list.value);
    showToast('刷新成功');

    loading.value = false;
    listLoading.value = false;
  });

};

const onLoad = () => {
  offset.value += limit.value; 
  loading.value = true;

  aListOfTrendingTopics(offset.value, limit.value).then((res) => {
    list.value = list.value.concat(res.data.result.list); // 追加新数据
    console.log('list追加数组', list.value);
    loading.value = false;
    if (res.data.result.list.length < limit.value) {
      finished.value = true; 
    }
  }).catch((error) => {
    console.error('获取数据失败', error);
    loading.value = false;
  });
};


// 跳转热门话题
const gototrendingTopics = (id) => {
  console.log('跳转热门话题', id);
  router.push({
    path: '/trendingTopics',
    query: {
      id:id
    }
  })
}



onMounted(() => {
  onRefresh();
});



</script>

<style lang="less" scoped>
.aListOfTopics {

  .top {
    position: sticky;
    top: 0;
    z-index: 100;

    background-color: white;

    display: flex;
    align-items: center;

    padding: 15rem;

    .return {
      font-size: 30rem;
      width: 40rem;
    }

    .title {
      font-weight: bold;
      font-size: 20rem;
    }
  }

  .list {
    padding: 10rem 10rem;
    background-color: #f2f3f5;

    .list-label {
      background-color: white;

      padding: 10rem;
      margin: 10rem;

      display: flex;
      align-items: center;

      .van-image {
        margin-right: 10rem;

        :deep(.van-image__img) {
          border-radius: 10rem;
        }
      }

      .text {

        .title {
          letter-spacing: 1rem;
          padding-bottom: 10rem;
        }

        .number {
          color: #999999;
          font-size: 14rem;
        }
      }


    }
  }
}
</style>
