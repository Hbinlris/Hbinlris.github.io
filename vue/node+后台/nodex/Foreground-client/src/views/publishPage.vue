<template>
  <div class="publishPage">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="ReturnToPrevious" />
      </div>
    </header>

    <!-- 主体 -->
    <main>
      <!-- 加载状态 -->
      <div v-if="isLoading">加载中...</div>

      <!-- 错误提示 -->
      <div v-if="errorMsg">{{ errorMsg }}</div>

      <!-- 文件上传 -->
      <van-field name="uploader" v-if="!isLoading && !errorMsg">
        <template #input>
          <van-uploader v-model="value" accept=".jpg, .jpeg, .png" />
        </template>
      </van-field>

      <!-- 文本输入 -->
      <div class="textInput" v-if="!isLoading && !errorMsg">
        <div class="title-number">
          <input
            class="title"
            type="text"
            v-model="title"
            placeholder="添加标题"
          />
          <div class="title-length">{{ 20 - title.length }}</div>
        </div>
        <textarea
          class="text"
          type="text"
          v-model="text"
          placeholder="添加正文"
        />

        <div class="btn">
          <div class="btn-left">
            <div
              class="label"
              :class="{
                'active-label': selectedLabel && selectedLabel.id === item._id,
              }"
              v-for="item in labels"
              :key="item._id"
              @click="selectLabel(item)"
            >
              #{{ item.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 开关选择公开或私密 -->
      <div class="switch" v-if="!isLoading && !errorMsg">
        <div class="switch-text">是否公开</div>
        <div
          class="switch-box"
          :style="{ backgroundColor: checked ? '#007bff' : 'gray' }"
        >
          <div
            class="switch-btn"
            :style="{
              transform: checked ? 'translateX(30rem)' : 'translateX(0)',
            }"
            @click="toggleSwitch"
          ></div>
        </div>
      </div>
    </main>

    <!-- 底部栏 -->
    <footer>
      <div class="bottom">
        <div class="btn-publish" @click="publishNote">发布笔记</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { showToast } from "vant";
import axios from "axios";

import { apiusers } from "@/api/api.js";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { nextTick } from "vue";

const route = useRoute(); // 获取路由
const value = ref([]);
const title = ref("");
const text = ref("");
const selectedLabel = ref(null);
const userToken = ref("");
const checked = ref(true);
const labels = ref([]);
const isLoading = ref(true); // 添加加载状态
const errorMsg = ref(""); // 添加错误信息
const router = useRouter();

const ReturnToPrevious = () => {
  router.back();
  // router.push("/");
  console.log("返回上一页");
  localStorage.removeItem("currentPost");
};

// 获取标签数据
const getData = () => {
  axios
    .get("http://localhost:8080/api/olo")
    .then((response) => {
      labels.value = response.data;
      isLoading.value = false; // 加载完成
    })
    .catch((error) => {
      console.error("请求错误:", error);
      showToast("加载标签失败，请重试");
      errorMsg.value = "加载失败"; // 设置错误信息
      isLoading.value = false; // 加载完成
    });
};

getData();

// 监听标题长度，限制最大长度
watch(title, (newValue) => {
  if (newValue.length > 20) {
    showToast("标题最多输入20个字");
    title.value = newValue.slice(0, 20);
  }
});

// 切换公开/私密状态
const toggleSwitch = () => {
  checked.value = !checked.value;
  console.log("开关状态：", checked.value);
};

// 选择标签
const selectLabel = (item) => {
  console.log("item._id:", item._id);
  console.log("selectedLabel.value.id 类型：", typeof selectedLabel.value?._id);
  if (selectedLabel.value && selectedLabel.value.id === item._id) {
    selectedLabel.value = null;
  } else {
    selectedLabel.value = { name: item.label, id: item._id };
  }
  console.log("选中的标签：", selectedLabel.value);
};

// 发布笔记
const publishNote = async () => {
  // 获取用户token
  const userTokens = localStorage.getItem("userToken");
  console.log("userTokens", userTokens);

  apiusers(userTokens).then(async (res) => {
    const zhuangtai = res.data.usersData.zhuangtai;
    console.log("发布用户信息获取", zhuangtai);

    if (zhuangtai === "封禁") {
      showToast("您的账号已被封禁，无法发布笔记");
      // 清除登陆
      localStorage.removeItem("userToken");

      router.push("/").then(() => {
        location.reload();
      });
    } else {
      if (!selectedLabel.value) {
        showToast("请选择一个标签");
        return;
      }
      if (value.value.length === 0) {
        showToast("请上传至少一张图片");
        return;
      }
      if (!title.value.trim()) {
        showToast("标题不能为空");
        return;
      }
      if (!text.value.trim()) {
        showToast("正文内容不能为空");
        return;
      }
      router.push("/");
      const status = checked.value ? "公开" : "私密";
      console.log("发布状态：", checked.value, status);

      const formData = new FormData();
      formData.append("id", Date.now());
      formData.append("title", title.value);
      formData.append("text", text.value);
      formData.append("userToken", userToken.value);
      formData.append("status", checked.value ? "公开" : "私密");
      formData.append("isPublic", checked.value);
      formData.append("status22", "未审核");
      formData.append("label", selectedLabel.value.name);
      formData.append("labelId", selectedLabel.value.id);

      value.value.forEach((file) => {
        formData.append("imageUrl", file.file);
      });

      if (
        value.value.some((fileItem) => {
          const fileName = (fileItem.file || fileItem).name;
          return /[\u4e00-\u9fa5]/.test(fileName);
        })
      ) {
        showToast("请修改为英文之后再上传");
        return;
      }

      const existingPostId = route.query.postId; // 这里可以从路由中获取传递的postId
      if (existingPostId) {
        // 如果传递了 postId，说明是更新操作
        try {
          const response = await axios.put(
            `http://localhost:8080/api/update/${existingPostId}`, // 这里需要配置更新接口
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (response.data.success) {
            showToast("更新成功");
          } else {
            showToast("更新失败");
          }
        } catch (error) {
          console.error("请求错误:", error);
          showToast("更新失败，请重试");
        }
      } else {
        // 没有传递 postId，则执行发布操作
        try {
          const response = await axios.post(
            "http://localhost:8080/api/publish",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (response.data.success) {
            showToast("发布成功");
          } else {
            showToast("发布失败");
          }
        } catch (error) {
          console.error("请求错误:", error);
          showToast("发布失败，请重试");
        }
      }
    }
  });
};

onMounted(() => {
  userToken.value = localStorage.getItem("userToken");
  const postString = localStorage.getItem("currentPost");
  if (postString) {
    const post = JSON.parse(postString);
    console.log("接收到的post参数：", post); // 检查传递的参数

    title.value = post.title;
    text.value = post.text;
    selectedLabel.value = { name: post.label, id: post.collection };

    // 转换 imageUrl 数组
    const tup = post.imageUrl.map((img) => ({
      url: `http://localhost:8080/${img}`,
    }));
    console.log("value.value:", tup);
    value.value = tup; // 赋值给 value

    nextTick(() => {
      // 确保在 DOM 更新完成后执行
      console.log("DOM 更新后选中的标签：", selectedLabel.value);
      console.log("图片", value.value);
    });
  }
});
</script>

<style lang="less" scoped>
.publishPage {
  height: 100vh;

  header {
    display: flex;
    align-items: center;
    padding: 10rem 20rem;
    font-size: 18rem;
  }
  :deep(.van-uploader__wrapper) {
    display: flex;
    justify-content: space-between;
  }

  :deep(.van-uploader__preview) {
    margin: 2rem 2rem;
  }

  main {
    padding: 0 15rem;
    // height: 400rem;
    .textInput {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #e9e9e9;

      input {
        width: 100%;
        padding: 10rem 10rem;
        border: 0;
      }

      .title-number {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16rem;

        .title-length {
          color: lightgray;
        }
      }

      .text {
        width: 100%;
        height: 100rem;
        font-size: 14rem;
        padding: 10rem 10rem;
        border: 0;
      }

      .btn {
        padding: 10rem 0;
        width: 100%;

        .btn-left {
          font-size: 14rem;
          display: flex;
          justify-content: space-between;

          overflow-x: auto;
          white-space: nowrap;
          -ms-overflow-style: none;
          scrollbar-width: none;

          .label {
            width: 50rem;
            padding: 5rem 10rem;
            background-color: #e9e9e9;
            border-radius: 50rem;
            text-align: center;
            letter-spacing: 2rem;

            margin-right: 5rem;

            &.active-label {
              background-color: #007bff !important;
              color: rgb(255, 255, 255) !important;
            }
          }
        }
      }
    }

    .switch {
      padding: 15rem 0;
      display: flex;
      justify-content: space-between;

      .switch-text {
        font-size: 14rem;
      }

      .switch-box {
        width: 50rem;
        height: 20rem;
        background-color: lightgray;
        padding: 0rem 1rem;
        border-radius: 50rem;

        .switch-btn {
          width: 20rem;
          height: 20rem;
          background-color: white;
          box-shadow: 0 0 3rem 1rem lightgrey;
          border-radius: 50rem;
          transition: transform 0.3s ease;
        }
      }
    }
  }

  footer {
    position: sticky;
    bottom: 0;
    padding: 5rem 20rem;

    .bottom {
      padding: 10rem 20rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50rem;
      color: white;
      background-color: red;
      margin-top: 30rem;
    }
  }
}
</style>
