<template>
  <!-- 音乐栏 -->
  <div class="bottom-musicBars">
    <div class="bottom-music-bg">
      <div class="bottom-music-box" @click="goToSongDetails">
        <div
          class="image"
        
          :playedSongs="playedSongs"
          :currentid="currentid"
          @plays-music="$emit('plays-music', $event)"
          @Delete-music="$emit('Delete-music', $event)"
        >
          <img
            v-if="song && (song.song || song.al)"
            :src="song.song ? song.picUrl : song.al.picUrl"
            alt=""
            :class="{ playing: playing }"
          />
        </div>

        <h4>{{ song.name }}</h4>
      </div>

      <div class="bottom-btn-box">
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
        <div class="column" @click.stop="listItems">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <ListItem
      v-show="column"
      :playedSongs="playedSongs"
      :currentid="song ? song.id : null"
      @plays-music="$emit('plays-music', $event)"
      @Delete-music="$emit('Delete-music', $event)"
    >

    </ListItem>
  </div>
</template>

<script>
import ListItem from "@/components/ListItem.vue";

export default {
  components: {
    ListItem,
  },
  props: {
    song: {
      type: [String, Object, Number],
      default: null,
    },
    playing: {
      type: Boolean,
    },
    playedSongs: {
      type: Array,
      default: () => [],
    },
    currentid: {
      type: Number,
    },
  },
  data: function () {
    return {
      column: false,
    };
  },

  methods: {
    goToSongDetails() {
      this.$router.push({
        path: "/SongDetails",
        name: "SongDetails",
        query: {
          id: this.song.id,
        },
      });
    },
    listItems() {
      this.column = !this.column;
      // console.log("column:", this.column);
    },
  },

  mounted() {
    // console.log("在 PlayMusic 中收到 songId:", this.song);
  },
};
</script>

<style scoped lang="less">
.bottom-musicBars {


  .bottom-music-bg {
    width: 100%;
    height: 50px;
    background-color: white;

    padding: 10px;

    display: flex;
    align-items: center;

    position: fixed;
    bottom: 0;
    .bottom-music-box {
      width: 70%;
      // background-color: aquamarine;

      display: flex;
      align-items: center;

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .image {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        box-shadow: 0 0 15px 8px #ccc;
        border-radius: 50%;

        animation: rotate 3s linear;
        animation-iteration-count: infinite;
        animation-play-state: paused;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;

          animation: rotate 6s linear;
          animation-iteration-count: infinite;
          animation-play-state: paused;
        }
        .playing {
          animation-play-state: running;
        }
      }
    }

    .bottom-btn-box {
      width: 30%;
      height: 50%;

      padding: 0 10px;

      cursor: pointer;

      display: flex;
      justify-content: space-around;
      align-items: center;

      .previousOne {
        width: 22px;
      }
      .begin {
        width: 11px;
        // height: 100%;

        display: flex;
        align-items: center;
        justify-content: space-around;
        span {
          width: 2px;
          height: 14px;
          background-color: black;
          display: block;
        }
      }
      .timeOut {
        width: 22px;
      }
      .nextOne {
        width: 22px;
      }
      .column {
        width: 22px;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        span {
          width: 20px;
          height: 2px;
          background-color: black;
          display: block;
        }
      }
    }
  }
}
</style>
