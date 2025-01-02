<!-- bookDetailsDirectory 目录-->

<template>
  <div class="bookDetailsDirectory">
    <div class="bigtitle">
      <div class="iconfont icon-fanhui" @click="$router.go(-1)"></div>
      <!-- 标题 -->
      <div class="title">
        <van-image class="img" :src="tocCover" alt="" />

        <div class="Directorytitle">
          <div class="bookstitle">{{ docTitle }}</div>
          <div class="booksname">{{ tocname }}</div>
        </div>
      </div>

      <!-- 总章节数 -->
      <div class="number">
        <div class="num">共{{ number }}章</div>
        <div class="positiveAndNegative" @click="positiveAndNegative">
          <span v-if="Negative">正序</span>
          <span v-else>倒序</span>
        </div>
      </div>
    </div>

    <div class="DirectoryChapter">
      <!-- 正文 -->
      <div class="chapter" :style="{ display: navLabel ? 'block' : 'none' }">
        <div class="bodywen">{{ navLabel }}</div>
      </div>
      <!-- 章节 -->
      <div
        class="essay"
        v-for="(chaptersname, index) in chaptername"
        :key="index"
      >
        <div
          class="chaptername"
          @click="gotoBookContents(tocId, chaptersname.id)"
        >
          {{ chaptersname.navLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tableOfContentsChapters } from "@/api/axios";

export default {
  data() {
    return {
      tocId: null,
      id: null,
      tocCover: null,
      tocname: null,
      docTitle: null,
      number: null,

      navLabel: null,

      // 章节列表
      chaptername: [],

      Negative: false,
    };
  },

  created() {
    this.tocId = this.$route.query.tocId;
    this.tocCover = this.$route.query.tocCover;
    this.tocname = this.$route.query.tocname;
    this.docTitle = this.$route.query.docTitle;

    console.log(
      "tocId",
      this.tocId,
      this.tocCover,
      this.tocname,
      this.docTitle
    );

    if (this.tocId) {
      tableOfContentsChapters(this.tocId).then((res) => {
        console.log("章节", res.data.ncx);

        if (res.data.ncx.navMap.navPoint) {
          if (Array.isArray(res.data.ncx.navMap.navPoint)) {
            this.number = res.data.ncx.navMap.navPoint.length;
          } else if (
            res.data.ncx.navMap.navPoint.navPoint &&
            Array.isArray(res.data.ncx.navMap.navPoint.navPoint)
          ) {
            this.number = res.data.ncx.navMap.navPoint.navPoint.length;
          }
        }

        // 章节
        // 判断是否有navPoint
        if (res.data.ncx.navMap.navPoint) {
          // 有的话判断是否有navPoint.navPoint
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
            console.log("带有嵌套 navPoint 的 chaptername", this.chaptername);
            this.id = this.chaptername.map((chapter) => chapter.id);
            // console.log("navPoint.navPoint", this.chaptername);
          } else if (Array.isArray(res.data.ncx.navMap.navPoint)) {
            this.chaptername = res.data.ncx.navMap.navPoint.map((chapter) => ({
              ...chapter,
              navLabel: chapter.navLabel.replace(/,/g, ""),
            }));
            console.log(
              "没有嵌套 navPoint 的 chaptername",
              this.chaptername
            ); // 调试输出
            this.id = this.chaptername.map((chapter) => chapter.id);
            // console.log("navPoint", this.chaptername);
          }
        }

        
        // 检查 navLabel 是否存在，并且是字符串类型
        const navLabel = res.data.ncx.navMap.navPoint.navLabel;
        if (navLabel && typeof navLabel === "string") {
          this.navLabel = navLabel.replace(/,/g, "");
        }
      });
    }
  },
  methods: {
    gotoBookContents(tocId, id) {
      this.$router.push({
        path: "/BookContents",
        query: {
          source_uuid: tocId,
          content_uuid: id,
        },
      });
    },

    positiveAndNegative() {
      this.Negative = !this.Negative;
      this.sortChapters(); // 调用排序方法
      console.log("this.Negative", this.Negative);
    },

    sortChapters() {
      if (this.chaptername) {
        if (this.Negative) {
          // 如果 Negative 为 true，倒序排序
          this.chaptername.sort((a, b) => b.index - a.index);
          console.log("chaptername11", this.chaptername);
        } else {
          // 如果 Negative 为 false，正序排序
          this.chaptername.sort((a, b) => a.index - b.index);
          console.log("chaptername22", this.chaptername);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.bookDetailsDirectory {
  .bigtitle {
    padding: 0 15px;
    background-color: white;
    position: sticky;
    top: 0;

    .icon-fanhui {
      margin: 5px 0;
      font-size: 30rem;
    }
    .title {
      display: flex;
      .img {
        width: 30vw;
        height: 40vw;
      }
      .Directorytitle {
        margin-left: 35px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        .bookstitle {
          margin-bottom: 15px;
        }
        .booksname {
          font-size: 12rem;
          color: #ccc;
        }
      }
    }
    .number {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .num {
        font-weight: bold;
      }
      .positiveAndNegative {
        // background-color: antiquewhite;
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 50px;
        width: 45rem;
        text-align: center;
        font-size: 15rem;
      }
    }
  }

  .DirectoryChapter {
    .chapter {
      background-color: #cccccc63;
      padding: 0 15px;

      .bodywen {
        font-size: 12rem;
        font-weight: bold;
        padding: 3px 0;
        color: #8b8b8b;
      }
    }
    .essay {
      padding: 0 15px;
      .chaptername {
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        font-size: 14rem;
        letter-spacing: 2.5rem;
      }
    }
  }
}
</style>
