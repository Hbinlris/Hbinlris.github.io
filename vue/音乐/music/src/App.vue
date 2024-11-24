<template>
  <div id="app">
    <nav v-if="$route.meta.shownav">
      <router-link to="/">推荐音乐</router-link>
      <router-link to="/hotSongCharts">热歌榜</router-link>
      <router-link to="/Search">搜索</router-link>
    </nav>

    <router-view
      @plays-music="playsong"
      :currentid="song ? song.id : null"
      :playing="playing"
      :duration="duration"
      :playedSongs="playedSongs"
      :currentTime="currentTime"
      @change-play-time="$refs.audioEle.currentTime = $event"
      @start-play-song="$refs.audioEle.play()"
      @pause-play-song="$refs.audioEle.pause()"
      @prev-song="prevSong"
      @next-song="nextSong"
      @Delete-music="Deletemusic"
    />

    <!-- 绑定 audio 元素的 src 并监听 canplay 事件来播放音乐 -->
    <audio
      controls
      :src="`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`"
      autoplay
      v-if="song"
      ref="audioEle"
      @play="playing = true"
      @pause="playing = false"
      @durationchange="duration = $event.target.duration"
      @timeupdate="currentTime = $event.target.currentTime"
      @ended="nextSong"
    ></audio>

    <PlayMusic
      :song="song"
      :currentid="song ? song.id : null"
      v-if="song && showPlayMusic"
      :playing="playing"
      :playedSongs="playedSongs"
      @plays-music="playsong($event)"
      @start-play-song="$refs.audioEle.play()"
      @pause-play-song="$refs.audioEle.pause()"
      @prev-song="prevSong"
      @next-song="nextSong"
      @Delete-music="Deletemusic"
    ></PlayMusic>
  </div>
</template>

<script>
import PlayMusic from "./components/PlayMusic.vue";

export default {
  components: {
    PlayMusic,
  },
  data: function () {
    return {
      song: null,
      playing: false,
      currentid: null,

      duration: 0,
      currentTime: 0,

      showPlayMusic: true,

      playedSongs: [], // 存储歌曲ID
    };
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(newPath) {
        this.showPlayMusic = newPath !== "/SongDetails";
      },
    },
  },

  computed: {
    audioSrc() {
      // 检查 song.id 是否存在，如果存在，则返回对应的音频 URL
      return this.song && this.song.id
        ? `https://music.163.com/song/media/outer/url?id=${this.song.id}.mp3`
        : "";
    },
    newSoundMarginBottom() {
      // 如果 audioSrc 有值，说明有 id 传入，返回 '70px'
      return this.audioSrc ? "70px" : "0";
    },
  },
  methods: {
    playsong(song) {
      // console.log("11", song);
      console.log(song);

      this.song = song; // 更新 song
      this.currentid = song ? song.id : null;
      //  console.log("Song object:", song);

      this.saveSongToPlayedList(song);
    },
    saveSongToPlayedList(song) {
      // 检查是否已经存在相同 ID 的歌曲
      const isDuplicate = this.playedSongs.some(
        (playedSong) => playedSong.id === song.id
      );

      if (!isDuplicate) {
        this.playedSongs.push(song);
        localStorage.setItem("playedSongs", JSON.stringify(this.playedSongs));
      }
    },
    loadPlayedSongs() {
      const storedSongs = localStorage.getItem("playedSongs");
      if (storedSongs) {
        this.playedSongs = JSON.parse(storedSongs);
      }
    },

    // 上一曲下一曲
    prevSong() {
      const currentIndex = this.playedSongs.findIndex(
        (song) => song.id === this.currentid
      );
      if (currentIndex > 0) {
        const prevSong = this.playedSongs[currentIndex - 1];
        this.playsong(prevSong);
      }
    },
    nextSong() {
      const currentIndex = this.playedSongs.findIndex(
        (song) => song.id === this.currentid
      );
      if (currentIndex < this.playedSongs.length - 1) {
        const nextSong = this.playedSongs[currentIndex + 1];
        this.playsong(nextSong);
      }
    },

    Deletemusic(songId) {
      console.log("删除：", songId);
      
      // 使用 filter 方法过滤掉需要删除的歌曲
      this.playedSongs = this.playedSongs.filter((song) => song.id !== songId);

      // 更新 localStorage
      localStorage.setItem("playedSongs", JSON.stringify(this.playedSongs));

      // 检查当前播放的歌曲是否被删除
      if (this.currentid === songId) {
        this.$refs.audioEle.pause();
        this.playing = false;
        this.song = null;
        this.currentid = null;
      }
    },
  },
  created() {
    this.loadPlayedSongs();
  },
};
</script>

<style  lang="less">
#app {
  background-color: #f5f5f5;

  audio {
    // opacity: 0;
    display: none;
  }

  nav {
    width: 100%;
    display: flex;
    justify-content: space-around;
    background-color: white;

    border: 1px solid #cccccc59;

    padding: 20px 0;
    z-index: 100;
    position: fixed;
    top: 0;

    a {
      font-size: 20px;
      color: black;
      text-decoration: none;

      &.router-link-exact-active {
        color: #ff6600;
        border-bottom: 1px solid #ff6600;
      }
    }
  }
}
</style>
