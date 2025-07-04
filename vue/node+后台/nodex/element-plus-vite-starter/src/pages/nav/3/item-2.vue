<template>
  <div>
    <el-dialog title="添加普通管理员" v-model="dialogVisible" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddAdmin">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-button style="width: 112px; margin-left: 10px; display: flex; font-size: 13px;" type="primary" @click="dialogVisible = true">添加普通管理员</el-button>
    <el-table :data="tableData" stripe style="width: 100%">
      <!-- 根据接口数据结构添加列 -->
      <el-table-column fixed type="selection" width="80" min-width="80" />
      <el-table-column prop="_id" label="ID" width="180" show-overflow-tooltip />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="password" label="密码" show-overflow-tooltip />
      <el-table-column prop="sup" label="是否超级管理员" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            :disabled="isFirstUser(scope.row._id)"
            @click="handleDelete(scope.row._id)"
          >
           
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";

interface GuanlyCollectionItem {
  _id: string;
  username: string;
  password: string;
  sup: boolean; // 是否是超级管理员
}

const tableData = ref<GuanlyCollectionItem[]>([]);
const dialogVisible = ref(false);
const form = ref({
  username: "",
  password: "",
});

// 获取管理员列表
const fetchGuanlyCollection = async () => {
  try {
    const response = await axios.get<{ data: GuanlyCollectionItem[] }>(
      "http://localhost:8080/api/guanlyCollection"
    );
    console.log("API 响应数据:", response.data); // 添加调试信息
    tableData.value = response.data; // 解构赋值以确保类型匹配
    console.log("tableData 赋值后:", tableData.value); // 添加调试信息
  } catch (error) {
    console.error("获取 guanlyCollection 数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 添加管理员
const handleAddAdmin = async () => {
  try {
    const newAdmin = {
      username: form.value.username,
      password: form.value.password,
      sup: false, // 普通管理员，不是超级用户
    };

    const response = await axios.post(
      "http://localhost:8080/api/guanlyCollection/add",
      newAdmin
    );

    if (response.data.success) {
      ElMessage.success("添加管理员成功");
      tableData.value.push(response.data.data); // 将新管理员添加到表格数据中
      dialogVisible.value = false;
      form.value.username = "";
      form.value.password = "";
    } else {
      ElMessage.error("添加管理员失败：" + response.data.message);
    }
  } catch (error) {
    console.error("添加管理员失败:", error);
    ElMessage.error("添加管理员失败");
  }
};

// 删除管理员
const handleDelete = async (id: string) => {
  try {
    await axios.post("http://localhost:8080/api/guanlyCollection/delete", { _id: id });
    tableData.value = tableData.value.filter((item) => item._id !== id);
    ElMessage.success("删除管理员成功");
  } catch (error) {
    console.error("删除管理员失败:", error);
    ElMessage.error("删除管理员失败");
  }
};

// 判断是否为第一个管理员，禁用删除按钮
const isFirstUser = (id: string) => {
  return tableData.value[0]?._id === id; // 判断是否是第一个用户
};

onMounted(fetchGuanlyCollection);
</script>
