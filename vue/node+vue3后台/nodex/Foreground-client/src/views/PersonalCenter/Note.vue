<!-- Note 笔记 -->

<template>
  <div class="note">
    <header>
      <div class="title" v-for="(title, index) in note" :key="index" :class="{ active: index === notelist }"
        @click="gotolist(index)">
        <div v-if="title.title === '私密'" class="iconfont icon-jiesuo"></div>
        <div class="name">{{ title.title }}</div>
        <!-- <div class="number">{{ title.number }}</div> -->
      </div>
    </header>

    <main>
      <!-- 二级列表 -->
      <div class="list">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { apipublish } from "@/api/api.js";


import { useCounterStore } from "@/stores/counter.js";
const counterStore = useCounterStore();


const router = useRouter()
const route = useRoute()
const notelist = ref(0)


const note = ref([
  { title: '公开', number: 0, path: '/publish', },
  { title: '私密', number: 0, path: '/secret' },
  { title: '全部', number: 0, path: '/collections' },
])

console.log('初始化数据:', note.value);


watch(
  () => counterStore.PublishLength,
  (newLength) => {
    note.value[0].number = newLength;
    console.log('note.value[0].number更新数据:', note.value[0].number);
  },
)

watch(
  () => counterStore.SecretLength,
  (newLength) => {
    note.value[1].number = newLength;
    console.log('note.value[1].number更新数据:', note.value[1].number);
  },
)

watch(
  () => counterStore.Collectionslength,
  (newLength) => {
    note.value[2].number = newLength;
    console.log('note.value[2].number更新数据:', note.value[2].number);
  },
)


const gotolist = (index) => {
  notelist.value = index
  console.log(notelist.value)

  // 路由跳转
  const path = note.value[index].path;
  router.push(path);
}

onMounted(() => {
  const currentPath = route.path
  console.log('当前路由路径:', currentPath)

  if (currentPath !== '/publish') {
    router.push('/publish')
  }


  
})






</script>

<style lang="less" scoped>
.note {
  height: 750rem;

  header {
    display: flex;
    background-color: white;
    padding: 10rem 15rem;
    border-bottom: 1px solid #c7c7c7;


    .title {
      display: flex;
      align-items: center;
      // background-color: antiquewhite;
      margin-right: 20rem;
      color: gray;
      font-size: 14rem;

      .name {
        padding: 0 3rem;
      }
    }

    .active {
      color: black;
    }
  }

  main {
    .list {
      background-color: white;
    }
  }
}
</style>
