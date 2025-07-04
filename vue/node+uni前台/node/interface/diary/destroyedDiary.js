const Router = require('@koa/router');
// 身份验证
const authtwo = require('../verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });

const { users, diary } = require('../../mongodb/mongodb');
const { ObjectId } = require("mongodb");

router.post('/destroyedDiary', authtwo, async (ctx) => {
  console.log('destroyedDiary请求体:', ctx.request.body);

  const { email } = ctx.state.user;
  // const { timestamp } = ctx.request.body;
  // console.log('数据库查询:', { email, timestamp });
  const { _id } = ctx.request.body;
  console.log('数据库查询:', { email, _id });

  try {
    const user = await users.findOne({ email });
    console.log('destroyedDiary-email:', user);
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }

    // 删除数据
    const result = await diary.deleteOne({
      // timestamp: timestamp,
      _id: new ObjectId(_id),
      userId: user._id
    });
    console.log('日记结果:', result);
    console.log('userId:匹配', user._id);

    if (result.deletedCount > 0) {
      ctx.status = 200;
      ctx.body = { code: 200, message: '日记删除成功' };
    } else {
      ctx.status = 400;
      ctx.body = { code: 400, message: '日记删除失败' };
    }

  } catch (error) {
    console.error('删除失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, message: '服务器错误' };
  }

})
module.exports = router;
