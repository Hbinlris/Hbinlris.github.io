  <!-- Bookshelf 书架 -->
<template>
  <div class="Bookshelf">
    <div class="title">
      <div class="name">书架</div>
    </div>
    <div class="addshelf" v-if="shelf.length > 0">
      <div class="books" v-for="addshelf in shelf" :key="addshelf.id">
        <van-image
        class="img"
          :src="addshelf.cover"
          alt=""
          @click="gotoBookContents(addshelf.id)"
        />

        <div class="btn">
          <div class="bookstitle">{{ addshelf.title }}</div>

          <van-icon name="ellipsis" class="ellipsis" @click="showPopup" />

          <van-popup
            class="van-popup"
            v-model="show"
            position="bottom"
            :style="{ height: '10%' }"
            round
          >
            <div
              class="bookDetails"
              @click="bookDetails(addshelf.id, addshelf.cover)"
            >
              详情
            </div>
            <div class="deletebook" @click="deletebook(addshelf.id)">删除</div>
          </van-popup>
        </div>
      </div>
    </div>

    <div class="empty" v-else>空空如也</div>
  </div>
</template>

<script>
import { shelf, tableOfContentsChapters } from "@/api/axios";

export default {
  data() {
    return {
      // 书架
      shelf: [],

      show: false,
    };
  },
  methods: {
    showPopup() {
      this.show = true;
    },

    // 删除书籍
    deletebook(bookid) {
      // 从 localStorage 获取现有的书架列表
      let bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
      console.log("bookshelf", bookshelf);

      // 查找当前书籍在本地的索引
      const bookIndex = bookshelf.findIndex((book) => book.id === bookid);
      console.log("bookIndex", bookIndex);

      if (bookIndex !== -1) {
        bookshelf.splice(bookIndex, 1);
        localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
        this.shelf = this.shelf.filter((book) => book.id !== bookid); // 更新本地书架数据
      }
    },

    // 跳转详情页
    bookDetails(bookid, cover) {
      this.$router.push({
        path: "/bookDetails",
        query: {
          id: bookid,
          cover: cover,
        },
      });
    },

    // 跳转章节
    gotoBookContents(bookid) {
      // console.log("gotoBookContents", bookid);

      // 从 localStorage 获取当前书籍的章节列表
      // 从 localStorage 获取当前书籍的章节列表
      const bookChapterIds =
        JSON.parse(localStorage.getItem("bookChapterIds")) || {};
        console.log("bookChapterIds", bookChapterIds);
        
      let content_uuid = null;

      if (bookChapterIds[bookid] && bookChapterIds[bookid].length > 0) {
        // 如果存在当前书籍的章节ID，则使用最新的章节ID
        content_uuid =
          bookChapterIds[bookid][bookChapterIds[bookid].length - 1];
      }

      if (content_uuid) {
        this.$router.push({
          path: "/BookContents",
          query: {
            source_uuid: bookid,
            content_uuid: content_uuid,
          },
        });
      } else {
        // 如果不存在当前书籍的章节ID，则跳转到第一章节
        console.log("当前书籍的章节ID不存在，跳转到第一章节");

        tableOfContentsChapters(bookid).then((res) => {
          let firstChapterContentUuid = null;

          if (res.data.ncx.navMap.navPoint) {
            if (
              res.data.ncx.navMap.navPoint.navPoint &&
              Array.isArray(res.data.ncx.navMap.navPoint.navPoint)
            ) {
              firstChapterContentUuid =
                res.data.ncx.navMap.navPoint.navPoint[0].id;
            } else if (Array.isArray(res.data.ncx.navMap.navPoint)) {
              firstChapterContentUuid = res.data.ncx.navMap.navPoint[0].id;
            }
          }

          if (firstChapterContentUuid) {
            this.$router.push({
              path: "/BookContents",
              query: {
                source_uuid: bookid,
                content_uuid: firstChapterContentUuid,
              },
            });
          }
        });
      }
    },
  },

  created() {
    // 从 localStorage 获取书架列
    const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    // console.log("bookshelf", bookshelf);

    // 从 bookshelf 数组中提取所有书籍的 id 和 type
    const ids = bookshelf.map((book) => ({ id: book.id, type: book.type }));
    // console.log("ids11", ids);

    // 调用 shelf 方法从本地获取书籍数据
    shelf(ids).then((res) => {
      // console.log("书架", res.data.data.list);
      this.shelf = res.data.data.list;
    });
  },
};
</script>

<style lang="less"  scoped>
.Bookshelf {
  padding: 0 10px;

  .empty {
    text-align: center;
    font-size: 20rem;
    position: fixed;
    left: 40%;
    top: 50%;
  }

  .title {
    // background-color: aqua;
    padding: 15px 0;
    .name {
      padding-right: 10px;
      font-weight: bold;
    }
  }

  .addshelf {
    display: flex;
    flex-wrap: wrap;
    gap: 10rem;
    margin-bottom: 60rem;
    .books {
      width: 30vw;
      margin-top: 20px;

      .img {
        width: 30vw;
        height: 40vw;

        margin-bottom: 5px;
        box-shadow: 0 0 5px 1px #cccc;
      }
      .btn {
        display: flex;

        // background-color: antiquewhite;
        height: 5vh;
        justify-content: space-between;
        // flex-wrap: wrap;
        align-items: center;

        .bookstitle {
          width: 25vw;
          font-size: 13rem;
          font-weight: bold;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* 设置显示的行数 */
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }

        .ellipsis {
          transform: rotate(90deg);
        }

        .van-popup {
          display: flex;
          align-items: center;
          justify-content: space-around;

          .bookDetails {
            width: 40vw;
            height: 5vh;

            background-color: #cccccc45;
            border-radius: 10rem;

            text-align: center;
            line-height: 5vh;
            transition: background-color 1s, color 1s; /* 过渡效果 */
            &:hover {
              background-color: #c92929c7;
              color: white;
            }
          }

          .deletebook {
            width: 40vw;
            height: 5vh;

            background-color: #cccccc45;
            border-radius: 10rem;

            text-align: center;
            line-height: 5vh;
            transition: background-color 1s, color 1s; /* 过渡效果 */
            &:hover {
              background-color: #c92929c7;
              color: white;
            }
          }
        }
      }
    }
  }
}
</style>

