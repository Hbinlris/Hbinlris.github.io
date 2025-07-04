const Koa = require("koa");
const Router = require("@koa/router");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const router = new Router();
const cors = require("@koa/cors");
const { users } = require("./models/modg");
const crypto = require("crypto"); // MD5加密


let client;

app.use(bodyParser());
app.use(cors());

// MD5 加密函数
function md5(password) {
  let hash = crypto.createHash('md5').update(password).digest('hex');
  console.log("hash:", hash);

  // 裁去倒数第三位
  return hash.slice(0, -3);
}


router.post("/api/login", bodyParser(), async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.body = { success: false, message: "用户名和密码不能为空" };
    return;
  }

  try {
    console.log("Received username:", username);
    console.log("Received password:", password);

    const user = await users.findOne({ username });


    if (user) {
      const encryptedPassword = md5(password);
      console.log("登录加密 password:", encryptedPassword);

      if (user.password === encryptedPassword && user.zhuangtai === "正常") {
        // 密码正确，且状态为“正常”
        ctx.body = { success: true, message: "登录成功" };
        console.log("Login successful for user:", username);
      } else if (user.password === encryptedPassword && user.zhuangtai === "封禁") {
        // 密码正确，但账户被封禁
        ctx.body = { success: false, message: "账号被禁用" };
        console.log("Account is banned:", username);
      } else {
        // 密码错误
        ctx.body = { success: false, message: "账号或密码错误" };
        console.log("Login failed for user:", username);
      }
    } else {
      ctx.body = { success: false, message: "账号或密码错误" };
      console.log("Login failed for user:", username);
    }

    // if (user) {
    //   // const encryptedPassword = md5(password);
    //   // console.log("登录加密 password:", encryptedPassword);

    //   if (user.password === password && user.zhuangtai === "正常") {
    //     // 密码正确，且状态为“正常”
    //     ctx.body = { success: true, message: "登录成功" };
    //     console.log("Login successful for user:", username);
    //   } else if (user.password === password && user.zhuangtai === "封禁") {
    //     // 密码正确，但账户被封禁
    //     ctx.body = { success: false, message: "账号被禁用" };
    //     console.log("Account is banned:", username);
    //   } else {
    //     // 密码错误
    //     ctx.body = { success: false, message: "账号或密码错误" };
    //     console.log("Login failed for user:", username);
    //   }
    // } else {
    //   ctx.body = { success: false, message: "账号或密码错误" };
    //   console.log("Login failed for user:", username);
    // }
  } catch (err) {
    console.error("数据库查询失败:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误", error: err.message };
  } finally {
    if (client) {
      await client.close();
    }
  }
}
);

module.exports = router;
