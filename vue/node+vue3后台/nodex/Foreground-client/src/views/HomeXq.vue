  <template>
    <div id="app">
      <div v-if="detail">
        <!-- 作者信息 -->
        <div class="author" v-if="detail">
          <van-icon class="icon" size="25" name="arrow-left" @click="$router.go(-1)" />
          <img :src="`http://localhost:8080/${detail.imageUrl[0]}`" alt="" @click="tiaozhuanqx(detail.userToken)" >
          <p>{{ detail.userToken }}</p>
        </div>
        <!-- 图片内容 -->
        <!-- 图片内容 -->
        <div class="swiper" v-if="detail && detail.imageUrl.length">
          <van-swipe  class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image, index) in detail.imageUrl" :key="index">
              <img :src="`http://localhost:8080/${image}`" alt="图片加载失败" />
            </van-swipe-item>
          </van-swipe>
        </div>

        <div class="content" v-if="detail">
          <h5 style="margin: 0;padding: 0;font-size: 14rem;">{{ detail.title }}</h5>
          <p style="padding: 0;font-size: 14rem;" v-html="formattedText"></p>
          <p style="color: gray;font-size: 12rem;">编辑于{{ detail.createdAt }}</p>
        </div>
        <!-- 分割线 -->
        <div style="height: 1px;background-color: #eee;margin: 10rem 20rem;"></div>
        <!-- 评论列表 -->
        <div class="comment-list" v-if="comments.length">
          <h4>评论</h4>
          <ul>
            <li style="display: flex;
            align-items: center;" v-for="(comment, index) in comments" :key="index">
              <img style="width: 28rem;height: 28rem;margin-right: 10rem;margin-top: -50rem;" src="../images/xhs_icon.png" 
                alt="" @click="tiaozhuanqx(comment.userToken)" >
              <div>
                <p class="comment-user" style="color: gray;">{{ comment.userToken }}</p>
                <p class="comment-content">{{ comment.content }}</p>
                <p style="color: gray;font-size: 12rem;">{{ comment.createdAt }}</p>
              </div>
              <!-- <div style="height: 1px;background-color: #eee;margin: 5rem 10rem;width: 100%;"></div> -->

            </li>
          </ul>
          <div style="height: 20rem;"></div>
        </div>
        <div v-else>
          <p style="margin: 10rem; font-size: 13rem;">暂无评论，快来抢沙发吧！</p>
        </div>
      </div>
      <div v-else>
        <p>加载中...</p>
      </div>
      <div class="footer">
        <input type="text" placeholder="说点什么..." class="input" v-model="newComment" @keyup.enter="addComment" />
        <!-- <van-icon
          size="20rem"
          style="margin-left: 15rem;"
          :name="liked ? 'like' : 'like-o'"
          :style="{ color: liked ? 'red' : 'inherit' }"
          @click="toggleLike"
        />
        <p>{{ likeCount }}</p> -->
        <!-- <van-icon size="20rem" style="margin-left: 15rem;" name="star-o" />
        <p>123</p> -->
        <van-icon size="20rem" style="margin-left: 15rem;" name="chat-o" />
        <p>
          {{ comments.length }}
        </p>
        <!-- <van-icon size="20rem" style="margin-left: 15rem;margin-right: 10rem;" name="share-o" /> -->
      </div>
    </div>
  </template>

  <script setup>
  import { useRoute } from "vue-router";
  import axios from "axios";
  import { ref, onMounted } from "vue";
  import { showToast } from "vant";
  import { computed } from "vue";
  import router from "@/router";


  const route = useRoute();
  const id = route.params.id; // 获取路由参数 id, 即当前文章的 ID
  const detail = ref(null); // 用于存储详情数据
  const comments = ref([]); // 用于存储评论数据
  const newComment = ref(""); // 用于存储新评论内容



  const liked = ref(false); // 是否点赞
  const likeCount = ref(123); // 初始点赞数


  const toggleLike = () => {
    liked.value = !liked.value; // 切换点赞状态
    likeCount.value += liked.value ? 1 : -1; // 根据状态增减计数
    saveLikeState(); // 保存点赞状态
  };

  // 保存点赞状态到 sessionStorage，使用 ID 作为键名的一部分
  const saveLikeState = () => {
    const state = {
      liked: liked.value,
      likeCount: likeCount.value,
    };
  localStorage.setItem(`likeState-${id}`, JSON.stringify(state)); // 使用 id 作为唯一标识
  };

  // 页面加载时恢复点赞状态
  onMounted(() => {
    const savedState = localStorage.getItem(`likeState-${id}`);
    if (savedState) {
      const { liked: savedLiked, likeCount: savedLikeCount } = JSON.parse(savedState);
      liked.value = savedLiked;
      likeCount.value = savedLikeCount;
    }
  });
  // 格式化文章内容(换行)
  const formattedText = computed(() => {
    return detail.value && detail.value.text
      ? detail.value.text.replace(/(?:\r\n|\r|\n)/g, "<br>")
      : "";
  });

  console.log("接收到的 ID:", id);

  // 获取评论数据
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comment/${id}`);
      comments.value = res.data.data;
      
      console.log("评论评论数据:", comments.value);
    } catch (err) {
      console.error("获取评论数据失败:", err);
    }
  };

  onMounted(async () => {
    if (!id) {
      console.error("未提供有效的 ID 参数");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/article/${id}`);
      detail.value = res.data;

      // 确保 imageUrl 是数组
      if (typeof detail.value.imageUrl === "string") {
        detail.value.imageUrl = [detail.value.imageUrl]; // 如果是字符串，转为数组
      }

      console.log("详情数据:", detail.value);

      // 获取评论数据
      await fetchComments();
    } catch (err) {
      console.error("获取详情数据失败:", err);
    }
  });
  // 提交评论
  const addComment = async () => {
    if (!newComment.value.trim()) {
      showToast("评论不能为空！");
      return;
    }

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      showToast("请先登录！");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/comment", {
        articleId: id,
        userToken,
        content: newComment.value,
      });
      console.log("文章id为", id);


      if (res.data.success) {
        showToast("评论成功！");
        // 创建一个新评论对象
        const newCommentObj = {
          userToken,
          content: newComment.value,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        // 插入到评论列表最前面
        comments.value.unshift(newCommentObj);
        newComment.value = "";
      } else {
        showToast("评论失败，请重试！");
      }
    } catch (err) {
      console.error("提交评论失败:", err);
      showToast("提交评论失败，请稍后再试！");
    }
  };
  const tiaozhuanqx = (userToken) => {
    router.push({
      name: "tarenzhuye",
      query: { tiaozhuanm: userToken }
    });
  };
  </script>

  <style scoped lang="less">
  #app {
    padding: 0;
  }

  .author {
    position: fixed;
    top: 0;
    left: 0rem;
    display: flex;
    align-items: center;
    z-index: 999;
    background-color: white;
    width: 100%;

    .icon {
      margin: 10rem;
    }

    img {
      width: 30rem;
      height: 30rem;
      border-radius: 50rem;
      margin-right: 10rem;
    }
  }

  // .swiper {
  //   margin-top: 55rem;

  //   .my-swipe .van-swipe-item {
  //     color: #fff;
  //     font-size: 20px;
  //     text-align: center;
  //   }

  //   img {
  //     width: 100%;
  //     height: 100%;
  //     object-fit: cover;
  //   }
  // }

  .swiper {
    margin-top: 50rem;

    .my-swipe .van-swipe-item {
      color: #fff;
      font-size: 20rem;
      text-align: center;
    }

    img {
      width: 100%;
      height: auto;
      /* 确保图片比例正确 */
      object-fit: cover;
    }
  }


  .content {
    margin: 10rem;
  }

  .comment-list {
    margin: 10rem;

    h4 {
      font-size: 14rem;
      margin-bottom: 8rem;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 10rem;

        .comment-user {
          font-weight: bold;
        }

        .comment-content {
          color: #555;
          font-size: 15rem;
        }
      }
    }
  }

  .footer {
    position: fixed;
    left: 0rem;
    right: 0rem;
    bottom: 0rem;
    width: 100%;
    height: 50rem;
    background-color: white;
    display: flex;
    align-items: center;

    .input {
      width: 75%;
      height: 19rem;
      border-radius: 20rem;
      border: none;
      padding: 5rem;
      background-color: rgba(230, 232, 233, 0.5);
      padding-left: 15rem;
      margin-left: 10rem;
      font-size: 12rem;
    }

    p {
      margin-left: 3rem;
    }
  }
  </style>
