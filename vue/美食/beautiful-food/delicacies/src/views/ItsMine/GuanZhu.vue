<!-- guanzhuttwo  -->
<template>
  <div class="guanzhu">
    <nav style="position: sticky; top: 0">
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
          padding: 15rem 0;
          background-color: white;
          text-align: center;
          font-weight: bold;
        "
      >
        关注
      </div>
    </nav>

    <div class="list" v-if="list.length > 0">
      <div class="list-name" v-for="list in listmsg" :key="list.userid">
        <div class="information">
          <van-image width="50rem" height="50rem" :src="list.avatar_medium" />
          <div class="name">
            <div
              class="nametitle"
              v-html="
                `${list.nick} <i style='color: orange;'>LV.${list.lv}</i>`
              "
            ></div>
            <div class="introduction">{{ list.introduction }}</div>
          </div>
        </div>
        <div class="btn">
          <div
            class="concern"
            v-if="isadd(list.userid)"
            @click="unfollow(list.userid)"
          >
            已关注
          </div>
          <div class="followed" v-else @click="unfollow(list.userid)">关注</div>
        </div>
      </div>
    </div>
    <div class="text" v-else>四处逛逛，结识有趣的吃货</div>
  </div>
</template>
<script setup>
import { userDetails } from "@/api/axios";
import { ref, onMounted, nextTick } from "vue";

const onClickLeft = () => history.back();

// 获取本地存储
// const userid = JSON.parse(localStorage.getItem('guanzhulist'))
// console.log(userid)
const list = ref([]);
const listmsg = ref([]);
const userid = ref();

if (JSON.parse(localStorage.getItem("guanzhulist"))) {
  userid.value = JSON.parse(localStorage.getItem("guanzhulist"));
}

if (userid.value) {
  console.log("userid存在", userid.value);

  userid.value.forEach(async (id) => {
    try {
      const res = await userDetails(id);
      console.log(res.data.result.user);

      listmsg.value.push(res.data.result.user);
    } catch (error) {
      console.error("请求失败：", error);
    }
  });
  console.log("list关注", list.value);
} else {
  console.log("没有关注", list.value);
}

const isadd = (id) => {
  // 查找是否有当前id
  if (list.value.some((collected) => collected === id)) {
    return false;
  } else {
    return true;
  }
};
// 取消/关注
const unfollow = (id) => {
  console.log("取消关注", id);

  if (list.value.find((listid) => listid === id) !== -1) {
    // 取消
    list.value = list.value.filter((listid) => listid != id);

    console.log(list.value);
  } else {
    // 添加
    list.value.push(id);
  }

  // 更新
  localStorage.setItem("guanzhulist", JSON.stringify(list.value));

  nextTick(() => {
    list.value = JSON.parse(localStorage.getItem("guanzhulist"));
    console.log("更新关注", list.value);
    window.location.reload();
  });
};

onMounted(() => {
  // 读取
  const readconcern = JSON.parse(localStorage.getItem("guanzhulist"));

  if (readconcern) {
    // 如果存在，将赋值给 bookmarkNotes
    list.value = JSON.parse(localStorage.getItem("guanzhulist"));
    console.log("读取关注", list.value);
  }
});
</script>

<style scoped lang="less">
.guanzhu {
  background-color: #f3f2ed;

  .list {
    .list-name {
      background-color: white;
      padding: 15rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;

      .information {
        display: flex;

        .van-image {
          margin-right: 15rem;

          :deep(.van-image__img) {
            border-radius: 50rem;
          }
        }

        .name {
          width: 120rem;

          .nametitle {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            max-width: 120rem;
          }

          .introduction {
            padding-top: 10rem;
            font-size: 12rem;
            color: #ccc;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            max-width: 120rem;
          }
        }
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;

      .concern {
        padding: 3rem 20rem;
        border-radius: 50rem;
        background-color: red;
        color: white;
      }

      .followed {
        padding: 3rem 20rem;
        border-radius: 50rem;
        background-color: #f5f5f5;
        color: #ababab;
      }
    }
  }

  .text {
    padding: 30rem 0;
    color: gray;
    font-size: 12rem;
    text-align: center;
  }
}
</style>
