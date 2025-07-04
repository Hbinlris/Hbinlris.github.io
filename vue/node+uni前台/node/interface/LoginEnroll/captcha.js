// 验证码

// 引入koa-router
const Router = require('@koa/router');
const router = new Router();

// 引入nodemailer实现邮箱发送
const nodemailer = require('nodemailer');

// 导入数据库captcha
const { captcha } = require('../../mongodb/mongodb');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.qq.com', // 使用 QQ 邮箱
    port: 465,
    secure: true,
    auth: {
      user: '3096274533@qq.com', // 邮箱
      pass: 'hrxjcapfzupddfaf' // 授权
    }
  });
};


// 生成验证码和过期时间 
function generateCaptcha() {
  const code = Math.random().toString().slice(2, 8); // 生成随机验证码
  const captchaTime = Date.now() + 600000; // 设置过期时间为5分钟
  return { code, captchaTime };
}


router.post('/captcha', async (ctx) => {
  console.log('captcha请求体:', ctx.request.body);
  const { email } = ctx.request.body;


  if (!email) {
    ctx.status = 400;
    ctx.body = { error: '邮箱不能为空' };
    return;
  }

  try {
    // 生成验证码
    const { code, captchaTime } = generateCaptcha();

    // 更新验证码记录（不存在则插入）
    await captcha.updateOne(
      { email },
      { $set: { code, CaptchaTime: captchaTime } },
      { upsert: true }
    );

    // 发送邮件
    const mailOptions = {
      from: '测试<3096274533@qq.com>', // 发件人邮箱
      to: email, // 收件人邮箱
      subject: '验证码', // 邮件主题
      html: `<h2>您的验证码是：${code}</h2>, 系统自动发送请勿回复` // 邮件内容
    };

    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    ctx.body = { code: 0, message: '验证码已发送至您的邮箱，请查收' };
  } catch (error) {
    console.error('发送验证码失败:', error);
    ctx.status = 500;
    ctx.body = { code: -1, message: '发送验证码失败，请稍后再试' };
  }

});

module.exports = router;
