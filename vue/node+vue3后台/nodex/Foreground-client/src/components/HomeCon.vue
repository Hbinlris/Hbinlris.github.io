<template>
    <div id="app">
        <!-- 作者信息 -->
        <div class="author" v-for="(item, index) in activeTabContent.content" :key="index">
            <van-icon class="icon" size="30" name="arrow-left" @click="goBack" />
            <img :src="item.authorimg" alt="">
            <p>{{ item.author }}</p>
        </div>
        <!-- 轮播图 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-for="(item, index) in activeTabContent.content" :key="index">
            <van-swipe-item>1</van-swipe-item>
            <van-swipe-item>2</van-swipe-item>
            <van-swipe-item>3</van-swipe-item>
            <van-swipe-item>4</van-swipe-item>
        </van-swipe>
        <!-- 内容 -->
        <div class="con" v-for="(item, index) in activeTabContent.content" :key="index">
            <div class="top">
                <h5>{{ item.title }}</h5>
                <p>{{ item.content }}</p>
                <p>{{ item.titlecon }}</p>
            </div>
            <div class="pinlun">
                <h5>共{{ comments.length }}条评论</h5>
                <ul>
                    <li v-for="(comment, index) in comments" :key="index">
                        <img src="../images/xhs_icon.png" alt="">
                       <div class="talk">
                        <p>小红书用户</p>
                        {{ comment }}
                       </div>
                    </li>
                </ul>
            </div>
            <!-- 读者操作 -->
            <div class="footer">
                <input
                    type="text"
                    placeholder="说点什么..."
                    class="input"
                    v-model="newComment"
                    @keyup.enter="addComment"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';

// 返回上一页
const goBack = () => {
    router.go(-1);
};

// 假数据
const activeTabContent = ref({
    content: [
        {
            title: '标题',
            content: '内容',
            talk: '努力不一定成功，但不努力一定不成功。',
            authorimg: 'https://img.yzcdn.cn/vant/cat.jpeg',
            titlecon:'最新的娱乐圈新闻，明星们的生活总是吸引大家的目光。今天我们来聊聊XX明星的新动态。',
            author: '作者',
            img:'https://sns-webpic-qc.xhscdn.com/202501071928/1fcbe8a010634dfd73d7ca642eb68c55/1040g2sg31bdjd8p800d05pofje07e5feh4rd2n8!nd_dft_wlteh_webp_3'
        },
    ]
});

// 评论列表
const comments = ref([]); 

// 新评论输入框内容
const newComment = ref('');

// 从 localStorage 加载评论
const loadComments = () => {
    const savedComments = localStorage.getItem('comments'); 
    if (savedComments) {
        comments.value = JSON.parse(savedComments); 
    }
};

// 保存评论到本地存储
const saveComments = () => {
    localStorage.setItem('comments', JSON.stringify(comments.value)); 
};

// 添加评论
const addComment = () => {
    if (newComment.value.trim() !== '') {
        comments.value.unshift(newComment.value); 
        newComment.value = '';
        // 保存评论到本地存储
        saveComments(); 
    }
};

// 页面加载时读取评论
onMounted(() => {
    loadComments(); 
});
</script>

<style lang="less" scoped>
#app {
    padding: 0;
}

.author {
    display: flex;
    align-items: center;
    .icon {
        margin: 10rem;
    }
    img {
        width: 40rem;
        height: 40rem;
        border-radius: 50rem;
        margin-right: 10rem;
    }
}

.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-size: cover;
    background-color: #39a9ed;
    img{
        width: 100%;
        height: 150rem;
    }
}

.con {
    color: black;
    margin: 10rem;

    h5 {
        font-size: 20rem;
        margin: 0;
        padding: 0;
    }

    p {
        font-size: 18rem;
        margin: 0;
        padding: 0;
    }
}

.pinlun {
    ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li {
            font-size: 16rem;
            margin-bottom: 10rem;
            display: flex;
            align-items: center;
            img {
                width: 30rem;
                height: 30rem;
                border-radius: 50rem;
                margin-right: 10rem;
            }
           .talk{
            p{
                font-size: 16rem;
            }
           }
        }
    }
}

.footer {
    position: fixed;
    left: 10rem;
    right: 10rem;
    bottom: 10rem;
    width: 100%;

    .input {
        width: 40%;
        height: 30rem;
        border-radius: 20rem;
        border: none;
        padding: 5rem;
        background-color: rgba(230, 232, 233, 0.5);
        padding-left: 15rem;
    }
}
</style>
