<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="login">
			<view class="edition">
				<!-- 标题 -->
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">登录</view>
				</view>
				<!-- 邮箱 -->
				<view class="emailbox">
					<input class="email" type="email" v-model="emailText" @input="EmailText" placeholder="请输入邮箱" />
					<!-- 报错 -->
					<view v-if="emailerrormassage" class="emailerrormassage">{{ emailerrormassage }}</view>
				</view>

				<!-- 密码 -->
				<view class="Passwordbox">

					<input class="passwordNumber" type="password" v-model="passwordNumber" @input="PasswordNumber"
						placeholder="请输入密码" />

					<!-- 报错 -->
					<view v-if="Passworderrormassage" class="Passworderrormassage">{{ Passworderrormassage }}</view>
				</view>

				<button class="btnlogin" @click="loginbtn">登录</button>
				<view class="forgetenoll">
					<view class="btnenoll" @click="enoll">点击注册</view>
				</view>

			</view>

		</view>
	</view>
</template>

<script setup>
import {
	ref
} from 'vue';


import {
	login
} from '../fetchajax/api';

import {
	onShow
} from "@dcloudio/uni-app"

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();

onShow(() => {
	syncTabBarStyle(); // 确保导航条样式同步
});

const gotoback = () => {
	uni.navigateBack({
		delta: 1
	});
}

const enoll = () => {
	uni.navigateTo({
		url: '/pages/loginenroll/enoll'
	})
}


// 邮箱
const emailText = ref('')

// 邮箱报错
const emailerrormassage = ref('')

// 邮箱正则
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 邮箱验证
const EmailText = () => {
	const inputValue = emailText.value;
	if (inputValue === '') {
		// 输入为空，清空错误信息
		emailerrormassage.value = '';
	} else if (!emailRegex.test(inputValue)) {
		// 输入不符合邮箱格式，设置错误信息
		emailerrormassage.value = '请输入有效的邮箱地址';
	} else {
		// 输入符合邮箱格式，清空错误信息
		emailerrormassage.value = '';
	}
	console.log(inputValue, '邮箱');
}

// 输入密码
const passwordNumber = ref('')

// 输入密码验证
const PasswordNumber = () => {
	const PasswordNumbervalue = passwordNumber.value
	console.log(PasswordNumbervalue, '输入密码');
}
// 密码报错
const Passworderrormassage = ref('')

// 确认的时候提交
const loginbtn = () => {
	if (emailText.value && passwordNumber.value) {
		const enollEmail = emailText.value.trim();
		console.log(enollEmail, '邮箱确认');

		const password = passwordNumber.value;
		console.log(password, '密码确认');

		console.log(enollEmail, '开始登录');

		login({
			email: enollEmail,
			password: password
		}).then(data => {
			console.log('login111', data);
			if (data && data.data.token) {
				uni.setStorageSync('Token', data.data.token);
				uni.switchTab({
					url: '/pages/wode/wode'
				})
			} else {
				Passworderrormassage.value = data.error || '邮箱或者密码错误';
			}
		}).catch(err => {
			console.log('登录失败', err);
		});
	}
}
</script>

<style lang="less" scoped>
.login {

	background-color: #f5f5f5;
	padding: 35rpx 20rpx 20rpx 20rpx;

	.edition {
		padding: 20rpx;

		.title {
			// width: 100%;
			padding: 25rpx;
			background-color: white;

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



		.emailbox {
			.email {
				height: 60rpx;
				padding: 25rpx;
				border: 1px solid gainsboro;
				border-radius: 25rpx;
				margin: 20rpx 0;
			}

			// 邮箱错误处理
			.emailerrormassage {
				padding-left: 15rpx;
				font-size: 25rpx;
				color: red;
			}
		}


		.Passwordbox {
			.passwordNumber {
				height: 60rpx;
				padding: 25rpx;
				border: 1px solid gainsboro;
				border-radius: 25rpx;
				margin: 20rpx 0;
			}

			// 密码错误处理
			.Passworderrormassage {
				padding-left: 15rpx;
				font-size: 25rpx;
				color: red;
			}
		}

		button {
			margin: 20rpx 0;
		}

		.forgetenoll {
			// background-color: antiquewhite;
			font-size: 30rpx;
			color: lightcoral;
			display: flex;
			justify-content: center;

		}
	}
}
</style>
