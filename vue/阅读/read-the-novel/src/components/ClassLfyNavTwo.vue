<!-- ClassLfy  二级导航栏 -->

<template>
  <div class="ClassLfy">
    <nav>
      <div class="navigation">
        <div
          class="Channel"
          v-for="(ClassLfyChannel, index) in filteredClassLfyTwo"
          :key="ClassLfyChannel.index"
          :class="{ highlighted: index === highlightedindex[selectedChannel] }"
          @click="highlightedindex[selectedChannel] = index"
        >
          {{ ClassLfyChannel.name }}
        </div>
      </div>
    </nav>

    <main>
      <div class="filter" v-if="sifts">
        <div class="sift">
          <div
            class="name"
            v-for="sift in sifts.sort"
            :key="sift.index"
            :class="{ selected: selectedSifts.sort === sift }"
            @click="selectSift('sort', sift)"
          >
            {{ sift.name }}
          </div>
        </div>

        <div class="myfilter" @click="toggleFilters">筛选</div>
      </div>
      <div class="showFilters" v-show="showFilters">
        <ul>
          <li>
            <div
              class="sequence"
              v-for="sift in sifts.pay"
              :key="sift.index"
              :class="{ selected: selectedSifts.pay === sift }"
              @click="selectSift('pay', sift)"
            >
              {{ sift.name }}
            </div>
          </li>
          <li>
            <div
              class="sequence"
              v-for="sift in sifts.bookStatus"
              :key="sift.index"
              :class="{ selected: selectedSifts.bookStatus === sift }"
              @click="selectSift('bookStatus', sift)"
            >
              {{ sift.name }}
            </div>
          </li>
          <li>
            <div
              class="sequence"
              v-for="sift in sifts.wordCount"
              :key="sift.index"
              :class="{ selected: selectedSifts.wordCount === sift }"
              @click="selectSift('wordCount', sift)"
            >
              {{ sift.name }}
            </div>
          </li>
        </ul>
      </div>
    </main>

    <ClassLfyBook
      :highlightedindex="highlightedindex"
      :selectedSifts="selectedSifts"
      :selectedChannel="selectedChannel"
    ></ClassLfyBook>
  </div>
</template>

<script>
import { ClassLfyNav, ClassLfysift } from "@/api/axios";
import ClassLfyBook from "@/components/ClassLfyBook.vue";

export default {
  components: {
    ClassLfyBook,
  },

  props: {
    selectedChannel: String,
  },

  data() {
    return {
      ClassLfyTwo: [],
      primaryCategories: [], // 一级分类

      // 一级分类对应的channel
      highlightedindex: {
        male: 0,
        female: 0,
        publish: 0,
        ting: 0,
      },

      sifts: {
        pay: 0,
        bookStatus: 0,
        sort: 0,
        wordCount: 0,
      },

      selectedSifts: {
        pay: null,
        bookStatus: null,
        sort: null,
        wordCount: null,
      },

      showFilters: false, // 控制筛选条件的显示状态
    };
  },

  created: function () {
    // 获取二级分类
    ClassLfyNav().then((res) => {
      // console.log("api", res.data);
      this.primaryCategories = res.data; // 保存一级分类
      // 提取所有的 cate 数据
      this.ClassLfyTwo = [].concat(...res.data.map((item) => item.cates || []));
      // console.log("分类名称:", this.ClassLfyTwo);
    });

    ClassLfysift().then((res) => {
      const categories = res.data.categories;
      this.sifts = {
        sort:
          categories.find((category) => category.type === "sort")?.catArray ||
          [],
        pay:
          categories.find((category) => category.type === "pay")?.catArray ||
          [],
        bookStatus:
          categories.find((category) => category.type === "bookStatus")
            ?.catArray || [],
        wordCount:
          categories.find((category) => category.type === "wordCount")
            ?.catArray || [],
      };

      // 初始化 selectedSifts
      this.selectedSifts = {
        pay: this.sifts.pay[0] || null,
        bookStatus: this.sifts.bookStatus[0] || null,
        sort: this.sifts.sort[0] || null,
        wordCount: this.sifts.wordCount[0] || null,
      };
      
      console.log("筛选条件:", this.sifts);
    });
  },

  computed: {
    // 筛选二级分类
    filteredClassLfyTwo() {
      // console.log("当前 selectedChannel:", this.selectedChannel);
      // console.log("this.ClassLfyTwo", this.ClassLfyTwo);

      // 找到匹配 selectedChannel 的一级分类
      const primaryCategory = this.primaryCategories.find(
        (category) => category.channel === this.selectedChannel
      );

      if (!primaryCategory) {
        return []; // 如果没有找到匹配的一级分类，返回空数组
      }
      // 返回一级分类下的二级分类
      return primaryCategory.cates || [];
    },
  },

  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
      console.log("toggleFilters", this.showFilters);
    },

    selectSift(type, item) {
      console.log("selectSift", type, item);

      this.selectedSifts[type] = item;
      console.log("selectSift", this.selectedSifts);
      this.emitData();
    },

     emitData() {
      this.$emit('update-data', this.highlightedindex, this.selectedSifts);
    },
  },
};
</script>

<style lang="less" scoped>
.ClassLfy {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;

  nav {
    .navigation {
      background-color: #cccccc4a;
      padding: 0 8px;

      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .Channel {
        padding: 10px;

        &.highlighted {
          color: red;
        }
      }
    }
  }

  main {
    .filter {
      padding: 10px 8px;

      display: flex;
      justify-content: space-between;
      align-items: center;
      .sift {
        display: flex;
        .name {
          padding: 0 10px;
          &:first-child {
            border-right: 1px solid #ccc;
          }
          &.selected {
            color: red;
          }
        }
      }
      .myfilter {
        width: 15vw;
        height: 7.5vw;
        line-height: 7.5vw;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 25rem;
      }
    }
    .showFilters {
      padding: 0 8px;
      background-color: white;

      ul {
        li {
          display: flex;
          flex-wrap: wrap;
          .sequence {
            padding: 10px;
            &.selected {
              color: red;
            }
          }
        }
      }
    }
  }
}
</style>
