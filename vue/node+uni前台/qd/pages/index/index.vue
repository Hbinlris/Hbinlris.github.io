<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="sign">
			<view class="edition">
				<!-- 标题 -->
				<view class="title">
					<view class="titletext">签到</view>
					<view class="button" @click="gotodiary">
						<image src="/static/diary.png" mode="widthFix"></image>
					</view>
				</view>

				<!-- 按钮 -->
				<view class="click-btn">
					<button class="btn" @click="frequency">签到</button>
				</view>

				<!-- 文本框 -->
				<view class="remark">
					<view class="note">备注：</view>
					<view class="input">
						<textarea class="text" v-model="content" placeholder="请输入内容" rows="2" :maxlength="30"
							@input="textinput"></textarea>
						<view class="number">{{ content.length }}/30字</view>
					</view>
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
	onShow
} from "@dcloudio/uni-app"

import {
	checkIn
} from '../fetchajax/api.js'

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();

onShow(() => {
	syncTabBarStyle(); // 确保导航条样式同步
});

const gotodiary = () => {
	uni.navigateTo({
		url: '/pages/diary/diary'
	})
}

const ClickTime = ref(0); // 存储上次时间戳
const seconds = 5000; // 时间间隔

// 时间换算
const formatDate = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const second = String(date.getSeconds()).padStart(2, '0');
	return `${year}年${month}月${day}日 ${hour}小时${minute}分钟${second}秒`;
};

// 签到点击
const frequency = () => {
	// 获取本地存储中的token
	const token = uni.getStorageSync('Token');
	if (!token) {
		uni.showToast({
			title: "请先登录",
			icon: 'none',
		});
		return;
	}

	const nowtime = Date.now();
	if (nowtime - ClickTime.value < seconds) {
		console.log('频繁');
		uni.showToast({
			title: "点击频繁，请稍后再试",
			icon: 'none',
		});
		return;
	}
	uni.showModal({
		title: '提示',
		content: '是否获取当前定位信息？',
		success: (res) => {
			console.log('uni.showModal-res', res);
			if (res.confirm) {
				uni.getLocation({
					isHighAccuracy: true,
					success: (res) => {
						const longitude = res.longitude;
						const latitude = res.latitude;
						console.log('当前位置的经度：', longitude);
						console.log('当前位置的纬度：', latitude);
						completeCheckIn(nowtime, longitude, latitude);
					},
					fail: () => {
						uni.showToast({
							title: "请授权获取位置信息",
							icon: 'none',
						});
						completeCheckIn(nowtime);
					}
				});
			} else {
				completeCheckIn(nowtime);
			}
		}
	});
};

// 签到
const completeCheckIn = (nowtime, longitude = null, latitude = null) => {
	ClickTime.value = nowtime;
	console.log(nowtime, '时间戳');

	const now = new Date(nowtime);
	const formatnow = formatDate(now);
	console.log(formatnow, '当前时间');

	// 签到数据
	const checkInData = {
		timestamp: nowtime,
		date: formatnow,
		longitude: longitude,
		latitude: latitude,
		remark: content.value
	};

	console.log('签到数据', checkInData);

	const signIn = checkIn({
		checkInData: checkInData
	}).then((res) => {
		console.log('index-res', res);
		if (res.data.code === 404) {
			uni.showToast({
				title: "用户不存在，请重新登录",
				icon: 'none',
			});
			const token = uni.getStorageSync('Token');
			uni.removeStorageSync('Token')
		} else if (res.data.code === 200) {
			uni.showToast({
				title: "打卡成功",
				// icon: 'none',
			});
			// 清空备注
			content.value = ''
			console.log('成功');
		}
	}).catch((err) => {
		// 错误处理
		console.log('签到数据发送失败', err);
		uni.showToast({
			title: "签到失败，请稍后再试",
			icon: 'none',
		});

	});

};

// 备注
const content = ref("");

const textinput = () => {
	console.log(content.value, '内容');
};
</script>

<style lang="less" scoped>
// 页面容器 - 基础布局
.sign {
	padding: 40rpx 30rpx;
	box-sizing: border-box;
}

// 主容器 - 基础布局
.edition {
	padding: 40rpx 30rpx;
}

// 标题区域 - 基础布局
.title {
	padding: 30rpx;
	margin-bottom: 60rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.titletext {
		font-size: 36rpx;
		font-weight: 600;
		flex: 1;
		text-align: center;
	}

	.button {
		width: 60rpx;
		height: 60rpx;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;

		&:active {
			background-color: rgba(255, 255, 255, 0.3);
			transform: scale(0.95);
		}

		image {
			width: 32rpx;
			height: 32rpx;
			filter: invert(1);
		}
	}
}

// 签到按钮区域 - 特殊样式
.click-btn {
	display: flex;
	justify-content: center;
	margin: 80rpx 0;

	.btn {
		width: 320rpx;
		height: 320rpx;
		border-radius: 50%;
		font-size: 32rpx;
		font-weight: 600;
		border: none;
		box-shadow:
			0 8rpx 20rpx rgba(108, 117, 125, 0.3),
			0 0 0 8rpx rgba(108, 117, 125, 0.1);
		transition: all 0.2s ease;
		position: relative;

		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		&:active {
			transform: scale(0.96);
			box-shadow:
				0 4rpx 12rpx rgba(108, 117, 125, 0.4),
				0 0 0 4rpx rgba(108, 117, 125, 0.15);
		}
	}
}

// 暗色主题下的签到按钮
.theme-dark .click-btn .btn {
	box-shadow:
		0 8rpx 20rpx rgba(73, 80, 87, 0.4),
		0 0 0 8rpx rgba(73, 80, 87, 0.1);

	&:active {
		box-shadow:
			0 4rpx 12rpx rgba(73, 80, 87, 0.5),
			0 0 0 4rpx rgba(73, 80, 87, 0.2);
	}
}

// 备注区域 - 基础布局
.remark {
	padding: 0;
	overflow: hidden;

	.note {
		font-size: 28rpx;
		font-weight: 500;
		padding: 20rpx 25rpx 15rpx;
		margin: 0;
	}

	.input {
		position: relative;
		padding: 25rpx;

		.text {
			width: 100%;
			min-height: 120rpx;
			background-color: transparent;
			border-radius: 0;
			padding: 0;
			font-size: 28rpx;
			line-height: 1.5;
			resize: none;
			box-sizing: border-box;
			border: 1px solid #dee2e6;

			&:focus {
				outline: none;
			}
		}

		.number {
			position: absolute;
			bottom: 30rpx;
			right: 30rpx;
			padding: 6rpx 12rpx;
			border-radius: 12rpx;
			font-size: 22rpx;
			font-weight: 500;
		}
	}
}
</style>
