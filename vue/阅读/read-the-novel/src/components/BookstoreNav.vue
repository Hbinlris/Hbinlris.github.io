
<!--BookstoreNav 书城导航 -->

<template>
  <div class="BookstoreNav">
    <nav>
      <div
        class="nav-Bookstore"
        v-for="boookstorenav in BookstoreNavs"
        :key="boookstorenav.id"
        @click="boookstorenavId(boookstorenav.url)"
        :class="{ active: nav === boookstorenav.url }"
      >
        {{ boookstorenav.name }}
      </div>
    </nav>
  </div>
</template>

<script>
import { BookstoreNav } from "@/api/axios";
export default {
  name: "BookstoreNav",

  props: {
    gender: {
      type: Number,
    },
  },

  watch: {
    gender(newGender) {
      this.fetchBookstoreNavs(newGender);
    },
  },

  data() {
    return {
      BookstoreNavs: [],
      nav: null,
    };
  },
  created() {
    this.fetchBookstoreNavs(this.gender);
  },

  methods: {
    boookstorenavId(url) {
      console.log("url1", url);
      this.$emit("BookstoreNavUrl", url);
      this.nav = url;
    },
    fetchBookstoreNavs(gender) {
      // 发起 API 请求
      BookstoreNav(gender)
        .then((res) => {
          this.BookstoreNavs = res.data.data.navi;
          console.log("书城导航", this.BookstoreNavs);

          if (this.BookstoreNavs.length > 0) {
            this.boookstorenavId(this.BookstoreNavs[0].url);
          }
        })

        .catch((error) => {
          console.error("加载书城导航失败:", error);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.BookstoreNav {
  background-color: white;
  border-bottom: 1px solid #cccccc29;
  padding: 10px 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  nav {
    display: flex;
    justify-content: space-between;
    .nav-Bookstore {
      &.active {
        color: red;
      }
    }
  }
}
</style>




