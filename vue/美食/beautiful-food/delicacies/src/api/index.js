


import axios from 'axios'

const service = axios.create({
  baseURL: "https://apis.netstart.cn/douguo/", // api 的 base_url

})
export default service;

// 首页笔记列表
const HomeNode = (
  offset, limit
) => {
  return service.get(`home/notes/${offset}/${limit}`)
}
// 收藏的笔记
const collectNote = (
  noteid
) => {
  return service.get(`note/detail/${noteid}`)
}


// 首页笔记详情
const noteDetails = (
  noteid
) => {
  return service.get(`note/detail/${noteid}`)
}

// 笔记相关信息
const notesReview = (
  noteid, offset, limit
) => {
  return service.get(`note/related/${noteid}/${offset}/${limit}`)
}

// 热门话题列表
const aListOfTrendingTopics = (
  offset, limit
) => {
  return service.get(`note/topiclist/${offset}/${limit}`)
}
// 话题详情
const topicDetails = (
  topicid, offset, limit
) => {
  return service.get(`note/topicdetail/${topicid}/${offset}/${limit}`)
}
// 食材详情
const foodDetails = (
  foodid
) => {
  return service.get(`recipe/material/${foodid}`)
}
// 用户菜谱
const userRecipes = (
  userid, offset, limit
) => {
  if (!offset) {
    offset = 0
    limit = '20'
  }
  return service.get(`user/urecipes/${userid}/${offset}/${limit}`)
}
// 用户笔记
const userNotes = (
  userid, offset, limit
) => {
  if (!offset) {
    offset = 0
    limit = '20'
  }
  return service.get(`user/usernotescalendar/${userid}/${offset}/${limit}`)
}
// 用户收藏
const userFavorites = (
  userid, offset, limit
) => {
  if (!offset) {
    offset = 0
    limit = '20'
  }
  return service.get(`user/ufavorites/${userid}/${offset}/${limit}`)
}
export {
  HomeNode,
  noteDetails,
  notesReview,
  aListOfTrendingTopics,
  topicDetails,
  foodDetails,
  userRecipes,
  userNotes,
  userFavorites,
  collectNote



}




