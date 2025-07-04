<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="Account">
			<view class="edition">
				<!-- 标题 -->
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext border-none">账号管理</view>
				</view>

				<!-- 列表 -->
				<view class="Accountlist" v-for="(list, index) in lists" :key="index">
					<view class="text border-none">{{ list.text }}</view>
					<view class="img">
						<text v-if="list.Bundled">{{ list.Bundled }}</text>
						<text v-else>{{ list.Untied }}</text>
						<image :src="list.img" mode="widthFix"></image>
					</view>
				</view>
				<view class="returnlogin" @click="logout" v-if="isLogin">退出登录</view>
				<view class="gologin" @click="gotologin" v-else>登录</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref
} from 'vue';
import {
	onShow
} from "@dcloudio/uni-app"

import {
	user
} from '../fetchajax/api.js'

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();


const lists = ref([{
	text: '微信',
	Bundled: '',
	Untied: '未绑定(暂未完成)',
	img: '/static/Greater.png',
},
{
	text: '邮箱',
	Bundled: '',
	Untied: '未绑定',
	img: '/static/Greater.png',
}
])


const gotoback = () => {
	uni.navigateBack({
		delta: 1
	})
}


onShow(async () => {
	syncTabBarStyle(); // 确保导航条样式同步

	try {
		tockenLogin()

		const users = await user();
		console.log('Account-users', users.data);
		// 检查 users 中是否存在 email
		if (users.data.email) {
			// 找到 lists 中的邮箱项并更新
			const emailItem = lists.value.find(item => item.text === '邮箱');
			if (emailItem) {
				emailItem.Bundled = users.data.email; // 绑定的邮箱信息
				emailItem.Untied = ''; // 清空未绑定的提示
			}
		}

	} catch (error) {
		console.error('获取用户信息失败:', error);
	}
});
const isLogin = ref(false);

const tockenLogin = () => {
	const token = uni.getStorageSync('Token')
	console.log('tockenLogin', token);
	isLogin.value = !!token
}

const gotologin = () => {
	uni.navigateTo({
		url: '/pages/loginenroll/login'
	})
}
const logout = () => {
	// 删除 Token
	uni.removeStorage({
		key: 'Token',
		success: function () {
			console.log('删除成功');
			tockenLogin()
			uni.switchTab({
				url: '/pages/index/index'
			})
		},
		fail: function (err) {
			console.error('删除失败', err);
		}
	});
}
</script>

<style lang="less" scoped>
.Account {

	// background-color: #f5f5f5;
	padding: 35rpx 20rpx 20rpx 20rpx;

	.edition {
		background-color: #f9f9f9;
		padding: 20rpx;
		border-radius: 25rpx;

		.title {
			// width: 100%;
			padding: 25rpx;
			background-color: white;
			// border-bottom: 1px solid #e8e8e8;

			display: flex;
			align-items: center;

			.img {
				width: 45rpx;
				// background-color: aqua;

				image {
					width: 100%;
					display: block;
				}
			}

			.titletext {
				margin: auto;
				font-size: 40rpx
			}
		}

		.Accountlist {
			background-color: white;
			padding: 25rpx 30rpx;
			margin: 25rpx 0;
			border-radius: 15rpx;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.text {
				// font-size: 35rpx;
				font-weight: bold;
			}

			.img {
				display: flex;
				align-items: center;

				text {
					color: gray;
				}

				image {
					margin-left: 15rpx;
					width: 20rpx;
					display: block;
				}
			}
		}

		.returnlogin,
		.gologin {
			text-align: center;
			padding: 25rpx 0;


			&:active {
				color: red;
			}
		}
	}
}
</style>
