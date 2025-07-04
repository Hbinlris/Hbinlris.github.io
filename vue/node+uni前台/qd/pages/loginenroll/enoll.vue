<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="enoll">
			<view class="edition">
				<!-- 标题 -->
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">注册</view>
				</view>
				<!-- 邮箱 -->
				<view class="emailbox">
					<input class="email" type="email" v-model="emailText" @input="EmailText" placeholder="请输入邮箱" />

					<!-- 报错 -->
					<view v-if="emailerrormassage" class="emailerrormassage">{{ emailerrormassage }}</view>
				</view>

				<!-- 验证码 -->
				<view class="Captcha">
					<input class="NumberCaptcha" type="number" v-model="captchaText" @input="CaptchaText" placeholder="请输入验证码" />
					<view class="btnCaptcha" v-show="!countdownActive" @click="GetCaptcha">获取验证码</view>
					<view class="btnCaptcha" v-show="countdownActive">{{ countdownText }}</view>
				</view>
				<!-- 报错 -->
				<view v-if="Captchaerrormassage" class="Captchaerrormassage">{{ Captchaerrormassage }}</view>

				<!-- 密码 -->
				<view class="Password">
					<input class="passwordNumber" type="password" v-model="passwordNumber" @input="PasswordNumber"
						placeholder="请输入密码" />
					<input class="passwordNumber" type="password" v-model="ConfirmpasswordNumber" @input="ConfirmPasswordNumber"
						placeholder="请确认密码" />

					<!-- 报错 -->
					<view v-if="Passworderrormassage" class="Passworderrormassage">{{ Passworderrormassage }}</view>
				</view>

				<button @click="enollbtn">注册</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	onUnmounted
} from 'vue';
import {
	enoll,
	baseUrl
} from '../fetchajax/api';
import {
	onShow
} from "@dcloudio/uni-app"

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
onShow(() => {
	syncTabBarStyle();
});

const gotoback = () => {
	uni.navigateBack({
		delta: 1,
	});
};

// 邮箱
const emailText = ref('');
const emailerrormassage = ref('');

// 邮箱正则
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 邮箱验证
const EmailText = () => {
	const inputValue = emailText.value;
	if (inputValue === '') {
		emailerrormassage.value = '';
	} else if (!emailRegex.test(inputValue)) {
		emailerrormassage.value = '请输入有效的邮箱地址';
	} else {
		emailerrormassage.value = '';
	}
};

// 验证码
const captchaText = ref('');
const Captchaerrormassage = ref('');

// 验证码验证
const CaptchaText = () => {
	const Captchavalue = captchaText.value;
};

// 倒计时
const countdownActive = ref(false);
const countdown = ref(120);
const countdownText = ref('');
let countdownTimer = null; // 添加定时器引用

// 开始倒计时
const startCountdown = () => {
	// 清除可能存在的定时器
	if (countdownTimer) {
		clearInterval(countdownTimer);
	}

	// 重置倒计时值
	countdown.value = 120;
	countdownActive.value = true;

	countdownTimer = setInterval(() => {
		countdown.value--;
		countdownText.value = `${countdown.value}s`;

		// 修改判断条件，防止负数
		if (countdown.value <= 0) {
			clearInterval(countdownTimer);
			countdownTimer = null; // 清空引用
			countdownActive.value = false;
			countdownText.value = '';
			countdown.value = 120; // 重置为初始值
		}
	}, 1000);
};

// 组件卸载时清理定时器
onUnmounted(() => {
	if (countdownTimer) {
		clearInterval(countdownTimer);
		countdownTimer = null;
	}
});
// const baseUrl = 'http://localhost:8080'
// const baseUrl = 'http://192.168.43.47:8080'

// 获取验证码
const GetCaptcha = () => {
	EmailText();
	if (emailerrormassage.value) {
		return;
	}
	const emailtxt = emailText.value.trim();

	uni.request({
		url: `${baseUrl}/captcha`,
		method: 'POST',
		data: {
			email: emailtxt,
		},
		header: {
			'content-type': 'application/json',
		},
		success: (res) => {
			if (res.statusCode === 200) {
				Captchaerrormassage.value = '验证码已发送，请查收';
				startCountdown();
			} else {
				const response = res.data || {};
				Captchaerrormassage.value = response.error || '发送验证码失败，请稍后再试';
			}
		},
		fail: (err) => {
			console.error('发送验证码失败:', err.errMsg);
			Captchaerrormassage.value = '发送验证码失败，请稍后再试';
		},
	});
};

// 输入密码
const passwordNumber = ref('');
const ConfirmpasswordNumber = ref('');
const Passworderrormassage = ref('');

// 输入密码验证
const PasswordNumber = () => {
	const PasswordNumbervalue = passwordNumber.value;
};

// 确认密码验证
const ConfirmPasswordNumber = () => {
	const ConfirmPasswordNumbervalue = ConfirmpasswordNumber.value;
};

// 确认的时候提交
const enollbtn = () => {
	if (emailText.value || captchaText.value || passwordNumber.value) {
		const enollEmail = emailText.value.trim();
		const enollCaptcha = captchaText.value;

		if (passwordNumber.value !== ConfirmpasswordNumber.value) {
			Passworderrormassage.value = '两次密码不一致';
		} else {
			Passworderrormassage.value = '';
		}

		enoll({
			email: enollEmail,
			code: enollCaptcha,
			password: passwordNumber.value,
		}).then((res) => {
			console.log('enoll222', res, 'code', res.data.code, 'error', res.data.error, 'message', res
				.data.message);
			if (res.data.code === 0) {
				console.log('注册成功', res.data.message || res.data.error);
				uni.navigateTo({
					url: '/pages/loginenroll/login',
				});
			}
			if (res.data.code === 400) {
				console.log('完整的错误响应:', res);
				Captchaerrormassage.value = res.data.error;
				emailerrormassage.value = res.data.message;
			}
		}).catch((err) => {
			console.log('注册失败:', err);
			uni.showToast({
				title: err.data.message || '注册失败，请稍后再试',
				icon: 'none',
			});
		});
	} else {
		uni.showToast({
			title: '请输入内容',
			icon: 'none',
		});
	}
};
</script>

<style lang="less" scoped>
.enoll {

	background-color: #f5f5f5;
	padding: 35rpx 20rpx 20rpx 20rpx;

	.edition {
		padding: 20rpx;

		.title {
			padding: 25rpx;
			background-color: white;
			display: flex;
			align-items: center;

			.img {
				width: 45rpx;

				image {
					width: 100%;
					display: block;
				}
			}

			.titletext {
				margin: auto;
				font-size: 40rpx;
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

			.emailerrormassage {
				padding-left: 15rpx;
				font-size: 25rpx;
				color: red;
			}
		}

		.Captcha {
			position: relative;

			.NumberCaptcha {
				height: 60rpx;
				padding: 25rpx;
				border: 1px solid gainsboro;
				border-radius: 25rpx;
				margin: 20rpx 0;
			}

			.btnCaptcha {
				position: absolute;
				right: 20rpx;
				bottom: 40rpx;
			}
		}

		.Captchaerrormassage {
			padding-left: 15rpx;
			font-size: 25rpx;
			color: red;
		}

		.Password {
			.passwordNumber {
				height: 60rpx;
				padding: 25rpx;
				border: 1px solid gainsboro;
				border-radius: 25rpx;
				margin: 20rpx 0;
			}

			.Passworderrormassage {
				padding-left: 15rpx;
				font-size: 25rpx;
				color: red;
			}
		}

		button {
			margin: 20rpx 0;
		}
	}
}
</style>
