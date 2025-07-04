<!-- Collection 收藏 -->

<template>
  <div class="collection">
    <header>
      <div class="title" v-for="(title, index) in note" :key="index" :class="{ active: index === notelist }"
        @click="gotolist(index)">
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
import { ref } from 'vue'

const notelist = ref(0)

const note = ref([
  { title: '笔记', number: 0 },
  // { title: '专辑', number: 0 },
])

const gotolist = (index) => {
  notelist.value = index
  console.log(notelist.value)
}

</script>

<style lang="less" scoped>
.collection {
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
}
</style>
