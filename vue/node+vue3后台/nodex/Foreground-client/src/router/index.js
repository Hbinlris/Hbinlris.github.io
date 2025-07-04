import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// 首页
import HomeViews from '@/views/HomeViews.vue'
import ContentXq from '@/views/HomeXq.vue'
// 消息
import Message from '@/views/Message.vue'

// 我的
import PersonalCenter from '@/views/PersonalCenter.vue'
import edit from '@/views/edit.vue'


import Note from '@/views/PersonalCenter/Note.vue'
import publish from '@/views/PersonalCenter/publish.vue'
import secret from '@/views/PersonalCenter/secret.vue'
import collections from '@/views/PersonalCenter/collections.vue'

import Collection from '@/views/PersonalCenter/Collection.vue'
import CollectionText from '@/views/PersonalCenter/CollectionText.vue'
import Liked from '@/views/PersonalCenter/Liked.vue'


// 发布页
import publishPage from '@/views/publishPage.vue'

import SearchView from '@/views/PersonalCenter/SearchView.vue'

// 设置
import setUp from '@/views/setUp/setUp.vue'
import DengLu from '@/views/setUp/DengLu.vue'
import Zhuce from '@/views/setUp/Zhuce.vue'
import Wangji from '../views/setUp/Wangji.vue'
import jianjie from '@/views/jianjie.vue'
import mingc from '@/views/mingc.vue'

//他人主页
import tarenzhuy from '@/views/tarenzhuy.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 首页
    {
      path: '/',
      name: 'HomeViews',
      component: HomeViews,
      meta: {
        shownav: true
      },
    },
    //详情页
    {
      path: '/ContentXq/:id',
      name: 'ContentXq',
      component: ContentXq,
    },
    // 消息
    {
      path: '/Message',
      name: 'Message',
      component: Message,
      meta: {
        shownav: true
      },
    },

    // 个人中心
    {
      path: '/PersonalCenter',
      name: 'PersonalCenter',
      component: PersonalCenter,
      meta: {
        shownav: true
      },
      redirect: '/Note',

      children: [
        // 笔记
        {
          path: '/Note',
          name: 'Note',
          component: Note,
          redirect: '/publish',

          children: [
            // 发布
            {
              path: '/publish',
              name: 'publish',
              component: publish,
              props: route => ({ post: route.params.post })


            },

            // 私密
            {
              path: '/secret',
              name: 'secret',
              component: secret,
            },
            // 合集
            {
              path: '/collections',
              name: 'collections',
              component: collections,
            }
          ]
        },

        // 收藏
        {
          path: '/Collection',
          name: 'Collection',
          component: Collection,
          redirect: '/CollectionText',

          children: [
            // 文本
            {
              path: '/CollectionText',
              name: 'CollectionText',
              component: CollectionText,
            }
          ]
        },
        // 赞过
        {
          path: '/Liked',
          name: 'Liked',
          component: Liked,
        }
      ],
    },
    // 编辑
    {
      path: '/edit',
      name: 'edit',
      component: edit,
    },
    //简介
    {
      path: '/jianjie',
      name: 'jianjie',
      component: jianjie,
    },
    //名字
    {
      path: '/mingc',
      name: 'mingc',
      component: mingc,
    },
    // 发布页
    {
      path: '/publishPage',
      name: 'publishPage',
      component: publishPage,
      props: route => ({ post: route.params.post })


    },

    // 设置
    {
      path: '/setUp',
      name: 'setUp',
      component: setUp,
    },
    {
      path: '/tarenzhuye',
      name: 'tarenzhuye',
      component: tarenzhuy,
    },

    // 登录
    {
      path: '/DengLu',
      name: 'DengLu',
      component: DengLu,
    },
    // 注册
    {
      path: '/Zhuce',
      name: 'Zhuce',
      component: Zhuce,
    },
    // 忘记
    {
      path: '/Wangji',
      name: 'Wangji',
      component: Wangji,
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchView,
    },
  ],
})

export default router


router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem('userToken')
  // to.name === 'publishPage' && !userToken || 
  if (to.name === 'publish' && !userToken) {
    next({ name: 'DengLu' })
  } else {
    next()
  }
})


