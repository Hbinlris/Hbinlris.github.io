const Koa = require("koa");
const Router = require("@koa/router");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const router = new Router();
const cors = require("@koa/cors");
const { guan } = require("./models/modg");

let client;
// let users;

app.use(bodyParser());  // 确保bodyParser在cors前加载
app.use(cors());

// 连接到MongoDB

async function olo() {
    try {
      // 使用空的查询对象 {} 来匹配所有文档
      const result = await guan.find().toArray(); // 使用 toArray() 将游标转换为数组
      return result;
    } catch (err) {
      console.error("查询数据失败：", err);
      return [];
    }
  }
  
  router.get("/api/olo", async (ctx) => {
    const guan = await olo();
    console.log(ctx);
  
    if (guan && guan.length > 0) {
      ctx.body = guan; // 返回用户信息
    } else {
      ctx.body = { message: "table" }; // 用户不存在
      ctx.status = 404; // 404 未找到
    }
  });
  

  module.exports = router;
