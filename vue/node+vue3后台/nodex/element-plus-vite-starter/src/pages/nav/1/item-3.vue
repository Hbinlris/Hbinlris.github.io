<template>
  <div>
    <el-page-header>
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-weight: bold;color: black; margin-left: 13px;">
          笔记管理
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><a href="./item-1">内容管理</a></el-breadcrumb-item
        >
        <el-breadcrumb-item>审核管理</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <!-- <template #content >
      <span  class="text-large font-600 mr-3" style="font-size: 14px;"> 审核管理 </span>
    </template> -->
  </el-page-header>
    <el-input v-model="search" size="small" placeholder="搜索标题或内容"  style="width: 300px; margin-left: -30rem;"/>
    <el-select v-model="selectedCategory" size="small" placeholder="选择分类" style="width: 300px; margin-left: 2rem;">
      <el-option
        v-for="category in categories"
        :key="category.value"
        :label="category.text"
        :value="category.value"
      />
    </el-select>
    <el-input v-model="searchAuthor" size="small" placeholder="搜索作者" style="width: 300px; margin-left: 2rem;" />
    <el-button type="primary" size="small" style="margin-left: 2rem;" @click="resetFilters">重置</el-button>
    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column fixed type="selection" width="60" />
      <el-table-column
        fixed
        prop="label"
        label="分类"
        width="80"
        :filters="[
          { text: '娱乐', value: '娱乐' },
          { text: '美食', value: '美食' },
          { text: '游戏', value: '游戏' },
          { text: '穿搭', value: '穿搭' },
        ]"
        :filter-method="filterCategory"
        filter-placement="bottom-end"
      />
      <el-table-column
        fixed
        prop="title"
        label="标题"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column prop="userToken" label="作者" width="100" />
      <el-table-column prop="imageUrl" label="笔记封面" width="120">
        <template #default="scope">
          <img
            :src="`http://localhost:8080/${scope.row.imageUrl[0]}`"
            alt="笔记封面"
            style="width: 60%; height: 60px; border-radius: 10%"
          />
        </template>
      </el-table-column>
      <el-table-column prop="text" label="内容" show-overflow-tooltip width="250" />
      <el-table-column prop="quantity" label="图片数量" width="80" />
      <el-table-column prop="status22" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status22)" disable-transitions>{{
            scope.row.status22
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="评论数量" width="100" />
      <el-table-column prop="createdAt" label="发布时间" width="209">
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="300">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            :icon="Select"
            @click="adopt(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            :icon="CloseBold"
            @click="reject(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { CloseBold, Select } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { throttle } from 'lodash';


const drawer2 = ref(false);
const tableData = ref<Item[]>([]);
const search = ref("");
const selectedCategory = ref("");
const searchAuthor = ref("");

const categories = [
  { value: "娱乐", text: "娱乐" },
  { value: "美食", text: "美食" },
  { value: "游戏", text: "游戏" },
  { value: "穿搭", text: "穿搭" },
];

const fetchHoneyData = async () => {
  try {
    const response = await axios.get<Item[]>("http://localhost:8080/api/publish");
    const transformedData = response.data.map((item: Item) => ({
      _id: item._id,
      label: item.label,
      id: item.id,
      title: item.title,
      userToken: item.userToken,
      imageUrl: item.imageUrl,
      text: item.text,
      quantity: item.imageUrl.length.toString(),
      status22: item.status22,
      comment: item.comment,
      createdAt: item.createdAt,
    }));
    tableData.value = transformedData.filter(
      (post) => post.status22 === "未审核" || post.status22 === "未通过"
    );
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

const fetchHoneyDatas=throttle(fetchHoneyData, 2000);

onMounted(() => {
  // fetchHoneyData();
  setInterval(fetchHoneyDatas, 1000);
});

const resetFilters = () => {
  search.value = "";
  selectedCategory.value = "";
  searchAuthor.value = "";
};

const filteredTableData = computed(() => {
  return tableData.value.filter((item) => {
    const matchesSearch = item.title.includes(search.value) || item.text.includes(search.value);
    const matchesCategory = selectedCategory.value ? item.label === selectedCategory.value : true;
    const matchesAuthor = searchAuthor.value ? item.userToken.includes(searchAuthor.value) : true;
    return matchesSearch && matchesCategory && matchesAuthor;
  });
});

const reject = async (row: Item) => {
  console.log("reject 方法被调用"); // 添加调试信息
  console.log("row:", row); // 添加调试信息
  try {
    const postId = row.id; // 假设 row.id 是帖子的 id
    console.log(`postId: ${postId}`); // 添加调试信息

    // 发送更新请求
    const response = await axios.post(
      `http://localhost:8080/api/articles/update`, // 修改为正确的更新路径
      {
        id: postId,
        status22: "未通过",
      }
    );
    console.log("更新请求发送成功:", response.data); // 添加调试信息

    // 更新本地数据
    const updatedRow = tableData.value.find((item) => item.id === postId);
    if (updatedRow) {
      updatedRow.status22 = "未通过";
      console.log("本地数据更新成功"); // 添加调试信息
      ElMessage.success("文章状态更新成功");
    } else {
      console.log("未找到对应的本地数据"); // 添加调试信息
      ElMessage.error("未找到对应的本地数据");
    }
  } catch (error) {
    console.error("状态更新失败:", error);
    ElMessage.error("状态更新失败，请重试");
  }
};

const adopt = async (row: Item) => {
  console.log("adopt 方法被调用"); // 添加调试信息
  console.log("row:", row); // 添加调试信息
  try {
    const postId = row.id; // 假设 row.id 是帖子的 id
    console.log(`postId: ${postId}`); // 添加调试信息

    // 发送更新请求
    const response = await axios.post(
      `http://localhost:8080/api/articles/update`, // 修改为正确的更新路径
      {
        id: postId,
        status22: "已审核",
      }
    );
    console.log("更新请求发送成功:", response.data); // 添加调试信息

    // 更新本地数据
    const updatedRow = tableData.value.find((item) => item.id === postId);
    if (updatedRow) {
      updatedRow.status22 = "已审核";
      fetchHoneyData();
      console.log("本地数据更新成功"); // 添加调试信息
      ElMessage.success("文章已通过审核");
    } else {
      console.log("未找到对应的本地数据"); // 添加调试信息
      ElMessage.error("未找到对应的本地数据");
    }
    console.log("状态更新成功");
  } catch (error) {
    console.error("状态更新失败:", error);
    ElMessage.error("状态更新失败，请重试");
  }
};

const filterCategory = (value: string, row: Item) => {
  return row.label === value;
};

interface Item {
  _id: string;
  id: string;
  title: string;
  userToken: string;
  imageUrl: string[];
  text: string;
  status22: string;
  comment: string;
  createdAt: string;
  collection: string;
  label: string;
}

const formatDate = (dateString: string) => {
  return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
};

const getStatusType = (status: string) => {
  switch (status) {
    case "未审核":
      return "primary";
    case "已审核":
      return "success";
    case "未通过":
      return "danger";
    default:
      return "info";
  }
};

</script>

<style scoped>
.ep-tag.ep-tag--primary {
  --ep-tag-text-color: rgb(236, 159, 42);
}
.ep-tag.ep-tag--primary {
  --ep-tag-bg-color: #fdf7ec;
  --ep-tag-border-color: rgb(241, 204, 147);
  --ep-tag-hover-color: #eab25e;
}
.ep-button {
  border: none;
  width: 50px;
}
.ep-button--primary {
  background-color: #3f9fff;
}
</style>
