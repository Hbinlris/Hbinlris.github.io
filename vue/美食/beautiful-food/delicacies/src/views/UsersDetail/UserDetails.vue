<template>
  <div class="user-details" style="width: 375rem; overflow: hidden">
    <!-- 导航栏 -->
    <van-nav-bar left-arrow @click-left="onClickLeft" />

    <!-- 用户头像 -->
    <div
      class="c1"
      style="display: flex; align-items: center; margin-bottom: 30rem"
    >
      <img
        :src="userphoto"
        alt=""
        style="
          width: 60px;
          height: 60rem;
          border-radius: 50%;
          margin: 5rem;
          position: relative;
          top: 15rem;
        "
      />
      <div class="c1msg">
        <!-- 用户昵称 -->
        <p
          style="
            font-weight: bold;
            margin-left: 10rem;
            margin-bottom: 5rem;
            font-size: 16rem;
          "
        >
          {{ usernick }}
        </p>

        <!-- 用户vip -->
        <img
          v-if="uservip"
          :src="uservip"
          alt=""
          style="width: 25rem; position: relative; right: 275rem; top: 24rem"
        />

        <!-- 关注按钮 -->
        <button
          v-if="isadd(userId)"
          style="
            width: 240px;
            height: 30px;
            background-color: #f9494b;
            border: none;
            border-radius: 50px;
            margin-left: 10px;
            float: left;
            color: white;
          "
          @click="GuanZhufn(userId)"
        >
          关注
        </button>
        <button
          v-else
          style="
            width: 240px;
            height: 30px;
            background-color: #f5f5f5;
            border: none;
            color: #aab0b6;
            border-radius: 50px;
            margin-left: 10px;
            float: left;
          "
          @click="GuanZhufn(userId)"
        >
          已关注
        </button>
      </div>
    </div>

    <!-- 新增：性别、年龄和地址展示 -->
    <div
      class="msg"
      style="
        display: flex;
        justify-content: space-around;
        font-weight: bold;
        font-size: 16rem;
        width: 60vw;
        /* margin-left: 5rem; */
      "
    >
      <div style="font-size: 12rem; font-weight: normal">{{ genderText }}</div>
      <div style="font-size: 12rem; font-weight: normal">{{ age }}</div>
      <div style="font-size: 12rem; font-weight: normal">{{ address }}</div>
    </div>

    <!-- 用户简介 -->
    <p
      style="
        width: 70vw;
        margin-left: 15rem;
        font-size: 12rem;
        color: #333333;
        white-space: pre-wrap;
        line-height: 23rem;
      "
    >
      {{ userintro }}
    </p>

    <!-- 新增：关注数、粉丝数、被收藏、被学做和经验值展示 -->
    <div class="c2">
      <ul
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
          text-align: center;
          margin: 15rem 0;
          padding: 0 10rem;
        "
      >
        <li style="font-size: 14rem">
          {{ following_count_text }}
          <div style="font-size: 10rem; margin-top: 10rem; color: #b8b8b8">
            关注
          </div>
        </li>
        <li style="font-size: 14rem">
          {{ followers_count_text }}
          <div style="font-size: 10rem; margin-top: 10rem; color: #b8b8b8">
            粉丝
          </div>
        </li>
        <li style="font-size: 14rem">
          {{ favoed_count_text }}
          <div style="font-size: 10rem; margin-top: 10rem; color: #b8b8b8">
            被收藏
          </div>
        </li>
        <li style="font-size: 14rem">
          {{ noted_count_text }}
          <div
            style="
              font-size: 10rem;
              margin-top: 10rem;

              color: #b8b8b8;
            "
          >
            被学做
          </div>
        </li>
        <li style="font-size: 14rem">
          {{ point_text }}
          <div style="font-size: 10rem; margin-top: 10rem; color: #b8b8b8">
            经验值
          </div>
        </li>
      </ul>
    </div>

    <div class="c3">
      <van-tabs v-model="active">
        <van-tab :title="`菜谱 ${recipes_count}`">
          <ul
            v-for="item in userRecipesList"
            :key="item.index"
            style="margin: 20rem 15rem"
          >
            <li style="display: flex" @click="gotoCulinaryDetails(item.r.id)">
              <!-- <p>{{ item.r.id }}</p> -->
              <div class="left">
                <van-image
                  width="30vw"
                  height="25vw"
                  fit="cover"
                  radius="10rem"
                  :src="item.r.img"
                />
              </div>
              <div
                class="right"
                style="
                  margin-left: 15rem;
                  display: flex;
                  align-items: flex-start;
                  flex-direction: column;
                  font-size: 12rem;
                "
              >
                <div style="margin-left: 0rem">
                  {{ item.r.n }}
                </div>
                <div style="font-size: 10rem; margin-top: 8rem">
                  {{ item.r.recommend_label }}
                </div>
                <div
                  class="msg"
                  style="display: flex; align-items: center; margin-top: 30rem"
                >
                  <van-image
                    width="20rem"
                    radius="50%"
                    :src="userphoto"
                    style="margin-right: 5rem"
                  />
                  <span style="color: #b8b8b8; font-size: 12rem">{{
                    usernick
                  }}</span>
                </div>
              </div>
            </li>
          </ul>
        </van-tab>

        <van-tab :title="`笔记 ${notes_count}`">
          <ul style="padding: 0 15rem">
            <li
              v-for="item in userNotesList"
              :key="item.imdex"
              style="
                width: 375rem;
                overflow: hidden;
                position: relative;
                margin-top: 30rem;
              "
            >
              <!-- <p>{{ item }}</p> -->
              <div class="left" style="width: 40rem; min-height: 105rem">
                <div style="font-size: 12rem">{{ item.month_text }}</div>
                <div
                  style="font-size: 25rem; font-weight: bold; margin-top: 10rem"
                >
                  {{ item.day_text }}
                </div>
              </div>
              <div
                class="right"
                v-for="item2 in item.day_list"
                :key="item2.id"
                style="position: absolute; left: 45rem; top: 0"
                @click="
                  $router.push({
                    path: '/NoteDetailPage',
                    query: { id: item2.id },
                  })
                "
              >
                <!-- <p>{{ item2.id }}</p> -->
                <van-image
                  width="100rem"
                  height="100rem"
                  fit="cover"
                  radius="10rem"
                  :src="item2.image_u"
                />
              </div>
            </li>
          </ul>
        </van-tab>

        <van-tab :title="`收藏`" style="padding: 15rem">
          <!-- ------------ -->

          <div
            class="info"
            v-for="item in userFavoriteList"
            :key="item.index"
            style="display: flex; margin: 10rem 5rem"
          >
            <div class="left" @click="gotoCulinaryDetails(item.id)">
              <van-image
                width="130rem"
                height="90rem"
                :src="item.img"
                fit="cover"
                alt=""
                radius="10rem"
              />
              <!-- <p>{{ item }}</p> -->
            </div>

            <div class="right" style="margin-left: 10rem">
              <div class="up">
                <div
                  style="
                    font-weight: normal;
                    margin-bottom: 8rem;
                    font-size: 14rem;
                  "
                >
                  {{ item.n }}
                </div>

                <span style="font-size: 10rem; padding: 0rem 0">{{
                  item.recommend_label
                }}</span>
              </div>
              <div
                class="user"
                style="display: flex; align-items: center; margin-top: 20rem"
              >
                <van-image
                  width="15rem"
                  style="
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 5rem;
                  "
                  :src="item.a.p"
                  alt=""
                />
                <!-- <p>{{ item.a.p }}</p> -->
                <span
                  class="nickname"
                  style="color: #b8b8b8; font-size: 10rem"
                  >{{ item.a.n }}</span
                >
              </div>
            </div>
          </div>

          <!-- ------------- -->
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router"; // 引入 useRoute 和 useRouter 以获取路由参数和返回功能
import { userRecipes } from "@/api/axios";
import { userNotes, userFavorites } from "@/api/index.js";
import { useUserStore } from "@/stores/user";

// 定义响应式数据
const active = ref(0);
const usernick = ref("");
const userphoto = ref("");
const uservip = ref("");

const age = ref("");
const address = ref("");
const userintro = ref("");
const archivementTags = ref([]);
const gender = ref("");
const genderText = ref("");
const following_count_text = ref("");
const followers_count_text = ref("");
const favoed_count_text = ref("");
const noted_count_text = ref("");
const point_text = ref("");
const recipes_count = ref("");
const notes_count = ref("");

// 通过路由参数获取用户 ID
const route = useRoute();
const guanzhulist = ref([]);
const isadd = (id) => {
  // 查找是否有当前id
  if (guanzhulist.value.some((collected) => collected === Number(id))) {
    return false;
  } else {
    return true;
  }
};
onMounted(() => {
  // 读取本地收藏
  const collected = localStorage.getItem("guanzhulist");
  if (collected) {
    guanzhulist.value = JSON.parse(collected);
    // isadd(userId);
  }
});
const GuanZhufn = (id) => {
  const userStore = useUserStore();
  if (!userStore.Loginguard()) {
    // 用户未登录，提示登录
    showToast("请先登录");
    router.push({ name: "Login", query: { redirect: currentPath } });
    return;
  } else if (userStore.Loginguard()) {
    // 查找是否有当前id
    if (guanzhulist.value.some((collected) => collected === Number(id))) {
      // 取消
      guanzhulist.value = guanzhulist.value.filter(
        (collectedId) => collectedId !== Number(id)
      );
      console.log("取关", id);
    } else {
      // 添加
      console.log("关注", id);
      guanzhulist.value.push(Number(id));
    }
    // 更新
    localStorage.setItem("guanzhulist", JSON.stringify(guanzhulist.value));
  }
};
const gotoCulinaryDetails = (id) => {
  // console.log("id", id);
  router.push({
    path: "/CulinaryDetails",
    query: {
      id: id,
    },
  });
};
const userId = route.query.id; // 获取传递的用户 ID
const router = useRouter(); // 创建 router 实例
const onClickLeft = () => router.back();
// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(
      `https://apis.netstart.cn/douguo/user/info/${userId}`
    );
    const userdetails = response.data.result.user;
    console.log(userdetails);

    usernick.value = userdetails.nick;
    userphoto.value = userdetails.avatar_medium;
    uservip.value = userdetails.verified_image; // 确保 uservip 被正确赋值
    archivementTags.value = userdetails.archivement_tags;
    userintro.value = userdetails.introduction;

    gender.value = userdetails.gender;
    genderText.value =
      gender.value === 2 ? "厨娘" : gender.value === 1 ? "厨男" : "未知";

    age.value = userdetails.age;
    address.value = userdetails.location;
    following_count_text.value = userdetails.following_count_text;
    followers_count_text.value = userdetails.followers_count_text;
    favoed_count_text.value = userdetails.favoed_count_text;
    noted_count_text.value = userdetails.noted_count_text;
    point_text.value = userdetails.point_text;
    recipes_count.value = userdetails.recipes_count;
    notes_count.value = userdetails.notes_count;
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 组件挂载后的生命周期钩子
onMounted(() => {
  fetchUserInfo();
});
// 获取用户食谱列表
const userRecipesList = ref();

userRecipes(userId).then((res) => {
  // console.log(res.data.result.list);
  userRecipesList.value = res.data.result.list;
});

// 获取用户笔记列表
const userNotesList = ref();
userNotes(userId).then((res) => {
  console.log(res.data.result.notes);
  userNotesList.value = res.data.result.notes;
});
// 获取用户收藏
const userFavoriteList = ref();
userFavorites(userId).then((res) => {
  // console.log("收藏", res.data.result.recipes);
  userFavoriteList.value = res.data.result.recipes;
});
</script>

<style lang="less" scoped>
/* 添加样式 */
</style>
