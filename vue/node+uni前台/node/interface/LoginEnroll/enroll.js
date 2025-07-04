// 引入koa-router
const Router = require('@koa/router');
const router = new Router();

// 导入数据库users，captcha
const { users, captcha } = require('../../mongodb/mongodb');

// 引入bcrypt进行密码加密
const bcrypt = require('bcryptjs');



router.post('/enroll', async (ctx) => {
  console.log('enroll请求体:', ctx.request.body);
  const { email, code, password, avatar = '', username = '', gender = '', signature = '' } = ctx.request.body;

  // 验证邮箱和密码，验证码是否为空
  if (!email || !password || !code) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '邮箱,密码,验证码不能为空' };
    return;
  }

  try {
    // 查询当前邮箱是否存在
    const outcome = await users.findOne({ email });
    if (outcome) {
      ctx.status = 400;
      ctx.body = { code: 400, message: '邮箱已存在' };
      return;
    }

    // 对密码进行加密
    const saltRounds = 10; // 加密强度
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // 验证验证码是否正确
    const captchaRecord = await captcha.findOne({ email });
    if (!captchaRecord || captchaRecord.code !== code || captchaRecord.CaptchaTime < Date.now()) {
      ctx.status = 400;
      ctx.body = { code: 400, error: '验证码无效或已过期' };
      return;
    }

    // 生成用户ID
    const userID = Math.random().toString().slice(2, 14)

    // 生成注册时间
    const RegistrationTime = new Date()

    // 自定义格式化日期时间
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 使用24小时制
    };
    // 格式化日期时间
    const formattedTime = new Intl.DateTimeFormat('zh-CN', options).format(RegistrationTime);

    // 插入用户信息
    await users.insertOne({ email, userID, formattedTime, password: hashedPassword, avatar, username, gender, signature });

    // 删除验证码记录（避免重复使用）
    await captcha.deleteOne({ email });
    ctx.body = { code: 0, message: '注册成功' };

  } catch (error) {
    ctx.status = 500;
    ctx.body = { code: -1, message: '注册失败，请稍后再试' };
    console.error('注册失败:', error);
  }
});

module.exports = router;
