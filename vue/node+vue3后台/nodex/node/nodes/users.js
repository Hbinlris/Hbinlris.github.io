const Router = require("@koa/router");
const { users, guanlyCollection } = require("./models/modg"); // 确保引入 guanlyCollection
const { MongoClient, ObjectId } = require("mongodb"); // 导入 MongoClient 和 ObjectId
const bodyParser = require("koa-bodyparser");

const router = new Router();

async function getAllUsers() {
  try {
    const result = await users.find({}).toArray();
    return result;
  } catch (err) {
    console.error("查询数据失败：", err);
    return [];
  }
}

router.get("/api/users", async (ctx) => {
  const usersData = await getAllUsers();
  if (usersData && usersData.length > 0) {
    ctx.body = usersData;
  } else {
    ctx.body = { message: "没有找到用户" };
    ctx.status = 404;
  }
});

// 删除用户路由
router.post("/api/users/delete", bodyParser(), async (ctx) => {
  console.log("删除用户请求:", ctx.request.body._id);

  try {
    // 将 ctx.request.body._id 转换为 ObjectId
    const userId = new ObjectId(ctx.request.body._id);
    const result = await users.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: "用户未找到" };
    } else {
      ctx.status = 200;
      ctx.body = { success: true, message: "删除成功" };
    }
  } catch (err) {
    console.error("删除用户失败:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

// 更新用户状态路由
router.post("/api/users/updateStatus", bodyParser(), async (ctx) => {
  console.log("更新用户状态请求:", ctx.request.body);

  try {
    const { _id, status } = ctx.request.body;

    // 将 _id 转换为 ObjectId
    const userId = new ObjectId(_id);

    // 更新用户状态
    const result = await users.updateOne(
      { _id: userId },
      { $set: { zhuangtai: status } }
    );

    if (result.matchedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: "用户未找到" };
    } else {
      ctx.status = 200;
      ctx.body = { success: true, message: "状态更新成功" };
    }
  } catch (err) {
    console.error("更新用户状态失败:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

// 获取 guanlyCollection 表中的全部数据
router.get("/api/guanlyCollection", async (ctx) => {
  try {
    const result = await guanlyCollection.find({}).toArray();
    if (result && result.length > 0) {
      ctx.body = result;
    } else {
      ctx.body = { message: "没有找到数据" };
      ctx.status = 404;
    }
  } catch (err) {
    console.error("查询 guanlyCollection 数据失败：", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

// 添加普通管理员路由
router.post("/api/guanlyCollection/add", bodyParser(), async (ctx) => {
  console.log("添加普通管理员请求:", ctx.request.body);

  try {
    const { username, password } = ctx.request.body;
    const newAdmin = {
      _id: new ObjectId(), // 使用 MongoDB ObjectId 作为 ID
      username,
      password,
      sup: false, // 普通管理员
    };

    const result = await guanlyCollection.insertOne(newAdmin);
    if (result.acknowledged) {
      ctx.status = 200;
      ctx.body = { success: true, message: "添加管理员成功", data: newAdmin };
    } else {
      ctx.status = 500;
      ctx.body = { success: false, message: "添加管理员失败" };
    }
  } catch (err) {
    console.error("添加管理员失败:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

// 删除 guanlyCollection 中的用户路由
router.post("/api/guanlyCollection/delete", bodyParser(), async (ctx) => {
  console.log("删除管理员请求:", ctx.request.body._id);

  try {
    // 将 ctx.request.body._id 转换为 ObjectId
    const adminId = new ObjectId(ctx.request.body._id);
    const result = await guanlyCollection.deleteOne({ _id: adminId });

    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: "管理员未找到" };
    } else {
      ctx.status = 200;
      ctx.body = { success: true, message: "删除成功" };
    }
  } catch (err) {
    console.error("删除管理员失败:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器内部错误" };
  }
});

module.exports = router;