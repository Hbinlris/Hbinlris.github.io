const Router = require('@koa/router');
const multer = require('@koa/multer');
const path = require('path');
const fs = require('fs');

// 身份验证
const authtwo = require('../verify/authtwo');
// 设置前缀为'/authtwo'
const router = new Router({ prefix: '/authtwo' });

const { users } = require('../../mongodb/mongodb');


// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = Date.now().toString();
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({ storage });

// 上传接口
router.post('/upload', authtwo, upload.single('file'), async (ctx) => {

  const { email } = ctx.state.user;


  try {

    // 查找用户邮箱
    const user = await users.findOne({ email });

    console.log('upload-email:', user);

    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }

    // console.log('ctx:', ctx); // 打印整个上下文对象
    // console.log('ctx.file:', ctx.file); // 打印上传的文件信息

    if (!ctx.file) {
      ctx.status = 400;
      ctx.body = { success: false, message: '未收到文件' };
      return;
    }
    // 返回图片链接
    console.log('文件保存路径:', path.join(__dirname, '../uploads', ctx.file.filename));

    // const baseUrl = 'http://localhost:8080';
    // const baseUrl = 'http://192.168.43.47:8080'
    const baseUrl = 'http://192.168.82.47:8080'

    const fileUrl = `${baseUrl}/${ctx.file.filename}`;


    // 返回图片链接
    ctx.body = {
      success: true,
      url: fileUrl,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, message: '上传失败', error: err.message };
  }
});

module.exports = router;
