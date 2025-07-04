<template>
  <div>
    <van-nav-bar title="编辑名字" left-text="" right-text="保存" left-arrow @click-left="onClickLeft"
      @click-right="onClickRight" style="margin-bottom: 10rem;" />

    <van-cell-group inset>
      <van-field v-model="message" rows="2" autosize label="" type="textarea" maxlength="10" placeholder="添加一个名字"
        show-word-limit class="jianj" @keydown.enter="onEnter"/>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { Toast, showToast } from 'vant';
import axios from "axios";

const router = useRouter();
const route = useRoute();

const message = ref("");

const onEnter = (event) => {
  event.target.blur();
};
const onClickLeft = () => {
  router.push({ path: "/edit" });
};

const userToken = localStorage.getItem("userToken");
const userData = ref(null);
axios
  .get(`http://localhost:8080/api/clientusers/${userToken}`)
  .then((response) => {
    userData.value = response.data.usersData;

    if (userData.value && userData.value.grzl && userData.value.grzl.mingcheng) {
      message.value = userData.value.grzl.mingcheng;
    }
  })
  .catch((error) => {
    showToast("当前未登录");
  });
const onClickRight = async () => {
  const data = {
    userToken,
    message: message.value,
  }
  axios
    .post("http://localhost:8080/api/grmz", data)
    .then((response) => {
      if (response.data.success) {
        showToast("保存成功")
        router.push({ name: "edit" });
      } else {
        console.error("保存失败");
      }
    })
    .catch((error) => {
      console.error("请求失败:", error);
    });
};
</script>

<style lang="less">
.jianj {
  width: 90%;
  border-radius: 10rem;
  background-color: rgb(232, 232, 232);
  margin: 10rem auto;
}
</style>
