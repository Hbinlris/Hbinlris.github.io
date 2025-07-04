const Koa = require("koa");
const app = new Koa();
const Router = require("@koa/router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { review } = require("./models/modg"); // 确保正确导入 review 模型
const { ObjectId } = require('mongodb'); // 导入 ObjectId 类型

app.use(bodyParser());
app.use(cors());

// 定义插入评论的函数
const formatDate = (date) => {
    const pad = (num) => num < 10 ? '0' + num : num;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    // const hours = pad(date.getHours());
    // const minutes = pad(date.getMinutes());
    // const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} `;
};

const insertPost = async (post) => {
    try {
        const postWithTimestamp = {
            ...post,
            createdAt: formatDate(new Date())  
        };
        const result = await review.insertOne(postWithTimestamp); 

        return { _id: result.insertedId, ...postWithTimestamp };
    } catch (error) {
        console.error("插入评论失败:", error);
        throw error;
    }
};

router.post("/api/comment", bodyParser(), async (ctx) => {
    const { articleId = "", userToken = "", content = "" } = ctx.request.body;
    console.log("添加评论请求:", ctx.request.body);
    if (!articleId || !userToken || !content) {
        ctx.status = 400;
        ctx.body = { success: false, message: "缺少必要的字段" };
        return;
    }
    try {
        const newComment = await insertPost({ articleId, userToken, content }); // 调用插入函数
        ctx.status = 201;
        ctx.body = { success: true, message: "评论成功", data: newComment };
    } catch (error) {
        console.error("添加评论失败:", error);
        ctx.status = 500;
        ctx.body = { success: false, message: "服务器错误" };
    }
});

router.get("/api/comment/:articleId", bodyParser(), async (ctx) => {
    const { articleId } = ctx.params;
    console.log("获取评论请求:", articleId);
    
    try {
        // 使用 .toArray() 获取所有评论数据
        const comments = await review.find({ articleId }).sort({ createdAt: -1 }).toArray();
        console.log("查询的 articleId:", articleId);
        ctx.status = 200;
        ctx.body = { success: true, data: comments };
    } catch (error) {
        console.error("获取评论失败:", error);
        ctx.status = 500;
        ctx.body = { success: false, message: "服务器错误" };
    }
});

// 新增：获取所有评论的 API
router.get("/api/comments", bodyParser(), async (ctx) => {
    try {
        // 使用 .toArray() 获取所有评论数据
        const comments = await review.find({}).sort({ createdAt: -1 }).toArray();
        console.log("获取所有评论");
        ctx.status = 200;
        ctx.body = { success: true, data: comments };
    } catch (error) {
        console.error("获取所有评论失败:", error);
        ctx.status = 500;
        ctx.body = { success: false, message: "服务器错误" };
    }
});

// 新增：删除评论的 API
router.delete("/api/commentdel/:commentId", bodyParser(), async (ctx) => {
    const { commentId } = ctx.params;
    console.log("删除评论请求:", commentId);

    if (!commentId) {
        ctx.status = 400;
        ctx.body = { success: false, message: "缺少必要的字段" };
        return;
    }

    try {
        const result = await review.deleteOne({ _id: new ObjectId(commentId) });
        if (result.deletedCount === 1) {
            ctx.status = 200;
            ctx.body = { success: true, message: "评论删除成功" };
        } else {
            ctx.status = 404;
            ctx.body = { success: false, message: "评论未找到" };
        }
    } catch (error) {
        console.error("删除评论失败:", error);
        ctx.status = 500;
        ctx.body = { success: false, message: "服务器错误" };
    }
});

module.exports = router;