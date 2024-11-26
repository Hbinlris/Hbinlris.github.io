<template>
  <!-- 推荐音乐歌曲列表 -->
  <div class="TuYinTwo" v-if="playlist" :style="{ 'margin-bottom': $parent.newSoundMarginBottom }">
    <div class="return" @click="gotorecommend"></div>
    <div class="tuYinTwo-title">
      <div class="image">
        <img
          :src="`${playlist.coverImgUrl}?imageView=1&type=webp&thumbnail=252x0`"
          alt=""
        />
      </div>

      <div class="TuYinTwo-text">
        <div class="text">{{ playlist.name }}</div>
      </div>
    </div>

    <div class="min-tit">歌曲列表</div>

    <div
      class="num-list"
      v-for="(item, index) in playlist.tracks"
      :key="item.id"
      @click="playsMusic(item)"
      :class="{ 'text-song': item.id === currentid }"
      
    >
      <div class="num">{{ number(index + 1) }}</div>

      <div class="tuYinTwo-lf">
        <div class="tuYinTwo-song">{{ item.name }}</div>
        <div class="tuYinTwo-singer">{{ arname(item) }}</div>
      </div>

      <div class="play-btn">
        <div v-if="currentid !== item.id" class="iconfont">&nbsp;▶</div>
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
      playlist: null,
    };
  },
  created: function () {
    if (this.$route.query.id) {
      this.axios
        .get("playlist/detail", {
          params: { id: this.$route.query.id },

        })
        .then((response) => {
          console.log(response.data);
          this.playlist = response.data.playlist;
        });
    }
  },
  computed: {
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

    // newSoundMarginBottom() {
    //   return this.playing ? "70px" : "0";
    // },
  },

  methods: {
    number(num) {
      return num.toString().padStart(2, "0");
    },
    gotorecommend() {
      this.$router.push({ path: "/" });
    },

    playsMusic(song) {
      this.$emit("plays-music", song);
    },
  },
};
</script>

<style scoped lang="less">
.TuYinTwo {
  .text-song {
    color: red;
  }

  .return {
    // width: 100%;
    height: 25px;
    background-color: #0000194f;
    padding-left: 10px;
    font-size: 30px;

    &::before {
      content: "←";
      font-size: 1.2em; /* 调整箭头的大小 */
      margin-right: -0.2em; /* 调整箭头和减号之间的间距 */
    }
  }
  .tuYinTwo-title {
    padding: 10px;
    display: flex;
    background-color: #0000194f;
    .image {
      width: 145px;
      height: 145px;
      margin-right: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .TuYinTwo-text {
      width: 60%;
      .text {
        font-size: 17px;
        color: #fefefe;
        padding-top: 1px;
        height: 44px;
      }
    }
  }
  .min-tit {
    height: 23px;
    padding: 0 10px;
    font-size: 12px;
    color: #666;
    background-color: #eeeff0;
    line-height: 23px;
  }

  .num-list {
    width: 100%;
    background-color: white;

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

    .tuYinTwo-lf {
      width: 85%;
      .tuYinTwo-song {
        font-size: 17px;
      }
      .tuYinTwo-singer {
        margin-top: 5px;

        font-size: 12px;
        color: #888;
      }
    }

    .play-btn {
      width: 10%;
      // height: 34px;
      // background-color: aqua;
      display: flex;
      justify-content: center;
      align-items: center;

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
