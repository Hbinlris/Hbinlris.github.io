const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser"); // 解析请求体
// const crypto = require("crypto"); // MD5加密
const app = new Koa();
const router = new Router();
const { guanlyCollection } = require("./models/modg");

app.use(bodyParser());

let client;


// 登录验证逻辑
router.post("/adminlogin", async (ctx) => {
    console.log("请求体内容:", ctx.request.body); // 打印请求体内容

    const { username, password } = ctx.request.body;

    if (!username || !password) {
        ctx.body = { success: false, message: "用户名和密码不能为空" };
        return;
    }

    try {
        // 查找用户是否存在
        const user = await guanlyCollection.findOne({ username });

        if (user) {
            // 直接对比明文密码
            if (user.password === password) {
                // 密码正确
                ctx.body = {
                    success: true,
                    message: "登录成功",
                    sup: user.sup.toString() // 确保 sup 字段被包含在响应中
                };
                console.log("Login successful for user:", username);
            } else {
                // 用户名或密码错误
                ctx.body = { success: false, message: "账号或密码错误" };
                console.log("Login failed for user:", username);
            }
        } else {
            // 用户名不存在
            ctx.body = { success: false, message: "账号或密码错误" };
            console.log("Login failed for user:", username);
        }

  
    } catch (err) {
        console.error("数据库查询失败:", err);
        ctx.status = 500;
        ctx.body = { success: false, message: "服务器内部错误" };
    }
});

module.exports = router;



