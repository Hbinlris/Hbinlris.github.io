<template>
  <div id="app">
    <!-- 顶部搜索栏 -->
    <div class="top">
      <img src="../images/xhs.png" alt="" />
      <div class="search" style="margin-right: 10rem;">
        <van-icon name="search" style="font-size: 25rem;" @click="goToSearch()" />
        <!-- <img src="../images/more.png" alt="" /> -->
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="index" :class="['tab', { active: activeTab === index }]"
        @click="activeTab = index">
        {{ tab.label }}
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="tabs.length === 0" class="loading">加载中...</div>

    <!-- 渲染内容区域 -->
    <transition name="fade" mode="out-in">
      <div v-if="tabs.length > 0" class="tab-content" :key="activeTab">
        <section class="waterfall">
          <div v-for="(item, index) in activeTabContent.content" :key="index">
            <div v-if="item.status === '公开' && item.status22 === '已审核'" class="item">
              <div class="item-img">
                <img :src="`http://localhost:8080/${item.imageUrl[0]}`" alt="图片加载失败"
                  @click="goToContent(item.id)" />
              </div>
              <div class="item-content">
                <p>{{ item.title }}</p>
              </div>
              <div class="author">
                <img src="../images/xhs_icon.png" alt="" />
                <span>{{ item.userToken }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>



<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const activeTab = ref(0); // 当前选中选项卡索引
const tabs = ref([]); // 选项卡数据
const mingcheng = ref(""); // 用户名

// 动态获取当前选项卡内容
const activeTabContent = computed(() => tabs.value[activeTab.value] || { content: [] });
console.log("activeTabContent:", activeTabContent.value);

// 跳转到内容详情页
const goToContent = (id) => {
  router.push({ name: "ContentXq", params: { id } });
};

// 跳转到搜索页面
const goToSearch = () => {
  router.push({ name: "Search" });
};




// 获取数据
const getData = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/publish");

    // 格式化数据为 [{ label: string, content: array }]
    const groupedTabs = res.data.reduce((acc, item) => {
      const existingTab = acc.find(tab => tab.label === item.label);
      if (existingTab) {
        existingTab.content.push(item);
      } else {
        acc.push({ label: item.label, content: [item] });
      }
      return acc;
    }, []);

    tabs.value = groupedTabs;
    console.log("分组后的选项卡数据:", tabs.value);
  } catch (err) {
    console.error("数据加载失败:", err);
    tabs.value = []; // 保证响应性
  }
};
//获取用户数据
const getUser = async (mingcheng) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/clientusers/${username}`);
    console.log("用户信息:", res.data);
  } catch (err) {
    // console.error("用户信息加载失败:", err);
  }
};

// 初始化加载数据
getData();
getUser(mingcheng);
</script>

<style lang="less" scoped>
#app {
  margin: 0;
  padding-left: 5rem;
  height: 100%;
  margin-bottom: 50rem;

  li {
    list-style: none;
  }
}

.top {
  display: flex;
  align-items: center;
  height: 45rem;
  background-color: white;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  left: 0;

  img {
    width: 60rem;
    margin-left: 15rem;
  }

  .search {
    display: flex;

    img {
      width: 25rem;
      margin-right: 10rem;
      margin-left: 10rem;
    }
  }
}

.tabs {
  margin: 10rem;
  margin-top: 0;
  display: flex;
  color: black;
  background-color: white;
  position: fixed;
  width: 350rem;
  height: 35rem;
  top: 45rem;
  justify-content: space-between;
  align-items: center;
}

.tab {
  cursor: pointer;
  font-size: 14rem;
  transition: background-color 0.3s;
  color: rgb(158, 156, 156);
}

.tab.active {
  font-weight: bold;
  color: red;
  padding-bottom: 5rem;
  border-bottom: 2rem solid red;
}

.tab:hover {
  color: red;
  padding-bottom: 5rem;
  border-bottom: 2rem solid red;
}

.loading {
  margin-top: 100px;
  text-align: center;
  font-size: 16px;
  color: #888;
}

.tab-content {
  display: flex;
  justify-content: center;
  margin-top: 75rem;
  padding: 0;
}

//过渡
/* 选项卡内容的过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10rem);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}


.waterfall {
  column-count: 2;
  column-gap: 10rem;
  max-width: 1200rem;
}

.item {
  background-color: #f9f9f9;
  margin-bottom: 16rem;
  break-inside: avoid;
  padding: 2rem;
  border-radius: 4px;
}

.item-img img {
  height: 200rem;
  width: 165rem;
  object-fit: cover;
  object-position: center;
  background-color: #fff;
  border-radius: 4rem;
}

.item-content p {
  margin: 0;
  margin-top: 5rem;
  padding: 0;
  width: 140rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13rem;
}

.author {
  display: flex;
  align-items: center;
  font-size: 14rem;
  margin-top: 5rem;
}

.author img {
  width: 20rem;
  border-radius: 50%;
  margin-right: 10rem;
}
</style>
