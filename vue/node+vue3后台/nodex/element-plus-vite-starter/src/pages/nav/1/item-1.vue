<template>
  <div>
    <el-input v-model="search" size="small" placeholder="搜索标题或内容" style="width: 300px; margin-left: -30rem;" />
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
    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column fixed type="selection" width="60" />
      <el-table-column
        fixed
        prop="label"
        label="分类"
        width="80"
        :filters="categories"
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
      <el-table-column
        prop="status22"
        label="状态"
        width="100"
        :filters="[
          { text: '未审核', value: '未审核' },
          { text: '已审核', value: '已审核' },
          { text: '未通过', value: '未通过' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status22)" disable-transitions>{{ scope.row.status22 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="评论数量" width="100" />
      <el-table-column prop="createdAt" label="发布时间" width="209">
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="150">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="filteredTableData.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
      style="margin-top: 20px; text-align: center; margin-left: 10px;"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { throttle } from 'lodash';

const drawer2 = ref(false);
const tableData = ref<Item[]>([]);
const search = ref('');
const selectedCategory = ref('');
const searchAuthor = ref('');
const currentPage = ref(1);
const pageSize = ref(8);

const categories = [
  { text: '娱乐', value: '娱乐' },
  { text: '美食', value: '美食' },
  { text: '游戏', value: '游戏' },
  { text: '穿搭', value: '穿搭' },
];

// 计算过滤后的表格数据
const filteredTableData = computed(() => {
  return tableData.value.filter((data) =>
    (data.title.toLowerCase().includes(search.value.toLowerCase()) ||
     data.text.toLowerCase().includes(search.value.toLowerCase())) &&
    (selectedCategory.value === '' || data.label === selectedCategory.value) &&
    (searchAuthor.value === '' || data.userToken.toLowerCase().includes(searchAuthor.value.toLowerCase()))
  );
});

// 计算分页后的表格数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTableData.value.slice(start, end);
});

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
    tableData.value = transformedData;
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败，请重试");
  }
};

const fetchHoneyDatas = throttle(fetchHoneyData, 2000);

onMounted(() => {
  fetchHoneyDatas();
  setInterval(fetchHoneyDatas, 1000);
});

const handleDelete = async (row: Item) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    console.log("删除文章 id:", row.id);

    const response = await axios.post(
      `http://localhost:8080/api/articles/delete`,
      { id: row.id }
    );
    console.log("后端响应:", response.data);

    if (response.data.success) {
      console.log(`文章 id ${row.id} 已成功删除。`);
      ElMessage({
        type: 'success',
        message: '文章已删除',
      });
      tableData.value = tableData.value.filter((item) => item.id !== row.id);
    } else {
      console.error(`删除文章 id ${row.id} 失败。状态: ${response.status}`);
      ElMessage({
        type: 'error',
        message: '删除文章失败',
      });
    }
  } catch (error) {
    if (error === "cancel") {
      console.log("取消删除操作");
      ElMessage({
        type: 'info',
        message: '删除取消',
      });
    } else {
      console.error(`删除文章 id ${row.id} 时出错:`, error);
      ElMessage({
        type: 'error',
        message: '删除文章失败',
      });
    }
  }
};

const filterTag = (value: string, row: Item) => {
  return row.status22 === value;
};

const filterCategory = (value: string, row: Item) => {
  return row.label === value;
};

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

// 重置过滤条件
const resetFilters = () => {
  search.value = '';
  selectedCategory.value = '';
  searchAuthor.value = '';
  currentPage.value = 1; // 重置页码
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
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
</script>

<style scoped>
.ep-tag.ep-tag--primary {
  --ep-tag-text-color: rgb(236, 159, 42);
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
