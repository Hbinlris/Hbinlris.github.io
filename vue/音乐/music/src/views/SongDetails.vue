<template>
  <!-- 音乐详情 -->
  <div
    class="SongDetails"
    v-if="song"
    :style="{
      backgroundImage: `url(${song.song ? song.picUrl : song.al.picUrl})`,
    }"
  >
    <div class="box">
      <div class="return" @click="gotorecommend"></div>

      <div class="image-songTitle" v-if="!showLyric" @click="gotoSongLyric">
        <div class="image">
          <img
            :src="song.song ? song.picUrl : song.al.picUrl"
            alt=""
            :class="{ playing: playing }"
          />
        </div>

        <div class="songTitle">
          <div class="songTitle-lf">
            <div class="songName">{{ song.name }}</div>
            <div class="songwriter">
              {{ song.ar.map((artist) => artist.name).join("/") }}
            </div>
          </div>
          <div class="songTitle-lr"></div>
        </div>
      </div>

      <SongLyric
        v-else
        :currentTime="currentTime"
        :duration="duration"
        :playing="playing"
        @hide-lyric="hideLyric"
      ></SongLyric>

      <div class="song-time">
        <div class="progress">
          <div
            class="mask"
            :style="{ width: (userValue / duration) * 100 + '%' }"
          ></div>
          <input
            type="range"
            min="0"
            :max="duration"
            v-model.number="userValue"
            @input="inputing = true"
            @change="
              inputing = false;
              $emit('change-play-time', userValue);
            "
            
          />
        </div>
        <div class="num" >
          <span><span v-if="!currentTime">00:00</span>{{ currentTime | time2mmss }}</span>
          <span>{{ duration | time2mmss }}</span>
        </div>
      </div>

      <div class="bottom-btn-box">
        <div class="bottom-btn-bf">
          <div class="previousOne" @click="$emit('prev-song')">l◀</div>
          <div
            class="begin"
            @click.stop="$emit('pause-play-song')"
            v-if="playing"
          >
            <span></span>
            <span></span>
          </div>
          <div class="timeOut" @click.stop="$emit('start-play-song')" v-else>
            ▶
          </div>
          <div class="nextOne" @click="$emit('next-song')">▶l</div>

          <div class="column" @click="listItems">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <ListItem
          v-show="column"
          :playedSongs="playedSongs"
          :currentid="currentid"
          @plays-music="$emit('plays-music', $event)"
          @Delete-music="$emit('Delete-music', $event)"
        ></ListItem>
      </div>
    </div>
  </div>
</template>

<script>
import SongLyric from "@/components/SongLyric.vue";
import ListItem from "@/components/ListItem.vue";

export default {
  components: {
    SongLyric,
    ListItem,
  },

  props: {
    playing: {
      type: Boolean,
    },
    currentTime: Number,
    duration: Number,
    currentid: Number,

    playedSongs: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      song: null,
      userValue: this.currentTime,
      inputing: false,
      showLyric: false,

      column: false,
    };
  },
  created: function () {
    this.axios
      .get("/song/detail", {
        params: {
          ids: this.$route.query.id,
        },
      })
      .then((res) => {
        this.song = res.data.songs[0];
      })
      .catch((error) => {
        console.error("111加载歌曲详细信息时出错:", error);
      });
  },
  watch: {
    currentTime: function (currentTime) {
      if (!this.inputing) {
        this.userValue = currentTime;
      }
    },

    currentid: function (newId, oldId) {
      if (newId !== oldId) {
        if (this.currentid) {
          this.axios
            .get("/song/detail", {
              params: {
                ids: this.currentid,
              },
            })
            .then((res) => {
              this.song = res.data.songs[0];
            })
            .catch((error) => {
              console.error("加载歌曲详细信息时出错:", error);
            });
        }
      }
    },
  },

  methods: {

    
    gotorecommend() {
      this.$router.push({ path: "/" });
    },

    gotoSongLyric() {
      this.showLyric = !this.showLyric;
    },
    hideLyric() {
      this.showLyric = false;
    },
    listItems() {
      this.column = !this.column;
      // console.log("column:", this.column);
    },


  },

  computed: {},
};
</script>

<style scoped lang="less">
.SongDetails {
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;

  .box {
    width: 100%;
    height: 100vh;
    // background-color: aqua;

    background: rgba(0, 0, 0, 0.2); /* 半透明背景 */
    backdrop-filter: blur(10px); /* 背景模糊效果 */

    .return {
      // width: 100%;
      height: 25px;
      // background-color: #ffffff73;
      font-size: 30px;
      line-height: 25px;

      color: #fafafa;

      padding: 10px 20px;
      margin-top: 20px;

      &::before {
        content: "←";
        font-size: 1.2em; /* 调整箭头的大小 */
        margin-right: -0.2em; /* 调整箭头和减号之间的间距 */
      }
    }
    .makeUpTheNumbers {
      width: 100%;
      height: 100px;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .image-songTitle {
      width: 100vw;
      height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .image {
        width: 235px;
        height: 235px;

        display: flex;
        justify-content: center;
        // background-color: aquamarine;

        margin: 20px 0;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 0 0 10px white;

          padding: 30px;
          background-color: #282828;

          animation: rotate 6s linear;
          animation-iteration-count: infinite;
          animation-play-state: paused;
        }
        .playing {
          animation-play-state: running;
        }
      }
      .songTitle {
        // background-color: beige;
        display: flex;
        width: 100vw;

        .songTitle-lf {
          width: 70%;
          padding-left: 15px;
          .songName {
            // background-color: aqua;
            padding: 10px 0 5px 0;
            font-size: 15px;
            font-weight: bold;
            color: white;
          }
          .songwriter {
            font-size: 12px;
            padding: 5px 0 10px 0;
            color: #fafafa;
          }
        }
        .songTitle-lr {
          width: 30%;
          height: 100%;
        }
      }
    }

    .song-time {
      width: 100%;
      // height: 10vh;
      // background-color: #fafafa;
      color: white;

      padding: 15px 0;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      margin-bottom: 20px;

      .progress {
        width: 95%;
        // height: 30px;
        // background-color: aqua;

        padding: 5px 0;

        input {
          width: 100%;
          height: 3px;

          appearance: none;
          background-color: #ddd; /* 轨道颜色 */
          border-radius: 5px; /* 轨道圆角 */
          outline: none; /* 移除轮廓线 */

          /* 针对 WebKit 浏览器的滑块 */
          &::-webkit-slider-thumb {
            -webkit-appearance: none; /* 移除默认样式 */
            appearance: none;
            width: 10px; /* 滑块宽度 */
            height: 10px; /* 滑块高度 */
            border-radius: 50%; /* 滑块圆角 */
            background: white; /* 滑块背景色 */
            cursor: pointer; /* 滑块光标 */
            border: 2px solid whitesmoke; /* 滑块边框 */
          }
        }
      }

      .num {
        width: 95%;
        // height: 100%;
        // background-color: #999;
        padding-top: 5px;

        display: flex;
        justify-content: space-around;
      }
    }

    .bottom-btn-box {
      width: 100%;
      height: 50px;
      // background-color: #fafafa;
      display: flex;
      justify-content: center;
      .bottom-btn-bf {
        width: 95%;
        height: 50px;
        // background-color: orange;
        // color: #1f1f1f;
        color: white;

        font-size: 35px;

        display: flex;
        justify-content: space-around;
        align-items: center;

        .begin {
          width: 40px;
          // height: 100%;

          display: flex;
          align-items: center;
          justify-content: space-around;
          span {
            width: 5px;
            height: 35px;
            // background-color: #1f1f1f;/
            background-color: white;
            display: block;
          }
        }
        .column {
          width: 40px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          span {
            width: 40px;
            height: 4px;
            // background-color: black;
            background-color: white;
            display: block;
          }
        }
      }
    }
  }
}
</style>
