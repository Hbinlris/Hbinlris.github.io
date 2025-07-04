// 引入koa
const Koa = require('koa');

// 引入koa-cors跨域支持
const cors = require('@koa/cors');

// 引入koa-bodyparser解析post请求
const bodyParser = require('koa-bodyparser');

// 引入koa-static静态资源服务
const serve = require('koa-static');

// 引入koa-session实现会话管理
const session = require('koa-session');



const app = new Koa();

app.use(cors({
  origin: 'http://localhost:5173', // 允许的前端域
  credentials: true, // 允许携带Cookie
}));

app.use(bodyParser());

app.use(serve('./uploads'));
// app.use(serve('./public'));

// 配置 Session
app.keys = ['YYTT-BBTY-CCIEN-MMIYTB.SDNKKSEN-BSNNCYEWBASK-NVUEWNAS'];
// app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,// cookie 的最大存活周期，单位 ms (默认是 1 天)
  autoCommit: true,// 自动提交 headers (默认 true)
  overwrite: true, // 是否允许重写 (默认 true)
  httpOnly: true, // 是否仅允许 HTTP 访问 (默认 true)
  signed: true, // 是否签名 (默认 true)
  rolling: false, // 每次响应时刷新 session 有效期 (默认 false)
  renew: false, // 在 session 快过期时刷新有效期 (默认 false)
  secure: false, // 仅在 https 中传输 (默认 false)
  sameSite: 'lax', // session cookie 的 sameSite 选项 (默认 null)
};



// app.use(session.createSession(CONFIG, app));
app.use(session(CONFIG, app));


// 连接数据库
require('./mongodb/mongodb.js');

// 注册
const enroll = require('./interface/LoginEnroll/enroll.js');
app.use(enroll.routes());

// 验证码
const captcha = require('./interface/LoginEnroll/captcha.js');
app.use(captcha.routes());

// 登录
const login = require('./interface/LoginEnroll/login.js');
app.use(login.routes());

// 用户信息
const userInfo = require('./interface/LoginEnroll/userinfo.js');
app.use(userInfo.routes());

// 签到
const sign = require('./interface/sign.js')
app.use(sign.routes());

// // 图片文件
const upload = require('./interface/image/uploads.js')
app.use(upload.routes());

// 删除操作
const deluploads = require('./interface/image/deluploads.js')
app.use(deluploads.routes());

// 获取资料
const postinformation = require('./interface/postinformation.js')
app.use(postinformation.routes());

// 日记
const diary = require('./interface/diary/diary.js')
app.use(diary.routes());

// 删除日记
const destroyedDiary = require('./interface/diary/destroyedDiary.js')
app.use(destroyedDiary.routes());


const PORT = 8080;

// 监听所有网络接口
app.listen(PORT, () => {
  console.log(`服务器启动成功 ${PORT}`);
});


