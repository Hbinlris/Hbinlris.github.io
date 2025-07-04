<template>
  <div>
    <h2>用户管理</h2>
    <el-input v-model="search" size="small" placeholder="搜索用户名或昵称" style="width: 300px; margin-left: 30px; display: flex;" />
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column fixed type="selection" width="80" min-width="80" />
      <el-table-column fixed prop="shortId" label="红薯号" width="120" min-width="150" />
      <el-table-column prop="avatar" label="头像" width="120">
        <template #default="scope">
          <img
            :src="getAvatarUrl(scope.row.avatar)"
            alt="头像"
            style="width: 60%; height: 60px; border-radius: 50%"
          />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="账号" width="80" />
      <el-table-column prop="grzl.xingbie" label="性别" width="80" />
      <el-table-column prop="grzl.jianjie" label="简介" width="139" />
      <el-table-column prop="grzl.mingcheng" label="昵称" width="150" />
      <el-table-column prop="grzl.date" label="出生日期" width="150" />
      <el-table-column prop="grzl.resultArea" label="地区" width="200" />
      <el-table-column
        prop="zhuangtai"
        label="状态"
        width="100"
        :filters="[
          { text: '正常', value: '正常' },
          { text: '封禁', value: '封禁' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.zhuangtai === '封禁' ? 'primary' : 'success'"
            disable-transitions
          >
            {{ scope.row.zhuangtai }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="167" min-width="150">
        <template #default="scope">
          <el-switch
            v-model="scope.row.zhuangtai"
            active-value="正常"
            inactive-value="封禁"
            style="--ep-switch-on-color: green; --ep-switch-off-color: red"
            @change="handleStatusChange(scope.row)"
          />
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="handleDelete(scope.row._id)"
            style="margin-left: 2rem;"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { Menu as IconMenu, Delete, Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { throttle } from 'lodash';

interface User {
  _id: string;
  username: string;
  grzl: {
    mingcheng: string;
    xingbie: string;
    jianjie: string;
    date: string;
    resultArea: string;
  };
  avatar: string;
  zhuangtai: string;
}

const search = ref("");
const tableData = ref<User[]>([]);
const filterTableData = computed(() => {
  return tableData.value.filter(
    (user) =>
      user.username.includes(search.value) || user.grzl.mingcheng.includes(search.value)
  );
});

const fetchUsers = async () => {
  try {
    const response = await axios.get<User[]>("http://localhost:8080/api/users");
    tableData.value = response.data.map((item) => ({
      ...item,
      shortId: item._id.toString().substring(0, 10),
    }));
  } catch (error) {
    console.error("获取用户数据失败:", error);
    // 可以在这里添加用户友好的提示
  }
};

const handleDelete = async (id: string) => {
  try {
    // 使用 ElMessageBox 进行二次确认
    await ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 使用 POST 方法发送删除请求，确保后端 API 能够正确处理这种请求
    const response = await axios.post(`http://localhost:8080/api/users/delete`, {
      _id: id,
    });
    if (response.data.success) {
      ElMessage.success("用户已删除");
      tableData.value = tableData.value.filter((user) => user._id !== id);
    } else {
      ElMessage.error("删除失败：" + response.data.message);
    }
  } catch (error) {
    if (error === "cancel") {
      console.log("取消删除操作");
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    } else {
      console.error("删除失败:", error);
      ElMessage.error("删除用户时发生错误");
    }
  }
};

const handleStatusChange = async (user: User) => {
  try {
    // 使用 POST 方法发送更新状态请求
    const response = await axios.post(`http://localhost:8080/api/users/updateStatus`, {
      _id: user._id,
      status: user.zhuangtai,
    });
    if (response.data.success) {
      ElMessage.success("状态更新成功");
      // 更新本地数据
      user.zhuangtai = user.zhuangtai;
    } else {
      ElMessage.error("状态更新失败：" + response.data.message);
      // 如果更新失败，恢复原始状态
      user.zhuangtai = user.zhuangtai === "正常" ? "封禁" : "正常";
    }
  } catch (error) {
    console.error("状态更新失败:", error);
    ElMessage.error("状态更新时发生错误");
    // 如果更新失败，恢复原始状态
    user.zhuangtai = user.zhuangtai === "正常" ? "封禁" : "正常";
  }
};

const filterTag = (value: string, row: User) => {
  return row.zhuangtai === value;
};

const getAvatarUrl = (avatar: string) => {
  return `http://localhost:8080/${avatar}`;
};

const fetchHoneyDataThrottled = throttle(fetchUsers, 2000);

onMounted(() => {
  // fetchUsers();
  setInterval(fetchHoneyDataThrottled, 1000);
});
</script>

<style lang="scss" scoped>
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

.p-scrollbar_view{
  display: block !important;
  
}

:deep(.ep-scrollbar__view){
  display: block !important;
}
</style>
