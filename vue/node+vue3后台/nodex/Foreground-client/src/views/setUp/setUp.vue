<!-- setUp 设置 -->
<template>
  <div class="setUp">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="$router.back()" />
      </div>
      <div class="title">设置</div>
    </header>

    
    <div class="setUp-content">
      <div class="setUp-content-box">
        <div class="foundation" v-for="setUp in foundationSetUps" :key="setUp.englishname"
          @click="gotoaccount(setUp.englishname)">
          <div class="title">{{ setUp.title }}</div>
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="setUp-content-box">
        <div class="storage" v-for="setUp in storageSetUps" :key="setUp.englishname"
          @click="gotoaccount(setUp.englishname)">
          <div class="title">{{ setUp.title }}</div>
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="setUp-content-box">
        <div class="help" v-for="setUp in helpSetUps" :key="setUp.englishname" @click="gotoaccount(setUp.englishname)">
          <div class="title">{{ setUp.title }}</div>
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="setUp-content-box">
        <div class="loginhandoff" v-for="setUp in accountSettings" :key="setUp.englishname"
          @click="gotoaccount(setUp.englishname)">
          <div class="title">{{ setUp.title }}</div>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, computed } from "vue";
import { showToast } from 'vant';
import { useRouter } from "vue-router";

const router = useRouter();


const setUplest = ref([
  { title: "账号与安全", englishname: "account" },
  { title: "通用设置", englishname: "general" },
  { title: "通知设置", englishname: "notice" },
  { title: "隐私设置", englishname: "privacy" },

  { title: "存储空间", englishname: "storage" },
  { title: "内容偏好调节", englishname: "preference" },
  { title: "添加小组件", englishname: "subassembly" },
  { title: "青少年模式", englishname: "mode" },

  { title: "帮助与客服", englishname: "help" },
  { title: "关于", englishname: "concerning" },

  { title: "切换账号", englishname: "switchAccounts" },
  { title: "退出登录", englishname: "signOut", path: '/DengLu' },

]);

const foundationSetUps = computed(() => setUplest.value.slice(0, 4));
console.log('setup-foundationSetUps', foundationSetUps.value);
const storageSetUps = computed(() => setUplest.value.slice(4, 8));
console.log('setup-storageSetUps', storageSetUps.value);
const helpSetUps = computed(() => setUplest.value.slice(8, 10));
console.log('setup-helpSetUps', helpSetUps.value);
const accountSettings = computed(() => setUplest.value.slice(10, 12));
console.log('setup-helpSetUps', accountSettings.value);

const gotoaccount = (englishname) => {
  console.log('setup-englishname', englishname);
  const item = setUplest.value.find(setUp => setUp.englishname === englishname);
  if (item && item.path) {
    router.push(item.path);
    localStorage.removeItem('userToken');
  } else {
    showToast('当前内容正在开发中');
  }
}


</script>

<style lang="less" scoped>
.setUp {
  background-color: #f8f8f8;
  height: 100vh;

  header {
    display: flex;
    align-items: center;
    padding: 10rem 15rem;
    font-size: 18rem;

    .back {
      width: 45%;
    }

    .title {
      width: 55%;
    }
  }

  .setUp-content {
    padding: 15rem;

    .setUp-content-box {
      margin-bottom: 15rem;

      .foundation,
      .storage,
      .help,
      .loginhandoff {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 15rem;
        background-color: white;
        border: 1px solid #f8f8f8;

        &:nth-child(1) {
          border-radius: 15rem 15rem 0 0;
        }

        &:nth-last-child(1) {
          border-radius: 0 0 15rem 15rem;
        }

      }

      .loginhandoff {
        justify-content: center;
      }
    }
  }

}
</style>
