<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="Set-up">
			<view class="edition">
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">设置</view>
				</view>

				<view class="Accountbox" @click="gotoaccout(item.url)" v-for="item in Accountdata" :key="item.name">
					<view class="text">{{ item.name }}</view>
					<view class="img">
						<image :src="item.icon" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
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
	})
	console.log('1111');
	
}
// 数组列表
const Accountdata = ref([
	{
		name: "账号管理",
		desc: "密码修改",
		icon: "/static/Greater.png",
		url: "/pages/Account/Account"
	},
	{
		name: "基础设置",
		desc: "主题、字体、显示，语言，字体，提醒设置",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "写作偏好",
		desc: "自动保存、模板设置",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "隐私与安全",
		desc: "应用锁、隐私设置",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "数据管理",
		desc: "备份、导出、清理数据",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "意见反馈",
		desc: "提交建议和问题反馈",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "帮助中心",
		desc: "使用教程和常见问题",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "关于应用",
		desc: "版本信息和更新日志",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "检查更新",
		desc: "检查应用版本更新",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "隐私政策",
		desc: "查看隐私保护条款",
		icon: "/static/Greater.png",
		url: ""
	},
	{
		name: "服务条款",
		desc: "用户服务协议",
		icon: "/static/Greater.png",
		url: ""
	},
])

const gotoaccout = (url) => {
	if (url && url.trim() !== "") {
		uni.navigateTo({
			url: url
		})
		console.log('跳转到:', url);
	} else {
		uni.showToast({
			title: '功能开发中...',
			icon: 'none'
		});
		console.log('该功能暂未开放');
	}
	
}
</script>

<style lang="less" scoped>
.Set-up {

	background-color: #f5f5f5;
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

		.Accountbox {
			background-color: white;

			padding: 25rpx 30rpx;
			margin: 25rpx 0;
			border-radius: 15rpx;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.text {
				// font-size: 35rpx;
				font-weight: bold;
			}

			.img {
				width: 20rpx;

				image {
					width: 100%;
					display: block;
				}
			}
		}
	}
}
</style>
