const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/';

// 连接数据库
const client = new MongoClient(uri);

client.connect().then(() => {
  console.log("数据库连接成功");
}).catch(err => {
  console.error('数据库连接失败:', err);
});

// db数据库
const db = client.db("blog");

const users = db.collection("users");
const guanlyCollection = db.collection("guanliy");

const guan = db.collection("collection");
const articles = db.collection("articles");

const review = db.collection("review");


exports.users = users;
exports.guanlyCollection = guanlyCollection;
exports.client = client;
exports.guan = guan;
exports.articles = articles;
exports.review = review;
exports.ObjectId = ObjectId;
