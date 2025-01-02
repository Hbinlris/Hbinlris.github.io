<script setup >
import { HomeNode } from "@/api/index";
import { ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

const offset = ref(0);
const limit = ref(20);
const btmid = ref();

const finished = ref(false);
const listLoading = ref(false);
const loading = ref(false);

// 获取数据
const resultList = ref(null);
const list = ref(null);

HomeNode(offset.value, limit.value).then((res) => {
  console.log(res.data.result);
  resultList.value = res.data.result;
  list.value = res.data.result.list;
  btmid.value = res.data.result.btmid;
});

// 跳转热门
const TrendingTopics = (tip) => {
  if (tip.id === 0) {
    router.push({
      path: "/aListOfTopics",
      query: {
        id: tip.id,
      },
    });
  } else {
    router.push({
      path: "/trendingTopics",
      query: {
        id: tip.id,
      },
    });
  }
};

// 触底
const onLoad = () => {
  listLoading.value = true;

  offset.value += limit.value;

  HomeNode(offset.value, limit.value, btmid.value)
    .then((res) => {
      list.value = [...list.value, ...res.data.result.list];

      listLoading.value = false;

      if (res.data.result.list.length < limit.value) {
        finished.value = true;
      }
    })
    .catch((error) => {
      console.error("获取数据失败", error);
      listLoading.value = false;
    });
};
// 下拉刷新
const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  HomeNode(offset.value, limit.value).then((res) => {
    console.log(res.data.result);
    resultList.value = res.data.result;
    list.value = res.data.result.list;
    btmid.value = res.data.result.btmid;
    showToast("刷新成功");
    loading.value = false;
  });
};
</script>


<template>
  <div class="big">
    <div v-if="resultList">
      <div v-for="tops in resultList.topics" class="topics" :key="tops.index">
        <div
          v-for="tip in tops"
          :key="tip.id"
          class="item"
          @click="TrendingTopics(tip)"
        >
          # {{ tip.name }}
        </div>
      </div>
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <van-list
          v-model:loading="listLoading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="node">
            <template v-for="node in list">
              <div
                v-if="node.type === 1"
                class="item"
                @click="
                  $router.push({
                    path: '/NoteDetailPage',
                    query: { id: node.note.id },
                  })
                "
              >
                <van-image
                  fit="cover"
                  width="175rem"
                  height="218rem"
                  :src="node.note.image_u"
                  alt=""
                  radius="10rem"
                />
                <span class="straight_text">{{ node.note.straight_text }}</span>
                <p class="title text">{{ node.note.title }}</p>
                <div class="author">
                  <div style="display: flex; align-items: center">
                    <van-image
                      fit="cover"
                      width="15rem"
                      radius="50%"
                      :src="node.note.author.p"
                      alt=""
                    />
                    <span>{{ node.note.author.n }}</span>
                  </div>
                  <div style="display: flex; align-items: center">
                    <van-icon name="like-o" size="20" />
                    <span>{{ node.note.like_count }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="nodata" v-else>
      <van-image src="/loading.gif" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.topics {
  display: flex;
  overflow: auto;
  margin-top: 4rem;

  .item {
    flex: 1;
    white-space: nowrap;
    background-color: #f0fafc;
    color: #659596;
    border-radius: 12rem;
    padding: 6rem;
    margin: 6rem;
    font-size: 14rem;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.node {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8rem;

  .item {
    width: 49%;
    margin-top: 12rem;

    .straight_text {
      color: #b2b2b4;
      font-size: 12rem;
      padding-left: 8rem;
    }

    .title {
      // font-weight: 600;
      font-size: 12rem;
      padding: 0 4rem;
      line-height: 23rem;
      margin-top: 4rem;
    }

    .author {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #cdcdcd;
      font-size: 12rem;
      padding: 0 4rem;

      span {
        margin-left: 5rem;
      }
    }
  }
}

.text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
