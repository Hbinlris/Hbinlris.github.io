<template>
  <div class="HotSongCharts" :style="{ 'margin-bottom': $parent.newSoundMarginBottom }">
    <!-- <h1>热歌榜</h1> -->
    <div
      v-for="(item, index) in HotSongCharts"
      :key="item.id"
      @click="playsMusic(item)"
      class="HotSongCharts-box"
      :class="{ 'text-song': item.id === currentid }"

    >
      <div :class="['num', { three: index < 3 }]">{{ number(index + 1) }}</div>
      <div class="HotSongCharts-lf">
        <div class="HotSongCharts-title">{{ item.name }}</div>
        <div class="HotSongCharts-singer">{{ arname(item) }}</div>
      </div>
      <div class="play-btn">
        <div v-if="currentid !== item.id" class="iconfont"> &nbsp;▶</div>
        <div v-else :class="{ playing: playing }" class="icon">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["currentid", "playing"],
  data: function () {
    return {
      HotSongCharts: [],
    };
  },
  computed: {
    // newSoundMarginBottom() {
    //   return this.playing ? "70px" : "0";
    // },

    arname() {
      return (item) => {
        if (!item.ar) {
          return "未知歌手 - 未知歌曲";
        }

        // 获取歌手名字
        const artistNames = Array.isArray(item.ar)
          ? item.ar.map((artist) => artist.name).join("/")
          : item.ar.name;

        // 获取歌曲名称
        const songName = item.name || "未知歌曲";

        return `${artistNames} - ${songName}`;
      };
    },
  },
  methods: {
    number(num) {
      return num.toString().padStart(2, "0");
    },
    playsMusic(song) {
      this.$emit("plays-music", song);
    },
  },
  created: function () {
    this.axios.get("/playlist/detail?id=3778678").then((response) => {
      // console.log(response.data)
      // console.log(response.data.playlist);
      // console.log(response.data.playlist.tracks);

      this.HotSongCharts = response.data.playlist.tracks;
    });
  },
};
</script>

<style lang="less" scoped>
.HotSongCharts {
  width: 100%;
  background-color: #f5f5f5;

  margin-top: 65px;



  .text-song {
    color: red;
  }

  .HotSongCharts-box {
    width: 100%;
    border-bottom: 1px solid #cccccc59;

    padding: 6px 0;

    display: flex;
    align-items: center;

    .num {
      width: 5%;
      // background-color: aquamarine;

      text-align: center;

      font-size: 20px;
      font-weight: 300;

      margin: 0 10px;
    }
    .three {
      color: red;
    }

    .HotSongCharts-lf {
      width: 85%;
      .HotSongCharts-title {
        font-size: 17px;
      }
      .HotSongCharts-singer {
        margin-top: 5px;

        font-size: 12px;
        color: #888;
      }
    }
    .play-btn {
      width: 10%;
      // background-color: aqua;
      display: flex;
      justify-content: center;

      .iconfont {
        width: 22px;
        height: 22px;
        text-align: center;
        border: 1px solid #888;

        border-radius: 50%;
        line-height: 22px;
      }

      @keyframes playbar {
        0% {
          transform: scaleY(1);
        }
        100% {
          transform: scaleY(0);
        }
      }

      .icon {
        width: 22px;
        height: 22px;
        display: flex;
        justify-content: space-around;
        // background-color: antiquewhite;
        span {
          display: block;
          width: 15%;
          height: 100%;
          background-color: red;
          animation: playbar 0.8s linear 0;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          transform-origin: bottom;
          animation-play-state: paused;

          &:nth-child(1) {
            animation-delay: 0s;
          }
          &:nth-child(2) {
            animation-delay: -0.4s;
          }
          &:nth-child(3) {
            animation-delay: -0.2s;
          }
          &:nth-child(4) {
            animation-delay: -0.6s;
          }
        }

        &.playing {
          span {
            animation-play-state: running;
          }
        }
      }
    }
  }
}
</style>
