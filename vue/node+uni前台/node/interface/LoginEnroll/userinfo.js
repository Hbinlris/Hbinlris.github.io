// 引入koa-router
const Router = require('@koa/router');
// 身份验证
const authtwo = require('../verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });
// 导入数据库users
const { users } = require('../../mongodb/mongodb');



router.get('/userinfo', authtwo, async (ctx) => {

  const { email } = ctx.state.user;

  try {
    // 查找用户
    const user = await users.findOne({ email });

    if (user) {
      // 返回用户邮箱/userID/注册时间
      ctx.body = { email: user.email, userid: user.userID, formattedTime: user.formattedTime, avatar: user.avatar, username: user.username, gender: user.gender, signature: user.signature };
    } else {
      ctx.status = 404;
      ctx.body = { error: '用户未找到' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '服务器错误' };
  }
});

module.exports = router;

