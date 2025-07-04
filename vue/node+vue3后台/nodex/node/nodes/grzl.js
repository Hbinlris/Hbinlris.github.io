const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { users, ObjectId } = require("./models/modg"); // 使用 users 模型
const multer = require("@koa/multer");
const upload = multer();
const { writeFile } = require("node:fs/promises");
const path = require("path");

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

// 简介更新
router.post("/api/grzl", async (ctx) => {
  try {
    const { userToken, message: jianjie } = ctx.request.body;

    if (!userToken || !jianjie) {
      ctx.status = 400;
      ctx.body = { success: false, message: "缺少必要的参数" };
      return;
    }

    const result = await users.updateOne(
      { username: userToken },
      { $set: { "grzl.jianjie": jianjie } }
    );

    if (result.modifiedCount > 0) {
      ctx.body = { success: true, message: "简介更新成功" };
    } else {
      ctx.body = { success: false, message: "简介更新失败" };
    }

  } catch (error) {
    console.error("更新简介时出错：", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

// 头像上传
router.post("/api/toxi", upload.single("avatar"), async (ctx) => {
  const { userToken = "" } = ctx.request.body;
  console.log(ctx.file);

  // 生成头像文件名
  const originalName = path.basename(ctx.file.originalname, path.extname(ctx.file.originalname)); // 获取原始文件名，不包括扩展名
  const avatarName = originalName + "-" + Date.now() + path.extname(ctx.file.originalname);
  console.log('avatarName', avatarName);

  try {
    // 写入文件系统
    await writeFile(path.resolve(__dirname, "./uploads", avatarName), ctx.file.buffer);

    // 更新用户数据库中的头像路径
    await users.updateOne({ username: userToken }, { $set: { avatar: avatarName } });

    // 返回成功响应
    ctx.body = { success: true, message: "头像上传成功" };

  } catch (error) {
    console.error("后端错误:", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "失败，请重试", error: error.message };
  }
});

// 名字更新
router.post("/api/grmz", async (ctx) => {
  try {
    const { userToken, message: mingcheng } = ctx.request.body;

    if (!userToken || !mingcheng) {
      ctx.status = 400;
      ctx.body = { success: false, message: "缺少必要的参数" };
      return;
    }

    const result = await users.updateOne(
      { username: userToken },
      { $set: { "grzl.mingcheng": mingcheng } }
    );

    if (result.modifiedCount > 0) {
      ctx.body = { success: true, message: "名字更新成功" };
    } else {
      ctx.body = { success: false, message: "名字更新失败" };
    }

  } catch (error) {
    console.error("更新名字时出错：", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

// 地区更新
router.post("/api/grdz", async (ctx) => {
  try {
    const { resultArea, userToken } = ctx.request.body;

    if (!userToken || !resultArea) {
      ctx.status = 400;
      ctx.body = { success: false, message: "缺少必要的参数" };
      return;
    }

    const result = await users.updateOne(
      { username: userToken },
      { $set: { "grzl.resultArea": resultArea } }
    );

    if (result.modifiedCount > 0) {
      ctx.body = { success: true, message: "地址更新成功" };
    } else {
      ctx.body = { success: false, message: "地址更新失败" };
    }
  } catch (error) {
    console.error("更新地址时出错：", error);
    ctx.status = 500;
    ctx.body = { success: false, message: error.message || "服务器内部错误" };
  }
});

// 日期更新
router.post("/api/grsr", async (ctx) => {
  try {
    const { results, userToken } = ctx.request.body;

    if (!userToken || !results) {
      ctx.status = 400;
      ctx.body = { success: false, message: "缺少必要的参数" };
      return;
    }

    const result = await users.updateOne(
      { username: userToken },
      { $set: { "grzl.date": results } }
    );

    if (result.modifiedCount > 0) {
      ctx.body = { success: true, message: "日期更新成功" };
    } else if (result.matchedCount > 0) {
      ctx.body = { success: true, message: "日期未发生变化" };
    } else {
      ctx.body = { success: false, message: "未找到用户或更新失败" };
    }
  } catch (error) {
    console.error("更新日期时出错：", error);
    ctx.status = 500;
    ctx.body = { success: false, message: error.message || "服务器内部错误" };
  }
});

// 性别更新
router.post("/api/grxb", async (ctx) => {
  try {
    const { xingbie, userToken } = ctx.request.body;

    if (!userToken || !xingbie) {
      ctx.status = 400;
      ctx.body = { success: false, message: "缺少必要的参数" };
      return;
    }

    const result = await users.updateOne(
      { username: userToken },
      { $set: { "grzl.xingbie": xingbie } }
    );

    if (result.modifiedCount > 0) {
      ctx.body = { success: true, message: "日期更新成功" };
    } else if (result.matchedCount > 0) {
      ctx.body = { success: true, message: "日期未发生变化" };
    } else {
      ctx.body = { success: false, message: "未找到用户或更新失败" };
    }
  } catch (error) {
    console.error("更新日期时出错：", error);
    ctx.status = 500;
    ctx.body = { success: false, message: error.message || "服务器内部错误" };
  }
});

// 获取用户信息
// router.get("/api/clientusers/", async (ctx) => {
//   // try {
//   // 查询数据库中是否有该用户

//   const { username } = ctx.request.query;

//   // ctx.body = { success: true, message: "用户信息获取成功", data:username };
//   const usersData = await users.findOne({ username });
//   console.log('usersData', usersData);
//   ctx.body = { usersData };


// });
router.get("/api/clientusers/:username", async (ctx) => {
  const { username } = ctx.params;
  const usersData = await users.findOne({ username });
  console.log('usersData', usersData);
  ctx.body = { usersData };
});

module.exports = router;
