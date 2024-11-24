import Vue from 'vue'
import VueRouter from 'vue-router'
import Homerecommend from '../views/HomeRecommend.vue'
import HomeHotSongCharts from '../views/HomeHotSongCharts.vue'
import HomeSearch from '../views/HomeSearch.vue'
import TuYinTwo from '../views/TuYinTwo.vue'
import SongDetails from '../views/SongDetails.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'recommend',
    component: Homerecommend,
    meta: {
      shownav:true
    }
  },

  {
    path: '/hotSongCharts',
    name: 'hotSongCharts',
    component: HomeHotSongCharts,
    meta: {
      shownav: true
    }
  },
  {
    path: '/Search',
    name: 'Search',
    component: HomeSearch,
    meta: {
      shownav: true
    }
  },
  {
    path: '/tuyintwo',
    name: 'tuyintwo',
    component: TuYinTwo,
  },
  {
    path: '/SongDetails',
    name: 'SongDetails',
    component: SongDetails,
  },
]

const router = new VueRouter({
  routes
})

export default router
