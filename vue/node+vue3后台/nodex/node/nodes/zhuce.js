const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require('koa-bodyparser');
const { MongoClient } = require('mongodb');
const cors = require('@koa/cors');
// const bcrypt = require('bcryptjs');  // 用于加密密码
const crypto = require("crypto"); // MD5加密
const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(cors());

// 数据库连接配置
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let users;

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db('blog');
    users = db.collection('users');
  } catch (err) {
    console.error("数据库连接失败:", err);
  }
}

// MD5 加密函数
function md5(password) {
  let hash = crypto.createHash('md5').update(password).digest('hex');
  console.log("hash:", hash);

  // 裁去倒数第三位
  return hash.slice(0, -3);
}


router.post('/api/register', bodyParser(), async (ctx) => {
  console.log("请求体内容:", ctx.request.body); // 打印请求体内容
  const { username, password } = ctx.request.body;

  // 检查用户名和密码是否为空
  if (!username || !password) {
    ctx.body = { success: false, message: '用户名和密码不能为空' };
    return;
  }

  try {
    await connectToDatabase();

    const existingUser = await users.findOne({ username: username });

    if (existingUser) {
      ctx.body = { success: false, message: '该用户名已存在' };
      return;
    }

    const encryptedPassword = md5(password);
    console.log("注册加密 password:", encryptedPassword);



    const result = await users.insertOne({
      username: username,
      password: encryptedPassword,
      // password: password,

      zhuangtai: '正常',
      avatar: "wdl.png"
    });
    console.log("插入结果:", result);


    ctx.body = { success: true, message: '注册成功' };

  } catch (err) {
    console.error("数据库连接失败:", err);
    ctx.body = { success: false, message: '服务器内部错误' };
  }
});

module.exports = router;


