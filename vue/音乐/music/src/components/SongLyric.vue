<template>
<!-- 歌词详情 -->
  <div class="SongLyric" :class="{ playing: playing }" @click="$emit('hide-lyric')" >
    <!-- SongLyric -->
    <ul class="list" :style="lyricMarginTop">
      <li
        :class="{ active: index === currentLyricIndex }"
        v-for="(item, index) in parsedLyric"
        :key="index"
        ref="lyricElements"
      >
        <span :style="lyricAnimationDuration(index, item)">{{
          item.text
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    currentTime: Number,
    duration: Number,
    playing: Boolean,
  },
  data: function () {
    return {
      lyric: "",
      lyricElementsHeight: [],
    };
  },
  created: function () {
    this.axios
      .get("/lyric", {
        params: {
          id: this.$route.query.id,
        },
      })
      .then((res) => {
        // console.log(res.data.lrc.lyric);
        this.lyric = res.data.lrc.lyric;

        this.$nextTick(() => {
          // console.log(this.$refs.lyricElements);
          this.lyricElementsHeight = this.$refs.lyricElements.map(
            (ele) => ele.offsetHeight
          );
        });
      });
  },
  computed: {
    currentLyricIndex: function () {
      // console.log(10, this.parsedLyric);
      return this.parsedLyric.findLastIndex((item) => {
        return item.time <= this.currentTime;
      });
    },
    parsedLyric: function () {
      return this.lyric
        .split("\n")
        .filter((o) => o)
        .map((item) => {
          var res = item.match(
            /\[(?<m>\d{2}):(?<s>\d{2}\.\d{2,3})\](?<str>.*)/i
          );

          return {
            time: res.groups.m * 60 + parseFloat(res.groups.s),
            text: res.groups.str || "---",
          };
        });
    },
    lyricMarginTop: function () {
      const marginTop =
        -1 *
          this.lyricElementsHeight
            .slice(0, this.currentLyricIndex)
            .reduce((total, num) => total + num, 0) +
        200 +
        "px";
      return { marginTop };
    },
  },

  methods: {
    lyricAnimationDuration(index, item) {
      const nextTime = this.parsedLyric[index + 1]?.time || this.duration;
      const animationDuration = (nextTime - item.time) * 0.89 + "s";
      return { animationDuration };
    },
    // gotoSongDetails() {
    //   this.$router.go(-1); 
    // },
  },
};
</script>

<style scoped lang="less">
@keyframes xxx {
  0% {
    background-position-x: 100%;
  }
  100% {
    background-position-x: 0%;
  }
}

.SongLyric {
  width: 100%;
  height: 55vh;
  // background-color: aliceblue;
  background-image: linear-gradient(
    to bottom,
    transparent 0%,
    white 20%,
    white 80%,
    transparent 100%
  );

  background-clip: text;
  overflow: hidden;
  color: transparent;

  .list {
    width: 100%;
    height: 100%;

    li {
      // background-color: aquamarine;
      display: flex;
      justify-content: center;
      span {
        display: inline-block;

        font-size: 14px;
        line-height: 25px;

        background-size: 200%;
        background-repeat: no-repeat;
        background-position-x: 100%;
        background-clip: text;
      }

      &.active {
        span {
          font-size: 20px;
          line-height: 30px;

          animation: xxx linear;
          animation-play-state: paused;
          background-image: linear-gradient(
            to right,
            rgb(255, 3, 133) 48%,
            rgb(255, 255, 255) 52%
          );
          color: transparent;
          text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.185);
        }
      }
    }
  }
  &.playing {
    .list {
      li {
        span {
          animation-play-state: running;
        }
      }
    }
  }
}
</style>
