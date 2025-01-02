<template>
  <div class="note">
    <div class="notebox" v-if="datalist.length != 0">
      <ul
        style="
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          padding: 0 20rem;
          margin-top: 10rem;
        "
      >
        <li
          v-for="item in datalist"
          :key="item.id"
          style="width: 160rem; margin-bottom: 10rem"
          @click="
            $router.push({
              path: '/NoteDetailPage',
              query: { id: item.id },
            })
          "
        >
          <div class="up">
            <van-image
              width="160rem"
              radius="10rem"
              fit="cover"
              :src="item.entity.img"
            />
          </div>
          <!-- {{ item.entity.img }} -->
          <div class="down">
            <p style="margin: 0; color: #a7a7a7; font-size: 11rem">
              {{ item.straight_text }}
            </p>
            <h5
              style="
                display: -webkit-box;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                margin: 3rem 0;
                font-size: 11rem;
              "
            >
              {{ item.share_info.name }}
            </h5>
            <div
              class="msg"
              style="display: flex; align-items: center; margin-top: 5rem"
            >
              <!-- 用户头像 -->
              <van-image
                width="10rem"
                radius="50%"
                :src="item.author.p"
              ></van-image>
              <span
                style="color: #a7a7a7; font-size: 9rem; margin-left: 3rem"
                >{{ item.author.n }}</span
              >
            </div>
          </div>
        </li>
      </ul>
      <div
        class="end"
        style="
          width: 100%;
          text-align: center;
          color: #a7a7a7;
          margin: 100rem 0;
        "
      >
        ---这是底线----
      </div>
    </div>

    <div class="nodata" v-else>
      <van-image src="/caipubg.png" />
      <p>您还没有收藏的笔记</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.note {
  .nodata {
    // display: flex;
    // justify-content: center;
    text-align: center;
    color: #adadad;
  }
}
</style>

<script setup>
import { ref } from "vue";
import { collectNote } from "@/api/index";
import { useRoute } from "vue-router";
const route = useRoute();
const data = ref(JSON.parse(localStorage.getItem("bookmarkNotes")));

const datalist = ref([]);
if (data.value) {
  console.log("data存在", data.value);
  data.value.forEach(async (id) => {
    try {
      // 调用 API 获取菜谱详情
      const res = await collectNote(id);
      // 将结果添加到 datalist 数组中
      datalist.value.push(res.data.result.note);
      console.log("结果", res.data.result.note);
    } catch (error) {
      console.error("请求失败：", error);
    }
  });
  console.log("datalist", datalist.value);
} else {
  console.log("参数错误", datalist.value);
}
</script>
