<template>
  <div v-show="ListItem" @click.stop="overlay" class="ListItem-container">
    <div class="ListItem">
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
          <div class="singerSongs">
            {{ item.name }} - {{ getArtists(item) }}
          </div>
          <div class="line" @click.stop="Deletemusic(item.id)">X</div>
        </li>
      </ul>
    </div>
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
.ListItem-container {
  // width: 100%;
  // height: 100%;
  .overlay {
    width: 100vw;
    height: 100vh;
    background-color: #cccccc0f;
    position: fixed;
    top: -219px;
    left: 0;
    z-index: 10;
  }
  .ListItem {
    width: 100vw;
    height: 60vh;

    // background-color: #d2d1d1fa;
    background-color: rgba(255, 255, 255, 0.433); /* 半透明背景 */
    backdrop-filter: blur(20px) ; /* 背景模糊 */
    position: fixed;
    left: 0px;
    bottom: 0;
    border-radius: 10px 10px 0 0;
    z-index: 1000;

    .ListItem-title {
      width: 100%;
      font-weight: bold;
      font-size: 20px;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      letter-spacing: 5px;
      display: flex;


      position: fixed;
      bottom: 55vh;
      left: 0;
      background-color: #d4d4d4;
      border-radius: 10px 10px 0 0;

      .num {
        font-size: 12px;
      }
    }

    ul {
      width: 100%;
      height: 55vh;
      list-style: none;

      overflow: auto; /* 或者 overflow-x: auto; overflow-y: auto; */
      scrollbar-width: none; /* 隐藏滚动条 */
      -ms-overflow-style: none; /* IE 10+ 的兼容写法 */

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
          text-overflow: ellipsis;
          width: 90%;
          // background-color: wheat;
          // color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .line {
          width: 10%;
          text-align: center;
          cursor: pointer;
          color: black;
        }

        &:first-of-type {
          margin-top: 35px;
        }
      }
    }
  }
}
</style>
