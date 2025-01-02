


import axios from 'axios'

const service = axios.create({
  baseURL: "https://apis.netstart.cn/douguo/", // api 的 base_url

})
export default service;

// 推荐
const HomeRecommend = (
  offset, limit
) => {
  console.log(' offset, limit', offset, limit);

  // return service.get(`home/recommended/0/10`)
  return service.get(`home/recommended/${offset}/${limit}`)

}

// 用户详情
const userDetails = (
  userid
) => {
  console.log('useridapi', userid);
  
  return service.get(`user/info/${userid}`)
}

// 活动
const activity = (
  offset, limit
) => {
  return service.get(`home/events/getlists?offset=${offset}limit=${limit}`)
}



// 搜索
const Search = (
  keyword
) => {
  return service.get(`recipe/search?keyword=${keyword}`)
}

// 搜索提示
const SearchHint = (
  kw
) => {
  return service.get(`recipe/search/suggests?kw=${kw}`)
}

// 菜谱详情
const RecipeDetail = (
  recipeid
) => {
  console.log('recipeid', recipeid);

  return service.get(`recipe/detail/${recipeid}`)
  // return service.get(`recipe/detail/3000088`)
}

// 菜谱评论
const recipeReviews = (
  // 菜谱id，分页偏移(limit的倍数)，分页大小
  recipeid, offset, limit

) => {
  if (!offset) {
    offset = 1
    limit = '20'
  }

  return service.get(`/recipe/flatcomments/${recipeid}/${offset}/${limit}`)
}
// 笔记详情
const noteDetails = (
  noteid
) => {
  return service.get(`note/detail/${noteid}`)
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
export {
  HomeRecommend,
  userDetails,
  Search,
  SearchHint,
  RecipeDetail,
  recipeReviews,
  noteDetails,
  userRecipes,
  activity
}



