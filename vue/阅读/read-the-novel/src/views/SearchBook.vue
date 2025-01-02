 <!-- SearchBook 搜索 -->
<template>
  <div class="SearchBook">
    <div class="SearchBooks">
      <span class="iconfont icon-sousuo"></span>
      <input
        type="text"
        autofocus
        v-model="searchs"
        @keydown.enter="enter"
        @input="Stabilization"
      />
      <div @click="$router.go(-1)">取消</div>
    </div>

    <div class="outcome" v-if="books.length > 0">
      <div
        class="books"
        v-for="book in books"
        :key="book.id"
        @click="gotobookDetails(book.sourceUuid, book.iconUrl)"
      >
        <img v-lazy="book.iconUrl" alt="" />
        <div class="title-author">
          <div class="title">{{ book.title }}</div>
          <div class="author">{{ `${book.category}/${book.author}` }}</div>
          <div class="text" v-html="book.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { search } from "@/api/axios";
import _ from "lodash";

export default {
  data() {
    return {
      searchs: "",
      books: [],
    };
  },

  created() {
    // 防抖函数
    this.Stabilization = _.debounce(this.enter, 300);
  },
  methods: {
    enter() {
      const ipt = this.searchs.trim();
      if (ipt === "") {
        this.books=[];
        return;
      }

      search(this.searchs).then((res) => {
        console.log(res.data.data);
        this.books = res.data.data.books;
      });
    },

    gotobookDetails(sourceUuid, iconUrl) {
      this.$router.push({
        path: "/bookDetails",
        query: {
          id: sourceUuid,
          cover: iconUrl,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.SearchBook {
  height: 100vh;
  background-color: #8080803b;
  .SearchBooks {
    position: sticky;
    top: 0;
    padding: 3px 10px;
    background-color: white;

    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .icon-sousuo {
      position: absolute;
      bottom: 8px;
      left: 20px;
      font-size: 20rem;
      color: #ccc;
    }

    input {
      width: 70vw;
      background-color: #cacaca4f;
      padding: 5px 30px;
      border: 1px solid #ccc;
      border-radius: 50rem;
    }
  }

  .outcome {
    margin: 15px 0;
    background-color: white;
    padding: 15px;
    .books {
      display: flex;
      padding-bottom: 20rem;

      img {
        width: 20vw;
        box-shadow: 0 0 10px 2px #ccc;
        margin-right: 20rem;
      }
      .title-author {
        .title {
          font-weight: bold;
          margin-bottom: 5rem;
        }
        .author {
          color: #ccc;
          font-size: 12rem;
          letter-spacing: 2rem;
          margin-bottom: 15rem;
        }

        .text {
          font-size: 14rem;
          color: #838383;
          display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
          -webkit-box-orient: vertical; /* 从上到下垂直排列子元素 */
          -webkit-line-clamp: 2; /* 显示的行数，这里设置为3行 */
          overflow: hidden; /* 超出盒子宽度内容，便溢出隐藏 */
          text-overflow: ellipsis; /* 用...省略号显示 */
        }
      }
    }
  }
}
</style>
