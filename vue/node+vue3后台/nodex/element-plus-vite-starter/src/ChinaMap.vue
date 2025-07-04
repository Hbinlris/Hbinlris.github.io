<template>
  <div ref="chinaMap" style="width: 100%; height: 600px;"></div>
</template>

<script>
import * as echarts from "echarts";
import cnmap from "./assets/cnmap.json"; // 引入中国地图数据
import { ref, onMounted } from "vue";

export default {
  name: "ChinaMap",
  setup() {
    const chinaMap = ref(null);

    // 注册中国地图数据
    echarts.registerMap('china', cnmap);

    const initMap = () => {
      const mapDom = chinaMap.value;
      if (!mapDom) return; // 确保 DOM 元素存在
      const myChart = echarts.init(mapDom);

      const option = {
        title: {
          text: "中国地图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return `${params.name}`;
          },
        },
        series: [
          {
            name: "中国地图",
            type: "map",
            mapType: "china",
            roam: true,
            label: {
              show: true,
            },
            data: [], // 空数据
          },
        ],
      };

      myChart.setOption(option);
    };

    onMounted(() => {
      initMap();
    });

    return {
      chinaMap,
    };
  },
};
</script>

<style scoped>
/* 添加一些样式以确保地图显示正常 */
</style>