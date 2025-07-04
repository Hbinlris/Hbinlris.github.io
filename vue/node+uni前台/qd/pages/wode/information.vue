<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="information">
			<view class="edition">
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">个人资料</view>
				</view>

				<view class="content">
					<!-- 文件上传 -->
					<view class="filebox">
						<view class="file" @click="uploadImage">
							<image class="fileimage" v-if="imageUrl" :src="imageUrl" mode="aspectFit"></image>
							<image class="camera" v-else src="/static/camera.png" mode="widthFix"></image>
						</view>
					</view>
					<!-- 列表 -->
					<view class="informationLists" v-for="(informationList, index) in informationLists" :key="index"
						@click="showModal(index)">
						<view class="text">{{ informationList.Text }}</view>
						<view class="content-image">
							<view class="informationLists-content">{{ informationList.content }}</view>
							<view class="informationLists-image">
								<image src="/static/Greater.png" mode="widthFix"></image>
							</view>
						</view>
					</view>

					<!-- 提交 -->
					<button @click="save">保存</button>

					<!-- 弹出框 -->
					<view v-if="showModalIndex !== null" class="modal">
						<component :is="modalComponent" :informationList="informationLists[showModalIndex]" @confirm="confirm">
						</component>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import { onShow } from "@dcloudio/uni-app"
import { inform, user, baseUrl } from '../fetchajax/api.js'
import NameSignatureModal from './NameSignatureModal.vue';
import GenderModal from './GenderModal.vue';
import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme } = useTheme();

// 🔥 添加onShow生命周期，获取用户数据
onShow(async () => {
	await fetchUserInfo();
});

const gotoback = () => {
	uni.navigateBack({
		delta: 1
	})
}

// 图片显示
const imageUrl = ref('');
// 存储url
const avatarUrl = ref('')

// 🔥 添加获取用户信息的方法
const fetchUserInfo = async () => {
	const token = uni.getStorageSync('Token');
	if (!token) {
		console.log('没有token，使用默认数据');
		return;
	}

	try {
		const users = await user();
		console.log('获取到的用户信息:', users);

		if (users.data) {
			// 更新头像
			if (users.data.avatar) {
				imageUrl.value = users.data.avatar;
				avatarUrl.value = users.data.avatar;
			}

			// 更新表单数据
			informationLists.value[0].content = users.data.username || '';
			informationLists.value[1].content = users.data.gender || '';
			informationLists.value[2].content = users.data.signature || '';
		}
	} catch (err) {
		console.error('获取用户信息失败:', err);
		uni.showToast({
			title: '获取用户信息失败',
			icon: 'none'
		});
	}
}

const uploadImage = async () => {
	try {
		// 选择图片
		const chooseRes = await uni.chooseImage({
			count: 1,
			sourceType: ['album', 'camera'],
			sizeType: ['compressed'] // 压缩图片
		});

		const filePath = chooseRes.tempFilePaths[0];
		imageUrl.value = filePath; // 本地预览
		console.log('filePath', filePath);

		// 上传图片
		const uploadTask = uni.uploadFile({
			url: `${baseUrl}/authtwo/upload`, // 后端上传接口
			filePath: filePath,
			name: 'file',
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('Token')}`
			},
			formData: {},
			success: (uploadRes) => {
				const data = JSON.parse(uploadRes.data);
				if (data.success) {
					// 上传成功，设置图片链接
					avatarUrl.value = data.url
					uni.showToast({
						title: '上传成功',
						icon: 'success',
					});
				} else {
					// 上传失败
					uni.showToast({
						title: data.message || '上传失败',
						icon: 'none',
					});
				}
			},
			fail: (err) => {
				console.error('上传失败:', err);
				uni.showToast({
					title: '上传失败',
					icon: 'none',
				});
			},
		});

	} catch (err) {
		console.error('上传错误:', err);
	}
};

// 列表 - 初始化为空，由fetchUserInfo填充
const informationLists = ref([
	{
		Text: "名字",
		content: '', // 将由fetchUserInfo更新
	},
	{
		Text: "性别",
		content: '', // 将由fetchUserInfo更新
	},
	{
		Text: "签名",
		content: '', // 将由fetchUserInfo更新
	},
])

// 弹出框
const showModalIndex = ref(null)
const modalComponent = shallowRef(null);

const showModal = (index) => {
	showModalIndex.value = index
	if (informationLists.value[index].Text === '名字' || informationLists.value[index].Text === '签名') {
		modalComponent.value = NameSignatureModal
	} else if (informationLists.value[index].Text === '性别') {
		modalComponent.value = GenderModal
	}
}

const confirm = (content) => {
	if (showModalIndex.value === null) return
	const list = informationLists.value
	list[showModalIndex.value].content = content
	showModalIndex.value = null
}

// 保存
const save = () => {
	try {
		const data = {
			avatar: avatarUrl.value,
			username: informationLists.value[0].content,
			gender: informationLists.value[1].content,
			signature: informationLists.value[2].content
		};

		console.log('保存的数据:', data);

		inform({
			...data
		}).then((res) => {
			console.log('informres', res);
			uni.showToast({
				title: '资料保存成功',
				icon: 'success'
			});
			uni.switchTab({
				url: '/pages/wode/wode'
			})

		}).catch((err) => {
			console.log('保存失败', err);
		})

	} catch (err) {
		uni.showToast({
			title: '保存失败',
			icon: 'none'
		});
		console.error('保存错误:', err);
	}
}
</script>
<style lang="less" scoped>
.information {

	background-color: #f5f5f5;
	padding: 35rpx 20rpx 20rpx 20rpx;

	.edition {
		background-color: #f9f9f9;
		padding: 20rpx;
		border-radius: 25rpx;

		.title {
			padding: 25rpx;
			background-color: white;
			// border-bottom: 1px solid #e8e8e8;

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

		.content {
			margin-top: 50rpx;
			width: 100%;
			// height: 800rpx;

			.filebox {
				margin-bottom: 50rpx;

				.file {
					width: 200rpx;
					height: 200rpx;
					margin: auto;
					border-radius: 50%;
					border: 1rpx solid #ccc;
					display: flex;
					align-items: center;
					justify-content: center;

					.fileimage {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						display: block;
						object-fit: cover;
					}

					.camera {
						width: 80rpx;
					}
				}

			}

			.informationLists {
				background-color: white;

				padding: 25rpx 30rpx;
				margin-bottom: 25rpx;
				border-radius: 15rpx;

				display: flex;
				align-items: center;
				justify-content: space-between;

				.text {
					font-weight: bold;
					// background-color: aquamarine;
					width: 100rpx;
					text-align: center;
				}

				.content-image {
					// background-color: aqua;
					display: flex;
					align-items: center;

					.informationLists-image {
						width: 30rpx;
						height: 30rpx;
						display: flex;
						align-items: center;

						image {
							width: 100%;
							display: block;
						}
					}

					.informationLists-content {
						height: 100%;
						// background-color: antiquewhite;
						margin: 0 20rpx;
					}
				}

			}

			button {
				background-color: #e8e8e8;
				margin-top: 50rpx;
			}

			.modal {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.5);
				// background-color: red;
				display: flex;
				justify-content: center;
				align-items: center;


			}
		}
	}
}
</style>
