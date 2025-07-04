<template>

  <div class="othershomePage">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="$router.push('/')" />
      </div>
    </header>

    <!-- 个人信息 -->
    <div class="individual">

      <!-- 头像名字 -->
      <div class="imgname">
        <div class="tx" style="margin-right: 10rem;">
          <van-image style="margin-right: 16rem;" width="60rem" height="60rem"
            :src="`http://localhost:8080/${posts.avatar}`" />
        </div>
        <div class="name">
          <div class="bigname">{{ posts.grzl?.mingcheng }}</div>
          <div class="account">小红书号：{{ posts.username }}</div>
          <div class="territorial">
            <div class="IP">IP属地:{{ splitresultArea }}</div>
            <div class="gender">{{ posts.grzl?.xingbie }}</div>
          </div>
        </div>
      </div>

      <!-- 简介 -->
      <div class="briefIntroduction">
        {{ posts.grzl?.jianjie }}
      </div>

      <!-- 粉丝编辑 -->

      <div class="edit">
        <div class="edit-fans">
          <div class="fans" v-for="fan in fans" :key="fan.englishname">
            <div class="number">{{ fan.number }}</div>
            <div class="name">{{ fan.name }}</div>
          </div>
        </div>
      </div>

    </div>

    <main>
      <div class="publish-titles">
        <div class="publish-title-name">
          合集
        </div>
      </div>

      <div class="publish-box" v-if="postslist.length > 0">
        <!-- 遍历list -->
        <div class="publish-list" v-for="postslist in postslist" :key="postslist._id">

          <div class="publish-public ">

            <div class="publish-imiage">
              <van-image fit="cover" width="160rem" height="160rem" style="display: block;"
                :src="`http://localhost:8080/${postslist.imageUrl[0]}`"  @click="goToContent(postslist.id)" />
            </div>
            <!-- 标题 -->
            <div class="publish-title">
              {{ postslist.title }}
            </div>
            <!-- 个人头像 -->
            <div class="publish-individual">
              <div class="publish-avatar">
                <van-image width="20rem" height="20rem" :src="`http://localhost:8080/${postslist.useravatar}`" />
              </div>
              <div class="publish-name">{{ postslist.mingcheng }}</div>
            </div>



          </div>


        </div>
      </div>
    </main>

  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";
// import axios from "axios";
import { useRoute,useRouter } from "vue-router";
import { apipublish, apiusers } from "@/api/api.js";
// import { useCounterStore } from "@/stores/counter.js";

// const counterStore = useCounterStore();

const route = useRoute();
const router = useRouter();
const tiaozhuanm = route.query.tiaozhuanm;


const posts = ref([]);
const splitresultArea = ref('');

const goToContent = (id) => {
  router.push({ name: "ContentXq", params: { id } });
};

// 粉丝
const fans = ref([
  { name: '粉丝', number: 0, englishname: 'concern' },
  { name: '关注', number: 0, englishname: 'aFanOfSomeone' },
  { name: '获赞与收藏', number: 0, englishname: 'support' },
]);


const postslist = ref([]);
onMounted(() => {
  if (tiaozhuanm) {
    Promise.all([
      apipublish(),
      apiusers(tiaozhuanm)
    ]).then(([publishRes, usersRes]) => {
      const arraypublish = publishRes.data;
      console.log("111", arraypublish);

      if (arraypublish && arraypublish.length > 0) {
        postslist.value = arraypublish.filter(
          (item) => item.userToken === tiaozhuanm && item.status === "公开"
        );
        console.log("postslist查找", postslist.value);
      } else {
        console.log("arraypublish 为空或未定义");
      }

      // const publishlength = postslist.value.length;
      // counterStore.setPublishLength(publishlength);

      const userData = usersRes.data.usersData;
      console.log("121", userData);

      // 合并用户信息到 postslist
      postslist.value = postslist.value.map(postslist => ({
        ...postslist,
        useravatar: userData.avatar,
        mingcheng: userData.grzl.mingcheng
      }));

      console.log("合并postslist", postslist.value);
    });

  }

  if (tiaozhuanm) {
    apiusers(tiaozhuanm).then((res) => {
      posts.value = res.data.usersData;
      console.log("apiusers", posts.value);

      const resultArea = posts.value.grzl?.resultArea;
      if (resultArea) {
        const parts = resultArea.split('/');
        splitresultArea.value = parts[0];
      }
    });
  }
});
</script>

<style scoped lang="less">
.othershomePage {
  // width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  header {
    display: flex;
    align-items: center;
    // background-color: antiquewhite;
    width: 100%;
    padding: 10rem 0;
    font-size: 18rem;

    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;

    .back {
      padding: 0 15rem;
      width: 43%;
    }
  }

  .individual {
    padding: 15rem 0;
    // height: 200rem;
    width: 100%;
    // background-color: #705d42;
    // background-color: aqua;

    // 头像信息
    .imgname {
      padding: 0 15rem;
      display: flex;
      align-items: center;
      // background-color: blue;

      .tx {
        display: flex;
        align-items: center;

        :deep(.van-image__img) {
          border-radius: 50rem;
        }
      }


      .name {
        padding: 15rem 0;
        // color: white;
        color: black;

        .bigname {

          font-size: 16rem;
          font-weight: bold;
        }

        .account {
          font-size: 12rem;
          margin-top: 5rem;
        }

        .territorial {
          font-size: 12rem;
          // margin-top: 10rem;

          display: flex;

          .IP {
            margin-right: 5rem;
          }
        }
      }
    }

    // 简介
    .briefIntroduction {
      padding: 10rem 15rem;
      font-size: 12rem;
      // color: white;
      color: black;
    }

    // 粉丝
    .edit {
      // background-color: aqua;
      // color: white;
      color: black;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8rem 15rem;
      // background-color: chartreuse;

      .edit-fans {
        width: 150rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // background-color: cadetblue;

        .fans {
          // background-color: blueviolet;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12rem;
        }
      }


    }

  }

  main {
    width: 100%;

    .publish-titles {
      // width: 100%;
      padding: 5rem 15rem;
      border-bottom: 1px solid #c9c9c9;
      border-top: 1px solid #c9c9c9;
 

      display: flex;
    

      .publish-title-name {
        position: relative;
        padding: 5rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        

        // background-color: #c9c9c9;


        &::before {
          content: '';
          width: 30rem;
          height: 2rem;
          background-color: red;
          border-radius: 50rem;
          position: absolute;
          bottom: 0;
        }
      }

    }

    .publish-box {
      // background-color: aqua;
      padding: 15rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      // background-color: #f9f9f9;


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
          }

          .publish-title {
            padding: 0 10rem;
            font-size: 12rem;
            margin-bottom: 5rem;

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


  }



}
</style>
