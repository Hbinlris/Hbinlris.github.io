<!-- NoteDetailPage  笔记详情-->

<template>
  <div class="NoteDetailPage" :key="route.query.id">
    <div class="return">
      <div class="arrow-left">
        <van-icon name="arrow-left" @click="router.back()" />
      </div>
      <div class="top">
        <div
          class="information"
          @click="navigateToUserDetails(note?.author?.id)"
        >
          <van-image width="35" height="35" :src="note?.author?.p" />
          <div class="name-grade">
            {{ note?.author?.n }}
            <i>{{ `LV.${note?.author?.lvl}` }}</i>
          </div>
        </div>
        <div
          class="concern"
          v-if="isadd(note?.author?.id)"
          @click="GuanZhufn(note?.author?.id)"
        >
          关注
        </div>
        <div class="followed" v-else @click="GuanZhufn(note?.author?.id)">
          已关注
        </div>
      </div>
    </div>

    <div class="video_url" v-if="note?.video_url">
      <video :src="note?.video_url" autoplay muted controls />
    </div>
    <van-swipe class="image" v-else-if="note?.images">
      <van-swipe-item
        class="images"
        v-for="(notes, index) in note?.images"
        :key="index"
      >
        <van-image :src="notes.u" class="u" />
      </van-swipe-item>
      <template #indicator="{ active }">
        <div class="custom-indicator">
          {{ active + 1 }}/{{ note?.images?.length }}
        </div>
        <!-- 精选 -->
        <div class="selected">{{ note?.selection_text }}</div>
      </template>
    </van-swipe>

    <div class="titles">
      <div class="title">{{ note?.title }}</div>

      <div class="content">
        <div class="c" v-for="content in note?.contents" :key="content.id">
          <div
            class="c-icon"
            v-if="content.icon"
            @click="gotoactivity(content.u)"
          >
            <van-image :src="content.icon" class="icon" />
            {{ content.c }}
          </div>
          <div class="c-text" v-else>
            <p v-html="content.c"></p>
          </div>
        </div>
      </div>

      <div class="like_count">
        <div class="publishtime">{{ formattedPublishtime }}</div>
        <div class="frequency">{{ `${note?.like_count}次赞` }}</div>
      </div>
    </div>

    <!-- 相关笔记 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="related_notes">
        <div class="title">相关笔记</div>
        <div class="related_notes-list">
          <div
            class="note"
            v-for="note in notesReviews"
            :key="note.id"
            @click="gotoNoteDetailPage(note.note.id)"
          >
            <van-image
              width="45vw"
              height="60vw"
              fit="cover"
              :src="note?.note?.image_u"
            />
            <div class="name-title">
              {{ note?.note?.title }}
            </div>

            <div class="avatarName">
              <van-image width="12rem" :src="note?.note?.author?.p" />
              <div class="avatarNamename">{{ note?.note?.author?.n }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <!-- 底部栏 -->
    <div class="bottomBar">
      <!-- 评论 -->
      <input type="text" placeholder="说点什么..." />

      <!-- 评论气泡 -->
      <div class="comments">
        <van-icon name="chat-o" class="chat-o" style="font-size: 30rem" />
        <div class="text">评论</div>
      </div>
      <!-- 喜欢 -->
      <div class="link">
        <van-icon name="like-o" class="like-o" style="font-size: 30rem" />
      </div>

      <!-- 收藏 -->
      <div class="collection">
        <div class="star">
          <van-icon
            name="star"
            v-if="bookmarkNotes.indexOf(note?.id) !== -1"
            style="font-size: 30rem; color: red"
            @click="gotonotecollection(note.id)"
          />
          <van-icon
            name="star-o"
            v-else
            style="font-size: 30rem"
            @click="gotonotecollection(note.id)"
          />
          <!-- :class="{ collected: bookmarkNotes.indexOf(note?.id) !== -1 }" -->
        </div>
        <div class="text">收藏</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { noteDetails, notesReview } from "@/api/index";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useUserStore } from "@/stores/user";

import { showToast } from "vant";

const route = useRoute();
const router = useRouter();
const id = ref(route.query.id);

const note = ref();

const guanzhulist = ref([]);

const isadd = (id) => {
  // 查找是否有当前id
  return !guanzhulist.value.some((collected) => collected === Number(id));
};
onMounted(() => {
  // 读取本地收藏
  const collected = localStorage.getItem("guanzhulist");
  if (collected) {
    guanzhulist.value = JSON.parse(collected);
  }
  isadd();
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

// 活动
const gotoactivity = (url) => {
  console.log("url", url);
  console.log(url);

  // window.location.href = url;
};
// 笔记详情
// noteDetails(id.value).then((res) => {
//   note.value = res.data.result.note
//   console.log('note.value', note.value);
// })
// 跳转到用户详情页并传递对应的 nameids 值
const navigateToUserDetails = (userId) => {
  if (userId) {
    router.push({ path: "/UserDetails", query: { id: userId } });
  }
};

const fetchNoteDetails = async () => {
  try {
    const res = await noteDetails(id.value);
    note.value = res.data.result.note;
    console.log("note.value", note.value);
  } catch (error) {
    console.error("Failed to fetch note details:", error);
  }
};

// 初始分页数
const offset = ref(0);
const limit = ref(10);

const notesReviews = ref();
const loading = ref(false);
const finished = ref(false);

// 笔记相关信息
// notesReview(id.value, offset.value, limit.value).then((res) => {
//   notesReviews.value = res.data.result.list
//   console.log('笔记详情信息', notesReviews.value);
// })

const fetchNotesReview = async () => {
  try {
    const res = await notesReview(id.value, offset.value, limit.value);
    notesReviews.value = res.data.result.list;
    console.log("笔记详情信息", notesReviews.value);
  } catch (error) {
    console.error("Failed to fetch notes review:", error);
  }
};

const gotoNoteDetailPage = (id) => {
  console.log("笔记详情", id);

  router.push({
    path: "/NoteDetailPage",
    query: { id: id },
  });
  // 回到顶部
  window.scrollTo(0, 0);
  // window.location.reload()
};

// 初始加载数据
fetchNoteDetails();
fetchNotesReview();

// 监听 id 的变化
watch(
  () => route.query.id,
  (newId) => {
    id.value = newId;
    fetchNoteDetails();
    fetchNotesReview();
  },
  { immediate: true } // 立即执行一次
);

const onLoad = () => {
  offset.value += limit.value;
  loading.value = true; // 开始加载

  // 笔记相关信息
  notesReview(id.value, offset.value, limit.value).then((res) => {
    const newReviews = res.data.result.list;
    // console.log('笔记详情信息', notesReviews.value);

    notesReviews.value = [...notesReviews.value, ...newReviews];

    // 检查是否已经加载完所有数据
    if (newReviews.length < limit.value) {
      finished.value = true;
    }

    // 追加新数据
    loading.value = false; // 加载完成
  });
};

let bookmarkNotes = ref([]);

// 获取当前路由的完整路径
const currentPath = router.currentRoute.value.fullPath;
// 笔记收藏
const gotonotecollection = (id) => {
  console.log("笔记收藏", id);

  const userStore = useUserStore();
  // 未登录
  if (!userStore.Loginguard()) {
    showToast("请先登录");
    router.push({ name: "Login", query: { redirect: currentPath } });
    return;
  } else if (userStore.Loginguard()) {
    if (bookmarkNotes.value.some((noteId) => noteId === id)) {
      // 取消
      bookmarkNotes.value = bookmarkNotes.value.filter(
        (notesId) => notesId !== id
      );
    } else {
      // 添加
      bookmarkNotes.value.push(id);
    }
    // 更新
    localStorage.setItem("bookmarkNotes", JSON.stringify(bookmarkNotes.value));
  }
};

onMounted(() => {
  // 读取
  const collected = localStorage.getItem("bookmarkNotes");

  if (collected) {
    // 如果存在，将赋值给 bookmarkNotes
    bookmarkNotes.value = JSON.parse(collected);
  }
});

// 计算时间差
const timeAgo = (publishtime) => {
  if (!publishtime) return "";
  const now = new Date();
  const publishDate = new Date(publishtime.replace(" ", "T"));
  const diffTime = Math.abs(now - publishDate);
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

  return `${diffHours} 小时前`;
};

// 计算属性
const formattedPublishtime = computed(() => {
  return timeAgo(note.value?.publishtime);
});
</script>

<style lang="less" scoped>
.NoteDetailPage {
  overflow-x: hidden;

  .return {
    position: fixed;
    top: 0;
    z-index: 100;

    // width: 375rem;
    padding: 10rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(255, 255, 255);

    .arrow-left {
      // background-color: antiquewhite;
      display: flex;
      align-items: center;

      .van-icon {
        font-size: 30rem;
      }
    }

    .top {
      // background-color: #5ba3fc;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 350rem;

      .information {
        display: flex;
        align-items: center;

        .van-image {
          margin-right: 5rem;

          :deep(.van-image__img) {
            border-radius: 50rem;
          }
        }

        .name-grade {
          font-size: 13rem;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          /* 设置要显示的行数 */
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150rem;

          i {
            margin-left: 3rem;
            color: orange;
          }
        }
      }

      .concern {
        background-color: red;
        padding: 3rem 25rem;
        border-radius: 50rem;
        color: white;
      }

      .followed {
        background-color: #f5f5f5;
        color: #ababab;
        padding: 5rem 25rem;
        border-radius: 30rem;
        text-align: center;
      }
    }
  }

  .video_url {
    margin-top: 60rem;

    video {
      width: 100vw;
      height: auto;
      background-color: black;
    }
  }

  .image {
    display: flex;

    .images {
      height: 220rem;
      overflow: hidden;
      margin-top: 65rem;

      .u {
        width: 100vw;
        // height: 450rem;
        object-fit: cover;
        display: block;
        position: relative;
      }
    }
  }

  .selected {
    position: absolute;
    left: 5rem;
    bottom: 5rem;
    padding: 3rem 10rem;
    border-radius: 5rem;
    font-size: 12rem;
    background: red;
  }

  .custom-indicator {
    position: absolute;
    right: 5rem;
    bottom: 5rem;
    padding: 3rem 10rem;
    font-size: 12rem;
    border-radius: 50rem;
    background: rgba(0, 0, 0, 0.1);
    color: white;
  }

  .titles {
    padding: 20rem 10rem;

    .title {
      font-weight: bold;
      font-size: 15rem;
    }

    .content {
      display: flex;
      flex-wrap: wrap;

      .c {
        // margin-right: 10rem;

        .c-icon {
          display: flex;
          color: #5ba3fc;
          align-items: center;

          .icon {
            width: 15rem;
            height: 15rem;
            display: block;
          }
        }

        .c-text {
          // 首行缩进
          text-indent: 28rem;
          line-height: 28rem;
        }
      }
    }

    .like_count {
      margin-top: 10rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12rem;
      color: lightgray;
    }
  }

  .related_notes {
    padding: 20rem 10rem;

    .title {
      font-weight: bold;
      font-size: 15rem;
      margin-bottom: 20rem;
    }

    .related_notes-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-around;

      .note {
        width: 45vw;
        margin-bottom: 15rem;

        .van-image {
          :deep(.van-image__img) {
            border-radius: 10rem 10rem 0 0;
          }
        }

        .name-title {
          font-size: 12rem;
          font-weight: bold;
          width: 100%;

          padding: 4rem 0;

          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .avatarName {
          display: flex;
          align-items: center;

          .van-image {
            margin-right: 10rem;

            :deep(.van-image__img) {
              border-radius: 50rem;
            }
          }

          .avatarNamename {
            font-size: 12rem;
            color: #999;
          }
        }
      }
    }
  }

  .NoteDetailPage-notesReview {
    padding: 15rem 10rem;

    .title {
      font-weight: bold;
      font-size: 20rem;
    }
  }

  .bottomBar {
    position: fixed;
    bottom: 0;
    z-index: 100;

    box-shadow: 0rem 0rem 20rem 0rem #cccccc8c;

    background-color: white;

    padding: 10rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    // 评论
    input {
      width: 25%;
      padding: 8rem 20rem;
      border-radius: 50rem;
      border: 1rem solid #f6f6f6;
      background-color: #f6f6f6;
    }

    // 评论起泡
    .comments {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 65rem;
    }

    // 收藏
    .collection {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 70rem;

      .collected {
        color: red;
      }
    }
  }
}
</style>
