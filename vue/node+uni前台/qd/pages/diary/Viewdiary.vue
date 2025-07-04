<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="Viewdiary">
			<view class="mask" v-if="showEjectLayer" @click="closeEject"></view>
			<view class="edition">
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">日记</view>
				</view>
				<!-- 展示 -->
				<view class="content">
					<view class="viewdiarybox" v-for="(lookdiary, index) in getview" :key="index" @click="ejectbox(lookdiary)">
						<view class="box">
							<h3>{{ lookdiary.diarytitle }}</h3>
							<view class="time">{{ lookdiary.date }}</view>
						</view>
					</view>
				</view>

				<!-- 完整内容 -->
				<view class="ejectlayers" v-if="showEjectLayer">
					<view class="ejectcontent">
						<view class="closebtn">
							<view class="closeDestroyed" @click="destroyed">删除</view>
							<view class="closedelete" @click="closeEject"> x</view>
						</view>
						<h3>{{ selectedDiary.diarytitle }}</h3>
						<view class="imagebox">
							<view class="itemimage" v-for="(urlimage, index) in selectedDiary.Image" :key="index"
								@click="showBigImage(urlimage)">
								<image :src="urlimage" mode="aspectFit"></image>
							</view>
						</view>
						<view class="diarytext">{{ selectedDiary.diarytext }}</view>
						<view class="time">{{ selectedDiary.date }}</view>
					</view>
				</view>

				<!-- 放大 -->
				<view class="big-image-modal" v-if="showBigImageModal" @click="closeBigImageModal">
					<view class="big-image-container" @click="closeBigImageModal">
						<image :src="bigImageUrl" mode="widthFix" />
					</view>
				</view>

				

			</view>
		</view>
	</view>
</template>

<script setup>
import {
	onShow
} from "@dcloudio/uni-app";
import {
	getdiary,
	destroyedDiary
} from '../fetchajax/api.js';
import {
	ref
} from "vue";
import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();

const gotoback = () => {
	uni.navigateBack({
		delta: 1
	});
};

const getview = ref([]);


const viewdiary = () => {
	getdiary().then((res) => {
		const formattedDiaryData = res.data.diarydata.map(item => {
			const date = item.date.split(' ')[0]; // 只保留日期部分
			return {
				...item,
				date
			};
		});
		getview.value = formattedDiaryData;
	}).catch((err) => {
		console.log('查询失败:', err);
	});
};

onShow(async () => {
	syncTabBarStyle(); // 确保导航条样式同步
	await viewdiary();
});

const showEjectLayer = ref(false);
const selectedDiary = ref({});
const ejectbox = (diary) => {
	selectedDiary.value = diary;
	console.log('selectedDiary.value', selectedDiary.value);
	showEjectLayer.value = true;
};

const closeEject = () => {
	showEjectLayer.value = false;
};

const showBigImageModal = ref(false);
const bigImageUrl = ref('');

const showBigImage = (url) => {
	bigImageUrl.value = url;
	showBigImageModal.value = true;
};

const closeBigImageModal = () => {
	showBigImageModal.value = false;
	console.log('closeBigImageModal点击');
};

// 删除
const destroyed = () => {
	uni.showModal({
		title: '是否删除当前日记',
		success: function (res) {
			if (res.confirm) {
				console.log('用户点击确定-销毁');
				const _id = selectedDiary.value._id;
				console.log('_id', _id, typeof _id);
				destroyedDiary(
					_id
				).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							title: res.data.message,
							icon: 'success'
						});
						closeEject(); // 关闭弹窗
						viewdiary() //重新更新日记列表
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'error'
						});
					}
				}).catch((err) => {
					console.error('删除失败:', err);
					uni.showToast({
						title: err.data.message,
						icon: 'error'
					});
				});
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	});
}
</script>

<style lang="less" scoped>
.Viewdiary {

	background-color: #f5f5f5;
	padding: 35rpx 20rpx 20rpx 20rpx;
	position: relative; // 设置相对定位

	.edition {
		background-color: #f9f9f9;
		padding: 20rpx;
		border-radius: 25rpx;

		.title {
			padding: 25rpx;
			display: flex;
			align-items: center;

			.titletext {
				margin: auto;
				font-size: 40rpx;
			}

			.img {
				width: 45rpx;

				image {
					width: 100%;
					display: block;
				}
			}
		}

		.content {
			margin: 10rpx 0;
			width: 100%;

			.viewdiarybox {
				background-color: #f5f5f5;
				padding: 15rpx;
				border-radius: 15rpx;
				margin-bottom: 20rpx;
				cursor: pointer;

				.time {
					text-align: end;
				}
			}
		}

		.ejectlayers {
			position: absolute; // 绝对定位
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5); // 半透明背景
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 10; // 确保在最上层

			.ejectcontent {
				background-color: white;
				padding: 20rpx;
				border-radius: 15rpx;
				width: 80%; // 根据需要调整宽度
				height: 70%;
				overflow: hidden;
				overflow-y: auto;
				// position: relative;

				.closebtn {
					// background-color: antiquewhite;
					font-size: 40rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 30rpx;

					.closedelete {
						// background-color: aqua;
					}

					.closeDestroyed {
						// background-color: aquamarine;
					}
				}

				.imagebox {
					display: flex;
					justify-content: start;
					margin: 15rpx 0;
					// background-color: aqua;

					.itemimage {
						margin-right: 15rpx;
						width: 150rpx;
						height: 150rpx;
						// background-color: antiquewhite;

						image {
							width: 100%;
							height: 100%;
							display: block;
							border-radius: 25rpx;

						}
					}

				}

				.diarytext {
					margin-bottom: 10rpx;
				}

				.time {
					text-align: end;
				}
			}
		}
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 5; // 确保在弹出层下方
	}

	.big-image-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		// background-color: aqua;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 20;

		.big-image-container {
			width: 90%;
			height: 90%;
			max-width: 800px;
			// background-color: antiquewhite;
			// background-color: rgba(66, 66, 66, 0.8);
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 100%;
				height: auto;
				display: block;
				border-radius: 25rpx;
			}
		}
	}
}
</style>
