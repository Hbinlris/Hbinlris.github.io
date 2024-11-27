<template>
  <!-- 最新音乐 -->
  <li
    class="new-sound"
    @click="playsMusic(item)"
    :class="{ 'text-song': currentid === item.id }"
  >
    <div class="nbox">
      <div class="songTitle">{{ item.name }}</div>

      <div class="singer">{{ singersName }}</div>
    </div>
    <div class="play-btn">
      <div v-if="currentid !== item.id" class="iconfont">&nbsp;▶</div>
      <div v-else :class="{ playing: playing }" class="icon">
        <span></span><span></span><span></span><span></span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    currentid: Number,
    item: Object,
    playing: Boolean,
  },
  computed: {
    singersName() {
      if (!this.item.song || !this.item.song.artists) {
        return "";
      }
      // 获取歌手名字
      const artistNames = this.item.song.artists.map((artist) => artist.name);
      // 获取专辑名称
      const albumName = this.item.song.album
        ? this.item.song.album.name
        : "未知专辑";

      return `${artistNames.join("/")} - ${albumName}`;
    },
  },
  methods: {
    playsMusic(song) {
      this.$emit("plays-music", song);
    },
  },
};
</script>

<style scoped lang="less">
.text-song {
  color: red;
}

.new-sound {
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;



  .nbox {
    width: 90%;
    padding: 6px 0;
    padding-left: 10px;

    .songTitle {
      font-size: 17px;
    }
    .singer {
      font-size: 12px;
      margin-top: 8px;

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
</style>
