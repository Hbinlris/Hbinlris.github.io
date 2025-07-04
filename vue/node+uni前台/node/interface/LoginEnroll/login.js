// 引入koa-router
const Router = require('@koa/router');
// 引入jsonwebtoken 生成token
const jwt = require('jsonwebtoken');
const { jwttoken } = require('../verify/token.js');
// 设置前缀为'/auth'
const router = new Router({ prefix: '/auth' });
// 导入数据库users
const { users } = require('../../mongodb/mongodb');

const bcrypt = require('bcryptjs');


router.post('/login', async (ctx) => {
  console.log('login请求体:', ctx.request.body);
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { code: 400, error: '邮箱和密码不能为空' };
    return;
  }

  try {
    //     const outcome = await users.findOne({ email, password });
    //     console.log('查询结果:', outcome);
    //     if (outcome) {
    //       // 生成token
    //       const token = jwt.sign({ email }, jwttoken, { expiresIn: '30d' });

    //       // 把token存储在cookie中
    //       const logincookie = ctx.cookies.set('Token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });

    //       // 把token放入响应头中
    //       const Authorizationtoken = ctx.set('Authorization', `Bearer ${token}`);

    //       console.log('Authorizationtoken:', Authorizationtoken);
    //       console.log('logincookie:', logincookie);


    //       ctx.body = { token };
    //       console.log('res:', { token });

    //     } else {
    //       ctx.status = 401;
    //       ctx.body = { error: '邮箱或密码错误' };
    //     }

    // 1. 查询用户
    const user = await users.findOne({ email });
    if (!user) {
      ctx.status = 401;
      ctx.body = { code: 401, error: '邮箱或密码错误' };
      return;
    }

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      ctx.status = 401;
      ctx.body = { code: 401, error: '邮箱或密码错误' };
      return;
    }

    // 生成token
    const token = jwt.sign({ email }, jwttoken, { expiresIn: '30d' });

    // 把token存储在cookie中
    const logincookie = ctx.cookies.set('Token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });

    // 把token放入响应头中
    const Authorizationtoken = ctx.set('Authorization', `Bearer ${token}`);

    console.log('Authorizationtoken:', Authorizationtoken);
    console.log('logincookie:', logincookie);


    ctx.body = { token };
    console.log('res:', { token });

  } catch (error) {
    console.error('登录失败:', error);
    ctx.status = 500;
    ctx.body = { code: 500, error: '服务器内部错误' };
  }
});

module.exports = router;
