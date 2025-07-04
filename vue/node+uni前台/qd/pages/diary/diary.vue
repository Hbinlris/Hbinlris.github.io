<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="diary">
			<view class="edition">
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">记录</view>
					<view class="Save" @click="Savebtn">保存</view>
				</view>

				<view class="content">
					<!-- 文件上传 -->
					<view class="filebox">
						<view class="file" @click="uploadImage" v-if="imageList.length < 3">
							<view class="camera-text">
								<image class="camera" src="/static/camera.png" mode="widthFix"></image>
								<view class="text">上传图片</view>
							</view>
						</view>
						<view class="fileimagebox" v-for="(imageUrl, index) in imageList" :key="index">
							<image class="fileimage" :src="imageUrl" mode="aspectFit"></image>
							<view class="deleteimage" @click.stop="deleteImage(index)">x</view>
						</view>
					</view>
					<!-- 日记标题 -->
					<view class="diary-title">
						<input type="text" v-model="diaryTitle" class="titlename" placeholder="起一个小标题..." />
					</view>
					<!-- 日记内容 -->
					<view class="diary-text">
						<textarea class="text" v-model="diaryText" :maxlength="maxTextLength" cols="30" rows="10"
							placeholder="写份日记分享一下自己的心情吧~"></textarea>
					</view>
				</view>
				<view class="word">
					<view class="expression" @click="btnexpression">
						<image class="smile" src="/static/smile.png" mode="aspectFit"></image>
					</view>
					<!-- 字数提醒 -->
					<view class="number">
						{{ diaryText.length }}/{{ maxTextLength }}字
					</view>
				</view>

				<!-- Expression弹窗 -->
				<view class="expression-modal" :class="{ 'show': showExpression }">
					<view class="expression-content">
						<view class="expression-header">
							<view class="expression-title">选择表情</view>
							<view class="expression-close" @click="closeExpression">×</view>
						</view>
						<!-- 引入expression组件 -->
						<Expression :isVisible="showExpression" @select-expression="handleExpressionSelect" />
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
	delimage,
	diary,
	baseUrl
} from '../fetchajax/api.js'
import {
	onShow
} from "@dcloudio/uni-app"

import Expression from './expression.vue'; // 表情弹窗

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();

onShow(() => {
	syncTabBarStyle(); // 确保导航条样式同步
});



const gotoback = () => {
	uni.navigateBack({
		delta: 1
	})
}

// 图片显示
const imageList = ref([]);
// 存储url
const avatarUrl = ref([])
// const baseUrl = 'http://localhost:8080'
// const baseUrl = 'http://192.168.43.47:8080'

// 图片上传
const uploadImage = async () => {
	if (imageList.value.length >= 3) {
		uni.showToast({
			title: '最多只能上传3张图片',
			icon: 'none'
		});
		return;
	}

	try {
		const remaining = 3 - imageList.value.length;
		const chooseRes = await uni.chooseImage({
			count: remaining,
			sourceType: ['album', 'camera'],
			sizeType: ['compressed']
		});

		// 临时显示本地图片
		const tempList = [...imageList.value, ...chooseRes.tempFilePaths];
		imageList.value = tempList;

		// 逐个上传新选择的图片
		const newFiles = chooseRes.tempFilePaths;
		for (const filePath of newFiles) {
			await uploadSingleFile(filePath);
		}

	} catch (err) {
		console.error('选择失败', err);
		uni.showToast({
			title: '选择图片失败',
			icon: 'none'
		});
	}
}
// 上传图片
const uploadSingleFile = (filePath) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${baseUrl}/authtwo/upload`,
			filePath,
			name: 'file',
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('Token')}`
			},
			success: (uploadRes) => {
				try {
					const data = JSON.parse(uploadRes.data);
					if (data.success) {
						// 追加到存储数组
						avatarUrl.value.push(data.url);
						console.log('dliary-avatarUrl.value', avatarUrl.value);
						// 替换路径
						const index = imageList.value.indexOf(filePath);
						if (index !== -1) {
							imageList.value.splice(index, 1, data.url);
						}
						resolve(data.url);
					} else {
						reject(data.message);
					}
				} catch (e) {
					reject('解析响应失败');
				}
			},
			fail: (err) => {
				reject('上传失败');
			}
		});
	});
}

// 图片删除
const deleteImage = async (index) => {
	const fileUrl = imageList.value[index];
	try {
		// 移除本地显示
		imageList.value.splice(index, 1);

		// 调用删除接口
		if (fileUrl.startsWith(baseUrl)) {
			const res = await delimage(fileUrl);
			if (!(res.code === 200 && res.data.success)) {
				throw new Error(res.data?.message || '服务器删除失败');
			}
		}
	} catch (err) {
		console.error('删除失败:', err);
		uni.showToast({
			title: err.message || '删除失败',
			icon: 'none'
		});
	}
}

// 提交

// 日记标题
const diaryTitle = ref('')
// 日记内容
const diaryText = ref('')

// 字数限制
const maxTextLength = ref(1500);

const showExpression = ref(false);
// 表情
const btnexpression = () => {
	console.log('点击表情按钮，当前状态:', showExpression.value);
	showExpression.value = !showExpression.value; // 切换显示状态
	console.log('切换后状态:', showExpression.value);
}
const closeExpression = () => {
	console.log('关闭表情弹窗');
	showExpression.value = false;
}
const handleExpressionSelect = (expression) => {
	console.log('选择的表情:', expression);
	diaryText.value += expression;
}



const Savebtn = () => {
	const diarydata = {
		Image: avatarUrl.value,
		diarytitle: diaryTitle.value,
		diarytext: diaryText.value
	}
	console.log('dliary-diarydata', diarydata);

	// 获取本地存储中的token
	const token = uni.getStorageSync('Token');
	if (!token) {
		uni.showToast({
			title: "请先登录",
			icon: 'none',
		});
		return;
	}

	diary({
		diarydata: diarydata
	}).then((res) => {
		console.log('diarydata', res);
		diaryTitle.value = ''
		diaryText.value = ''
		imageList.value = ''
	}).catch((err) => {
		console.log('保存失败', err);
	})
}
</script>

<style lang="less" scoped>
.diary {
	// background-color: #f5f5f5;
	background-color: #f5f5f5;
	padding: 35rpx 20rpx 48rpx 20rpx;
	margin: 0;

	.edition {
		background-color: #f9f9f9;
		padding: 20rpx;
		border-radius: 25rpx;

		// 标题
		.title {
			padding: 25rpx;
			// background-color: chartreuse;
			// border-bottom: 1px solid #e8e8e8;

			display: flex;
			justify-content: space-between;
			align-items: center;

			.titletext {
				// background-color: antiquewhite;
				margin: auto;
				font-size: 40rpx
			}

			.img {
				width: 45rpx;
				// background-color: aqua;

				image {
					width: 100%;
					display: block;
				}
			}

		}

		.content {
			margin-top: 50rpx;
			width: 100%;
			// height: 800rpx;
			// background-color: antiquewhite;

			.filebox {
				// margin-bottom: 50rpx;
				// background-color: orange;
				display: flex;

				.file {
					width: 150rpx;
					height: 150rpx;
					border-radius: 15rpx;
					background-color: #e1e1e1;
					margin-right: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					.camera-text {
						.camera {
							width: 45rpx;
							display: block;
							margin: auto;
						}

						.text {
							font-style: 15rpx;
						}
					}



				}

				.fileimagebox {
					width: 150rpx;
					height: 150rpx;
					margin-right: 20rpx;
					position: relative;

					.fileimage {
						width: 100%;
						height: 100%;
						border-radius: 15rpx;
					}

					.deleteimage {
						color: red;
						position: absolute;
						right: 10rpx;
						top: 0;
						font-size: 35rpx
					}
				}
			}

			.diary-title {
				// background-color: aqua;
				text-align: center;
				border-bottom: 1px solid #ccc;
				margin-bottom: 20rpx;

				.titlename {
					font-size: 45rpx
				}
			}

			.diary-text {
				.text {
					// text-indent: 2em;
					width: 100%;
					min-height: 700rpx;
					// background-color: chocolate;

				}
			}
		}

		.word {
			// background-color: orangered;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			.number {
				color: #ccc;
				border-radius: 12rpx;
				padding: 6rpx 12rpx;
			}

			.expression {
				border-radius: 50%;

				.smile {
					width: 45rpx;
					display: block;
					height: 45rpx;
				}
			}
		}
	}

	// Expression底部弹窗样式
	.expression-modal {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 45vh;
		background-color: white;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
		transform: translateY(100%); // 默认隐藏在底部
		transition: transform 0.3s ease-in-out;
		z-index: 100;

		pointer-events: none;

		// 显示状态
		&.show {
			transform: translateY(0); // 弹出显示
			pointer-events: auto;
		}

		.expression-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 40rpx 20rpx;
			border-bottom: 1px solid #eee;

			.expression-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.expression-close {
				font-size: 45rpx;
				cursor: pointer;
				color: #666;
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				// border-radius: 50%;
				transition: background-color 0.3s;

				&:active {
					background-color: #f0f0f0;
				}
			}
		}
	}
}
</style>
