<!-- ItsMine 我的 -->
<template>
  <div class="ItsMine">
    <!-- 登录前状态 -->
    <div class="avatar" @click="gotologin" v-if="!isAuthenticated">
      <van-icon name="contact" class="contact" color="grey" />
      <div class="log">
        <div class="login">点击登录</div>
        <div class="text">登录即可免费阅读<span>5天</span></div>
      </div>
    </div>

    <!-- 登录后状态 -->
    <div class="name" v-else>
      <van-icon name="manager-o" class="name-manager" color="grey" />
      <div class="title">{{ user.username }}</div>
    </div>

    <!-- 应用 -->
    <div class="apply">
      <div class="return-login" v-if="isAuthenticated" @click="logout">
        退出登录
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    gotologin() {
      this.$router.push({
        path: "/LoginRead",
      });
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({
        path: "/",
      });
    },
  },
  created() {
    this.$store.dispatch("initializeStore"); // 初始化存储
  },
};
</script>

<style lang="less" scoped>
.ItsMine {
  padding: 0 15px;
  position: relative;
  .avatar {
    padding: 30px 0;
    // background-color: antiquewhite;``
    display: flex;
    justify-content: center;
    align-items: center;
    .contact {
      font-size: 65rem;
      border: 1px solid white;
      background-color: #ccc;
      box-shadow: 0 0 10px 1px #cccc;
      border-radius: 50%;
      padding: 8px;
      margin-right: 15px;
    }
    .log {
      .login {
        font-size: 25rem;
        padding-bottom: 5px;
      }
      .text {
        font-size: 15rem;
        span {
          color: red;
        }
      }
    }
  }

  .name {
    padding: 30px 0;
    // background-color: antiquewhite;``
    display: flex;
    justify-content: center;
    align-items: center;

    .name-manager {
      font-size: 65rem;
      border: 1px solid white;
      background-color: #ccc;
      box-shadow: 0 0 10px 1px #cccc;
      border-radius: 50%;
      padding: 8px;
      margin-right: 15px;
    }
    .title {
      font-size: 25rem;
      padding-bottom: 5px;
    }
  }

  .apply {
    // background-color: aqua;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: absolute;
    bottom: -240px;
    left: 0;
    .return-login {
      width: 100vw;
      padding: 10rem 0;
      // background-color: antiquewhite;
      text-align: center;
      font-weight: bold;
      font-size: 20rem;
    }
  }
}
</style>
