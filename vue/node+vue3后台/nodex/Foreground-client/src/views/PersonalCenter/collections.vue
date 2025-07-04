<template>
  <div class="collections" v-if="!posts.length">
    <div class="image-txt">
      <van-image width="135rem" height="80rem" src="/public/笔记合集.png" />
      <div class="txt">创建你的第一个合集</div>
    </div>
    <div class="collections-btn" @click="collectionsPage">去创建</div>
  </div>

  <div class="publish-listbox" v-else>
    <div class="publish-list" v-for="post in posts" :key="post.id">
      <div class="publish-public">
        <img
          class="publish-sc"
          width="20rem"
          height="20rem"
          src="../../images/sc.png"
          alt=""
          @click="handleDelete(post)"
        />

        <div class="publish-imiage">
          <van-image
            fit="cover"
            width="160rem"
            height="160rem"
            :src="`http://localhost:8080/${post.imageUrl[0]}`"
            @click="handleClick(post)"
          />

          <div class="audit" v-if="post.status22 === '未审核'">
            <div class="audit-txt">{{ post.status22 }}</div>
            <van-image
              width="20rem"
              height="20rem"
              src="/public/警告.svg"
              alt=""
            />
          </div>

          <div class="audit" v-if="post.status22 === '未通过'">
            <div class="audit-txt" style="color: red">{{ post.status22 }}</div>
            <van-image
              width="20rem"
              height="20rem"
              src="/public/红警告.svg"
              alt=""
            />
          </div>
        </div>
        <div class="publish-title">
          {{ post.title }}
        </div>
        <div class="publish-individual">
          <div class="publish-avatar">
            <van-image
              width="20rem"
              height="20rem"
              :src="`http://localhost:8080/${post.useravatar}`"
            />
          </div>
          <div class="publish-name">{{ post.mingcheng }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { showConfirmDialog } from "vant";
import { useRouter } from "vue-router";
import { apipublish, apiusers } from "@/api/api.js";
import { useCounterStore } from "@/stores/counter.js";
import axios from "axios";

import { throttle } from "lodash";

const counterStore = useCounterStore();

const router = useRouter();
const userToken = localStorage.getItem("userToken");
const posts = ref([]);

const fetchData = throttle(() => {
  setTimeout(() => {
    if (userToken) {
      Promise.all([apipublish(), apiusers(userToken)]).then(
        ([publishRes, usersRes]) => {
          const arraypublish = publishRes.data;
          console.log("arraypublish", arraypublish);

          posts.value = arraypublish.filter(
            (post) => post.userToken === userToken
          );

          posts.value.forEach((post) => {
            console.log("遍历post", post); // 检查每个post对象
          });

          const collectionslength = posts.value.length;
          console.log("posts长度", collectionslength);

          counterStore.setcollectionslength(collectionslength);

          const userData = usersRes.data.usersData;
          console.log("userData", userData);

          // 合并用户信息到 posts
          posts.value = posts.value.map((post) => ({
            ...post,
            useravatar: userData.avatar,
            mingcheng: userData.grzl.mingcheng,
          }));

          console.log("合并posts", posts.value);
        }
      );
    }
  }, 300);
}, 1000);

onMounted(() => {
  fetchData();
});

const handleClick = (post) => {
  if (!post || !post.status22) {
    console.error("无效的post对象:", post);
    return;
  }
  console.log("点击事件触发,post对象:", post);
  if (
    post.status22 === "未审核" ||
    post.status22 === "未通过" ||
    post.status22 === "已审核"
  ) {
    localStorage.setItem("currentPost", JSON.stringify(post));
    router.push({ name: "publishPage" });
  } else if (post.status22 === "已审核") {
    router.push({ name: "ContentXq", params: { id: post.id } }); // 使用 post.id
    // console.log("未审核，不跳转");
  }
};

const handleDelete = async (post) => {
  try {
    // 显示二次确认框
    await showConfirmDialog({
      title: "提示",
      message: "确定要删除这篇文章吗？",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });

    // 发送删除请求
    const response = await axios.post(
      "http://localhost:8080/api/articles/delete",
      {
        id: post.id,
      }
    );

    // 检查后端响应是否成功
    if (response.data.success) {
      console.log(`文章 id ${post.id} 已成功删除。`);
      // 从 posts 中移除已删除的项
      posts.value = posts.value.filter((item) => item.id !== post.id);
    } else {
      console.error(
        `删除文章 id ${post.id} 失败，状态: ${response.data.message}`
      );
    }
  } catch (error) {
    if (error.message === "cancel") {
      console.log("用户取消了删除操作");
      return; // 直接退出，避免执行后续错误处理逻辑
    }
  }
};
</script>

<style lang="less" scoped>
.collections {
  // background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rem 0 50rem 0;

  .image-txt {
    padding-top: 50rem;
    text-align: center;

    .txt {
      font-size: 14rem;
      margin-bottom: 10rem;
      letter-spacing: 1rem;
    }
  }

  .collections-btn {
    border: 1rem solid lightgray;
    padding: 5rem 15rem;
    border-radius: 50rem;
  }
}

.publish-listbox {
  // height: 100vh;
  // width: 90%;
  // margin-left: 3rem;
  padding: 10rem 15rem 50rem 15rem;
  // background-color: #fafafa;

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  // &:after {
  //   content: "";
  //   flex: auto;
  // }

  .publish-list {
    width: 160rem;
    height: 215rem;
    position: relative;

    background-color: #f9f9f9;
    // background-color: aqua;
    border: 1px solid rgba(186, 179, 179, 0.363);

    margin-bottom: 15rem;
    display: flex;
    justify-content: center;
    .publish-sc {
      position: absolute;
      top: 10rem;
      right: 5rem;
      z-index: 1;
    }
    .publish-public {
      .publish-imiage {
        width: 100%;
        margin-bottom: 5rem;

        .audit {
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.3);
          width: 100%;
          height: 160rem;
          // border-radius: 15rem 15rem;

          display: flex;
          justify-content: center;
          align-items: center;

          .audit-txt {
            margin-right: 5rem;
            color: red;
          }
        }
      }

      .publish-title {
        padding: 0 10rem;
        font-size: 12rem;
        margin-bottom: 3rem;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .publish-individual {
        display: flex;
        align-items: center;
        padding: 0 10rem;
        font-size: 12rem;

        .publish-avatar {
          margin-right: 5rem;

          :deep(.van-image__img) {
            border-radius: 50rem;
          }
        }
      }
    }
  }
}
</style>
