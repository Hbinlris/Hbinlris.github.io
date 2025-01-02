<!--CulinaryDetails 菜谱详情页 -->
<template>
  <div class="CulinaryDetails" v-if="recipe" ref="CulinaryDetails">
    <!-- 顶部导航栏 -->
    <div class="top" ref="top">
      <van-icon name="arrow-left" class="return" color="#000" @click="back" />
    </div>

    <!-- 视频 -->
    <div class="video" v-if="recipe.vfurl">
      <video
        :src="recipe.vfurl"
        style="background-color: black"
        controls="controls"
        class="video-item"
      />
    </div>
    <!-- 图片 -->
    <div v-else-if="recipe.thumb_path">
      <van-image class="iamge" :src="recipe.thumb_path" fit="cover" />
    </div>

    <!-- 浏览 -->
    <div class="content">
      <div class="bigtitle">
        <h3>{{ recipe.title }}</h3>
        <div class="label">
          {{ `浏览${recipe.views_count_text} ·` }}
          {{ `收藏${recipe.favo_counts_text}` }}
        </div>
      </div>
      <!-- 关注 -->
      <div class="avatar">
        <div class="grade" @click="navigateToUserDetails(recipe.user.user_id)">
          <van-image class="avatar-img" :src="recipe.user.user_photo" />
          <div class="nickname">
            {{ recipe.user.nickname }}
            <i>{{ `Lv.${recipe.user.lvl}` }}</i>
          </div>
        </div>
        <!-- 关注 -->
        <div
          class="concern"
          v-if="isaddd(recipe.user.user_id)"
          @click="GuanZhufn(recipe.user.user_id)"
        >
          关注
        </div>
        <div class="followed" v-else @click="GuanZhufn(recipe.user.user_id)">
          已关注
        </div>
      </div>
      <!-- 作者 -->
      <div class="cookstory">{{ recipe.cookstory }}</div>

      <!-- 时间 -->
      <div class="time">
        <div class="number" v-if="recipe.cook_time">
          <van-image
            class="cook_time_image"
            :src="recipe.cook_time_image"
            fit="cover"
          />
          {{ recipe.cook_time }}
        </div>
        <div class="number" v-if="recipe.cook_difficulty">
          <van-image
            class="cook_time_image"
            :src="recipe.cook_difficulty_image"
            fit="cover"
          />
          {{ recipe.cook_difficulty }}
        </div>
      </div>

      <!-- 食材清单 -->
      <div class="ingredients">
        <div class="title">
          <p>食材清单</p>
          <p
            v-if="isadd(recipe.cook_id)"
            class="add"
            @click="addShop(recipe.cook_id)"
          >
            加入采购清单
          </p>
          <p v-else class="add" @click="deleteItem(recipe.cook_id)">
            移出采购清单
          </p>
        </div>
        <div
          class="major"
          v-for="ingredients in recipe.major"
          :key="ingredients.index"
          @click="gotufoodDetails(ingredients.title)"
        >
          <div class="major-title">{{ ingredients.title }}</div>
          <div class="major-note">{{ ingredients.note }}</div>
        </div>
      </div>

      <!-- 烹饪步骤 -->
      <div class="cooking">
        <div class="title">
          <div class="steps">烹饪步骤</div>
          <!-- 点击进入烹饪模式 -->
          <div class="magnify" @click="gotocook">点击进入烹饪模式</div>
        </div>

        <div
          class="cookstep"
          v-for="(cooksteps, index) in recipe.cookstep"
          :key="index"
        >
          <!-- 总数 -->
          <div class="length">
            {{ `步骤${index + 1}/${recipe.cookstep.length}` }}
          </div>
          <!-- 图片  -->
          <van-image class="image" :src="cooksteps.image" />
          <!-- 操作 -->
          <div class="content">{{ cooksteps.content }}</div>
        </div>
      </div>
    </div>

    <!-- 底部栏 -->
    <div class="bottomBar">
      <!-- 评论 -->
      <input type="text" placeholder="说点什么..." />

      <div class="c">
        <van-icon name="chat-o" size="26rem" @click="showPopup" />
        <van-popup
          v-model:show="show"
          :style="{ padding: '15px' }"
          position="bottom"
          round
          closeable
        >
          <!-- 评论展示 -->
          <ul>
            <li
              v-for="item in talks"
              :key="item.id"
              style="
                border-bottom: 1px solid #ccc;
                padding-bottom: 5rem;
                margin-bottom: 15srem;
              "
            >
              <!-- 用户 -->
              <div>
                <p style="margin: 5rem">
                  <van-image
                    width="20rem"
                    style="border-radius: 50%; overflow: hidden"
                    :src="item.u.p"
                  ></van-image>
                  <span style="color: #747474"
                    >{{ item.u.n }} LV.{{ item.u.lvl }}</span
                  >
                </p>
              </div>
              <!-- 评论内容 -->
              <span
                class="talk"
                v-if="item.content[0].c"
                style="margin-left: 26rem"
                >{{ item.content[0].c }}</span
              >
            </li>
          </ul>
          <ul class="talk" v-if="!talks">
            暂无评论
          </ul>
        </van-popup>
      </div>

      <div class="c-r">
        <van-icon
          name="star"
          v-if="isCollected.includes(recipe.cook_id)"
          style="font-size: 26rem; color: red"
          @click="collection(recipe.cook_id)"
        />
        <van-icon
          name="star-o"
          size="26rem"
          v-else
          @click="collection(recipe.cook_id)"
        />

        <div class="collection">收藏</div>
      </div>
    </div>
  </div>

  <div class="scroll" v-else>
    <!-- 顶部导航栏 -->
    <!-- <div style="text-align: center; margin-top: 300rem">菜谱正在审核！</div>
      -->
    <div class="suibian">
      <van-image width="150rem" src="/loading.gif" />
    </div>
  </div>
</template>

<script setup>
import { RecipeDetail, recipeReviews } from "@/api/axios";
import { useRoute } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";
import { showToast } from "vant";
import { useUserStore } from "@/stores/user";

const route = useRoute();

const show = ref(false);
const showPopup = () => {
  show.value = true;
};
// 评论数据
const talks = ref();

// 返回
const back = () => {
  router.back();
};

let guanzhulist = ref([]);
const isaddd = (id) => {
  // 查找是否关注有当前id
  return !guanzhulist.value.some((collected) => collected === Number(id));
};
// 点击图片烹饪模式
const gotocook = () => {
  router.push({
    path: "/CookModel",
    query: {
      id: route.query.id,
      // position: index,
    },
  });
};
// 加入采购
const isadd = (id) => {
  // 查找是采购否有当前id
  if (addList.value.some((collected) => collected === id)) {
    console.log("已经存在");
    return false;
  } else {
    console.log("没有");

    return true;
  }
};
onMounted(() => {
  isadd();
});
let addList = ref([]);
if (JSON.parse(localStorage.getItem("addList"))) {
  addList.value = JSON.parse(localStorage.getItem("addList"));
}
const addShop = (id) => {
  console.log("加入", id);

  // 查找是否有当前id
  if (addList.value.some((collected) => collected === id)) {
    // 取消
    console.log("已经存在");
  } else {
    // 添加
    addList.value.push(id);
  }
  // 更新
  localStorage.setItem("addList", JSON.stringify(addList.value));
  // window.location.reload();
};
// 移出采购
const deleteItem = (id) => {
  console.log("移出", id);
  // 查找是否有当前id
  if (addList.value.some((collected) => collected === id)) {
    // 删除
    addList.value = addList.value.filter((collectedId) => collectedId !== id);

    localStorage.setItem("addList", JSON.stringify(addList.value));
  }
  // window.location.reload();
};
// ---------------------
const gotufoodDetails = (title) => {
  router.push({
    path: "/FoodDetails",
    query: {
      title: title,
    },
  });
};
const recipeid = ref(route.query.id);
const recipe = ref();

RecipeDetail(recipeid.value).then((res) => {
  // recipe.value = res.data.result
  recipe.value = res.data.result.recipe;
  console.log("res111", recipe.value);
});

// 菜谱评论
recipeReviews(recipeid.value).then((res) => {
  console.log("评论", res.data);
  talks.value = res.data.result.comments;
  console.log(talks.value);
});

onMounted(() => {
  // 读取本地收藏
  const collected = localStorage.getItem("guanzhulist");
  if (collected) {
    guanzhulist.value = JSON.parse(collected);
    // isadd(userId);
  }
});
// 跳转到用户详情页并传递对应的 nameids 值
const navigateToUserDetails = (userId) => {
  if (userId) {
    router.push({ path: "/UserDetails", query: { id: userId } });
  }
};
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
      isadd();
    } else {
      // 添加
      console.log("关注", id);
      isadd();

      guanzhulist.value.push(Number(id));
    }
    // 更新
    localStorage.setItem("guanzhulist", JSON.stringify(guanzhulist.value));
  }
};

let isCollected = ref([]);
// 获取当前路由的完整路径
const currentPath = router.currentRoute.value.fullPath;
const collection = (id) => {
  console.log("收藏", id);

  const userStore = useUserStore();
  if (!userStore.Loginguard()) {
    // 用户未登录，提示登录
    showToast("请先登录");
    router.push({ name: "Login", query: { redirect: currentPath } });
    return;
  } else if (userStore.Loginguard()) {
    // 查找是否有当前id
    if (isCollected.value.some((collected) => collected === id)) {
      // 取消
      isCollected.value = isCollected.value.filter(
        (collectedId) => collectedId !== id
      );
    } else {
      // 添加
      isCollected.value.push(id);
    }
    // 更新
    localStorage.setItem("isCollected", JSON.stringify(isCollected.value));
  }
};

onMounted(() => {
  // 读取本地收藏
  const collected = localStorage.getItem("isCollected");
  if (collected) {
    isCollected.value = JSON.parse(collected);
  }
});
</script>

<style lang="less" scoped>
.suibian {
  width: 375rem;
  height: 400rem;
  display: flex;
  justify-content: center;
  align-items: center;

  align-items: center;
}

.CulinaryDetails {
  // 顶部导航栏
  .top {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    // background-image: linear-gradient(to bottom,
    //     rgba(0, 0, 0, 0.3),
    //     rgba(255, 255, 255, 0.3));
    background-color: #fff;
    padding: 10rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .return {
      font-size: 25rem;
    }
  }

  // 视频

  .video {
    .video-item {
      width: 100%;
      height: auto;
    }
  }

  // 图片
  .iamge {
    width: 100%;
    // height: 280rem;
    margin-top: 45rem;
    display: block;
  }

  // 浏览
  .content {
    // background-color: aqua;
    padding: 0 10rem;
    font-weight: normal;

    .bigtitle {
      padding: 15rem 0;

      h3 {
        font-weight: 500;
        margin: 5rem 0;
      }

      .label {
        font-size: 12rem;
        color: #747474;
      }
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15rem 0;

      .grade {
        display: flex;
        align-items: center;

        .avatar-img {
          width: 40rem;
          height: 40px;
          margin-right: 5rem;

          :deep(.van-image__img) {
            border-radius: 50rem;
          }
        }

        .nickname {
          font-size: 13rem;
          font-weight: bold;

          i {
            color: orange;
          }
        }
      }

      .concern {
        background-color: #e42e2ecf;
        color: white;
        padding: 5rem 25rem;
        border-radius: 30rem;
        text-align: center;
      }

      .followed {
        background-color: #f5f5f5;
        color: #ababab;
        padding: 5rem 25rem;
        border-radius: 30rem;
        text-align: center;
      }
    }

    .cookstory {
      font-size: 15rem;
      padding-bottom: 8rem;
    }

    .time {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 15rem 0;

      .number {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 14rem;

        .cook_time_image {
          margin-right: 10rem;
          width: 20rem;
          height: 20rem;
        }
      }
    }

    // 食材
    .ingredients {
      padding: 5rem 0;

      .title {
        font-weight: bold;
        font-size: 15rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
          font-size: 14rem;
        }

        .add {
          font-weight: normal;
          font-size: 14rem;
          color: #52979f;
        }
      }

      .major {
        display: flex;
        justify-content: space-between;
        padding-bottom: 12rem;
        color: #818181;

        .major-title {
          font-size: 16rem;
        }

        .major-note {
          font-size: 16rem;
        }
      }
    }

    // 烹饪
    .cooking {
      padding: 10rem 0;
      margin-bottom: 50rem;

      .title {
        padding-bottom: 20rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .steps {
          font-weight: bold;
          font-size: 15rem;
        }

        .magnify {
          font-weight: normal;
          font-size: 14rem;
          color: #52979f;
        }
      }

      .cookstep {
        padding-bottom: 10rem;

        .length {
          font-weight: bold;
          padding-left: 4rem;
        }

        .image {
          padding: 10rem 0;

          :deep(.van-image__img) {
            border-radius: 10rem;
          }
        }

        .content {
          font-size: 15rem;
          line-height: 27rem;
          padding-bottom: 6rem;
        }
      }
    }
  }

  .bottomBar {
    width: 95vw;
    background-color: white;

    position: fixed;
    bottom: 0;
    z-index: 100;

    padding: 10rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    box-shadow: 0rem 0rem 20rem 0rem #cccccc8c;

    // 评论
    .c {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 100%;

      ul {
        .talk {
          font-size: 12rem;
        }

        li {
          p {
            display: flex;
            align-items: center;

            span {
              font-size: 12rem;
            }
          }
        }
      }
    }

    // 收藏
    .c-r {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 70rem;
    }

    input {
      width: 25%;
      padding: 8rem 20rem;
      border-radius: 50rem;
      border: 1rem solid #f6f6f6;
      background-color: #f6f6f6;
    }
  }
}

.scroll {
  .top {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 10rem 0;
    color: white;

    .return {
      font-size: 30rem;
    }
  }
}
</style>
