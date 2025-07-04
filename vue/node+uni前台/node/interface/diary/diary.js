const Router = require('@koa/router');
// 身份验证
const authtwo = require('../verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });

const { users, diary } = require('../../mongodb/mongodb');

router.post('/diary', authtwo, async (ctx) => {
  console.log('diary请求体:', ctx.request.body);

  const { diarydata } = ctx.request.body;
  const { email } = ctx.state.user;

  // 获取当前时间的Date对象
  const now = new Date();
  // 时间换算
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hour}时${minute}分${second}秒`;
  }

  // 格式化当前时间
  const formattedDate = formatDate(now);
  console.log(formattedDate);

  try {
    const user = await users.findOne({ email });
    console.log('diary-email:', user);
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }

    const diaryDataWithDate = {
      ...diarydata,
      date: formattedDate,// 添加日期
    };

    // 插入数据
    const result = await diary.insertOne({
      userId: user._id,
      diarydata: diaryDataWithDate,
    });
    console.log('日记结果:', result);
    if (result) {
      ctx.status = 200;
      ctx.body = { code: 200, message: '日记保存成功', diarydata: diarydata };
    } else {
      ctx.status = 400;
      ctx.body = { code: 400, message: '日记保存失败' };
    }

  } catch (error) {
    console.error('保存失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, message: '服务器错误' };
  }

})

router.get('/getdiary', authtwo, async (ctx) => {
  console.log('diary请求体:', ctx.request.body);

  const { email } = ctx.state.user;

  try {
    const user = await users.findOne({ email });
    console.log('diaryday-email:', user);
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }

    // 查询数据
    const diaryday = await diary.find({ userId: user._id }).toArray();
    console.log('查找签到结果:', diaryday);

    if (diaryday) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '日记查询成功',
        diarydata: diaryday.map(item => ({
          _id: item._id.toString(),
          ...item.diarydata // 展diaryday内的所有字段
        })),
        count: diaryday.length
      };
    } else {
      ctx.status = 400;
      ctx.body = { code: 400, message: '日记查询失败' };
    }

  } catch (error) {
    console.error('查询失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, message: '服务器错误' };
  }

})
module.exports = router;
