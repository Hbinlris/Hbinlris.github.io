

import axios from "axios";


// 创建 axios 设置基础URL
const novel = axios.create({
  baseURL: "https://apis.netstart.cn/yunyuedu",
});

export default novel;




// 书城头部导航
const BookstoreNav = (
  gender
) => {

  return novel.get(`/store/navi.json?gender=${gender}`)
}

// 书城二级导航
// const BookstoreNavTwo = () => { return novel.get('/store/show.json?type=recommend&uuid=f2cb32ff209f4010911a77a617add8c4') }
const BookstoreNavTwo = (url = '/store/show.json ? type = recommend & uuid= f2cb32ff209f4010911a77a617add8c4') => {

  // if (!url) {
  //   console.error("BookstoreNavTwo：URL 未定义或 null");
  //   return;
  // }
  const match = url.match(/\?([^#]+)/);

  const queryParams = match ? match[1] : "";
  console.log('queryParams', queryParams);

  // const encodedQueryParams = encodeURIComponent(queryParams);
  // console.log('encodedQueryParams', encodedQueryParams);


  return novel.get(`/store/show.json?${queryParams}`);

}


// 排行榜
const RankingList = () => {
  return novel.get('/store/merged/rankNavi.json')
}


// 分类频道
const ClassLfyNav = (

) => {
  return novel.get('/mergedCategroy.json', {

  })
}

// 分类筛选
const ClassLfysift = () => {
  return novel.get('/source/v2/cat.json')
}

//分类书籍
const fetchClassLfyBooks = (id) => {
  console.log('112', id);
  const catId = id || '7';
  return novel.get(`/source/v2/searchBook.json?catId=${catId}`)


}


// 书籍详情
const bookDetails = (id) => {
  return novel.get('book/getsub.json', {
    params: {
      id: id
    }
  })
}

// 书籍最新章节
const latestChapters = (id) => {
  return novel.get('/book/simpleInfo.json', {
    params: {
      id: id
    }
  })
}

// 书籍目录
const tableOfContentsChapters = (tocId) => {
  return novel.get('/book/catalog.json', {
    params: {
      tocId: tocId
    }
  })
}

//  书籍内容
const BookContents = (source_uuid, content_uuid) => {
  return novel.get('/reader/book/content.json', {
    params: {
      source_uuid: source_uuid,
      content_uuid: content_uuid
    }
  })
}

// 评论
const comment = (id) => {
  console.log('id12456', id);

  return novel.get(`comment/getComments.json?bookId=${id}`, {

  })
}


// 书架
const shelf = (ids) => {
  console.log('ids', ids);

  // 将 ids 数组转换为 JSON 字符串
  const idsString = JSON.stringify(ids);
  console.log('idsString', idsString);

  return novel.get(`/shelf/detail.json?ids=${encodeURIComponent(idsString)}`);
}

// 搜索
const search = (key) => {
  return novel.get(`/search/book/data.json?key=${key}`)
}

export {


  BookstoreNav,
  BookstoreNavTwo,
  RankingList,

  ClassLfyNav,
  ClassLfysift,
  fetchClassLfyBooks,
  
  bookDetails,
  latestChapters,
  tableOfContentsChapters,
  BookContents,
  comment,

  shelf,

  search,
}

