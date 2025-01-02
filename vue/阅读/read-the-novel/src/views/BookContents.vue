  <!-- BookContents 书籍内容-->
<template>
  <div
    class="BookContentsnav"
    :class="{ 'dark-theme': theme, 'light-theme': !theme }"
  >
    <!-- 文章 -->
    <div
      class="BookContents-n"
      @scroll="handleScroll"
      ref="scrollContainer"
      style="height: 100vh; overflow-y: auto"
      @click="onshow"
    >
      <div
        class="BookContents"
        :style="{ paddingTop: show ? '5px' : '0' }"
        v-if="content"
        v-html="content"
      ></div>
    </div>

    <!-- 返回 -->
    <div class="show" v-if="show" :class="{ 'dark-mode': theme }">
      <div class="return iconfont icon-fanhui" @click="$router.go(-1)"></div>
    </div>
    <!-- 上一章下一章 -->
    <div class="showtwo" v-if="show" :class="{ 'dark-mode': theme }">
      <div class="btn">
        <div class="top" @click="previousChapter">上一章</div>

        <div class="buttom-setUp" @click="changeTheme">
          <div class="handoff-night iconfont icon-yueliang" v-if="theme">
            <p>夜间</p>
          </div>
          <div class="handoff-day iconfont icon-taiyang" v-else>
            <p>日间</p>
          </div>
        </div>

        <div class="bottom" @click="NextChapter">下一章</div>
      </div>
    </div>
  </div>
</template>

<script>
import { BookContents, tableOfContentsChapters } from "@/api/axios";

export default {
  data() {
    return {
      source_uuid: null,
      content_uuid: null,

      content: null,
      id: null,
      chaptername: [], //章节列表
      // 新增章节 ID 对象
      bookChapterIds: {},

      currentChapterIndex: null,

      show: false,

      theme: false,
    };
  },

  created() {
    this.source_uuid = this.$route.query.source_uuid;
    this.content_uuid = this.$route.query.content_uuid;

    // 从 localStorage 中读取章节 ID 对象
    const savedBookChapterIds = localStorage.getItem("bookChapterIds");
    if (savedBookChapterIds) {
      this.bookChapterIds = JSON.parse(savedBookChapterIds);
    }

    // 从 localStorage 中读取当前章节的 id
    const savedChapterId = localStorage.getItem("currentChapterId");
    if (savedChapterId) {
      this.content_uuid = savedChapterId;
    }

    // 获取书籍内容
    BookContents(this.source_uuid, this.content_uuid).then((res) => {
      if (res && res.data && res.data.data) {
        this.content = res.data.data.content;
      } else {
        this.content = "请开vip";
      }
    });

    // 书籍目录
    tableOfContentsChapters(this.source_uuid).then((res) => {
      if (res.data.ncx.navMap.navPoint) {
        if (
          res.data.ncx.navMap.navPoint.navPoint &&
          Array.isArray(res.data.ncx.navMap.navPoint.navPoint)
        ) {
          this.chaptername = res.data.ncx.navMap.navPoint.navPoint.map(
            (chapter) => ({
              ...chapter,
              navLabel: chapter.navLabel.replace(/,/g, ""),
            })
          );
          this.id = this.chaptername.map((chapter) => chapter.id);
        } else if (Array.isArray(res.data.ncx.navMap.navPoint)) {
          this.chaptername = res.data.ncx.navMap.navPoint.map((chapter) => ({
            ...chapter,
            navLabel: chapter.navLabel.replace(/,/g, ""),
          }));
          this.id = this.chaptername.map((chapter) => chapter.id);
        }
      }

      // 找到最新的章节 ID
      let latestChapterId = null;
      if (
        this.bookChapterIds[this.source_uuid] &&
        this.bookChapterIds[this.source_uuid].length > 0
      ) {
        latestChapterId =
          this.bookChapterIds[this.source_uuid][
            this.bookChapterIds[this.source_uuid].length - 1
          ];
      }

      // 如果有最新的章节 ID，则加载该章节的内容
      if (latestChapterId) {
        this.content_uuid = latestChapterId;
      }

      this.currentChapterIndex = this.chaptername.findIndex(
        (chapter) => chapter.id === this.content_uuid
      );

      if (this.currentChapterIndex === -1) {
        console.log("在列表中找不到当前章节");
      } else {
        console.log("当前章节索引：", this.currentChapterIndex);

        // 加载当前章节的内容
        BookContents(this.source_uuid, this.content_uuid).then((res) => {
          
          if (res && res.data && res.data.data) {
            this.content = res.data.data.content;
          } else {
            
            this.content = "请开vip";
          }
        });
      }
    });
  },

  methods: {
    // 切换
    onshow() {
      this.show = !this.show;
      console.log(this.show);
    },
    // 白天晚上
    changeTheme() {
      this.theme = !this.theme;
      console.log(this.theme);
    },
    // 滚动
    handleScroll(event) {
      const element = event.target;
      // console.log("element", element);

      const scrollTop = element.scrollTop;
      // console.log("scrollTop", scrollTop);

      const scrollHeight = element.scrollHeight;
      // console.log("scrollHeight", scrollHeight);

      const clientHeight = element.clientHeight;
      // console.log("clientHeight", clientHeight);

      // 判断是否滚动到顶部
      if (scrollTop === 0) {
        this.previousChapter();
      }
      // 判断是否滚动到底部
      else if (scrollTop + clientHeight === scrollHeight) {
        this.NextChapter();
      }
    },

    //  下一章
    NextChapter() {
      if (
        this.currentChapterIndex !== null &&
        this.currentChapterIndex < this.chaptername.length - 1
      ) {
        this.currentChapterIndex++;
        this.loadChapter(this.currentChapterIndex);
        console.log("下一章", this.currentChapterIndex);
        
      }
    },

    // 上一章
    previousChapter() {
      if (this.currentChapterIndex !== null && this.currentChapterIndex > 0) {
        this.currentChapterIndex--;
        this.loadChapter(this.currentChapterIndex);
        console.log("上一章", this.currentChapterIndex);
        
      }
    },

    // 加载指定章节
    loadChapter(index) {
      setTimeout(() => {
        if (this.chaptername[index] && this.chaptername[index].id) {
          BookContents(this.source_uuid, this.chaptername[index].id).then(
            (res) => {
              this.content = res.data.data.content;
              this.$nextTick(() => {
                this.scrollToTop();
              });

              // 更新当前章节索引
              this.currentChapterIndex = index;

              // 将当前章节的 ID 添加到对应书的章节 ID 数组中
              if (!this.bookChapterIds[this.source_uuid]) {
                this.bookChapterIds[this.source_uuid] = [];
              }
              if (
                !this.bookChapterIds[this.source_uuid].includes(
                  this.chaptername[index].id
                )
              ) {
                this.bookChapterIds[this.source_uuid].push(
                  this.chaptername[index].id
                );
              }

              // 保存章节 ID 对象到 localStorage
              localStorage.setItem(
                "bookChapterIds",
                JSON.stringify(this.bookChapterIds)
              );
            }
          );
        }
      }, 300);
    },

    // 滚动到顶部
    scrollToTop() {
      setTimeout(() => {
        const container = this.$refs.scrollContainer;
        if (container) {
          container.scrollTop = 20;
        }
      }, 0);
    },
  },
};
</script>

<style lang="less" scoped>
.light-theme {
  background-color: white;
  color: black;
}

.dark-theme {
  background-color: black;
  color: white;
}

.BookContentsnav {
  .BookContents {
    margin: 50px 0;
    text-indent: 2em;
    padding: 0 15px;

    ::v-deep(h1) {
      text-align: center;
    }
  }
  .show {
    position: fixed;
    top: 0;
    background-color: white;

    width: 100vw;
    height: 15vw;
    z-index: 100;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .return {
      font-size: 30rem;
      // background-color: antiquewhite;
    }
  }
  .showtwo {
    position: fixed;
    bottom: 0;
    background-color: white;
    width: 100vw;
    height: 15vw;
    z-index: 100;
    .btn {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      align-items: center;
      .buttom-setUp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;

        // background-color: antiquewhite;

        .handoff-day {
          display: flex;
          flex-direction: column;
          text-align: center;
          p {
            font-size: 11rem;
            margin: 0;
          }
        }
        .icon-taiyang {
          font-size: 20rem;
        }
        .handoff-night {
          display: flex;
          flex-direction: column;
          text-align: center;
          p {
            font-size: 11rem;
            margin: 0;
          }
        }
        .icon-yueliang {
          font-size: 20rem;
        }
      }
    }
  }
  .show.dark-mode,
  .showtwo.dark-mode {
    background-color: black;
    color: white;
  }
}
</style>
