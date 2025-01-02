import Vue from 'vue'
import VueRouter from 'vue-router'
import BookStore from "@/views/BookStore.vue"


import ClassLfy from "@/views/ClassLfy.vue"

import BookShelf from "@/views/BookShelf.vue"
import ItsMine from "@/views/ItsMine.vue"

import bookDetails from "@/views/bookDetails.vue"
import bookDetailsDirectory from "@/views/bookDetailsDirectory.vue"
import BookContents from "@/views/BookContents.vue"

import LoginRead from "@/views/LoginRead.vue"
import EnrollAccount from "@/views/EnrollAccount.vue"

import SearchBook from "@/views/SearchBook.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BookStore',
    component: BookStore,
    meta: {
      keepAlive: true
    }

  },
  {
    path: '/ClassLfy',
    name: 'ClassLfy',
    component: ClassLfy,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/BookShelf',
    name: 'BookShelf',
    component: BookShelf,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/ItsMine',
    name: 'ItsMine',
    component: ItsMine,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/bookDetails',
    name: 'bookDetails',
    component: bookDetails,
    meta: {
      detail: true
    }
  },
  {
    path: '/bookDetailsDirectory',
    name: 'bookDetailsDirectory',
    component: bookDetailsDirectory,

  },
  {
    path: '/BookContents',
    name: 'BookContents',
    component: BookContents,

  },

  {
    path: '/LoginRead',
    name: 'LoginRead',
    component: LoginRead,

  },
  {
    path: '/EnrollAccount',
    name: 'EnrollAccount',
    component: EnrollAccount,

  },


  {
    path: '/SearchBook',
    name: 'SearchBook',
    component: SearchBook,

  },

]

const router = new VueRouter({
  routes
})

export default router
