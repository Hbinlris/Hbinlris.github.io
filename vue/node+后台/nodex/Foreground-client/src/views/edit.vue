<template>
  <div class="edit">
    <header>
      <div class="back">
        <van-icon name="arrow-left" @click="router.push({ name: 'PersonalCenter' });" />
      </div>
      <div class="title">编辑资料</div>
    </header>

    <div class="tx">
      <van-image width="100rem" height="100rem" :src="imageSrc" @click="selectImage" />
      <!-- 隐藏的上传控件 -->
      <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
    </div>

    <!-- 主体 -->
    <main>
      <div class="edit-content">
        <div class="edit-content-box">
          <div class="foundation" v-for="edit in individualedit" :key="edit.englishname"
            @click="gotoaccount(edit.englishname)">
            <div class="title">{{ edit.title }}</div>
            <div class="introduce">{{ edit.introduce }}</div>
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="edit-content-box">
          <div class="storage" v-for="edit in briefIntroductionedit" :key="edit.englishname"
            @click="gotoaccount(edit.englishname)">
            <div class="title">{{ edit.title }}</div>
            <div class="introduce colortext">{{ edit.introduce }}</div>
            <van-icon name="arrow" />
          </div>
        </div>

        <!-- 地区选择 -->
        <van-field v-model="resultArea" is-link readonly name="area" label="地区" :placeholder="diqu"
          @click="showArea = true" />
        <van-popup v-model:show="showArea" destroy-on-close position="bottom">
          <van-area :area-list="areaList" :model-value="areaPickerValue" id="area-picker" @confirm="onAreaConfirm"
            @cancel="showArea = false" />
        </van-popup>

        <!-- 生日 -->
        <van-field v-model="result" is-link readonly name="datePicker" label="时间选择" :placeholder="date"
          @click="showsr = true" />
        <van-popup v-model:show="showsr" destroy-on-close position="bottom">
          <van-date-picker v-model="pickerValue" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm"
            @cancel="showsr = false" />
        </van-popup>


        <!-- 性别 -->
        <van-field v-model="resultPicker" is-link readonly name="picker" label="性别" :placeholder="xingbie"
          @click="showPicker = true" />
        <!-- 弹出选择器 -->
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
          <van-picker id="city-picker" :columns="columns" :model-value="xbValue" @confirm="onPickerConfirm"
            @cancel="showPicker = false" />
        </van-popup>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { showToast, Calendar } from 'vant';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { areaList } from '@vant/area-data';
import axios from 'axios';

const username = ref(localStorage.getItem('userToken'))

const route = useRoute();
const router = useRouter();


const file = ref(null);
const userToken = localStorage.getItem('userToken');

const userData = ref(null);
const imageSrc = ref("/wdl.jpg");

const diqu = ref('点击选择省市区');
const xingbie = ref('点击选择性别');
const date= ref('点击选择生日');

axios
  .get(`http://localhost:8080/api/clientusers/${userToken}`)
  .then((response) => {
    userData.value = response.data.usersData; 
    console.log('用户数据:', userData.value); 
    
    if (userData.value && userData.value.avatar) {
      imageSrc.value = `http://localhost:8080/${userData.value.avatar}`;
    } else {
      imageSrc.value = "/wdl.jpg"; 
    }
    if (userData.value && userData.value.grzl.resultArea) {
      diqu.value = userData.value.grzl.resultArea;
    } else {
      diqu.value = "点击选择省市区";
    }
    if (userData.value && userData.value.grzl.date) {
      date.value = userData.value.grzl.date;
    } else {
      date.value = "点击选择生日";
    }
    if (userData.value && userData.value.grzl.xingbie) {
      xingbie.value = userData.value.grzl.xingbie;
    } else {
      xingbie.value = "点击选择性别";
    }
 
  })
  .catch((error) => {
   
  });



// 触发文件选择框
const selectImage = () => {
  const fileInput = document.querySelector("input[type='file']");
  fileInput.click();
};

// 处理选择的文件
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile; // 将选中的文件存储到 ref 中

    // 使用 FileReader 读取文件并更新图片
    const reader = new FileReader();
    reader.onload = () => {
      imageSrc.value = reader.result; // 更新图片 URL
    };
    reader.onerror = () => {
      showToast("图片读取失败");
    };
    reader.readAsDataURL(selectedFile); // 将文件读取为 Data URL
    console.log("selectedFile", selectedFile);
  }
  const userToken = localStorage.getItem('userToken');
  const data = { userToken: userToken, file: file }
  const formData = new FormData();

  formData.append("userToken", username.value);
  formData.append("avatar", file.value);
  console.log("formData", formData);

  // 判断上传的图片是否是中文
  if (/[\u4e00-\u9fa5]/.test(file.value.name)) {
    showToast("请修改为英文之后再上传");
    return;
  }


  axios
    .postForm("http://localhost:8080/api/toxi", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 确保表单数据格式正确
      },
    })
    .then((response) => {
      if (response.data.success) {
        showToast("修改成功");
      } else {
        showToast("修改失败");
      }
    })
    .catch((error) => {
      console.error("请求失败:", error);
      showToast("修改失败，请重试");
    });

};


//编辑项的列表
const editlest = computed(() => {
  // 确保 userData 已经有数据并且 grzl 属性存在
  if (userData.value && userData.value.grzl) {
    return [
      { title: "名字", introduce: userData.value.grzl.mingcheng || "小红薯1234F67A", englishname: "name" },
      { title: "小红书号", introduce: username.value, englishname: "account" },
      { title: "简介", introduce: userData.value.grzl.jianjie || "介绍一下自己", englishname: "briefIntroduction" },
    ];
  } else {
    return [
      { title: "名字", introduce: "小红薯1234F67A", englishname: "name" },
      { title: "小红书号", introduce: username.value, englishname: "account" },
      { title: "简介", introduce: "介绍一下自己", englishname: "briefIntroduction" },
    ];
  }
});


const resultArea = ref('');
const showArea = ref(false);
const areaPickerValue = ref([]); // 变量名修改为 areaPickerValue

// 地区选择器`
const onAreaConfirm = ({ selectedValues, selectedOptions }) => {
  areaPickerValue.value = selectedValues.length
    ? selectedValues[selectedValues.length - 1]
    : '';
  showArea.value = false;
  resultArea.value = selectedOptions.map((item) => item.text).join('/');
  console.log(resultArea.value);

  const userToken = localStorage.getItem('userToken');
  const data = { userToken: userToken, resultArea: resultArea.value }
  axios
    .post("http://localhost:8080/api/grdz", data)
    .then((response) => {
      if (response.data.success) {
        console.log("地址保存成功");
      } else {
        console.error("保存失败");
      }
    })
    .catch((error) => {
      console.error("请求失败:", error);
    });

};

// 日期选择器
const result = ref('');
const showsr = ref(false);
const pickerValue = ref([]);

const minDate = new Date(1970, 0, 1);
const maxDate = new Date();
const onConfirm = () => {
  result.value = pickerValue.value.join('/');
  showsr.value = false;
  console.log(result.value);

  const userToken = localStorage.getItem('userToken');
  const data = { userToken: userToken, results: result.value }
  axios
    .post("http://localhost:8080/api/grsr", data)
    .then((response) => {
      if (response.data.success) {
        console.log("日期保存成功");
      } else {
        console.error("保存失败");
      }
    })
    .catch((error) => {
      console.error("请求失败:", error);
    });
};

//性别
const resultPicker = ref('');
const xbValue = ref([]);
const showPicker = ref(false);
const columns = [
  { text: '男', value: 'nan' },
  { text: '女', value: 'nv' },
];

const onPickerConfirm = ({ selectedValues, selectedOptions }) => {
  resultPicker.value = selectedOptions[0]?.text;
  xbValue.value = selectedValues;
  showPicker.value = false;
  console.log(resultPicker.value);

  const userToken = localStorage.getItem('userToken');
  const data = { userToken: userToken, xingbie: resultPicker.value }
  axios
    .post("http://localhost:8080/api/grxb", data)
    .then((response) => {
      if (response.data.success) {
        console.log("性别保存成功");
      } else {
        console.error("保存失败");
      }
    })
    .catch((error) => {
      console.error("请求失败:", error);
    });

};

// 按照不同区域筛选编辑项
const individualedit = computed(() => editlest.value.slice(0, 2));
const briefIntroductionedit = computed(() => editlest.value.slice(2, 3));

// 跳转到编辑页面
const gotoaccount = (englishname) => {
  const item = editlest.value.find(edit => edit.englishname === englishname);

  if (item.englishname == "account") {
    showToast("无法更改你的用户id");
  }
  else if (item.englishname == "name") {
    router.push('/mingc')
  }
  else if (item.englishname == "briefIntroduction") {
    router.push('/jianjie')
  }
  else {
    showToast('当前内容正在开发中');
  }
};


</script>


<style lang="less" scoped>
.edit {
  background-color: #f8f8f8;
  height: 100vh;

  header {
    display: flex;
    align-items: center;
    padding: 10rem 15rem;
    font-size: 18rem;

    .back {
      width: 40%;
    }
  }

  .tx {
    width: 100rem;
    height: 100rem;
    margin: 20rem auto;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  main {
    padding: 15rem;

    .edit-content {
      // padding: 15rem;

      .edit-content-box {
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

          .title {
            // background-color: antiquewhite;
            width: 66rem;
          }

          .introduce {
            font-size: 14rem;
            // background-color: aqua;
            width: 145rem;

          }

          .colortext {
            color: #999;
          }

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

    .btn {
      padding: 10rem;

      background-color: red;
      color: white;
      border-radius: 50rem;

      text-align: center;
    }
  }
}
</style>
