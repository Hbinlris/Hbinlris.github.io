<template>
  <div class="ListItem" v-show="ListItem">
    <div class="ListItem-title">
      当前播放
      <div class="num">{{ playedSongs.length }}</div>
    </div>
    <ul>
      <li
        v-for="(item, index) in playedSongs"
        :key="index"
        :class="{ 'text-song': item.id === currentid }"
        @click="playsMusic(item)"
      >
        <div class="singerSongs">{{ item.name }} - {{ getArtists(item) }}</div>
        <div class="line" @click.stop="Deletemusic(item.id)">X</div>
      </li>
    </ul>

    <div class="overlay" @click.stop="overlay"></div>
  </div>
</template>

<script>
export default {
  props: {
    playedSongs: {
      type: Array,
      default: () => [],
    },
    currentid: {
      type: Number,
    },
    playing: {
      type: Boolean,
    },
  },
  data() {
    return {
      ListItem: true,
    };
  },

  methods: {
    overlay() {
      this.ListItem = !this.ListItem;
    },

    getArtists(song) {
      // console.log("song object:", song); // 打印 song 对象
      // 检查 song.ar 或 song.artists 属性，同时检查嵌套的 song 对象
      const artists =
        song.ar || song.artists || song.song?.ar || song.song?.artists;
      if (artists && Array.isArray(artists)) {
        return artists.map((artist) => artist.name).join("/");
      } else {
        console.error("无效的 song 对象或 artists 数组：", song);
        return "未知歌手"; // 返回其他默认值
      }
    },
    playsMusic(item) {
      this.$emit("plays-music", item);
    },

    Deletemusic(songId) {
      this.$emit("Delete-music", songId);
      // console.log("删除：", index);
    },
  },
};
</script>

<style lang="less" scoped>
.ListItem {
  width: 100vw;
  height: 500px;

  overflow: auto; /* 或者 overflow-x: auto; overflow-y: auto; */
  scrollbar-width: none; /* 隐藏滚动条 */
  -ms-overflow-style: none; /* IE 10+ 的兼容写法 */

  background-color: #d2d1d1fa;
  position: fixed;
  bottom: 0;
  border-radius: 20px;

  .overlay {
    width: 100vw;
    height: 382px;
    background-color: #cccccc0f;
    position: fixed;
    top: 0;
  }

  .ListItem-title {
    width: 100%;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    letter-spacing: 5px;
    display: flex;
    .num {
      font-size: 12px;
    }
  }

  ul {
    width: 100%;
    list-style: none;
    // padding: 0;

    .text-song {
      color: red;
    }
    li {
      padding: 10px;
      border-bottom: 1px solid #ccc;

      font-size: 20px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      cursor: pointer;
      .singerSongs {
        width: 90%;
        // background-color: wheat;
      }
      .line {
        width: 10%;
        text-align: center;
        cursor: pointer;
        display: none;
        &:hover {
          color: red;
        }
      }
    }
    &:hover .line {
      display: block;
    }
  }
}
</style>
