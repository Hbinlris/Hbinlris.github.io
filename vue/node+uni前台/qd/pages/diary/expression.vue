<template>
  <view :class="themeClass" style="height: 100%;">
    <view class="expression">
      <view class="expression-header">
        <view class="expression-header-item" @click="btnexpression(expressionitem.id)"
          :class="{ 'active': classifyid === expressionitem.id }" v-for="expressionitem in expression"
          :key="expressionitem.id">

          {{ expressionitem.name }}
        </view>
      </view>

      <view class="expression-content">
        <!-- 根据选中的分类显示不同内容 -->
        <view class="expression-content-item" v-if="classifyid === 1">
          常用表情内容
        </view>

        <!-- 表情分类 - 轮播图效果 -->
        <view class="expression-content-item" v-if="classifyid === 2">
          <!-- 轮播图容器 -->
          <swiper class="emoji-swiper" :current="currentSwiperIndex" @change="onSwiperChange" :indicator-dots="false"
            :autoplay="false">

            <!-- 每个分类一页 -->
            <swiper-item v-for="(category, categoryIndex) in emojiCategories" :key="categoryIndex">

              <view class="swiper-page">
                <!-- 分类标题 -->
                <view class="category-title">{{ category.name }}</view>

                <!-- 表情网格容器 -->
                <scroll-view class="emoji-scroll" scroll-y enable-flex>
                  <view class="emoji-container">
                    <view class="emoji-row" v-for="(row, rowIndex) in getEmojiRows(category.emojis)" :key="rowIndex">
                      <view class="emoji-item" v-for="(emoji, emojiIndex) in row" :key="emojiIndex"
                        @click="selectEmoji(emoji)">
                        <text class="emoji">{{ emoji }}</text>
                      </view>
                    </view>
                  </view>
                </scroll-view>
              </view>
            </swiper-item>
          </swiper>

          <!-- 底部指示器 -->
          <view class="swiper-indicators">
            <view class="indicator-dot" :class="{ 'active': currentSwiperIndex === index }"
              v-for="(category, index) in emojiCategories" :key="index" @click="switchToCategory(index)">
              <text class="dot-text">{{ category.name }}</text>
            </view>
          </view>
        </view>

        <view class="expression-content-item" v-if="classifyid === 3">
          收藏表情内容
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  defineProps,
  defineEmits
} from 'vue';
import emojidata from './emojidata.json'

import {
  onShow
} from "@dcloudio/uni-app"

import useTheme from "../theme.js";
const { themeClass, isDark, toggleTheme } = useTheme();



const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['select-expression']);

// 表情数据
const emojis = ref(emojidata.emojiCategories)

// 按分类提取表情数据
const emojiCategories = computed(() => {
  console.log('按分类提取表情数据:', emojis.value);
  return emojis.value
})

// 将表情数组按每行8个分组
const getEmojiRows = (emojis) => {
  const rows = []
  const itemsPerRow = 7

  for (let i = 0; i < emojis.length; i += itemsPerRow) {
    rows.push(emojis.slice(i, i + itemsPerRow))
  }

  console.log('分组后的表情行:', rows);
  return rows
}

// 当前轮播图索引
const currentSwiperIndex = ref(0)

// 轮播图切换
const onSwiperChange = (e) => {
  currentSwiperIndex.value = e.detail.current
  console.log('切换到分类:', emojiCategories.value[currentSwiperIndex.value].name);
}

// 点击指示器切换分类
const switchToCategory = (index) => {
  currentSwiperIndex.value = index
  console.log('指示器切换到:', emojiCategories.value[index].name);
}

// 选择表情
const selectEmoji = (emoji) => {
  console.log('选中表情:', emoji);
  emit('select-expression', emoji);
}

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    console.log('表情弹窗打开，输出emojis数据:', emojis.value);
  }
});

// 默认选中常用
const classifyid = ref(1)
const btnexpression = (id) => {
  classifyid.value = id
  console.log('classifyid.value', classifyid.value);

  // 切换到表情分类时重置轮播图
  if (id === 2) {
    currentSwiperIndex.value = 0
  }
}

// 分类数据
const expression = ref([
  {
    id: 1,
    name: '常用',
  },
  {
    id: 2,
    name: '表情',
  },
  {
    id: 3,
    name: '收藏',
  },
])

</script>

<style lang="less" scoped>
.expression {
  width: 100%;
  overflow: hidden;

  .expression-header {
    background-color: #eee;
    height: 50rpx;
    padding: 10rpx 20rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .expression-header-item {
      flex: 1;
      text-align: center;
      transition: all 0.3s ease;
    }

    .active {
      background-color: #fff;
      border-radius: 10rpx;
    }
  }

  .expression-content {
    background-color: #f8f8f8;
    width: 100%;
    height: 580rpx;

    .expression-content-item {
      height: 100%;
      display: flex;
      flex-direction: column;

      // 轮播图样式
      .emoji-swiper {
        flex: 1;
        width: 100%;

        .swiper-page {
          height: 100%;
          display: flex;
          flex-direction: column;

          .category-title {
            text-align: center;
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            padding: 20rpx 0;
            border-bottom: 1px solid #eee;
            flex-shrink: 0;
          }

          // 滚动容器
          .emoji-scroll {
            flex: 1;
            height: 100%;


            .emoji-container {
              padding: 20rpx 0 40rpx 0;

              // 每一行表情
              .emoji-row {
                display: flex;
                gap: 8rpx;
                margin-bottom: 15rpx;

                .emoji-item {
                  flex: 1;
                  max-width: 12.5%;
                  aspect-ratio: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 5rpx;
                  border-radius: 8rpx;
                  background-color: white;
                  transition: all 0.2s ease;

                  &:last-child {
                    margin-right: 0;
                  }

                  &:active {
                    background-color: #e0e0e0;
                    transform: scale(0.9);
                  }

                  .emoji {
                    font-size: 40rpx;
                  }
                }
              }
            }
          }
        }
      }

      // 指示器样式
      .swiper-indicators {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20rpx;
        background-color: white;
        border-top: 1px solid #eee;
        flex-shrink: 0;

        .indicator-dot {
          margin: 0 10rpx;
          padding: 8rpx 16rpx;
          border-radius: 20rpx;
          background-color: #f0f0f0;
          transition: all 0.3s ease;

          .dot-text {
            font-size: 24rpx;
            color: #999;
          }

          &.active {
            background-color: #007aff;

            .dot-text {
              color: white;
            }
          }
        }
      }
    }
  }
}
</style>
