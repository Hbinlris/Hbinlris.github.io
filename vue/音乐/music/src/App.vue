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
      @start-play-song="startPlaying()"
      @pause-play-song="pausePlaying()"
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
      @start-play-song="startPlaying()"
      @pause-play-song="pausePlaying()"
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
      currentIndex: -1,
    };
  },
  watch: {
    "$route.path": {
      // 执行一次 handler
      immediate: true,
      handler(newPath) {
        // 根据新路径更新 showPlayMusic 的值
        this.showPlayMusic = newPath !== "/SongDetails";
        if (this.showPlayMusic && this.$refs.audioEle) {
          this.$refs.audioEle.load(); // 重新加载音频
        }
        // this.handleRouteChange(this.$route, { path: "/SongDetails" });
      },
    },
  },
  computed: {
    audioSrc() {
      // 根据当前歌曲的 ID 构建音频源 URL
      return this.song && this.song?.id
        ? `https://music.163.com/song/media/outer/url?id=${this.song?.id}.mp3`
        : "";
    },
    newSoundMarginBottom() {
      // 根据是否有音频源 URL 动态设置底部边距
      return this.audioSrc ? "70px" : "0";
    },
  },
  methods: {
    startPlaying() {
      if (this.$refs.audioEle) {
        console.log(this.$refs.audioEle);
        this.$refs.audioEle.play();
      } else {
        console.error("audioEle 未定义");
      }
    },
    pausePlaying() {
      if (this.$refs.audioEle) {
        console.log(this.$refs.audioEle);
        this.$refs.audioEle.pause();
      } else {
        console.error("audioEle 未定义");
      }
    },

    // 播放音乐的方法 更新当前播放的状态
    playsong(song) {
      console.log(`使用 id 播放歌曲: ${song?.id}`);
      // 更新 song
      this.song = song;
      // 更新当前歌曲的 ID
      this.currentid = song ? song?.id : null;

      // 将歌曲保存到播放列表
      this.saveSongToPlayedList(song);

      // 在播放新歌曲时更新 currentIndex
      if (
        this.currentIndex === -1 ||
        this.playedSongs[this.currentIndex]?.id !== song?.id
      ) {
        this.updateCurrentIndex(song?.id);
      }
    },
    // 将歌曲保存到播放列表
    saveSongToPlayedList(song) {
      // 检查播放列表中是否已存在该歌曲
      const isDuplicate = this.playedSongs.some(
        (playedSong) => playedSong?.id === song?.id
      );
      // 不存在则将歌曲添加到播放列表，并保存到本地存储
      if (!isDuplicate) {
        this.playedSongs.push(song);
        localStorage.setItem("playedSongs", JSON.stringify(this.playedSongs));
      }
    },
    // 加载播放列表
    loadPlayedSongs() {
      // 从本地存储中获取已播放的歌曲列表
      const storedSongs = localStorage.getItem("playedSongs");
      if (storedSongs) {
        // 如果存在已播放的歌曲列表，将其解析并赋值给 this.playedSongs
        this.playedSongs = JSON.parse(storedSongs);
      }
    },

    // 更新当前歌曲索引
    updateCurrentIndex(songId) {
      // 查找播放列表中与 songId 匹配的歌曲索引
      const index = this.playedSongs.findIndex((song) => song?.id === songId);
      console.log(`查找 songId 的索引 ${songId}:`, index);
      if (index !== -1) {
        // 如果找到匹配的歌曲，更新当前索引
        this.currentIndex = index;
        // 将当前索引保存到本地存储
        localStorage.setItem("currentIndex", JSON.stringify(this.currentIndex));
        console.log(`currentIndex 更新为: ${this.currentIndex}`);
      } else {
        console.log(`id 为 ${songId} 在 playedSongs 中找不到`);
      }
    },

    // 上一首
    prevSong() {
      // 查找当前播放歌曲在播放列表中的索引
      const currentIndex = this.playedSongs.findIndex(
        (song) => song?.id === this.currentid
      );
      // 如果当前索引大于 0，表示有上一首歌曲
      if (currentIndex > 0) {
        // 获取上一首歌曲
        const prevSong = this.playedSongs[currentIndex - 1];
        // 播放上一首歌曲
        this.playsong(prevSong);
      }
    },

    // 下一首
    nextSong() {
      // 查找当前播放歌曲在播放列表中的索引
      const currentIndex = this.playedSongs.findIndex(
        (song) => song?.id === this.currentid
      );
      // 如果当前索引小于播放列表长度减 1，表示有下一首歌曲
      if (currentIndex < this.playedSongs.length - 1) {
        // 获取下一首歌曲
        const nextSong = this.playedSongs[currentIndex + 1];
        // 播放下一首歌曲
        this.playsong(nextSong);
      } else {
        // 如果没有下一首歌曲，循环播放第一首歌曲
        const firstSong = this.playedSongs[0];
        this.playsong(firstSong);
      }
    },
    // 删除
    Deletemusic(songId) {
      console.log("删除：", songId);
      // 过滤掉要删除的歌曲
      this.playedSongs = this.playedSongs.filter((song) => song?.id !== songId);
      // 更新本地存储中的播放列表
      localStorage.setItem("playedSongs", JSON.stringify(this.playedSongs));
      // 如果当前播放的歌曲是要删除的歌曲
      if (this.currentid === songId) {
        // 暂停音频播放
        this.$refs.audioEle.pause();
        // 设置播放状态为停止
        this.playing = false;
        // 清空当前歌曲信息
        this.song = null;
        this.currentid = null;

        // 如果播放列表中还有其他歌曲
        if (this.playedSongs.length > 0) {
          // 重新计算 currentIndex
          this.currentIndex = Math.max(0, this.currentIndex - 1);

          // 如果当前索引小于播放列表长度减 1，表示有下一首歌曲
          if (this.currentIndex < this.playedSongs.length - 1) {
            // 获取下一首歌曲
            const nextSong = this.playedSongs[this.currentIndex + 1];
            // 播放下一首歌曲
            this.playsong(nextSong);
          } else {
            // 如果没有下一首歌曲，循环播放第一首歌曲
            const firstSong = this.playedSongs[0];
            this.playsong(firstSong);
          }
        } else {
          // 如果播放列表为空，停止播放
          this.stopPlaying();
        }
      }
    },
    // 停止
    stopPlaying() {
      // 暂停音频播放
      this.$refs.audioEle.pause();
      // 设置播放状态为停止
      this.playing = false;
      // 清空当前歌曲信息
      this.song = null;
      // 清空当前歌曲 ID
      this.currentid = null;
    },
  },

  mounted() {
    // 如果播放列表中有歌曲且当前索引不为 -1，则播放当前索引的歌曲
    if (this.playedSongs.length > 0 && this.currentIndex !== -1) {
      this.playsong(this.playedSongs[this.currentIndex]);
    }
    // 如果播放列表中有歌曲但当前索引为 -1，则播放第一首歌曲
    else if (this.playedSongs.length > 0) {
      const firstSong = this.playedSongs[0];
      if (firstSong) {
        this.currentid = firstSong?.id;
        this.playsong(firstSong);
      }
    }
  },
  created() {
    // 加载本地存储中的播放列表
    this.loadPlayedSongs();

    console.log("playedSongs 加载：", this.playedSongs);

    // 从本地存储中获取当前索引
    const storedIndex = localStorage.getItem("currentIndex");
    console.log("storedIndex 来自 localStorage:", storedIndex);
    // 如果存在存储的当前索引，则解析并设置当前索引
    if (storedIndex) {
      this.currentIndex = JSON.parse(storedIndex);
      console.log("currentIndex 设置为：", this.currentIndex);
    }
    // 如果没有存储的当前索引，则将当前索引设置为 -1
    else {
      console.log("在 localStorage 中找不到 currentIndex，设置为 -1");
      this.currentIndex = -1;
    }

    // 尝试从 URL 参数中获取歌曲 ID
    const songIdFromUrl = this.$route.query.id;
    
    // 检查是否在无痕模式下访问，即没有本地存储数据
    if (songIdFromUrl) {
      // 如果在无痕模式下访问，使用 URL 中的歌曲 ID
      this.song = { id: songIdFromUrl };
      this.currentid = songIdFromUrl;
    } else if (this.playedSongs.length > 0 && this.currentIndex !== -1) {
      // 如果播放列表中有歌曲且当前索引不为 -1，则播放当前索引的歌曲
      this.playsong(this.playedSongs[this.currentIndex]);
    } else if (this.playedSongs.length > 0) {
      // 如果播放列表中有歌曲但当前索引为 -1，则播放第一首歌曲
      const firstSong = this.playedSongs[0];

      if (firstSong) {
        this.currentid = firstSong.id;
        this.playsong(firstSong);
      }
    }
  },
};
</script>

<style  lang="less" scoped>
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
