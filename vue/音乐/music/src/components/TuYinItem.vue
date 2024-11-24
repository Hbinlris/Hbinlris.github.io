<template>
<!-- 编辑推荐 -->
  <li class="playlist-tuyin" :class="{ col3: col === 3, col2: col === 2 }" >
    <router-link :to="`/tuyintwo?id=${item.id}`">
      <div class="tuyin-box">
        <div class="image">
          <img
            :src="`${item.picUrl}?imageView=1&type=webp&thumbnail=246x0`"
            alt=""
          />
        </div>

        <span class="num">{{ item.playCount }}</span>
      </div>
      <div class="txt" >{{ item.name }}</div>
    </router-link>

    <router-view />
  </li>
</template>

<script>
export default {
  props: {
    item: Object,
    picUrl: String,
    col: Number,
  },

  methods: {},
};
</script>

<style scoped lang="less">
.playlist-tuyin {
  flex-grow: 1;
  margin-bottom: 16px;

  a {
    color: black;
    text-decoration: none;
  }

  .tuyin-box {
    position: relative;
    .image {

      
      img {
        width: 100%;

        display: block;
      }
    }

    .num {
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
    }
  }
  .txt {
    font-size: 14px;
    padding: 6px 2px 0 6px;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &.col3 {
    width: 30%;
    &:nth-child(3n + 2) {
      // outline: 5px solid red;
      margin-left: 3px;
      margin-right: 3px;
    }
  }
  &.col2 {
    width: 40%;
  }
}
</style>
