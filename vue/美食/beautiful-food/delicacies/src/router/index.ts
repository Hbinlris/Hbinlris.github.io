import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// @ts-ignore
// 首页
import FoodHomepage from '@/views/FoodHomepage/FoodHomepage.vue'
// @ts-ignore
import HomeRecommend from '@/views/FoodHomepage/HomeRecommend.vue'
// @ts-ignore
import HomeConcern from '@/views/FoodHomepage/HomeConcern.vue'

// 活动页
// @ts-ignore
import ActingView from '@/views/FoodHomepage/ActingView.vue'
// 关注
// @ts-ignore
// import GuanZhu from '@/views/ItsMine/GuanZhu.vue'

import guanzhuttwo from '@/views/ItsMine/guanzhuttwo.vue'
// 笔记
// @ts-ignore
import HomeNode from '@/views/FoodHomepage/HomeNode.vue'
// 笔记详情
// @ts-ignore
import NoteDetailPage from '@/views/CulinaryDetails/NoteDetailPage.vue'

// 热门话题
// @ts-ignore
import trendingTopics from '@/views/CulinaryDetails/trendingTopics.vue'

// 话题列表
// @ts-ignore
import aListOfTopics from '@/views/CulinaryDetails/aListOfTopics.vue'

// 搜索
// @ts-ignore
import JumpSearch from '@/views/JumpSearch/JumpSearch.vue'
// @ts-ignore
// 菜谱详情
// @ts-ignore
import CulinaryDetails from '@/views/CulinaryDetails/CulinaryDetails.vue'


// 收藏夹
// @ts-ignore
import GourmetFavorites from '@/views/GourmetFavorites/GourmetFavorites.vue'
// @ts-ignore
import CaiMenu from '@/views/GourmetFavorites/CaiMenu.vue'
// @ts-ignore
import ClassView from '@/views/GourmetFavorites/ClassView.vue'
// @ts-ignore
import GroupView from '@/views/GourmetFavorites/GroupView.vue'
// @ts-ignore
import NoteView from '@/views/GourmetFavorites/NoteView.vue'
// 我的
// @ts-ignore
import ItsMine from '@/views/ItsMine/ItsMine.vue'
// @ts-ignore
import UserDetails from '@/views/UsersDetail/UserDetails.vue'
// 采购清单
// @ts-ignore
import ShopList from '@/views/UsersDetail/ShopList.vue'


// 美食分类
// @ts-ignore
import gastronomyClassification from '@/views/gastronomyClassification/gastronomyClassification.vue'


// 登录
// @ts-ignore
import Login from '@/views/logInToRegister/Login.vue'
// 注册
// @ts-ignore
import Enroll from '@/views/logInToRegister/Enroll.vue'

//修改
// @ts-ignore 
import forgotPassword from '@/views/logInToRegister/forgotPassword.vue'

// 设置
// @ts-ignore
import gotosetUp from '@/views/logInToRegister/gotosetUp.vue'

// 食材详情
// @ts-ignore
import FoodDetails from '@/views/FoodHomepage/FoodDetails.vue'
// 烹饪模式
// @ts-ignore
import CookModel from '@/views/UsersDetail/CookModel.vue'
const routes = [

  // 首页
  {
    path: '/',
    name: 'FoodHomepage',
    component: FoodHomepage,
    redirect: '/HomeRecommend',
    meta: { isshow: true },

    children: [
      {
        path: '/HomeRecommend',
        name: 'HomeRecommend',
        component: HomeRecommend,

      },
      {
        path: '/HomeConcern',
        name: 'HomeConcern',
        component: HomeConcern,

      },
      {
        path: '/HomeNode',
        name: 'HomeNode',
        component: HomeNode,

      },

      // 活动页
      {
        path: '/ActingView',
        name: 'ActingView',
        component: ActingView
      },


    ]

  },


  // 收藏夹
  {
    path: '/GourmetFavorites',
    name: 'GourmetFavorites',
    component: GourmetFavorites,
    redirect: '/GourmetFavorites/CaiMenu',
    meta: { isshow: true },

    children: [
      {
        path: 'CaiMenu',
        name: 'CaiMenu',
        component: CaiMenu,
      },
      {
        path: 'ClassView',
        name: 'ClassView',
        component: ClassView,
      },
      {
        path: 'GroupView',
        name: 'GroupView',
        component: GroupView,
      },


      {
        path: 'NoteView',
        name: 'NoteView',
        component: NoteView,

      },
    ]
  },


  // 我的
  {
    path: '/ItsMine',
    name: 'ItsMine',
    component: ItsMine,
    meta: { isshow: true },

  },

  // 关注
  // {
  //   path: '/GuanZhu',
  //   name: 'GuanZhu',
  //   component: GuanZhu,
  // },

  {
    path: '/guanzhuttwo',
    name: 'guanzhuttwo',
    component: guanzhuttwo,
  },


  // 搜素
  {
    path: '/JumpSearch',
    name: 'JumpSearch',
    component: JumpSearch
  },

  // 用户详细信息
  {
    path: '/UserDetails',
    name: 'UserDetails',
    component: UserDetails
  },


  // 菜谱详情页
  {
    path: '/CulinaryDetails',
    name: 'CulinaryDetails',
    component: CulinaryDetails
  },

  // 笔记详情页
  {
    path: '/NoteDetailPage',
    name: 'NoteDetailPage',
    component: NoteDetailPage
  },
  // 热门话题
  {
    path: '/trendingTopics',
    name: 'trendingTopics',
    component: trendingTopics
  },

  // 话题列表
  {
    path: '/aListOfTopics',
    name: 'aListOfTopics',
    component: aListOfTopics
  },



  // 采购清单
  {
    path: '/ShopList',
    name: 'ShopList',
    component: ShopList,
  },

  // 分类
  {
    path: '/gastronomyClassification',
    name: 'gastronomyClassification',
    component: gastronomyClassification
  },


  // 登录
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },

  // 注册
  {
    path: '/Enroll',
    name: 'Enroll',
    component: Enroll
  },
  // 修改
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: forgotPassword
  },



  // 设置
  {
    path: '/gotosetUp',
    name: 'gotosetUp',
    component: gotosetUp
  },
  // 食材详情
  {
    path: '/FoodDetails',
    name: 'FoodDetails',
    component: FoodDetails
  },
  // 烹饪模式
  {
    path: '/CookModel',
    name: 'CookModel',
    component: CookModel
  },







]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {

  const userStore = useUserStore()
  // 身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (!userStore.Loginguard) {
      // 重定向登录
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
