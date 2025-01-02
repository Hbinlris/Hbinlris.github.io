<template>
  <div class="group-list" v-for="item in list" :key="item.index">
    <div class="card"></div>
    <div class="name">
      <p>{{ item.name }}</p>
      <p>0</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.group-list {
  //   background-color: #f7f7f7;
  border-radius: 15rem;
  float: left;
  .card {
    background-image: url(/fenzubg.png);
    width: 170rem;
    height: 170rem;
    margin: 5rem;
  }
  .name {
    display: flex;
    justify-content: space-around;
  }
}
</style>

<script setup >
// import { ref } from 'vue'
const props = defineProps({
  list: Array,
});
</script>
