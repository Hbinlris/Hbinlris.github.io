const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const path = require('path');
const bodyParser = require('koa-bodyparser');


// 连接数据库
require('./models/modg.js');

const serve = require('koa-static');

// 使用session
const session = require('koa-session');
// const flash = require('koa-flash');
app.keys = ['some secret hurr'];
// 使用中间件
app.use(bodyParser());
app.use(cors());
app.use(serve('./uploads'));

const CONFIG = {
    key: 'koa.session', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    // signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
  };

  
app.use(session(CONFIG, app));



const zhuceRouter = require("./zhuce.js");
const zhyeRouter = require("./zhye.js");
const dengluRouter = require("./denglu.js");
const fabunrRouter = require("./fabunr.js");
// 引入路由模块
const usersRouter = require("./users.js"); 

const labelRouter = require("./label.js"); 
const adminRouter = require("./login.js"); 
// console.log(usersRouter.routes()); 
// app.use(loginrouter.routes());
// app.use(indexrouter.routes());
// app.use(registerRouter.routes());

const grzlRouter = require("./grzl.js");

const reviewRouter = require("./review.js");

app.use(zhuceRouter.routes());
app.use(zhyeRouter .routes());
app.use(dengluRouter .routes());
app.use(fabunrRouter .routes());
app.use(grzlRouter .routes());
app.use(labelRouter .routes());
app.use(usersRouter.routes());
app.use(adminRouter.routes());
app.use(reviewRouter.routes());



// 监听所有网络接口
app.listen(8080,  () => {
  console.log("服务器启动成功");
});
