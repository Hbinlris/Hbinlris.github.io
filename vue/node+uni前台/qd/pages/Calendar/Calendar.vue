<template>
	<view :class="themeClass" style="height: 100%;">
		<view class="Calendar">
			<view class="edition">
				<!-- 标题 -->
				<view class="title">
					<view class="img" @click="gotoback">
						<image src="/static/smaller.png" mode="widthFix"></image>
					</view>
					<view class="titletext">日历</view>
				</view>

				<!-- 月份切换 -->
				<view class="header">
					<view class="arrow" @click="prevMonth">
						<image src="/static/smaller.png" mode=""></image>
					</view>
					<view class="title">{{ currentYear }}年{{ currentMonth + 1 }}月</view>
					<view class="arrow" @click="nextMonth">
						<image src="/static/Greater.png" mode=""></image>
					</view>
				</view>

				<!-- 星期标题 -->
				<view class="weekdays">
					<view class="weekday" v-for="day in weekdays" :key="day">{{ day }}</view>
				</view>

				<!-- 日期格子 -->
				<view class="days">
					<view v-for="(day, index) in days" :key="index" class="day" :class="{
						'current-month': day.isCurrentMonth,
						'today': day.isToday,
						'selected': day.isSelected,
						'marked': day.isMarked
					}" @click="selectDay(day)">
						<view class="day-number">{{ day.date.getDate() }}</view>
						<view class="marker" v-if="day.isMarked"></view>
					</view>
				</view>

				<!-- 签到详情 -->
				<view class="checkin-details" v-if="showDetails && selectedCheckIns.length > 0">
					<view class="details-header">
						<text class="details-title">签到详情 ({{ selectedCheckIns.length }}条)</text>
						<text class="details-close" @click="closeDetails">×</text>
					</view>
					<scroll-view class="details-content" scroll-y>
						<view class="checkin-record" v-for="(record, index) in selectedCheckIns" :key="index">
							<view class="record-header">
								<text class="record-time">{{ formatDisplayTime(record.date) }}</text>
								<text class="record-index">第<text> {{ index + 1 }}</text>次签到</text>
							</view>
							<view class="detail-item">
								<text class="detail-label">签到日期:</text>
								<text class="detail-value">{{ formatDisplayDate(record.date) }}</text>
							</view>
							<view class="detail-item" v-if="record.longitude || record.latitude">
								<text class="detail-label">签到位置:</text>
								<text class="detail-value">{{ record.longitude }}, {{ record.latitude }}</text>
							</view>
							<view class="detail-item">
								<text class="detail-label">备注:</text>
								<text class="detail-value">{{ record.remark || '无' }}</text>
							</view>
							<view class="divider" v-if="index < selectedCheckIns.length - 1"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	computed,
	onMounted
} from 'vue'
import {
	onShow
} from "@dcloudio/uni-app"
import {
	getcheckIn
} from '../fetchajax/api.js'

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();

const gotoback = () => {
	uni.navigateBack({
		delta: 1
	})
}

// 当前显示的年份和月份
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 选中的日期
const selectedDate = ref(null)

// 存储所有签到日期（格式为 'YYYY-MM-DD'）
const checkInDates = ref([])

// 计算当前月份的天数
const days = computed(() => {
	const year = currentYear.value
	const month = currentMonth.value

	// 当月第一天
	const firstDay = new Date(year, month, 1)
	// 当月最后一天
	const lastDay = new Date(year, month + 1, 0)
	// 上个月最后几天
	const prevMonthDays = firstDay.getDay()
	// 下个月前几天
	const nextMonthDays = 6 - lastDay.getDay()

	const daysArray = []

	// 添加上个月末尾的几天
	const prevMonthLastDay = new Date(year, month, 0).getDate()
	for (let i = prevMonthDays - 1; i >= 0; i--) {
		const date = new Date(year, month - 1, prevMonthLastDay - i)
		daysArray.push(createDayObject(date, false))
	}

	// 添加当月的天数
	for (let i = 1; i <= lastDay.getDate(); i++) {
		const date = new Date(year, month, i)
		daysArray.push(createDayObject(date, true))
	}

	// 添加下个月开头的几天
	for (let i = 1; i <= nextMonthDays; i++) {
		const date = new Date(year, month + 1, i)
		daysArray.push(createDayObject(date, false))
	}

	return daysArray
})

// 创建日期对象
function createDayObject(date, isCurrentMonth) {
	const dateStr = formatDate(date)
	return {
		date,
		isCurrentMonth,
		isToday: isSameDay(date, new Date()),
		isSelected: selectedDate.value ? isSameDay(date, selectedDate.value) : false,
		isMarked: checkInDates.value.includes(dateStr) // 检查是否是签到日
	}
}

// 判断是否是同一天
function isSameDay(date1, date2) {
	return date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	return `${year}-${month}-${day}`
}

// 解析API返回的日期字符串
function parseCheckInDate(dateStr) {
	// 示例日期格式: '2025年03月29日 19小时06分钟18秒'
	const match = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/)
	if (match) {
		const year = parseInt(match[1])
		const month = parseInt(match[2]) - 1 // 月份从0开始
		const day = parseInt(match[3])
		return new Date(year, month, day)
	}
	return null
}

const showDetails = ref(false)
const selectedCheckIn = ref(null)
const allCheckIns = ref([]) // 存储所有签到记录
const selectedCheckIns = ref([])

// 格式化显示日期
function formatDisplayDate(dateStr) {
	const date = parseCheckInDate(dateStr)
	return date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : ''
}

// 格式化显示时间
function formatDisplayTime(dateStr) {
	const match = dateStr.match(/(\d{2})小时(\d{2})分钟(\d{2})秒/)
	if (match) {
		return `${match[1]}:${match[2]}:${match[3]}`
	}
	return ''
}


// 选择日期
function selectDay(day) {
	if (!day.isCurrentMonth) {
		currentDate.value = new Date(day.date.getFullYear(), day.date.getMonth(), 1)
		return
	}

	selectedDate.value = day.date

	// 查找该日期的所有签到记录
	const dateStr = formatDate(day.date)
	selectedCheckIns.value = allCheckIns.value.filter(item => {
		const checkInDate = parseCheckInDate(item.date)
		return checkInDate && formatDate(checkInDate) === dateStr
	})

	if (selectedCheckIns.value.length > 0) {
		showDetails.value = true
	}
}

// 关闭详情面板
function closeDetails() {
	showDetails.value = false
}

// 上个月
function prevMonth() {
	currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

// 下个月
function nextMonth() {
	currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// 获取签到记录并处理
async function fetchCheckInRecords() {
	try {
		const response = await getcheckIn()
		console.log('签到数据:', response)

		if (response.data && Array.isArray(response.data.data)) {
			allCheckIns.value = response.data.data

			// 提取所有签到日期并格式化为 'YYYY-MM-DD'
			checkInDates.value = response.data.data.map(item => {
				const date = parseCheckInDate(item.date)
				return date ? formatDate(date) : null
			}).filter(dateStr => dateStr !== null)

			console.log('格式化后的签到日期:', checkInDates.value)
		}
	} catch (err) {
		console.error('获取签到数据失败:', err)
		uni.showToast({
			title: '获取签到记录失败',
			icon: 'none'
		})
	}
}

// 初始化时选中今天并获取签到记录
onMounted(() => {
	selectedDate.value = new Date()
	fetchCheckInRecords()
})

// 每次页面显示时刷新签到数据
onShow(() => {
	syncTabBarStyle(); // 确保导航条样式同步
	fetchCheckInRecords()
})
</script>

<style lang="less" scoped>
.Calendar {
	background-color: #f5f5f5;
	padding: 35rpx 20rpx 20rpx 20rpx;

	.edition {
		background-color: #f9f9f9;
		padding: 20rpx;
		border-radius: 25rpx;
	}

	.title {
		padding: 25rpx;
		// background-color: white;
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


	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		font-size: 32rpx;
		font-weight: bold;

		.arrow {
			padding: 0 30rpx;
			font-size: 36rpx;
			color: #666;

			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}

	.weekdays {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;

		.weekday {
			width: 14.28%;
			text-align: center;
		}
	}

	.days {
		display: flex;
		flex-wrap: wrap;

		.day {
			width: 14.28%;
			aspect-ratio: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			.day-number {
				font-size: 28rpx;
			}

			.marker {
				position: absolute;
				bottom: 10rpx;
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
				background-color: #f56c6c;
			}

			// 非当前月的日期
			&:not(.current-month) {
				color: #ccc;
			}

			// 今天
			&.today {
				.day-number {
					color: #409eff;
					font-weight: bold;
				}
			}

			// 选中的日期
			&.selected {
				background-color: #409eff;
				border-radius: 50%;

				.day-number {
					color: white;
				}

				.marker {
					background-color: white;
				}
			}

			// 已签到的日期
			&.marked:not(.selected) {
				.day-number {
					color: #f56c6c; // 红色文字
					font-weight: bold;
				}

				.marker {
					background-color: #f56c6c; // 红色标记点
					display: block; // 确保显示标记点
				}
			}
		}
	}

	// 签到详情
	.checkin-details {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		z-index: 100;


		.details-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;

			.details-title {
				font-size: 36rpx;
				font-weight: bold;
			}

			.details-close {
				font-size: 50rpx;
				color: #999;
				padding: 0 20rpx;
			}
		}

		.details-content {
			// background-color: orange;


			.checkin-record {
				background-color: #f5f5f5;
				border-radius: 15rpx;
				margin-bottom: 15rpx;
				padding: 15rpx;

				.record-header {
					// margin-bottom: 15rpx;

					.record-time {
						margin-right: 15rpx;
					}

					.record-index {
						.number {
							color: orangered;
						}
					}
				}

				.detail-item {
					display: flex;
					font-size: 28rpx;

					.detail-label {
						color: #666;
						width: 150rpx;
					}

					.detail-value {
						flex: 1;
						color: #333;
					}
				}
			}
		}
	}





}
</style>
