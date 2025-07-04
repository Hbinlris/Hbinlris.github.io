<template>
  <el-row>
    <el-col :span="6">
      <div class="usersvg" style="width: 60px; height: 60px">
        <svg
          class="icon"
          viewBox="0 0 1280 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M192 448c70.6 0 128-57.4 128-128s-57.4-128-128-128-128 57.4-128 128 57.4 128 128 128z m896 0c70.6 0 128-57.4 128-128s-57.4-128-128-128-128 57.4-128 128 57.4 128 128 128z m64 64h-128c-35.2 0-67 14.2-90.2 37.2 80.6 44.2 137.8 124 150.2 218.8h132c35.4 0 64-28.6 64-64v-64c0-70.6-57.4-128-128-128z m-512 0c123.8 0 224-100.2 224-224S763.8 64 640 64 416 164.2 416 288s100.2 224 224 224z m153.6 64h-16.6c-41.6 20-87.8 32-137 32s-95.2-12-137-32h-16.6C359.2 576 256 679.2 256 806.4V864c0 53 43 96 96 96h576c53 0 96-43 96-96v-57.6c0-127.2-103.2-230.4-230.4-230.4z m-447.4-26.8C323 526.2 291.2 512 256 512H128c-70.6 0-128 57.4-128 128v64c0 35.4 28.6 64 64 64h131.8c12.6-94.8 69.8-174.6 150.4-218.8z"
          />
        </svg>
      </div>
      <el-statistic title="用户数量" :value="userCount" />
    </el-col>
    <el-col :span="6">
      <div class="examinesvg" style="width: 60px; height: 60px">
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#17ddb1"
            d="M861.58955 750.675227A153.553243 153.553243 0 0 0 724.41532 665.7091h-20.473766l-107.999114-274.348461a204.737657 204.737657 0 1 0-168.396724 0L320.058446 665.7091h-20.473766a153.553243 153.553243 0 0 0-137.17423 84.966127L102.524685 870.446757h818.95063zM102.524685 921.631171h818.95063v102.368829H102.524685z"
          />
        </svg>
      </div>
      <el-statistic :value="pendingReviewCount">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            待审核
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix>/{{ noteCount }}</template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
      <div class="statistic-container" style="width: 60px; height: 60px">
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#17abe3"
            d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667a424.778667 424.778667 0 0 1-219.125333-60.501334 2786.56 2786.56 0 0 0-20.053334-11.765333l-104.405333 28.48c-23.893333 6.506667-45.802667-15.413333-39.285333-39.296l28.437333-104.288c-11.008-18.688-18.218667-31.221333-21.802667-37.909333A424.885333 424.885333 0 0 1 85.333333 512C85.333333 276.362667 276.362667 85.333333 512 85.333333z m-102.218667 549.76a32 32 0 1 0-40.917333 49.216A223.178667 223.178667 0 0 0 512 736c52.970667 0 103.189333-18.485333 143.104-51.669333a32 32 0 1 0-40.906667-49.216A159.189333 159.189333 0 0 1 512 672a159.189333 159.189333 0 0 1-102.218667-36.906667z"
          />
        </svg>
      </div>
      <el-statistic title="评论数量" :value="commentCount" />
    </el-col>
    <el-col :span="6">
      <div class="icon-container" style="width: 60px; height: 60px">
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#17bcd1"
            d="M832 42.666667a128 128 0 0 1 128 128v682.666666a128 128 0 0 1-128 128H277.333333a128.042667 128.042667 0 0 1-126.229333-106.666666H202.666667a96 96 0 0 0 4.522666-191.893334L202.666667 682.666667H149.333333v-74.666667h53.333334a96 96 0 0 0 95.893333-91.477333L298.666667 512a96 96 0 0 0-91.477333-95.893333L202.666667 416H149.333333V341.333333h53.333334a96 96 0 0 0 95.893333-91.477333L298.666667 245.333333a96 96 0 0 0-91.477334-95.893333L202.666667 149.333333H151.104A128.042667 128.042667 0 0 1 277.333333 42.666667h554.666667zM202.666667 746.666667a32 32 0 0 1 0 64h-106.666667a32 32 0 0 1 0-64h106.666667z m605.866666-445.866667a64 64 0 0 0-90.517333 0L411.413333 607.445333a42.666667 42.666667 0 0 0-12.117333 24.448l-8.64 63.829334a21.333333 21.333333 0 0 0 24.32 23.957333l62.869333-9.472a42.666667 42.666667 0 0 0 23.829334-12.010667l306.837333-306.858666a64 64 0 0 0 0-90.496zM202.666667 480a32 32 0 0 1 0 64h-106.666667a32 32 0 0 1 0-64h106.666667z m0-266.666667a32 32 0 0 1 0 64h-106.666667a32 32 0 0 1 0-64h106.666667z"
          />
        </svg>
      </div>
      <el-statistic title="笔记数量" :value="noteCount">
        <template #suffix> </template>
      </el-statistic>
    </el-col>
  </el-row>
  <div class="dashboard">
    <div style="margin-top: 20px">
      <div
        ref="chart"
        style="
          width: 300px;
          height: 200px;
          display: inline-block;
          margin-right: 20px;
        "
      ></div>
      <div
        ref="roseChart"
        style="
          width: 300px;
          height: 200px;
          display: inline-block;
          margin-right: 20px;
        "
      ></div>
      <div
        ref="barChart"
        style="width: 540px; height: 320px; display: inline-block"
      ></div>
      <ChinaMap />
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { ref, onMounted, watch } from "vue";
import { useTransition } from "@vueuse/core";
import { ChatLineRound, Male } from "@element-plus/icons-vue";
import axios from "axios";
import ChinaMap from "../../ChinaMap.vue";

export default {
  name: "Navigation2",
  components: {
    ChinaMap,
  },
  setup() {
    const source = ref(0);
    const outputValue = useTransition(source, {
      duration: 1500,
    });
    source.value = 172000;

    const noteCount = ref(0); // 用于存储笔记数量
    const commentCount = ref(0); // 用于存储评论数量
    const userCount = ref(0); // 用于存储用户数量
    const pendingReviewCount = ref(0); // 用于存储待审核的数量
    const genderData = ref([]); // 用于存储性别分布数据
    const honeyData = ref([]); // 用于存储 honey API 数据
    const users = ref([]); // 用于存储用户数据

    const chart = ref(null);
    const roseChart = ref(null);
    const barChart = ref(null);

    const fetchNoteCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/publish");
        noteCount.value = response.data.length; // 设置笔记数量
        console.log("noteCount", noteCount.value); // 确保这里打印正确
      } catch (error) {
        console.error("获取笔记数量失败:", error);
      }
    };

    const fetchCommentCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/comments");
        commentCount.value = response.data.data.length; // 设置评论数量
        console.log("commentCount", commentCount.value); // 确保这里打印正确
      } catch (error) {
        console.error("获取评论数量失败:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users");
        users.value = response.data;
        userCount.value = users.value.length; // 设置用户数量
        console.log("userCount", userCount.value); // 确保这里打印正确

        // 统计性别分布
        const genderCounts = {};
        users.value.forEach((user) => {
          const gender = user.grzl?.xingbie || "未知性别"; // 如果 grzl 或 xingbie 字段不存在，则使用 "未知性别"
          if (genderCounts[gender]) {
            genderCounts[gender]++;
          } else {
            genderCounts[gender] = 1;
          }
        });

        // 转换为饼状图数据格式
        genderData.value = Object.keys(genderCounts).map((gender) => ({
          value: genderCounts[gender],
          name: gender,
        }));

        console.log("genderData", genderData.value); // 确保这里打印正确
      } catch (error) {
        console.error("获取用户数据失败:", error);
        // 可以在这里添加用户友好的提示
      }
    };

    const fetchPendingReviewCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/publish");
        pendingReviewCount.value = response.data.filter(
          (item) => item.status22 === "未审核"
        ).length; // 设置待审核的数量
        console.log("pendingReviewCount", pendingReviewCount.value); // 确保这里打印正确
      } catch (error) {
        console.error("获取待审核数量失败:", error);
      }
    };

    const fetchHoneyData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/honey");
        honeyData.value = response.data;
        console.log("honeyData", honeyData.value); // 确保这里打印正确
      } catch (error) {
        console.error("获取 honey 数据失败:", error);
      }
    };

    const initChart = () => {
      const chartDom = chart.value;
      if (!chartDom) return; // 确保 DOM 元素存在
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: genderData.value, // 使用处理后的性别分布数据
          },
        ],
      };

      myChart.setOption(option);
    };

    const initRoseChart = () => {
      const roseChartDom = roseChart.value;
      if (!roseChartDom) return; // 确保 DOM 元素存在
      const roseChartInstance = echarts.init(roseChartDom);

      const roseOption = {
        series: [
          {
            type: "pie",
            data: [
              {
                value: 100,
                name: "A",
              },
              {
                value: 200,
                name: "B",
              },
              {
                value: 300,
                name: "C",
              },
              {
                value: 400,
                name: "D",
              },
              {
                value: 500,
                name: "E",
              },
            ],
            roseType: "area",
          },
        ],
      };

      roseChartInstance.setOption(roseOption);
    };

    const initBarChart = () => {
      const barChartDom = barChart.value;
      if (!barChartDom) return; // 确保 DOM 元素存在
      const barChartInstance = echarts.init(barChartDom);

      const labels = honeyData.value.map((item) => item.label);
      const seriesData1 = honeyData.value.map((item) =>
        parseInt(item.tags, 10)
      );
      const seriesData2 = honeyData.value.map(
        (item) => parseInt(item.tags, 10) * 2
      ); // 示例数据，可以根据需要调整

      const barOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["Tags 1", "Tags 2", "Line"],
        },
        xAxis: [
          {
            type: "category",
            data: labels, // 使用 honeyData 的 label 字段
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Tags",
            min: 0,
            max: Math.max(...seriesData1, ...seriesData2) + 10, // 设置最大值
            interval: 10,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "Tags 1",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: seriesData1, // 使用 honeyData 的 tags 字段
          },
          {
            name: "Tags 2",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: seriesData2, // 示例数据，可以根据需要调整
          },
          {
            name: "Line",
            type: "line",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: seriesData1, // 使用 honeyData 的 tags 字段
          },
        ],
      };

      barChartInstance.setOption(barOption);
    };

    // 监听 genderData 的变化，当 genderData 更新时重新初始化饼状图
    watch(genderData, (newVal) => {
      if (newVal.length > 0) {
        initChart();
      }
    });

    // 监听 honeyData 的变化，当 honeyData 更新时重新初始化柱状图
    watch(honeyData, (newVal) => {
      if (newVal.length > 0) {
        initBarChart();
      }
    });

    // 监听 users 的变化，当 users 更新时重新初始化地图
    watch(users, (newVal) => {
      if (newVal.length > 0) {
        // 地图会在 ChinaMap 组件内部处理
      }
    });

    onMounted(() => {
      fetchNoteCount(); // 获取笔记数量
      fetchCommentCount(); // 获取评论数量
      fetchUsers(); // 获取用户数量
      fetchPendingReviewCount(); // 获取待审核数量
      fetchHoneyData(); // 获取 honey 数据
      initRoseChart();
    });

    return {
      chart,
      roseChart,
      barChart,
      outputValue,
      noteCount,
      commentCount,
      userCount,
      pendingReviewCount,
      initChart,
      initRoseChart,
      initBarChart,
      users,
    };
  },
};
</script>

<style scoped>
.el-col {
  text-align: center;
}
.ep-col.ep-col-6 {
  display: flex;
  border: 1px solid #ccc;
}
/* 添加一些间距和布局优化 */
.el-row {
  margin-bottom: 20px;
}

.chart-container {
  display: flex;
  justify-content: space-between;
}

.chart-container div {
  margin-right: 20px;
}

.chart-container div:last-child {
  margin-right: 0;
}

.icon {
  width: 50px;
  height: 50px;
}

.usersvg {
  width: 20%;
  background-color: white;
  padding: 10px; /* 可选：添加一些内边距 */
  transition: background-color 0.3s, color 0.3s;
  color: rgb(255, 200, 0); /* 初始颜色为青色 */
  margin-left: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 4px;
  border-radius: 4px;
  display: inline-block;
}

.usersvg:hover {
  background-color: rgb(255, 200, 0);
  color: white; /* 悬浮时颜色为白色 */
}

.usersvg svg {
  width: 100%;
  height: auto;
  fill: currentColor; /* 使用 currentColor 来继承父元素的颜色 */
}

.examinesvg {
  margin-left: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 4px;
  border-radius: 4px;
}

.examinesvg:hover {
  background-color: #17ddb1;
}

.examinesvg:hover .icon path {
  fill: white;
}

.statistic-container {
  margin-left: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 4px;
  border-radius: 4px;
}
.statistic-container:hover {
  background-color: #17abe3;
}
.statistic-container:hover .icon path {
  fill: white;
}

.icon-container {
  margin-left: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 4px;
  border-radius: 4px;
}

.icon-container:hover {
  background-color: #17abe3;
}

.icon-container:hover .icon path {
  fill: white;
}

.icon-container {
  margin-left: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 4px;
  border-radius: 4px;
  display: inline-block;
}

.icon-container:hover {
  background-color: #17bcd1;
}

.icon-container:hover .icon path {
  fill: white;
}
</style>