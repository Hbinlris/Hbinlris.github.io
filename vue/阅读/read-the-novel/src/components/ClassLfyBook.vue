<!-- ClassLfyBook 分类书籍-->

<template>
  <div class="ClassLfyBook">
    <div
      class="ClassLfyBook-container"
      v-for="Books in ClassLfyBooks"
      :key="Books.id"
      @click="gotobookDetails(Books.id, Books.title, Books.cover, Books.extra)"
    >
      <!-- 书籍封面图片 -->
      <van-image class="img" :src="Books.cover" alt="" />
      <div class="Bookstxt">
        <!-- 书籍标题 -->
        <div class="title">{{ Books.title }}</div>
        <!-- 作者名称 -->
        <div class="name">{{ Books.author }}</div>
      </div>
    </div>

    <bookDetails></bookDetails>
  </div>
  
</template>


<script>
import { fetchClassLfyBooks } from "@/api/axios";
import bookDetails from "@/views/bookDetails.vue";

export default {
  components: {
    bookDetails,
  },
  props: {
    catId: String,
  },

  // 组件的数据对象
  data() {
    return {
      ClassLfyBooks: [], // 书籍数据列表
    };
  },

  // 计算属性
  computed: {},

  // 组件创建后执行的操作
  created: function () {},

  // 方法定义
  methods: {
    // 根据筛选条件获取书籍数据
    fetchClassLfyBooks(catId) {
      // console.log("12321", catId);
      // if (!catId) {
      //   console.error("catId 未定义或 null");
      //   return;
      // }

      fetchClassLfyBooks(catId)
        .then((res) => {
          console.log("res123", res);

          this.ClassLfyBooks = res.data.list; // 更新书籍数据列表
          // console.log("ClassLfyBook", this.ClassLfyBooks);
        })
        .catch((error) => {
          console.error("提取书籍时出错:", error);
        });
    },
    // 书籍详情
    gotobookDetails(id, title, cover, extra) {
      // console.log("gotobookDetails", id, title, cover, extra);

      this.$router.push({
        path: "/bookDetails",
        query: {
          id: id,
          title: title,
          cover: cover,
          extra: extra,
        },
      });
    },
  },

  // 监听器
  watch: {
    catId: {
      handler(newVal) {
        // 当catId发生变化时，重新获取书籍数据
        this.fetchClassLfyBooks(newVal);
      },
      immediate: true, // 立即执行一次，确保在组件创建时也获取数据
    },
  },
};
</script>

<style lang="less" scoped>
.ClassLfyBook {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  padding-bottom: 60px;

  .ClassLfyBook-container {
    width: 30vw;
    .img {
      width: 30vw;
      height: 40vw;
    }
    .Bookstxt {
      .title {
        width: 30vw;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 显示两行 */
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 10px 0;
      }
      .name {
        font-size: 12rem;
        color: #999999;
        margin: 10px 0;
      }
    }
  }
}
</style>
