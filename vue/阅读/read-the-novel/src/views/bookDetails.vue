  <!-- bookDetails 书籍详情-->

<template>
  <div class="bookDetails" v-if="$route.meta.detail">
    <div class="return iconfont icon-fanhui" @click="$router.go(-1)"></div>
    <div class="bookDetails-container" v-if="bookDetail">
      <!-- 图片，名字，书名 -->
      <div class="title">
        <van-image class="img" :src="bookCover" alt="" />
        <div class="bookstitle">
          <div class="booksname">{{ bookDetail.feed.entry.title }}</div>
          <div class="name">
            {{ `${bookCategory}|${bookDetail.feed.entry.author.name}` }}
          </div>
          <div class="WordCount">
            <span>{{ bookExtra }}</span>
            <span>{{ bookclicksCount }}</span>
          </div>
        </div>
      </div>

      <!-- 简介 -->
      <div class="SimpleSeashell">
        <p :class="{ 'no-ellipsis': Retract }" @click="retract">
          {{ bookDetail.feed.entry.summary }}
        </p>
        <div v-show="Retract" class="authorization">
          <p v-if="bookAuthorizer">授权方：{{ bookAuthorizer }}</p>
          <p>作品类型：{{ bookPaydesc }}</p>
        </div>

        <!-- 最新章节 -->
        <div class="chapter" @click="gotoDirectory(bookId, bookCover)">
          <div>{{ latestArticleTitle }}</div>
          <div>&gt;</div>
        </div>
      </div>
    </div>

    <!-- 评论 -->

    <div class="comments">
      <div class="title">
        <div class="title-txt">
          <span></span>
          评论
        </div>
      </div>
      <div
        class="comments-container"
        v-for="comment in comments"
        :key="comment.commentId"
      >
        <van-skeleton title avatar :row="3" :loading="loading">
          <van-image class="img" :src="comment.avatar" alt="" />
          <div class="reight">
            <div class="name">{{ comment.nickName }}</div>
            <div class="time">{{ formatDate(comment.time) }}</div>
            <div class="text">{{ comment.comment }}</div>
          </div>
        </van-skeleton>
      </div>
    </div>
    <!-- 加入书架，试读 -->
    <div class="bookDetails-bottom">
      <div
        class="addBookshelf"
        @click="delBookshelf(id, type)"
        v-if="bookshelf"
      >
        已加入书架
      </div>
      <div class="addBookshelf" @click="addBookshelf(id, type)" v-else>
        加入书架
      </div>
      <div class="read" @click="gotoBookContents">试读</div>
    </div>
  </div>
</template>

<script>
import {
  bookDetails,
  latestChapters,
  tableOfContentsChapters,
  comment,
} from "@/api/axios";

export default {
  data() {
    return {
      bookId: null,
      bookTitle: null,
      bookDetail: null,
      bookCover: null,
      bookCategory: null,

      bookExtra: null,
      bookclicksCount: null,

      Retract: false,

      bookAuthorizer: null,
      bookPaydesc: null,

      id: null,
      type: null,

      latestArticleTitle: null,

      firstChapterContentUuid: null, // 存储第一章的 content_uuid
      bookChapterIds: {}, // 章节 ID

      //初始化 bookshelf 状态
      bookshelf: false,

      comments: [],

      loading: true,
    };
  },

  mounted() {
    this.loading = false;
  },

  watch: {},
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始计数，所以加1
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}年${month}月${day}日`;
    },
    // 切换
    retract() {
      this.Retract = !this.Retract;
    },

    // 点击进目录
    gotoDirectory(bookId, bookCover) {
      console.log("gotoDirectory", bookId, bookCover);

      this.$router.push({
        path: "/bookDetailsDirectory",
        query: {
          tocId: bookId,
          tocCover: bookCover,
          tocname: this.bookDetail.feed.entry.author.name,
          docTitle: this.bookDetail.feed.entry.title,
        },
      });
    },

    // 点击进章节
    gotoBookContents() {
      // 根据 bookChapterIds 获取第一个章节的 content_uuid
      if (
        this.bookChapterIds[this.id] &&
        this.bookChapterIds[this.id].length > 0
      ) {
        this.content_uuid = this.bookChapterIds[this.id][0];
      } else if (this.firstChapterContentUuid) {
        this.content_uuid = this.firstChapterContentUuid;
      } else {
        console.error("第一章内容未找到 UUID.");
        return;
      }

      this.$router.push({
        path: "/BookContents",
        query: {
          source_uuid: this.bookId,
          content_uuid: this.content_uuid,
        },
      });
    },

    // 加入书架
    addBookshelf(id, type) {
      console.log("加入书架", id, type);
      // 从 localStorage 获取现有的书架列表
      let bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];

      // 创建一个对象，包含 id 和 type 属性
      const book = { id: id, type: type };
      console.log("加入书架", book);

      // 检查书架列表中是否已存在相同 id 和 type 的书籍
      const exists = bookshelf.some(
        (b) => b.id === book.id && b.type === book.type
      );
      if (!exists) {
        bookshelf.push(book);
        localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
        console.log("书架列表已更新", bookshelf);

        this.bookshelf = true;
      } else {
        console.log("这本书已经在书架上了");
      }

      // 将当前章节的 ID 添加到对应书的章节 ID 数组中
      if (!this.bookChapterIds[id]) {
        this.bookChapterIds[id] = [];
      }
      if (!this.bookChapterIds[id].includes(this.firstChapterContentUuid)) {
        this.bookChapterIds[id].push(this.firstChapterContentUuid);
      }

      // 保存章节 ID 对象到 localStorage
      localStorage.setItem(
        "bookChapterIds",
        JSON.stringify(this.bookChapterIds)
      );
    },

    // 删除书籍
    delBookshelf(id, type) {
      console.log("删除书籍", id, type);

      // 从 localStorage 获取现有的书架列表
      let bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];

      // 查找书架中是否有匹配 id 和 type 的书籍
      const index = bookshelf.findIndex(
        (book) => book.id === id && book.type === type
      );
      if (index !== -1) {
        // 如果找到匹配的书籍
        bookshelf.splice(index, 1); // 移除书籍
        localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
        console.log("书架列表已更新", bookshelf);

        this.bookshelf = false;
      } else {
        console.log("这本书不在书架上");
      }

      // 删除书籍的章节 ID 数组
      delete this.bookChapterIds[id];

      // 保存章节 ID 对象到 localStorage
      localStorage.setItem(
        "bookChapterIds",
        JSON.stringify(this.bookChapterIds)
      );
    },
  },
  created() {
    // 获取 URL 中的 query 参数
    this.bookId = this.$route.query.id;
    this.bookTitle = this.$route.query.title;
    this.bookCover = this.$route.query.cover;
    this.bookExtra = this.$route.query.extra;

    comment(this.bookId).then((res) => {
      console.log("评论数据", res.data.all.list);
      this.comments = res.data.all.list;
    });

    // 使用获取到的参数调用 API 获取书籍详情
    if (this.bookId) {
      bookDetails(this.bookId)
        .then((res) => {
          console.log(res.data.feed);
          this.bookDetail = res.data;
          // 书籍分类
          this.bookCategory = res.data.feed.entry["pris:book"].category;
          // 点击次数
          this.bookclicksCount =
            res.data.feed.entry["pris:subscribe"].clicksCount;
          // 授权方
          this.bookAuthorizer = res.data.feed.entry["pris:book"].authorizer;
          // 作品类型
          this.bookPaydesc = res.data.feed.entry["pris:book"].paydesc;

          // 书籍id
          this.id = res.data.feed.entry.id;
          console.log("id", this.id);
          // 书籍类型
          this.type = res.data.feed.entry["pris:entry_status"].type;
          console.log("type", this.type);

          // 检查当前书籍是否已加入书架
          let bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
          console.log("书籍本地数据", bookshelf);
          // 检查书架中是否存在相同 id 和 type 的书籍
          const exists = bookshelf.some(
            (book) => book.id === this.id && book.type === this.type
          );
          if (exists) {
            this.bookshelf = true;
          } else {
            this.bookshelf = false;
          }
        })
        .catch((error) => {
          console.error("Error fetching book details:", error);
        });

      // 最新章节
      latestChapters(this.bookId).then((res) => {
        console.log("112", res.data.item, this.bookId);
        this.latestArticleTitle = res.data.item.latestArticleTitle;
        console.log("latestArticleTitle", this.latestArticleTitle);
      });

      // 获取书籍目录并找到第一章的 content_uuid
      tableOfContentsChapters(this.bookId).then((res) => {
        if (res.data.ncx.navMap.navPoint) {
          if (
            res.data.ncx.navMap.navPoint.navPoint &&
            Array.isArray(res.data.ncx.navMap.navPoint.navPoint)
          ) {
            this.firstChapterContentUuid =
              res.data.ncx.navMap.navPoint.navPoint[0].id;
          } else if (Array.isArray(res.data.ncx.navMap.navPoint)) {
            this.firstChapterContentUuid = res.data.ncx.navMap.navPoint[0].id;
          }
        }
      });
    }

    // 从 localStorage 中读取章节 ID 对象
    const savedBookChapterIds = localStorage.getItem("bookChapterIds");
    if (savedBookChapterIds) {
      this.bookChapterIds = JSON.parse(savedBookChapterIds);
    }
  },
};
</script>

<style lang="less" scoped>
.bookDetails {
  // height: 100vh;
  background-color: #80808040;
  .return {
    padding: 0 15px;
    position: sticky;
    top: 0;
    border-bottom: 1px solid #cccccc3d;
    background-color: white;
  }
  .icon-fanhui {
    font-size: 30rem;
  }

  .bookDetails-container {
    padding-top: 5px;
    padding: 0 15px;
    background-color: white;
    .title {
      display: flex;
      .img {
        width: 30vw;
      }
      .bookstitle {
        margin: 0 20px;
        .booksname {
          font-weight: bold;
          margin: 5px 0;
        }
        .name {
          font-size: 12rem;
          color: #ccc;
          letter-spacing: 2.5rem;
          margin: 5px 0;
        }
      }
      .WordCount {
        font-size: 12rem;
        color: #ccc;
        margin: 5px 0;
        span {
          margin-right: 20px;
        }
      }
    }

    .SimpleSeashell {
      color: #7b7b7b;

      p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; /* 设置显示的行数 */
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .no-ellipsis {
        display: block;
        -webkit-box-orient: initial;
        -webkit-line-clamp: initial;
        overflow: visible;
        text-overflow: clip;
      }

      .authorization {
        font-size: 12rem;
        letter-spacing: 2.5rem;
        margin: 5px 0;
      }

      .chapter {
        border-top: 1px solid #ccc;
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .comments {
    margin-top: 15px;
    margin-bottom: 60rem;
    background-color: white;

    .title {
      padding-left: 15px;
      padding: 10px;

      .title-txt {
        display: flex;
        align-items: center;
        span {
          width: 4px;
          height: 20px;
          background-color: #00000082;
          display: block;
          border-radius: 50rem;
          margin-right: 5px;
        }
        font-size: 20rem;
      }
    }
    .comments-container {
      padding: 15px;
      display: flex;

      .img {
        width: 40rem;
        height: 40rem;
        border-radius: 50rem;
      }
      .reight {
        margin: 0 20rem;
        .name {
          color: lightskyblue;
          font-size: 15rem;
          margin-bottom: 5rem;
        }
        .time {
          font-size: 12rem;
          margin-bottom: 5rem;
        }
        .text {
          font-size: 15rem;
        }
      }
    }
  }

  .bookDetails-bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    height: 8vh;
    background-color: white;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;

    .addBookshelf {
      width: 50vw;
      padding: 20px 0;

      background-color: white;
      text-align: center;
      color: black;
    }
    .read {
      width: 50vw;
      padding: 20px 0;

      background-color: red;
      text-align: center;
      color: white;
    }
  }
}
</style>
