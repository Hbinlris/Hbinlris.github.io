<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="wode">
			<!-- 图片放大 -->
			<view class="full-image-view" v-show="isImageZoomed" @click="closeImageZoom">
				<image :src="zoomedImage" mode="aspectFit" class="zoomed-image"></image>
			</view>

			<!-- 蒙层 -->
			<view class="mask" v-show="isMaskVisible"></view>

			<view class="edition">
				<!-- 设置区域 -->
				<view class="settings-header">
					<view class="setting-btn" @click="onTheme">
						<image v-if="isDark" src="/static/dark.png" mode="widthFix"></image>
						<image v-else src="/static/light.png" mode="widthFix"></image>
					</view>
					<view class="setting-btn" @click="gotosetup">
						<image src="/static/setup.png" mode="widthFix"></image>
					</view>
				</view>

				<!-- 个人信息卡片 -->
				<view class="profile-card">
					<view class="profile-avatar" @click="zoomImage(avatar)">
						<image v-if="avatar" :src="avatar" mode="aspectFit"></image>
						<image v-else src="/static/Initial-avatar.png" mode="aspectFit"></image>
					</view>
					<view class="profile-info">
						<view class="name">{{ isuser ? username : '未注册用户' }}</view>
						<view class="ID">ID: {{ userid ? userid : '请登录' }}</view>
						<view class="gender">{{ gender }}</view>
					</view>
				</view>

				<!-- 个人简介 -->
				<view class="signature-card">
					<view class="signature">{{ signature || '快来介绍一下自己' }}</view>
				</view>

				<!-- 统计数据 -->
				<view class="stats-card">
					<view class="stat-item">
						<view class="stat-number">{{ diarynumber }}</view>
						<view class="stat-label">日记数量</view>
					</view>
					<view class="stat-item">
						<view class="stat-number">{{ recording }}</view>
						<view class="stat-label">记录天数</view>
					</view>
					<view class="stat-item">
						<view class="stat-number">{{ Days }}</view>
						<view class="stat-label">打卡天数</view>
					</view>
				</view>

				<!-- 功能菜单 -->
				<view class="menu-list">
					<view class="menu-item" v-for="(item, index) in wodeLists" :key="index" @click="gotoinformation(item)">
						<view class="menu-text">{{ item.Text }}</view>
						<view class="menu-i">
							<image :src="item.iamge" mode="widthFix"></image>
						</view>
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
	user,
	getcheckIn,
	getdiary
} from '../fetchajax/api';

import useTheme from "../theme.js";
// 主题颜色
const {
	theme,
	themeClass,
	isDark,
	toggleTheme,
	syncTabBarStyle
} = useTheme();

const onTheme = () => {
	toggleTheme(); // 切换主题
};


const gotoinformation = (wodelist) => {
	if (wodelist.url) {
		// 重定向image.png
		if (wodelist.Text === "个人资料") {
			const token = uni.getStorageSync('Token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: '/pages/loginenroll/login',
					animationType: "slide-in-right",
				});
				return;
			}
		}
		uni.navigateTo({
			url: wodelist.url,
			animationType: "slide-in-right",
		});
	} else {
		console.error('未定义跳转路径:', wodelist);
	}
}

const gotosetup = () => {
	uni.navigateTo({
		url: '/pages/SetUp/SetUp',
		animationType: "slide-in-right",
	})
}

const wodeLists = ref([{
	Text: "日历",
	iamge: "/static/Calendar.png",
	url: "../Calendar/Calendar"
},
{
	Text: "日记",
	iamge: "/static/draft.png",
	url: "../diary/Viewdiary"
},
{
	Text: "个人资料",
	iamge: "/static/Personal.png",
	url: "./information"
}
])

const userid = ref('') //id
const username = ref('')
const avatar = ref('') //头像
const gender = ref('') //性别
const signature = ref('') //签名
const isuser = ref(false) //注册状态

const isImageZoomed = ref(false); // 是否显示放大图片
const isMaskVisible = ref(false); // 是否显示蒙层
const zoomedImage = ref(''); // 放大图片的 URL

// 点击头像放大
const zoomImage = (imgUrl) => {
	if (imgUrl) {
		zoomedImage.value = imgUrl;
		isImageZoomed.value = true;
		isMaskVisible.value = true; // 显示蒙层
	}
};

// 关闭图片放大
const closeImageZoom = () => {
	isImageZoomed.value = false;
	isMaskVisible.value = false; // 关闭蒙层
};

// 获取用户信息
const fetchUserInfo = async () => {
	const token = uni.getStorageSync('Token');
	if (!token) {
		resetUserState();
		return;
	}

	try {
		const users = await user();
		if (users.data.userid) {
			userid.value = users.data.userid;
			username.value = users.data.username || '注册用户';
			avatar.value = users.data.avatar;
			gender.value = users.data.gender;
			signature.value = users.data.signature || '快来介绍一下自己'
			isuser.value = true;

			await clockdays()
			await diary()
		}
	} catch (err) {
		console.error('获取用户信息失败:', err);
	}
}

// 天数
const Days = ref(0)
// 获取打卡天数
const clockdays = async () => {
	try {
		const response = await getcheckIn();
		const realData = response.data?.data ||
			(Array.isArray(response.data) ? response.data : []);

		if (Array.isArray(realData) && realData.length > 0) {
			const dates = realData
				.map(item => item?.date?.split(' ')[0] || '')
				.filter(date => date.length > 0);

			Days.value = [...new Set(dates)].length;
		} else {
			Days.value = 0;
		}
	} catch (err) {
		console.log('获取打卡天数失败:', err);
	}
}

// 重置用户状态
const resetUserState = () => {
	userid.value = '';
	username.value = '';
	avatar.value = '';
	gender.value = '';
	signature.value = ''
	isuser.value = false;
	Days.value = 0;
}

// 记录天数
const recording = ref(0)
// 日记数量
const diarynumber = ref(0)

// 获取日记信息
const diary = async () => {
	try {
		const resdiary = await getdiary();
		diarynumber.value = resdiary.data.diarydata.length

		const resdiaryData = resdiary.data?.diarydata ||
			(Array.isArray(resdiary.diarydata) ? resdiary.diarydata : []);

		if (Array.isArray(resdiaryData) && resdiaryData.length > 0) {
			const dates = resdiaryData
				.map(item => item?.date?.split(' ')[0] || '')
				.filter(date => date.length > 0);

			recording.value = [...new Set(dates)].length;
		} else {
			recording.value = 0;
		}
	} catch (err) {
		console.log('获取日记信息失败:', err);
	}
}

onShow(async () => {
	await fetchUserInfo();
	syncTabBarStyle(); // 确保导航条样式同步
})
</script>

<style lang="less" scoped>
// 页面容器
.wode {
	padding: 40rpx 30rpx;
	box-sizing: border-box;
}

// 主内容区域
.edition {
	padding: 40rpx 30rpx;
}

// 设置区域
.settings-header {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
	margin-bottom: 40rpx;

	.setting-btn {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.95);
		}

		image {
			width: 32rpx;
			height: 32rpx;
			filter: invert(1);
		}
	}
}

// 个人信息卡片
.profile-card {
	display: flex;
	align-items: center;
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;

	.profile-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-right: 30rpx;
		overflow: hidden;
		flex-shrink: 0;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.profile-info {
		flex: 1;

		.name {
			font-size: 36rpx;
			font-weight: 600;
			margin-bottom: 15rpx;
		}

		.ID {
			font-size: 26rpx;
			margin-bottom: 10rpx;
		}

		.gender {
			font-size: 26rpx;
		}
	}
}

// 个人简介卡片
.signature-card {
	padding: 30rpx;
	margin-bottom: 30rpx;

	.signature {
		font-size: 28rpx;
		line-height: 1.5;
	}

}

// 统计数据卡片
.stats-card {
	display: flex;
	padding: 40rpx 20rpx;
	margin-bottom: 30rpx;

	.stat-item {
		flex: 1;
		text-align: center;

		.stat-number {
			font-size: 32rpx;
			font-weight: 600;
			padding: 12rpx 20rpx;
			border-radius: 20rpx;
			display: inline-block;
			margin-bottom: 15rpx;
		}

		.stat-label {
			font-size: 24rpx;
		}
	}
}

// 功能菜单列表
.menu-list {
	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		margin-bottom: 20rpx;
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.98);
		}

		.menu-text {
			font-size: 30rpx;
			font-weight: 500;
		}

		.menu-i {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
}

// 图片放大相关
.mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 999;
}

.full-image-view {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;

	.zoomed-image {
		max-width: 90%;
		max-height: 90%;
		border-radius: 20rpx;
	}
}
</style>
