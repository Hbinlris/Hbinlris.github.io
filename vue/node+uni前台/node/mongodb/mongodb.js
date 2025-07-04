const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/';

// 连接数据库
const client = new MongoClient(uri);

client.connect().then(() => {
  console.log("数据库连接成功", uri);
}).catch(err => {
  console.error('数据库连接失败:', err);
});

// db数据库
const db = client.db("qd");
// 个人信息
const users = db.collection("users");
// 验证码
const captcha = db.collection("captcha");
// 签到
const sign = db.collection("sign");

// 日记
const diary = db.collection("diary");

exports.users = users;
exports.captcha = captcha;
exports.sign = sign;
exports.diary = diary;

