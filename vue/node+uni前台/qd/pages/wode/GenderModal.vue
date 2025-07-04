<template>
	<view class="modal-content">
		<picker :range="genderOptions" :value="selectedGenderIndex" @change="onPickerChange">
			<view class="picker">
				{{ genderOptions[selectedGenderIndex] }}
			</view>
		</picker>
		<view class="modal-actions">
			<button @click="confirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';

const emit = defineEmits(['confirm']);

const props = defineProps({
	informationList: Object
});

// 在选项数组开头添加默认提示文字
const genderOptions = ['请选择性别', '男', '女'];

// 调整初始选择索引的逻辑
const getInitialIndex = () => {
	const currentContent = props.informationList.content;
	if (currentContent === '男') return 1;
	if (currentContent === '女') return 2;
	return 0; // 默认显示"请选择性别"
};

const selectedGenderIndex = ref(getInitialIndex());

const onPickerChange = (e) => {
	selectedGenderIndex.value = e.detail.value;
};

const confirm = () => {
	// 如果选择的是默认提示文字，则不更新内容
	if (selectedGenderIndex.value === 0) {
		emit('confirm', '');
		return;
	}

	props.informationList.content = genderOptions[selectedGenderIndex.value];
	emit('confirm', props.informationList.content);
};
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

	.picker {
		width: 100%;
		padding: 20rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		text-align: center;
		font-size: 32rpx;
		background-color: #f8f8f8;
		box-sizing: border-box;

		// 为默认提示文字添加样式
		&:first-child {
			color: #999;
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
