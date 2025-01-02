<!-- JumpSearch 搜索-->

<template>
  <div class="JumpSearch">
    <div class="search">
      <van-search v-model="value" show-action placeholder="请输入搜索关键词" shape="round" clearable :autofocus="true"
        @search="onSearch" @cancel="onCancel" />
    </div>

    <!-- 搜索结果 -->
    <div class="list" v-for="lists in list" :key="lists.id" @click="gotoCulinaryDetails(lists.r?.id)">

      <div class="fil" v-if="lists.type != 301">
        <van-image :src="lists.r?.img" class="image" fit="cover" />
        <div class="title">
          <div class="titlename">{{ lists.r?.n }}</div>
          <div class="fraction">{{ lists.r?.rate }}分</div>
          <div class="label">{{ lists.r?.recipe_list_tags[0]?.text }}</div>
          <div class="avatar-name">
            <van-image :src="lists.r?.a?.p" class="avatar" fit="cover" />
            <div class="Authorsname">{{ lists.r?.an }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提示 -->
    <div class="tips" v-if="value && !list.length !== 0" v-for="listips in tips.suggests" :key="listips.index"
      @click="goSearch(listips.name)">
      <div class="tip-name">{{ listips.name }}</div>
      <div class="tip-label" v-if="listips.tag">{{ listips.tag?.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Search, SearchHint } from "@/api/axios.js";
import { showLoadingToast } from 'vant';
import { showToast } from 'vant';

const value = ref("");
const router = useRouter();

// 搜索结果
const list = ref([]);
// 提示
const tips = ref([]);

watch(value, (newVal) => {
  if (newVal === "") {
    list.value = [];
    tips.value = [];
  }

  if (newVal) {
    // 提示
    SearchHint(newVal).then((res) => {
      tips.value = res.data.result;
      console.log("提示", res.data.result);
      list.value = [];
    });
  }
});

const goSearch = (name) => {
  value.value = name;
  onSearch(name)
};

const onSearch = (val) => {

  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });


  // 搜索
  Search(val).then((res) => {
    console.log("全部", res.data.result);

    list.value = res.data.result.list;
    console.log("搜索数据", list.value);

    showToast('加载成功');
    tips.value = [];
  });
};

// 返回
const onCancel = () => {
  router.back();
};

// 跳转详情
const gotoCulinaryDetails = (id) => {
  console.log("id", id);

  router.push({
    path: "/CulinaryDetails",
    query: {
      id: id,
    },
  });
};
</script>

<style lang="less" scoped>
.JumpSearch {
  .search {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .list {
    padding: 5rem 10rem;

    .fil {
      display: flex;

      .image {
        width: 40vw;
        height: 30vw;
        padding-right: 10rem;

        :deep(.van-image__img) {
          border-radius: 10rem;
        }
      }

      .title {
        width: 50vw;

        .titlename {
          font-weight: bold;
          margin-bottom: 5rem;
        }

        .fraction {
          font-size: 13rem;
          // background-color: antiquewhite;
          margin-bottom: 5rem;
        }

        .label {
          background: linear-gradient(to right, #fae9cd, #f5d39f);
          font-size: 13rem;
          border-radius: 5rem;
          text-align: center;
          width: 60rem;
          margin-bottom: 5rem;
        }

        .avatar-name {
          display: flex;
          margin-bottom: 5rem;

          .avatar {
            width: 20rem;
            height: 20rem;
            margin-right: 5rem;

            :deep(.van-image__img) {
              border-radius: 50rem;
            }
          }

          .Authorsname {
            font-size: 13rem;
          }
        }
      }
    }
  }

  .tips {
    display: flex;
    justify-content: space-between;
    margin: 15rem 15rem;

    .tip-label {
      background-color: #d3d3d375;
      border-radius: 50rem;
      text-align: center;
      width: 50rem;
    }
  }
}
</style>
