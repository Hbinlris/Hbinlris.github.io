<template>
    <div id="app">
        <div class="top">

            <van-search
                style="width: 90%;"
                v-model="searchValue"
                placeholder="请输入搜索关键词"
                @input="handleSearch"
                @focus="showHistory = true"
            />
            <span @click="$router.go(-1)" style="color: gray;">取消</span>
        </div>
        <div v-if="showHistory && !searchValue.trim()" class="history">
            <p>搜索历史：</p>
            <p v-for="(item, index) in searchHistory" 
               :key="index" 
               @click="handleHistorySearch(item)">
                {{ item }}
            </p>
            <p v-if="!searchHistory.length" class="empty-history">暂无搜索记录</p>
        </div>
        <div class="results">
            <div v-if="!filteredTabs.length" class="no-results">
                暂无搜索内容
            </div>
            <div
                v-for="(item, index) in filteredTabs"
                :key="index"
                @click="goToContent(item.id)"
            >
                <div v-if="item.status === '公开' && item.status22 === '已审核'">
                   <p style="font-size: 16rem; color: gray;">{{ item.title }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            searchValue: "", // 用户输入的搜索关键词
            tabs: [], // 原始数据
            searchHistory: [], // 搜索记录
            showHistory: false, // 是否显示历史记录
        };
    },
    computed: {
        filteredTabs() {
            // 当 searchValue 为空时返回空数组，否则根据搜索关键词过滤
            if (!this.searchValue.trim()) {
                return [];
            }
            return this.tabs.filter(item =>
                item.title.includes(this.searchValue)
            );
        },
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/publish"
                );
                this.tabs = response.data;
            } catch (error) {
                console.error("数据获取失败:", error);
            }
        },
        handleSearch() {
            if (!this.searchValue.trim()) {
                this.showHistory = true;
                return;
            }
            this.showHistory = false;
            // 保存到历史记录中，避免重复记录
            if (!this.searchHistory.includes(this.searchValue.trim())) {
                this.searchHistory.unshift(this.searchValue.trim());
                // 限制最多存储 10 条历史记录
                if (this.searchHistory.length > 10) {
                    this.searchHistory.pop();
                }
            }
        },
        handleHistorySearch(keyword) {
            // 点击历史记录进行搜索
            this.searchValue = keyword;
            this.showHistory = false;
        },
        goToContent(id) {
            // 跳转到内容页
            this.$router.push({ name: "ContentXq", params: { id } }); 
            }
    },
    mounted() {
        // 加载时获取数据
        this.fetchData();
        // 从本地存储加载历史记录
        const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        this.searchHistory = history;
    },
    watch: {
        // 当历史记录更新时保存到本地存储
        searchHistory: {
            handler(newHistory) {
                localStorage.setItem("searchHistory", JSON.stringify(newHistory));
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.results {
    margin: 16rem;
}

.top {
    display: flex;
    align-items: center;
}

.history {
    margin: 16rem;
    background: #f9f9f9;
    padding: 16rem;
    border-radius: 8rem;
    box-shadow: 0 2rem 8rem rgba(0, 0, 0, 0.1);
}

.history p {
    font-size: 14rem;
    color: #666;
    margin-bottom: 8rem;
    cursor: pointer;
}

.empty-history {
    font-size: 14rem;
    color: #999;
}

.no-results {
    font-size: 14rem;
    color: #999;
    text-align: center;
    margin-top: 16rem;
}
</style>
