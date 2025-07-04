<template>
  <div>
    <el-input v-model="searchContent" size="small" placeholder="搜索评论内容" style="width: 300px; margin-left: -30rem;"/>
    <el-input v-model="searchArticleTitle" size="small" placeholder="搜索被评论笔记" style="width: 300px; margin-left: 2rem;" />
    <el-input v-model="searchUserToken" size="small" placeholder="搜索评论用户" style="width: 300px; margin-left: 2rem;" />
    <el-button type="primary" size="small" style="margin-left: 2rem;" @click="resetFilters">重置</el-button>
    <el-table :data="paginatedData" style="width: 100%;">
      <el-table-column fixed type="selection" width="80" min-width="80" />
      <el-table-column label="被评论笔记" prop="articleTitle" width="150" />
      <el-table-column label="被评论封面" width="120">
        <template #default="scope">
          <img
            :src="`http://localhost:8080/${scope.row.articleImageUrl}`"
            alt="Article Image"
            style="width: 60%; height: 60px; border-radius: 10%"
          />
        </template>
      </el-table-column>
      <el-table-column label="评论用户" prop="userToken" width="120" />
      <el-table-column label="用户头像" width="120">
        <template #default="scope">
          <img
            :src="`http://localhost:8080/${scope.row.userAvatar}`"
            alt="User Avatar"
            style="width: 60%; height: 60px; border-radius: 50%"
          />
        </template>
      </el-table-column>
      <el-table-column label="评论内容" prop="content" show-overflow-tooltip width="409"/>
      <el-table-column label="评论日期" prop="createdAt" width="220" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="filterTableData.length"
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
import { ElMessageBox, ElMessage } from "element-plus";

interface Comment {
  _id: string;
  articleId: string;
  userToken: string;
  content: string;
  createdAt: string;
  articleTitle?: string;
  articleImageUrl?: string;
  userAvatar?: string;
}

interface Article {
  _id: string;
  id: string;
  title: string;
  text: string;
  imageUrl: string[];
  userToken: string;
  status: string;
  isPublic: string;
  status22: string;
  createdAt: string;
  collection: string;
  label: string;
}

interface User {
  _id: string;
  username: string;
  password: string;
  grzl: {
    jianjie: string;
    mingcheng: string;
    date: string;
    xingbie: string;
    resultArea: string;
  };
  avatar: string;
}

const searchContent = ref("");
const searchArticleTitle = ref("");
const searchUserToken = ref("");
const tableData = ref<Comment[]>([]);
const articles = ref<Article[]>([]);
const users = ref<User[]>([]);
const currentPage = ref(1);
const pageSize = ref(8);

import { throttle } from 'lodash';

// 计算过滤后的表格数据，根据评论内容、文章标题和发布者进行过滤
const filterTableData = computed(() =>
  tableData.value.filter((data) =>
    (!searchContent.value || data.content.toLowerCase().includes(searchContent.value.toLowerCase())) &&
    (!searchArticleTitle.value || data.articleTitle.toLowerCase().includes(searchArticleTitle.value.toLowerCase())) &&
    (!searchUserToken.value || data.userToken.toLowerCase().includes(searchUserToken.value.toLowerCase()))
  )
);

// 计算分页后的表格数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filterTableData.value.slice(start, end);
});

const fetchComments = async () => {
  try {
    console.log("开始获取评论数据...");
    const commentsResponse = await axios.get("http://localhost:8080/api/comments");
    console.log("评论 API 响应:", commentsResponse.data);

    let comments: Comment[] = [];
    if (commentsResponse.data && commentsResponse.data.success) {
      if (Array.isArray(commentsResponse.data.data)) {
        comments = commentsResponse.data.data;
        console.log("评论数据加载成功:", comments);
      } else {
        console.warn("评论响应数据中的 data 不是一个数组:", commentsResponse.data.data);
      }
    } else {
      console.warn("评论响应数据格式不正确:", commentsResponse.data);
    }

    console.log("开始获取文章数据...");
    const articlesResponse = await axios.get("http://localhost:8080/api/publish");
    console.log("文章 API 响应:", articlesResponse.data);

    let articles: Article[] = [];
    if (Array.isArray(articlesResponse.data)) {
      articles = articlesResponse.data;
      console.log("文章数据加载成功:", articles);
    } else {
      console.warn("文章响应数据不是一个数组:", articlesResponse.data);
    }

    console.log("开始获取用户数据...");
    const usersResponse = await axios.get("http://localhost:8080/api/users");
    console.log("用户 API 响应:", usersResponse.data);

    let users: User[] = [];
    if (Array.isArray(usersResponse.data)) {
      users = usersResponse.data;
      console.log("用户数据加载成功:", users);
    } else {
      console.warn("用户响应数据不是一个数组:", usersResponse.data);
    }

    // 合并评论数据、文章数据和用户数据
    tableData.value = comments.map((comment) => {
      console.log("Processing comment:", comment);
      console.log("Comment articleId:", comment.articleId);

      // 查找匹配的文章
      const article = articles.find((article) => String(article.id) === String(comment.articleId));
      console.log("Found article for comment ID", comment.articleId, ":", article);

      // 查找匹配的用户
      const user = users.find((user) => user.username === comment.userToken);
      console.log("Found user for comment userToken", comment.userToken, ":", user);

      return {
        ...comment,
        articleTitle: article ? article.title : "(No Title)",
        articleImageUrl: article && article.imageUrl && article.imageUrl.length > 0 ? article.imageUrl[0] : "(No Image)",
        userAvatar: user ? user.avatar : "(No Avatar)",
      };
    });

    // 输出合并后的 tableData
    console.log("合并后的 tableData:", tableData.value);
  } catch (error) {
    console.error("获取评论、文章或用户数据失败:", error);
  }
};

const handleDelete = async (comment: Comment) => {
  try {
    // 使用 ElMessageBox 进行二次确认
    await ElMessageBox.confirm("确定要删除这条评论吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    console.log("开始删除评论:", comment._id);
    const response = await axios.delete(
      `http://localhost:8080/api/commentdel/${comment._id}`
    );
    console.log("后端响应:", response.data);

    if (response.data.success) {
      console.log(`评论 id ${comment._id} 已成功删除。`);
      ElMessage({
        type: "success",
        message: "评论已删除",
      });
      // 从本地数据中移除已删除的项
      tableData.value = tableData.value.filter((item) => item._id !== comment._id);
    } else {
      console.error(`删除评论 id ${comment._id} 失败。状态: ${response.status}`);
      ElMessage({
        type: "error",
        message: "删除评论失败",
      });
    }
  } catch (error) {
    if (error === "cancel") {
      console.log("取消删除操作");
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    } else {
      console.error(`删除评论 id ${comment._id} 时出错:`, error);
      ElMessage({
        type: "error",
        message: "删除评论失败",
      });
    }
  }
};

// 重置过滤条件
const resetFilters = () => {
  searchContent.value = '';
  searchArticleTitle.value = '';
  searchUserToken.value = '';
  currentPage.value = 1; // 重置页码
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
};

// 在组件挂载时获取评论数据
const fetchComment = throttle(fetchComments, 2000);

onMounted(() => {
  fetchComment();
  setInterval(fetchComment, 1000);
});
</script>

<style scoped>
:deep(.ep-scrollbar__view){
  display: block !important;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
