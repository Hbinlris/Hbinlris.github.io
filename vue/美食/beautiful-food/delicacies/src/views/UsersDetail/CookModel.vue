<!-- 烹饪模式 -->

<template>
  <div class="cook">
    <!-- 顶部导航栏 -->
    <div class="top" ref="top">
      <van-icon
        name="arrow-left"
        size="20rem"
        class="return"
        color="white"
        @click="back"
      />
      <div class="numbeer">{{ `${current}/${total}` }}</div>
    </div>
    <!-- 1111111 -->
    <div class="carousel">
      <van-swipe style="margin-top: 80rem" @change="numbersteps">
        <van-swipe-item v-for="cooksteps in cookstep" :key="cooksteps.position">
          <van-image
            width="100vw"
            height="300rem"
            :src="cooksteps.image"
            fit="cover"
          />
          <div class="text" style="margin-top: 90rem">
            {{ cooksteps.content }}
          </div>
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="custom-indicator" v-show="indicatorv">
            {{ active + 1 }}/{{ total }}
          </div>
        </template>
      </van-swipe>
    </div>
  </div>
</template>

<!-- currentImage -->

<style scoped lang="less">
.cook {
  // 顶部导航栏
  background-color: #4d4d4d;
  height: 100vh;
  color: white;

  .top {
    padding: 10rem;
    // border-bottom: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .numbeer {
      width: 50vw;
      font-size: 20rem;
    }
  }

  .carousel {
    .text {
      padding-left: 15rem;
    }
  }

  // 指示器

  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 18px;
    // color: black;
  }
}
</style>


<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { RecipeDetail } from "@/api/axios";

const router = useRouter();
const route = useRoute();

const recipe = ref();
const recipeid = ref(route.query.id);
// const position = ref(route.query.position)
const cookstep = ref();

// 当前图片索引
// const currentImage = ref(position.value);

//  指示器状态
const indicatorv = false;

// 获取图片总数
const total = ref(0);

// 获取当前步骤
const current = ref(1);

RecipeDetail(recipeid.value).then((res) => {
  // recipe.value = res.data.result
  recipe.value = res.data.result.recipe;
  cookstep.value = recipe.value.cookstep;
  //   console.log("res111", recipe.value);
  console.log("列表", cookstep.value);
  total.value = cookstep.value.length;
});

const numbersteps = (index) => {
  current.value = index + 1;
  // currentImage.value = index;
};

// 返回
const back = () => {
  router.back();
};
</script>
