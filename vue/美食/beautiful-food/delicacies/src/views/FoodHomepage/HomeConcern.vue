<template>
  <div class="data">
    <div class="isdata" style="width: 375rem" v-if="data">
      <div class="upmsg">
        <div class="si">
          <h1>简单美食，会做饭很酷~</h1>
          <p>你关注的人的动态会出现在这</p>
          <p>为你推荐了一些有趣的人，快关注TA们吧</p>
        </div>
      </div>

      <div class="card">
        <ul>
          <li
            v-for="(item, index) in ids"
            :key="index"
            style="margin-bottom: 15rem"
          >
            <div class="carduser">
              <!-- 添加头像展示 -->
              <div class="left">
                <div class="left">
                  <img
                    :src="idimgs[index]"
                    @click="navigateToUserDetails(item.u.id)"
                  />
                </div>
                <div class="right">
                  <!-- 添加用户名展示 -->
                  <span @click="navigateToUserDetails(item.u.id)">
                    {{ names[index] }} LV.{{ lv[index] }}
                  </span>

                  <!-- 添加粉丝数和菜谱数展示 -->
                  <p>{{ followers[index] }} • {{ recipes[index] }}</p>
                </div>
                <!-- <img :src="vipimgs[index]" v-if="vipimgs[index]" /> -->
              </div>
              <div class="right">
                <button
                  style="
                    color: white;
                    background: rgb(247, 71, 74);
                    width: 64px;
                    border-radius: 50px;
                    border-width: 0px;
                    padding: 6rem;
                    font-size: 14rem;
                  "
                  @click="GuanZhufn(item.u.id)"
                  ref="guanzhu"
                  v-if="isadd(item.u.id)"
                >
                  <span>关注</span>
                </button>
                <button
                  v-else
                  style="
                    color: #aaaaaa;
                    background-color: #f5f5f5;
                    width: 80px;
                    border-radius: 50px;
                    border-width: 0;
                  "
                  @click="GuanZhufn(item.u.id)"
                  ref="guanzhu"
                >
                  <span>已关注</span>
                </button>
              </div>
            </div>

            <div class="cardimg">
              <!-- 添加图片展示 -->
              <!-- <p>{{ item.u.id }}</p> -->
              <div
                class="bigcard"
                @click="
                  $router.push({
                    path: '/CulinaryDetails',
                    query: { id: item.item_id },
                  })
                "
              >
                <img :src="images[index]" alt="图片" v-if="images[index]" />
              </div>
              <div class="downmsg">
                <!-- 添加收藏人数展示 -->
                <div class="shoucang">
                  <p>
                    {{ collectCounts[index] }}
                  </p>

                  <div class="imgs">
                    <van-icon name="chat-o" />
                    <van-icon name="star-o" />
                    <van-icon name="share-o" />
                  </div>
                </div>

                <!-- 添加标题展示 -->
                <div class="biaoti">
                  <h2>
                    {{ item.t }}
                  </h2>

                  <!-- 添加参加活动展示 -->
                  <p class="active" v-if="events[index]">
                    <img
                      v-if="events[index]"
                      src="../../assets/icons/activity.png"
                      alt=""
                    />
                    {{ events[index] }}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="nodata" v-else>
      <van-image src="/loading.gif" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // 引入 useRouter
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { showToast } from "vant";
import { RecipeDetail } from "@/api/axios";

// 定义响应式数据
const ids = ref([]); // 定义原始数据 ids
const names = ref([]); // 定义提取的 n 值数组
const followers = ref([]); // 定义粉丝数数组
const recipes = ref([]); // 定义菜谱数数组
const events = ref([]); // 定义事件内容数组
const images = ref([]); // 定义图片数据数组
const lv = ref([]); // 定义等级数数组
const idimgs = ref([]); // 定义用户头像数组
const collectCounts = ref([]); // 定义收藏人数数组
const vipimgs = ref([]); // 定义VIP用户数组
const router = useRouter(); // 使用 router
const userId = ref();
// 关注
const guanzhulist = ref([]);
const currentPath = router.currentRoute.value.fullPath;
const isadd = (id) => {
  // 查找是否有当前id
  if (guanzhulist.value.some((collected) => collected === id)) {
    return false;
  } else {
    return true;
  }
};
const idn = ref(Number);
const GuanZhufn = (id) => {
  console.log("关注", id);
  idn.value = Number(id);
  const userStore = useUserStore();
  if (!userStore.Loginguard()) {
    // 用户未登录，提示登录
    showToast("请先登录");
    router.push({ name: "Login", query: { redirect: currentPath } });
    return;
  } else if (userStore.Loginguard()) {
    // 查找是否有当前id
    if (guanzhulist.value.some((collected) => collected === idn.value)) {
      // 取消
      guanzhulist.value = guanzhulist.value.filter(
        (collectedId) => collectedId !== idn.value
      );
    } else {
      // 添加
      guanzhulist.value.push(idn.value);
    }
    // 更新
    localStorage.setItem("guanzhulist", JSON.stringify(guanzhulist.value));
  }
};

onMounted(() => {
  // 读取本地收藏
  const collected = localStorage.getItem("guanzhulist");
  if (collected) {
    guanzhulist.value = JSON.parse(collected);
  }
});
const data = ref();
const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://apis.netstart.cn/douguo/home/ffeeds/0/20"
    );
    const rfsData = response.data.result.rfs;
    console.log("rfsData", rfsData);

    data.value = response.data.result;
    ids.value = rfsData.map((item) => item); // 更新 ids

    // 提取 u 中的 n 值
    names.value = rfsData.map((item) => item.u.n);

    // 提取粉丝数
    followers.value = rfsData.map((item) => item.u.followers_count_text);

    // 提取菜谱数
    recipes.value = rfsData.map((item) => item.u.recipes_count_text);

    // 提取等级
    lv.value = rfsData.map((item) => item.u.lv);

    // 提取用户头像
    idimgs.value = rfsData.map((item) => item.u.p); // 检查 idimg 存在性

    // 提取 VIP 用户头像
    vipimgs.value = rfsData.map((item) => item.u.verified_image);
    userId.value = rfsData.map((item) => item.u.id);
    // console.log("uid", userId.value);

    // 提取事件内容中的 c 值
    events.value = rfsData.map((item) => {
      return item.events && item.events.length > 0 ? item.events[0].c : "";
    });

    // 提取图片数据
    images.value = rfsData.map((item) => (item.img ? item.img : "")); // 检查 img 存在性

    // 提取收藏人数
    collectCounts.value = rfsData.map((item) => item.collect_count_text);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// 组件挂载后获取数据
onMounted(() => {
  fetchData();
});

// 跳转到用户详情页并传递对应的 nameids 值
const navigateToUserDetails = (userId) => {
  if (userId) {
    router.push({ path: "/UserDetails", query: { id: userId } });
  }
};
</script>

<style lang="less" scoped>
.data {
  .isdata {
    .upmsg {
      .si {
        background-color: #fafafa;
        padding: 10rem;

        h1 {
          font-size: 12rem;
        }

        p {
          color: #a3a3a3;
          font-size: 10rem;
        }
      }
    }

    .card {
      .carduser {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8rem 8rem 0;
        margin-bottom: 5rem;

        .left {
          display: flex;
          align-items: center;

          img {
            width: 25rem;
            height: 25rem;
            border-radius: 50%;
            margin-right: 7rem;
          }

          span {
            font-size: 12rem;
            font-weight: normal;
          }

          p {
            font-size: 12rem;
            margin: 0;
            color: #a3a3a3;
          }
        }
      }

      .cardimg {
        .bigcard {
          img {
            width: 100%;
          }
        }

        .downmsg {
          .shoucang {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 10rem;

            p {
              font-size: 12rem;
              font-weight: normal;
            }

            .imgs {
              width: 80rem;
              display: flex;
              justify-content: space-between;
              font-size: 20rem;
            }
          }

          .biaoti {
            margin-left: 10rem;

            h2 {
              font-size: 12rem;
              font-weight: normal;
              margin: 0rem;
            }

            .active {
              font-size: 12rem;
              display: flex;
              align-items: center;
              color: #569aa2;
              margin-top: 10rem;
              margin-bottom: 18rem;

              img {
                width: 14rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
