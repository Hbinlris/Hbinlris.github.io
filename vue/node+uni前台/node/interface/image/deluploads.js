const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');

// 身份验证
const authtwo = require('../verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });

const { users } = require('../../mongodb/mongodb');


// 添加在您的路由文件中（与上传接口同文件）
router.post('/deluploads', authtwo, async (ctx) => {
  const { email } = ctx.state.user;
  const { fileUrl } = ctx.request.body; // 接收文件URL

  if (!fileUrl) {
    ctx.status = 400;
    ctx.body = { success: false, message: '缺少fileUrl参数' };
    return;
  }

  try {
    // 1. 验证用户权限
    const user = await users.findOne({ email });
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }

    // 2. 提取文件名（安全处理）
    const filename = path.basename(fileUrl);
    if (!filename || filename.includes('..')) { // 防止路径遍历攻击
      ctx.status = 400;
      ctx.body = { success: false, message: '非法文件名' };
      return;
    }

    // 3. 构建完整文件路径
    // const filePath = path.join(process.cwd(), 'uploads', filename); // 绝对路径
    const filePath = path.join(__dirname, '../../uploads', filename);
    console.log('del', filePath);


    // 4. 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { success: false, message: '文件不存在' };
      return;
    }

    // 5. 删除文件
    fs.unlinkSync(filePath);

    // 6. 返回成功响应
    ctx.body = {
      success: true,
      message: '删除成功'
    };

  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '删除失败',
      error: err.message
    };
  }
});

module.exports = router;

