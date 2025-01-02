<!-- ClassLfy 分类 -->

<template>
  <div class="ClassLfy">
    <nav>
      <div class="channel">
        <div
          class="channel-name"
          v-for="channel in ClassLfy"
          :key="channel.channel"
          :class="{ active: channel === onchannel }"
          @click="ClassLfyNavClassify(channel)"
        >
          {{ channel.name }}
        </div>
      </div>
      <div class="search" @click="$router.push({ path: '/SearchBook' })">
        <div class="iconfont icon-sousuo"></div>
      </div>
    </nav>

    <main>
      <ClassLfyTwo :channel="onchannel" />
    </main>
  </div>
</template>

<script>
import { ClassLfyNav } from "@/api/axios";
import ClassLfyTwo from "@/components/ClassLfyTwo.vue";

export default {
  components: {
    ClassLfyTwo,
  },

  data() {
    return {
      ClassLfy: [],
      onchannel: null,
    };
  },
  created: function () {
    ClassLfyNav().then((res) => {
      this.ClassLfy = res.data;
      this.onchannel = this.ClassLfy.find((c) => c.channel === "male");
    });
  },
  methods: {
    // fetchClassLfyData() {
    //   ClassLfyNav().then((res) => {
    //     this.ClassLfy = res.data;
    //     this.onchannel = this.ClassLfy.find((c) => c.channel === "male");
    //   });
    // },

    ClassLfyNavClassify(channel) {
      this.onchannel = channel;
    },
  },
};
</script>

<style lang="less" scoped>
.ClassLfy {
  nav {
    display: flex;
    justify-content: space-between;
    background-color: white;
    .channel {
      display: flex;
      justify-content: center;
      // background-color: antiquewhite;
      padding: 0 15px;
      .channel-name {
        padding: 15px;
      }
    }

    .active {
      color: red;
    }
    .search {
      // background-color: aqua;
      padding: 0 15px;
      .icon-sousuo {
        font-size: 22rem;
        padding: 15px 0;
      }
    }
  }
}
</style>
