<template>
  <div class="Recommend">
    <!-- 推荐音乐 -->
    <h4>编辑推荐</h4>
    <ul class="TuYinItem">
      <TuYinItem
        v-for="item in TuYinItem"
        :key="item.id"
        :item="item"
        :col="3"
      ></TuYinItem>
    </ul>

    <h4>最新音乐</h4>
    <ul class="New-Sound" :style="{ 'margin-bottom': $parent.newSoundMarginBottom }">
      <!-- :style="{ 'margin-bottom': newSoundMarginBottom }" -->
      <NewSound
        v-for="item in newsong"
        :key="item.id"
        :item="item"
        @plays-music="$emit('plays-music', $event)"
        :currentid="currentid"
        :playing="playing"
      ></NewSound>
    </ul>
  </div>
</template>

<script>
import TuYinItem from "../components/TuYinItem.vue";
import NewSound from "../components/NewSound.vue";

export default {
  props: ["currentid", "playing"],
  components: {
    TuYinItem,
    NewSound,
  },
  data: function () {
    return {
      // 推荐歌单
      TuYinItem: [],
      // 最新音乐
      newsong: [],
    };
  },
  created: function () {
    this.axios.get("/personalized").then((response) => {
      // console.log("推荐歌单", response.data);
      // console.log("推荐歌单", response.data.result);
      const limitedResult = response.data.result.slice(0, 6);
      this.TuYinItem = limitedResult;
    });

    this.axios.get("/personalized/newsong").then((response) => {
      // console.log("最新音乐", response.data);
      // console.log("最新音乐", response.data.result);
      this.newsong = response.data.result;
    });
  },

  computed: {
    // newSoundMarginBottom() {
    //   return this.playing ? "70px" : "0";
    // },
  },

  methods: {},
};
</script>
 
<style scoped lang="less">
.Recommend {
  margin-top: 65px;

  overflow: auto; /* 或者 overflow-x: auto; overflow-y: auto; */
  scrollbar-width: none; /* 隐藏滚动条 */
  -ms-overflow-style: none; /* IE 10+ 的兼容写法 */

  h4 {
    margin-bottom: 14px;
    padding-left: 9px;
    padding-top: 20px;

    position: relative;

    &::after {
      content: "";
      display: block;
      width: 2px;
      height: 14px;
      background-color: red;

      position: absolute;
      top: 60%;
      left: 0;
    }
  }
  .TuYinItem {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
