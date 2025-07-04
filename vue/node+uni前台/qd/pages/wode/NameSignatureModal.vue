<template>
		<view class="modal-content">
			<input v-model="tempContent" :maxlength="informationList.Text === '名字' ? 16 : 30" placeholder="请输入内容" />
			<view class="modal-actions">
				<button @click="$emit('confirm', tempContent)">确定</button>
			</view>
		</view>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
	informationList: Object
})
const tempContent = ref(props.informationList.content)
</script>

<style scoped lang="less">
.modal-content {
	background-color: white;
	padding: 40rpx;
	border-radius: 20rpx;
	width: 80%;
	max-width: 600rpx;
	min-width: 400rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
	box-sizing: border-box;

	input {
		width: 100%;
		height: 100rpx;
		padding: 20rpx;
		margin-bottom: 30rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 10rpx;
		font-size: 32rpx;
		box-sizing: border-box;

		&:focus {
			border-color: #007aff;
			outline: none;
		}
	}

	.modal-actions {
		display: flex;
		justify-content: center;

		button {
			border: none;
			background-color: #007aff;
			color: white;
			padding: 20rpx 60rpx;
			border-radius: 10rpx;
			font-size: 32rpx;
			cursor: pointer;

			&:active {
				background-color: #0056cc;
			}
		}
	}
}
</style>
