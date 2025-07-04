// 引入koa-router
const Router = require('@koa/router');
// 身份验证
const authtwo = require('./verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });

const { users } = require('../mongodb/mongodb');

router.post('/information', authtwo, async (ctx) => {
  console.log('information请求体:', ctx.request.body);

  const { email } = ctx.state.user;
  const { avatar, username, gender, signature } = ctx.request.body;

  try {
    // 更新用户信息
    const result = await users.updateOne(
      { email }, //根据邮箱查找用户
      {
        $set: { // 更新
          avatar: avatar,
          username: username,
          gender: gender,
          signature: signature
        }
      }
    );

    console.log('更新/插入结果:', result);

    if (result.upsertedCount > 0) {
      // 插入成功
      ctx.status = 201;
      ctx.body = { code: 201, message: '新用户信息插入成功' };
    } else if (result.modifiedCount > 0) {
      // 更新成功
      ctx.status = 200;
      ctx.body = { code: 200, message: '用户信息更新成功' };
    } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
      // 用户已存在但数据未发生变化
      ctx.status = 200;
      ctx.body = { code: 200, message: '用户信息未发生变化' };
    } else {
      ctx.status = 500;
      ctx.body = { code: 500, message: '服务器错误' };
    }
  } catch (error) {
    console.error('更新/插入失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, message: '服务器错误' };
  }
});

module.exports = router;
