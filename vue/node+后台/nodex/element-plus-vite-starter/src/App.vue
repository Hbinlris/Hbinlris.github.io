<!-- src/App.vue -->
<template>
  <el-config-provider namespace="ep">
    <div v-if="$route.path !== '/login'">
      <BaseHeader />
      <div class="main-container flex">
        <BaseSide />
        <div w="full" py="4">
          <RouterView />
        </div>
      </div>
    </div>
    <div v-else>
      <RouterView />
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 4px);
}

/* .ep-menu-item:hover {
  background-color: #f9455d6e;
}

.ep-sub-menu__title:hover {
  background-color: #f9455d6e;
}

.el-menu-demo.ep-menu--horizontal > .ep-menu-item:nth-child(1):hover {
  color: #ff2442;
  background-color: #f9455d6e;
}

.ep-menu--horizontal > .ep-sub-menu:hover .ep-sub-menu__title{
  color: #ff2442;
} */
</style>