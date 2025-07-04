<template>
  <div class="group-view">
    <div class="list">
      <ul>
        <!-- 添加的组件(分组列表) -->
        <div class="add">
          <GroupLIst :list="groupList" />
        </div>
        <!-- 弹出层 -->
        <li>
          <h1 @click="showPopup">+</h1>
          <van-cell title="创建分组" is-link @click="showPopup" />

          <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }" round closeable:true>
            <div class="title">
              <h3>创建分组</h3>
              <p @click="addlist">确定</p>
            </div>
            <div class="input">
              <img src="/fenzubg.png" alt="" />
              <input type="text" placeholder="请输入分组名称" v-model="name" @keydown.enter="addlist" />
            </div>
          </van-popup>

          <van-popup />
        </li>
        <!-- <li></li> -->
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.group-view {
  strong {
    margin: 20rem;
    width: 100%;
    height: 20rem;
  }

  .list {
    ul {
      li {
        width: 170rem;
        height: 170rem;
        background-color: #f7f7f7;
        position: relative;
        overflow: hidden;
        border-radius: 15rem;
        margin: 5rem;
        float: left;

        h1 {
          width: 30rem;
          height: 30rem;
          color: white;
          line-height: 100%;
          text-align: center;
          border-radius: 50%;
          background-color: black;
          position: absolute;
          top: 40rem;
          left: 70rem;
          z-index: 999;
        }

        .van-cell {
          background-color: #f7f7f7;
          position: absolute;
          top: 80rem;
          left: 40rem;

          .van-cell__right-icon {
            // display: none;
            opacity: 0;
            color: red;
          }
        }

        .title {
          border-bottom: 1rem solid #f3f3f3;
          padding: 15rem;
          display: flex;
          justify-content: space-between;

          p {
            color: #9a9a9a;
          }
        }

        .input {
          position: relative;

          img {
            width: 80rem;
            position: absolute;
            top: 15rem;
            left: 10rem;
          }

          input {
            border: 0;
            line-height: 100%;
            width: 280rem;
            height: 120rem;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }
  }
}
</style>


<script setup>
// import { watch } from "vue";
import { ref } from "vue";
import GroupLIst from "./GroupLIst.vue";
const show = ref(false);
const name = ref("");
const groupList = ref([]);
if (JSON.parse(localStorage.getItem("groupList"))) {
  groupList.value = JSON.parse(localStorage.getItem("groupList"));
}

const showPopup = () => {
  show.value = true;
};

const addlist = () => {
  console.log("确定");
  // console.log(name.value);

  groupList.value.push(`${name.value}`);
  console.log(groupList.value);
  const obj = ref({});
  const arr = ref([]);
  // console.log("空数组", arr.value);

  obj.value.name = groupList.value;
  obj.value.num = 0;
  arr.value.push(obj.value);
  console.log("obj", obj.value);

  console.log("arr", arr.value);
  // obj.value = {};
  //   // { [name: null, num: 0,{}] }

  // localStorage.setItem(
  //   "groupList",
  //   // JSON.stringify({...groupList.value:[ { name: null, num: 0 }}])
  //   // { [name: null, num: 0,{}] }
  // );
  // [{ name: [] }];
  name.value = "";

  show.value = false;
};
</script>
