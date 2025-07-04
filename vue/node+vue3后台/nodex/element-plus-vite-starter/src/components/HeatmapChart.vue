<template>
  <div ref="heatmapChart" style="width: 100%; height: 300px; margin-top: 50px;"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "HeatmapChart",
  mounted() {
    this.initChart();
  },
  methods: {
    getRandomNoteCount(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    initChart() {
      const chartDom = this.$refs.heatmapChart;
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "笔记贡献度",
          subtext: "一年内笔记提交的数量",
          left: "left",
        },
        tooltip: {
          position: "top",
        },
        xAxis: {
          type: "category",
          data: [
            "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
          ],
        },
        yAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        visualMap: {
          min: 0,
          max: 10,
          left: "left",
          top: "center",
          text: ["高", "低"],
          calculable: true,
          inRange: {
            color: ["#e0ffff", "#006edd"],
          },
        },
        series: [
          {
            name: "笔记数",
            type: "heatmap",
            data: this.generateHeatmapData(),
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },
    generateHeatmapData() {
      const data = [];
      for (let month = 0; month < 12; month++) {
        for (let day = 0; day < 7; day++) {
          data.push([month, day, this.getRandomNoteCount(0, 10)]);
        }
      }
      return data;
    },
  },
};
</script>

<style scoped>
/* Add any specific styles for your component here */
</style>