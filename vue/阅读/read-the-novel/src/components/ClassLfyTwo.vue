<template>
  <div class="ClassLfyTwo">
    <!-- 二级导航 -->
    <nav>
      <div class="navbook">
        <div
          class="list"
          v-for="item in namesArray"
          :key="item.url"
          :class="{ active: item.url === currentUrl }"
          @click="gotoClassLfyBook(item.url)"
        >
          {{ item.name }}
        </div>
      </div>
    </nav>

    <ClassLfyBook :catId="catId" />
  </div>
</template>

<script>
import { ClassLfyNav } from "@/api/axios";
import ClassLfyBook from "@/components/ClassLfyBook";

export default {
  components: {
    ClassLfyBook,
  },
  data() {
    return {
      // 二级导航数据数组
      ClassLfyTwo: [],
      // 处理后的二级导航名称和URL数组
      namesArray: [],
      catId: null,
      currentUrl: null, // 新增属性
    };
  },
  props: {
    // 接收父组件传递的channel对象
    channel: Object,
  },
  created: function () {
    // 初始化时获取二级导航数据
    this.fetchData();
  },
  watch: {
    channel: {
      handler(newVal) {
        // 当channel发生变化时，重新获取二级导航数据
        this.fetchData(newVal);
      },
      deep: true, // 深度监听channel对象的变化
    },
  },
  methods: {
    fetchData(channel = this.channel) {
      // 根据channel获取二级导航数据
      ClassLfyNav().then((res) => {
        this.ClassLfyTwo = res.data;
        if (channel) {
          // 过滤出与当前channel匹配的数据
          this.ClassLfyTwo = this.ClassLfyTwo.filter(
            (item) => item.channel === channel.channel
          );
        }
        // 提取cates中的name和url，形成新的数组
        this.namesArray = this.ClassLfyTwo.flatMap((item) =>
          item.cates.map((cates) => ({
            name: cates.name,
            url: cates.url,
          }))
        );

        // 设置初始URL为namesArray中的第一个URL
        if (this.namesArray.length > 0) {
          const firstItem = this.namesArray[0];
          const match = firstItem.url.match(/(?<=catId=)\d+/);
          this.catId = match ? match[0] : null;
          this.currentUrl = firstItem.url; // 新增代码
        }
      });
    },
    // 书籍
    gotoClassLfyBook(url) {
      console.log("原始url", url);
      const match = url.match(/(?<=catId=)\d+/);
      console.log("match", match);

      this.catId = match ? match[0] : null;
      this.currentUrl = url; // 新增代码

      console.log("gotourl1111", this.catId);
    },
  },
};
</script>

<style lang="less" scoped>
.ClassLfyTwo {
  background-color: white;

  nav {
    position: sticky;
    top: 0;
    background-color: white;
    margin-bottom: 15px;
    z-index: 100;

    .navbook {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20px;
      background-color: #cccccc6e;
      .list {
        padding: 14px 10px;
        &.active {
          color: red;
        }
      }
    }
  }
}
</style>
