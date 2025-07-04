<template>
  <div>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column fixed type="selection" width="100" />
      <el-table-column label="标签名称" prop="label" width="180" />
      <el-table-column label="标签使用次数" prop="tags" width="150"/>
      <el-table-column align="right">
        <template #header>
          <div style="display: flex;">
            <el-button type="primary" @click="dialogVisible = true" style="width: 6rem;">添加标签</el-button>
            <el-input v-model="search"  placeholder="标签搜索" style="width: 220px;margin-left: 100px;"/>
          </div>
        </template>
        <template #default="scope">
          <el-button type="primary" size="small" @click="editTag(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteTag(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑标签对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingTag ? '编辑标签' : '添加标签'"
      width="30%"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

interface Tag {
  id: string;
  label: string;
}

const tags = ref<Tag[]>([]);
const dialogVisible = ref(false);
const editingTag = ref<Tag | null>(null);
const form = ref({
  label: "",
});
const search = ref("");

// 计算过滤后的表格数据
const filterTableData = computed(() =>
  tags.value.filter(
    (data) =>
      !search.value || data.label.toLowerCase().includes(search.value.toLowerCase())
  )
);

//获取标签列表
const fetchTags = async () => {
  try {
    const response = await axios.get<Tag[]>("http://localhost:8080/api/honey");
    tags.value = response.data;
  } catch (error) {
    console.error("获取标签失败:", error);
    ElMessage.error("获取标签失败，请重试");
  }
};

// 初始化标签列表
onMounted(fetchTags);

//  添加标签
const addTag = async () => {
  try {
    const response = await axios.post<Tag>(
      "http://localhost:8080/api/honey", // 确保这个 URL 与后端路由匹配
      form.value
    );
    tags.value.push(response.data);
    fetchTags();
    ElMessage.success("标签添加成功");
    dialogVisible.value = false;
    form.value.label = "";
  } catch (error) {
    console.error("添加标签失败:", error);
    ElMessage.error("添加标签失败，请重试");
  }
};

//  更新标签
const updateTag = async () => {
  if (!editingTag.value) return;
  try {
    // 使用 _id 而不是 id
    const tagId = editingTag.value._id.toString();
    console.log(`tagId: ${tagId}`);
    console.log(`form.value.label: ${form.value.name}`);
    
    
    const response = await axios.post<Tag>(
      "http://localhost:8080/api/tags/update", // 修改 URL 路径
      { id: tagId, label: form.value.name }
    );
    console.log("更新请求发送成功:", response.data); // 添加调试信息

    // 更新本地数据
    const index = tags.value.findIndex((tag) => tag._id.toString() === tagId);
    if (index !== -1) {
      tags.value[index] = { ...tags.value[index], label: response.data.data.label };
      console.log("本地数据更新成功"); // 添加调试信息
      ElMessage.success("标签更新成功");
    } else {
      console.log("未找到对应的本地数据"); // 添加调试信息
      ElMessage.error("未找到对应的本地数据");
    }
  } catch (error) {
    console.error("更新标签失败:", error);
    ElMessage.error("更新标签失败，请重试");
  }
};

// 提交表单
const submitForm = () => {
  if (editingTag.value) {
    updateTag();
  } else {
    addTag();
  }
};

// 编辑标签
const editTag = (tag: Tag) => {
  editingTag.value = tag;
  form.value.label = tag.label;
  dialogVisible.value = true;
};

// 删除标签
const deleteTag = (tag: Tag) => {
  console.log(tag); // 添加调试信息
  ElMessageBox.confirm("确定要删除该标签吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        // 使用 _id 而不是 id
        const tagId = tag._id.toString();
        await axios.delete(`http://localhost:8080/api/tags/${tagId}`);
        tags.value = tags.value.filter((t) => t._id !== tagId);
        ElMessage.success("标签删除成功");
      } catch (error) {
        console.error("删除标签失败:", error);
        ElMessage.error("删除标签失败，请重试");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}

</style>
