<!-- Bookstore 书城 -->
<template>
  <div class="BookStore">
    <nav>
      <div class="gender" @click="gender">
        <div class="iconfont icon-nan" v-if="bothSexes"></div>
        <div class="iconfont icon-nv" v-else></div>
      </div>

      <!-- SearchBook -->
      <div class="search" @click="gotoSearchBook">
        <input type="text" />
        <span class="iconfont icon-sousuo"></span>
      </div>
    </nav>

    <BookstoreNav
      :gender="genderNumber"
      @BookstoreNavUrl="BookstoreNavUrl"
    ></BookstoreNav>
    <BookstoreNavTwo :url="urlForNavTwo"></BookstoreNavTwo>
  </div>
</template>

<script>
import BookstoreNav from "../components/BookstoreNav.vue";
import BookstoreNavTwo from "../components/BookstoreNavTwo.vue";

export default {
  name: "BookStore",

  components: {
    BookstoreNav,
    BookstoreNavTwo,
  },
  data() {
    return {
      bothSexes: true,
      genderNumber: 1,

      urlForNavTwo: "",
    };
  },
  methods: {
    gender() {
      this.bothSexes = !this.bothSexes;
      this.genderNumber = this.bothSexes ? 1 : 2;
      console.log(this.genderNumber);
    },

    BookstoreNavUrl(url) {
      this.urlForNavTwo = url;
    },

    gotoSearchBook() {
      this.$router.push({
        path: "/SearchBook",
      });
    },
  },
};
</script>

<style lang="less"  scoped>
.BookStore {
  height: 100vh;

  nav {
    display: flex;
    justify-content: space-between;

    margin-top: 10px;
    // background-color: aliceblue;

    padding: 10px 15px;

    .gender {
      display: flex;
      width: 30rem;
      height: 30rem;
      border-radius: 50%;
      padding: 2px;

      background-color: white;
      .icon-nan {
        color: aqua;
        font-size: 30rem;
      }
      .icon-nv {
        color: pink;
        font-size: 28rem;
        font-weight: bold;
      }
    }

    .search {
      width: 80vw;
      display: flex;
      align-items: center;

      input {
        width: 70vw;
        height: 5vw;
        border: none;
        padding: 3px 40px 3px 20px;
        border-radius: 25px;
        background-color: white;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
        position: relative;
      }
      .icon-sousuo {
        font-size: 25rem;
        font-weight: bold;
        position: absolute;
        right: 30rem;
        color: #ccc;
      }
    }
  }
}
</style>
