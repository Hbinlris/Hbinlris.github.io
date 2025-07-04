// 验证身份

// 引入jsonwebtoken生成验证jwt
const jwt = require('jsonwebtoken');

const { jwttoken } = require('./token.js');

module.exports = async (ctx, next) => {
  // 获取请求头中的 Token
  const headerToken = ctx.request.headers['authorization'];
  // 获取 Cookie 中的 Token
  const cookieToken = ctx.cookies.get('Token');

  console.log('请求头中的 Token:', headerToken);
  console.log('Cookie 中的 Token:', cookieToken);

  // 检查 Token 是否存在
  if (!headerToken || !cookieToken) {
    ctx.status = 401;
    ctx.body = { error: '身份验证失败：缺少令牌' };
    return;
  }

  try {
    // 验证请求头中的 Token
    const headerPayload = jwt.verify(headerToken.split(' ')[1], jwttoken);
    // 验证 Cookie 中的 Token
    const cookiePayload = jwt.verify(cookieToken, jwttoken);

    // 检查两个 Token 是否匹配
    if (headerPayload.username !== cookiePayload.username) {
      ctx.status = 401;
      ctx.body = { error: '令牌不匹配' };
      return;
    }
    // 将用户信息存储在 ctx.state 中
    ctx.state.user = cookiePayload;

    // 验证通过
    await next();
  } catch (err) {
    console.error('身份验证失败：', err);
    ctx.status = 401;
    ctx.body = { error: '令牌无效' };
  }
  
};
