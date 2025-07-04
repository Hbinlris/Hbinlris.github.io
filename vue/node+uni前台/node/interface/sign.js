// 引入koa-router
const Router = require('@koa/router');
// 身份验证
const authtwo = require('./verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });

const { users, sign } = require('../mongodb/mongodb');

router.post('/sign', authtwo, async (ctx) => {
  console.log('sign请求体:', ctx.request.body);

  const { checkInData } = ctx.request.body;
  const { email } = ctx.state.user;
  try {
    // 查找用户邮箱
    const user = await users.findOne({ email });

    console.log('sign-email:', user);
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }
    // 插入数据
    const result = await sign.insertOne({
      userId: user._id,
      checkInData: checkInData,
    });
    console.log('签到结果:', result);
    if (result) {
      ctx.status = 200;
      ctx.body = { code: 200, message: '签到成功' };
    } else {
      ctx.status = 400;
      ctx.body = { code: 400, message: '签到失败' };
    }


  }
  catch (error) {
    console.error('签到失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, message: '服务器错误' };
  }

});

router.get('/getsign', authtwo, async (ctx) => {
  const { email } = ctx.state.user;
  try {

    // 查找用户邮箱
    const user = await users.findOne({ email });
    console.log('getsign-email:', user);

    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }
    // 查找用户签到数据
    const signData = await sign.find({ userId: user._id }).toArray();
    console.log('查找签到结果:', signData);
    if (signData) {
      ctx.status = 200;
      ctx.body = {
        code: 200, message: '查找签到结果成功',
        data: signData.map(item => ({
          ...item.checkInData // 展开checkInData内的所有字段
        })),
        count: signData.length
      };

    } else {
      ctx.status = 200;
      ctx.body = { code: 200, message: '当前没有签到记录' };
    }

  } catch (error) {
    console.error('查找失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, message: '服务器错误' };
  }
})
module.exports = router;

