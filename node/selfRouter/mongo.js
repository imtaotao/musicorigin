const DB = require('mongodb').Db;
const Server = require('mongodb').Server;
const MongoClient = require('mongodb').MongoClient;

const setting = {
  db: 'musicsite', // 功能性数据库
  // db   : 'listComments',		// 歌单评论数据库
  // db   : 'musicComments'		// 歌曲评论数据库
  port: '27017',
  host: 'localhost',
};

// mongodb 连接 url
//'mongodb://localhost:27017/database'

// 使用 connect 方法连接到服务器
module.exports = function (name, callback) {
  if (typeof name === 'function') {
    callback = name;
    name = setting.db;
  }

  const url = 'mongodb://' + setting.host + ':' + setting.port + '/' + name;
  MongoClient.connect(url, function (err, db) {
    callback(err, db);
  });
};
