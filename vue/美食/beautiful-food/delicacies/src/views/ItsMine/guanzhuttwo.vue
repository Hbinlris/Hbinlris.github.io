<template>
  <div class="guanzhu">
    <nav style="position: sticky; top: 0; z-index: 100;">
      <van-nav-bar
        title="我的好友"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div
        class="label"
        style="
          border-bottom: 1px solid #ccc;
          padding: 15px 0;
          background-color: white;
          text-align: center;
          font-weight: bold;
        "
      >
        关注
      </div>
    </nav>

    <div class="list" v-if="listmsg.length > 0">
      <div class="list-name" v-for="item in listmsg" :key="item.userid">
        <div class="information">
          <van-image width="50px" height="50px" :src="item.avatar_medium" />
          <div class="name" @click="navigateToUserDetails(item.userid)">
            <div
              class="nametitle"
              v-html="
                `${item.nick} <i style='color: orange;'>LV.${item.lv}</i>`
              "
            ></div>
            <div class="introduction">{{ item.introduction }}</div>
          </div>
        </div>
        <div class="btn">
          <div
            class="concern"
            v-if="isFollowing(item.userid)"
            @click="toggleFollow(item.userid)"
          >
            已关注
          </div>
          <div class="followed" v-else @click="toggleFollow(item.userid)">
            关注
          </div>
        </div>
      </div>
    </div>
    <div class="text" v-else>四处逛逛，结识有趣的吃货</div>
  </div>
</template>

<script setup>
import { userDetails } from "@/api/axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const onClickLeft = () => history.back();

const list = ref([]); // 存储关注的用户ID
const listmsg = ref([]); // 存储关注用户的详细信息

onMounted(async () => {
  // 获取用户ID
  const storedUserIds = JSON.parse(localStorage.getItem("guanzhulist"));

  // 检查是否存在的用户ID列表且不为空
  if (storedUserIds && storedUserIds.length > 0) {
    list.value = storedUserIds;
    try {
      // 创建一个Promise数组，每个Promise对应一个用户详情请求
      const userPromises = list.value.map((id) => userDetails(id));

      // 并行执行所有用户详情请求，并等待所有请求完成
      const responses = await Promise.all(userPromises);

      // 将所有响应结果中的用户详情提取出来，赋值给listmsg
      listmsg.value = responses.map((res) => res.data.result.user);
    } catch (error) {
      // 捕获并打印请求过程中可能出现的错误
      console.error("请求失败：", error);
    }
  } else {
    // 如果localStorage中没有已关注的用户ID列表，则输出日志
    console.log("没有关注");
  }
});
// const idn = ref(Number);
// 判断是否正在关注某个用户
const isFollowing = (id) => {
  return list.value.includes(Number(id)); // 返回list中是否包含指定的用户ID
};
// 跳转
const navigateToUserDetails = (userId) => {
  console.log("userId", userId);

  if (userId) {
    router.push({ path: "/UserDetails", query: { id: userId } });
  }
};

// 切换关注状态（关注或取消关注）
const toggleFollow = (id) => {
  if (isFollowing(Number(id))) {
    // 如果正在关注，则取消关注
    list.value = list.value.filter((userId) => userId !== Number(id));
  } else {
    // 如果未关注，则添加关注
    list.value.push(Number(id));
  }
  // 将更新后的关注列表保存到localStorage
  localStorage.setItem("guanzhulist", JSON.stringify(list.value));
};
</script>

<style scoped lang="less">
.guanzhu {
  background-color: #f3f2ed;

  .list {
    .list-name {
      background-color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;

      .information {
        display: flex;

        .van-image {
          margin-right: 15px;

          :deep(.van-image__img) {
            border-radius: 50%;
          }
        }

        .name {
          width: 120px;

          .nametitle {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            max-width: 120px;
          }

          .introduction {
            padding-top: 10px;
            font-size: 12px;
            color: #ccc;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            max-width: 120px;
          }
        }
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;

      .concern {
        padding: 3px 20px;
        border-radius: 50rem;
        background-color: red;
        color: white;
      }

      .followed {
        padding: 3px 20px;
        border-radius: 50rem;
        background-color: #f5f5f5;
        color: #ababab;
      }
    }
  }

  .text {
    padding: 30px 0;
    color: gray;
    font-size: 12px;
    text-align: center;
  }
}
</style>
