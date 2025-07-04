<!-- publish 发布 -->

<template>
  <div class="publish" v-if="!posts.length">
    <div class="image-txt">
      <van-image width="120rem" height="100rem" src="/public/笔记公开.png" />
      <div class="txt">{{ text[0].name }}</div>
    </div>
    <div class="publish-btn" @click="$router.push('/publishPage')">去发布</div>
  </div>

  <div class="publish-listbox" v-else>
    <div
      class="publish-list"
      v-for="post in posts"
      :key="post.id"
      @click="handleClick(post)"
    >
      <div class="publish-public">
        <div class="publish-imiage">
          <van-image
            fit="cover"
            width="160rem"
            height="160rem"
            style="display: block"
            :src="`http://localhost:8080/${post?.imageUrl[0]}`"
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

          <div class="audit" v-else-if="post.status22 === '未通过'">
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
import { parseQuery, useRouter } from "vue-router";
import { apipublish, apiusers } from "@/api/api.js";
import { useCounterStore } from "@/stores/counter.js";
import { throttle } from "lodash";

const router = useRouter();
const counterStore = useCounterStore();

const text = ref([
  { name: "晒出你的实习日常" },
  { name: "打卡你的学习日常" },
  { name: "晒晒你的今日穿搭" },
  { name: "晒晒你手机里的美图" },
  { name: "分享你的工作日常" },
]);

setInterval(() => {
  text.value.push(text.value.shift());
}, 10000);

// 获取本地存储中的username
const userToken = localStorage.getItem("userToken");
console.log("userToken", userToken);

// 作品列表
const posts = ref([]);
console.log("posts", posts.value);

const fetchData = throttle(() => {
  setTimeout(() => {
    if (userToken) {
      Promise.all([apipublish(), apiusers(userToken)]).then(
        ([publishRes, usersRes]) => {
          const arraypublish = publishRes.data;
          console.log("arraypublish", arraypublish);

          posts.value = arraypublish.filter(
            (item) => item.userToken === userToken && item.status === "公开"
          );
          console.log("posts查找", posts.value);

          const publishlength = posts.value.length;
          counterStore.setPublishLength(publishlength);

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
  if (post.status22 === "未审核" || post.status22 === "未通过") {
    localStorage.setItem("currentPost", JSON.stringify(post));
    router.push({ name: "publishPage" });
  } else if (post.status22 === "已审核") {
    router.push({ name: "ContentXq", params: { id: post.id } }); // 使用 post.id
    // console.log("未审核，不跳转");
  }
};
</script>

<style lang="less" scoped>
.publish {
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
      margin: 10rem 0;
      letter-spacing: 1rem;
    }
  }

  .publish-btn {
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

    background-color: #f9f9f9;
    // background-color: aqua;
    border: 1px solid rgba(186, 179, 179, 0.363);

    margin-bottom: 15rem;
    display: flex;
    justify-content: center;

    .publish-public {
      .publish-imiage {
        width: 100%;
        margin-bottom: 5rem;
        position: relative;

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
