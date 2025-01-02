
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 获取用户名
  const username = ref(localStorage.getItem('username') || '')
  console.log('username:', username);

  // 根据用户名判断是否登录
  const isLoggedIn = ref(!!username.value);
  console.log('isLoggedIn:', isLoggedIn);

  // 更新用户名状态
  function setUserInfo(name: string) {
    username.value = name
    isLoggedIn.value = true
    localStorage.setItem('username', name)
    console.log('注销前user：', username.value, isLoggedIn.value);
  }
  // 注销
  function signOut() {
    username.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('username')
    console.log('注销后user：', username.value, isLoggedIn.value);
  }

  // 检查是否登录
  function Loginguard() {
    return !!username.value
  }

  return { username, isLoggedIn, setUserInfo, signOut, Loginguard }
})
