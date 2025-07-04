const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const path = require("path");
const multer = require("@koa/multer");
const fs = require("fs");
const { articles } = require("./models/modg");

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

// 确保上传目录存在
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 上传文件的存储目录
  },
  filename: function (req, file, cb) {
    const originalname = path.basename(file.originalname); // 获取文件的原始名称
    cb(null, encodeURIComponent(originalname)); // 使用编码后的文件名
  },
});

const upload = multer({ storage: storage });

// 格式化日期为 YYYY-MM-DD HH:mm:ss
const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("zh-CN", options);
  return formatter.format(date).replace(/\//g, "-"); // 格式化为"YYYY-MM-DD HH:mm:ss"
};

async function insertPost(post) {
  try {
    const result = await articles.insertOne(post); // 直接插入一条新文档
    console.log("数据库插入结果:", result);
  } catch (err) {
    console.error("数据库插入错误:", err);
  }
}

async function honey() {
  try {
    // 使用空的查询对象 {} 来匹配所有文档
    const result = await articles.find().toArray(); // 使用 toArray() 将游标转换为数组
    return result;
  } catch (err) {
    console.error("查询数据失败：", err);
    return [];
  }
}

async function honey(id) {
  try {
    const query = id ? { id } : {};  // 如果提供了 id，则根据 id 查询，否则查询所有文章
    const result = await articles.find(query).toArray();
    return result;
  } catch (err) {
    console.error("查询数据失败：", err);
    return [];
  }
}

router.get("/api/publish", async (ctx) => {
  const articles = await honey();
  console.log(ctx);

  if (articles && articles.length > 0) {
    ctx.body = articles; // 返回内容信息
  } else {
    ctx.body = { message: "返回内容信息" };
    ctx.status = 404; // 404 未找到
  }
});


// 根据文章 id 获取文章内容
router.get("/api/article/:id", bodyParser(), async (ctx) => {
  const articleId = ctx.params.id; // 获取路径中的 id 参数
  const articles = await honey(articleId); // 调用 honey 函数查询指定 id 的文章

  if (articles && articles.length > 0) {
    ctx.body = articles[0]; // 由于 id 是唯一的，返回第一个匹配的文章
  } else {
    ctx.body = { message: "未找到相关内容" };
    ctx.status = 404; // 404 未找到
  }
});



// 发布文章接口
router.post(
  "/api/publish",
  upload.array("imageUrl", 10),
  async (ctx) => {
    const {
      id = "",
      title = "",
      text = "",
      label = "",
      userToken = "",
      status = "",
      isPublic = "",
      status22 = "",
      labelId = "",
    } = ctx.request.body;

    const files = ctx.request.files; // 获取上传的文件数组
    console.log("接收到的文件:", files);

    if (!files) {
      ctx.status = 400;
      ctx.body = { success: false, message: "没有文件上传" };
      return;
    }

    // 处理文件 URL
    const fileUrls = files.map((file) => `${file.filename}`);

    // 获取格式化的当前日期时间
    const createdAt = formatDate(new Date());

    // 构造发布的文章数据
    const post = {
      id,
      title,
      text,
      imageUrl: fileUrls, // 存储文件数组
      userToken,
      status,
      isPublic,
      status22,
      createdAt, // 只保存年月日时分秒
      collection: labelId, // 假设 labelId 对应 collection 字段
      label,
    };

    try {
      // 检查文章是否已存在
      const existingArticle = await articles.findOne({ title });
      console.log("现有文章:", existingArticle);

      if (existingArticle) {
        // 如果存在，则更新文章
        const result = await articles.updateOne(
          { id: existingArticle.id },
          {
            $set: {

              title,
              text,
              imageUrl: fileUrls, // 存储文件数组
              userToken,
              status,
              isPublic,
              status22,
              createdAt, // 只保存年月日时分秒
              collection: labelId, // 假设 labelId 对应 collection 字段
              label,
            },
          }
        );
        console.log("更新结果:", result);

        if (result.modifiedCount > 0) {
          ctx.body = { success: true, message: "文章更新成功", post };
        } else {
          ctx.body = { success: false, message: "文章没有变化，更新失败" };
        }
      } else {
        // 如果不存在，则插入新文章
        await insertPost(post);
        ctx.body = { success: true, message: "发布成功", post };
      }
    } catch (error) {
      console.error("后端错误:", error);
      ctx.status = 500;
      ctx.body = { success: false, message: "发布失败，请重试", error: error.message };
    }
  }
);


// 删除 articles 集合中的数据
router.post('/api/articles/delete', bodyParser(), async (ctx) => {
  console.log("进入删除 articles 路由");
  console.log("接收到的请求体:", ctx.request.body);
  const { id } = ctx.request.body;

  if (!id) {
    ctx.status = 400;
    ctx.body = { success: false, message: '缺少文章 ID' };
    return;
  }

  try {
    console.log(`尝试删除文章 ID: ${id}`); // 添加日志
    const result = await articles.deleteOne({ id: id }); // 使用 id 而不是 _id
    console.log(`删除结果:`, result); // 添加日志

    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: '文章未找到或已被删除' };
    } else {
      ctx.body = { success: true, message: '文章删除成功' };
    }
  } catch (error) {
    console.error('删除文章时发生错误:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '删除文章失败，请重试', error: error.message };
  }
});

// 更新 articles 集合中的数据状态
router.post('/api/articles/update', bodyParser(), async (ctx) => {
  console.log("进入更新 articles 路由");
  console.log("接收到的请求体:", ctx.request.body);
  const { id, status22 } = ctx.request.body;

  if (!id || !status22) {
    ctx.status = 400;
    ctx.body = { success: false, message: '缺少文章 ID 或状态' };
    return;
  }

  try {
    console.log(`尝试更新文章 ID: ${id} 的状态为: ${status22}`); // 添加日志
    const result = await articles.updateOne(
      { id: id }, // 使用 id 而不是 _id
      { $set: { status22: status22 } }
    );
    console.log(`更新结果:`, result); // 添加日志

    if (result.matchedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, message: '文章未找到' };
    } else {
      ctx.body = { success: true, message: '文章状态更新成功' };
    }
  } catch (error) {
    console.error('更新文章状态时发生错误:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '更新文章状态失败，请重试', error: error.message };
  }
});

module.exports = router;
