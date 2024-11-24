<template>
  <div class="Search">
    <!-- 搜索 -->
    <div class="ss">
      <input
        type="text"
        class="text"
        v-model="search"
        v-on:keydown.enter="enter"
        v-on:input="debouncedSear"
        placeholder="输入歌曲或歌手名字"
      />
      <div class="load" style="color: orange" v-show="load">加载中...</div>
    </div>

    <div
      class="list"
      :style="{ 'margin-bottom': $parent.newSoundMarginBottom }"
    >
      <!-- 搜索提示 -->
      <div v-if="suggestions">
        <div v-for="suggestion in suggestions" :key="suggestion.keyword">
          <p class="tisp-outcome">{{ suggestion.keyword }}😊</p>
        </div>
      </div>

      <div v-else-if="search.trim() !== ''" class="tisp-outcome">
        找不到相关搜索😭
      </div>

      <!-- 歌单结果 -->
      <div v-if="formattedResult">
        <div
          v-for="song in formattedResult"
          :key="song.id"
          @click="playsMusic(song)"
          class="tisp-outcome"
          :class="{ 'text-song': song.id === currentid }"
        >
          <div class="song-name">
            <h4>{{ song.name }}</h4>
            <!-- <p class="outcome-p">歌手：{{ song.artists[0].name }}😊</p> -->
            <p class="outcome-p">歌手：{{ song.artistsNames }}😊</p>
            <!-- <p>id：{{ song.artists[0].id }}</p> -->
          </div>

          <div class="play-btn">
            <div v-if="currentid !== song.id" class="iconfont">&nbsp;▶</div>
            <div v-else :class="{ playing: playing }" class="icon">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="search.trim() !== ''" class="tisp-outcome">
        找不到相关搜索😭
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: ["currentid", "playing"],
  data() {
    return {
      search: "",
      load: false,
      result: [],
      suggestions: [],
      previousSearch: "",
    };
  },
  computed: {
    // 计算属性：格式化结果
    formattedResult() {
      return this.result.map((song) => ({
        ...song,
        artistsNames: song.artists.map((artist) => artist.name).join(" / "),
      }));
    },

    // newSoundMarginBottom() {
    //   return this.playing ? "70px" : "0";
    // },
  },

  methods: {
    // 获取搜索提示
    sear() {
      // console.log("000", this.search);

      // 当输入框为空时，清空结果
      if (this.search.trim() === "") {
        this.suggestions = [];
        this.result = [];
        console.log("清空结果", (this.suggestions = []), (this.result = []));

        return;
      }

      if (
        this.search.length < this.previousSearch.length &&
        this.previousSearch.startsWith(this.search)
      ) {
        this.result = []; // 当删除输入框内容的第一个字时，清空结果
      }

      this.previousSearch = this.search; // 更新搜索内容

      this.load = true;
      this.axios
        .get("/search/suggest", {
          params: {
            keywords: this.search,
            type: "mobile",
          },
        })
        .then((response) => {
          // console.log(response.data, response.data);
          if (this.search) {
            this.suggestions = response.data.result.allMatch;
          // this.result = [];
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.suggestions = [];
        })
        .finally(() => {
          this.load = false;
          this.result = [];
        });
    },

    // 搜索结果
    enter(e) {
      if (
        e.key === "Enter" &&
        this.search.trim() !== "" &&
        !this.search.match(/^ *$/)
      ) {
        this.song(this.search);
        this.suggestions = [];
        console.log("搜索结果", (this.suggestions = []));
      }
    },
    song(n) {
      this.load = true;
      this.axios
        .get("/search", {
          params: {
            keywords: n,
          },
        })
        .then((response) => {
          console.log("222", response.data.result.songs);
          this.result = response.data.result.songs;
          this.suggestions = [];
        })
        .catch((error) => {
          console.error("Error:", error);
          this.suggestions = [];
        })
        .finally(() => {
          this.load = false;
          this.suggestions = [];
        });
    },

    playsMusic(song) {
      this.$emit("plays-music", song);
      this.suggestions = [];
    },
  },
  // 防抖函数
  created() {
    this.debouncedSear = _.debounce(this.sear, 300);
  },
  debouncedSear() {
    if (this.search.trim() === "" || this.search.match(/^ *$/)) {
      this.suggestions = [];
      this.result = [];
    } else {
      this.sear();
    }
  },
};
</script>

<style scoped lang="less">
.Search {
  width: 100%;
  background-color: #fcfcfd;
  // border-bottom: 1px solid #ccc;

  margin-top: 65px;

  .ss {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    padding: 15px 10px;
    .text {
      width: 90%;
      height: 30px;
      border-radius: 20px;

      padding: 0 30px;

      background-color: #f5f5f5;
      border: 1px solid #ccc;

      outline: none;
      color: #333;
    }
    .load {
      color: orange;
      margin: 15px 0;
    }
  }
  .list {
    padding: 0 10px;
    .text-song {
      color: red;
    }
    .tisp-outcome {
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      padding: 10px 20px;
      display: flex;
      align-items: center;

      .song-name {
        width: 90%;
        h4 {
          font-size: 17px;
        }
        .outcome-p {
          margin-top: 10px;
          font-size: 12px;
          color: #666;
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
}
</style>
