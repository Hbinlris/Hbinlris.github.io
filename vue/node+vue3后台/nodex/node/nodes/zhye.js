const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser"); // 用于解析请求体
const app = new Koa();
const router = new Router();
const { guan } = require("./models/modg");
const { ObjectId } = require("mongodb"); // 导入 ObjectId

// 中间件：解析请求体
app.use(bodyParser());

async function honey() {
  try {
    // 使用空的查询对象 {} 来匹配所有文档
    const result = await guan.find().toArray(); // 使用 toArray() 将游标转换为数组
    return result;
  } catch (err) {
    console.error("查询数据失败：", err);
    return [];
  }
}

router.get("/api/honey", async (ctx) => {
  const user = await honey();
  console.log(ctx);

  if (user && user.length > 0) {
    ctx.body = user; // 返回用户信息
  } else {
    ctx.body = { message: "用户未找到" }; // 用户不存在
    ctx.status = 404; // 404 未找到
  }
});

// 添加新标签
router.post("/api/honey", async (ctx) => {
  const { name } = ctx.request.body;
  
  // 检查标签名称是否为空
  if (!name) {
    ctx.status = 400;
    ctx.body = { success: false, message: "标签名称不能为空" };
    return;
  }

  try {
    // 检查标签是否已存在（使用 name 字段）
    const existingTag = await guan.findOne({ label: name });
    if (existingTag) {
      ctx.status = 400;
      ctx.body = { success: false, message: "标签已存在" };
      return;
    }

    // 插入新标签（使用 label 字段）
    const newTag = { label: name };
    const result = await guan.insertOne(newTag);
    
    // 统一返回格式
    ctx.body = { 
      success: true, 
      message: "标签添加成功", 
      data: { id: result.insertedId, label: name } 
    };
  } catch (error) {
    console.error("添加标签失败:", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "添加标签失败，请重试", error: error.message };
  }
});

// 更新标签
// 更新标签
// 更新标签
router.post("/api/tags/update", async (ctx) => {
  const { id, label } = ctx.request.body;
  if (!id || !label) {
    ctx.status = 400;
    ctx.body = { success: false, message: "标签ID和名称不能为空" };
    return;
  }

  try {
    // 将 id 转换为 ObjectId
    const objectId = new ObjectId(id);

    // 更新标签
    const result = await guan.updateOne(
      { _id: objectId }, // 找到旧标签
      { $set: { label: label } } // 更新标签名称
    );

    if (result.matchedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: "标签未找到" };
    } else {
      ctx.body = { success: true, message: "标签更新成功", data: { id: id, label: label } };
    }
  } catch (error) {
    console.error("更新标签失败:", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "更新标签失败，请重试", error: error.message };
  }
});

// 删除标签
router.delete("/api/tags/:id", async (ctx) => {
  const { id } = ctx.params;

  try {
    // 将 id 转换为 ObjectId
    const objectId = new ObjectId(id);

    // 删除标签
    const result = await guan.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: "标签未找到" };
    } else {
      ctx.body = { success: true, message: "标签删除成功" };
    }
  } catch (error) {
    console.error("删除标签失败:", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "删除标签失败，请重试", error: error.message };
  }
});

module.exports = router;