/*歌单歌曲评论*/
const mongo = require('./mongo');
const ObjectID = require('mongodb').ObjectID;
const { dealErr } = require('../util/util');

module.exports = function (app) {
  // 歌单评论
  app.post('/listComments', (req, res, next) => {
    logicDeal(req, res, next, 'listComments');
  });

  // 歌曲评论
  app.post('/musicComments', (req, res, next) => {
    logicDeal(req, res, next, 'musicComments');
  });
};

function logicDeal(req, res, next, dbName) {
  const { name, id, text, reply, nickname, avatarUrl } = req.body;
  if (
    !name ||
    !nickname ||
    !avatarUrl ||
    !id ||
    text == null ||
    reply == null
  ) {
    res.send(JSON.stringify({ msg: '参数错误' }));
    return next();
  }

  // 根据评论类型进行不同的操作
  const data = { res, name, id, reply, text, nickname, avatarUrl, next };
  reply ? replyComment(dbName, data) : ordinary(dbName, data);
}

// 普通评论
function ordinary(dbName, { res, name, id, text, nickname, avatarUrl, next }) {
  // 连接歌单评论的数据库
  mongo(dbName, (err, db) => {
    if (!dealErr(err, res, next, db)) return;

    coll = db.collection('row' + id);

    // 连接当前歌单集合（一个歌单一个集合）
    const data = {
      name,
      text,
      nickname,
      avatarUrl,
      time: Date.now(),
      reply: [],
    };
    coll.insert(data, (err, { result, ops }) => {
      if (!dealErr(err, res, next, db)) return;

      const msg = result.ok === 1 ? '发表成功' : '发表失败';
      res.send(JSON.stringify({ msg, doc: ops[0] }));
      db.close();
      next();
    });
  });
}

// 回复评论
function replyComment(
  dbName,
  { res, name, id, reply, text, nickname, avatarUrl, next },
) {
  // 需要查找三个位置
  // 当前评论所在的集合（歌曲）
  // 当前集合中的具体评论位置
  // 被回复人的用户信息
  mongo(dbName, (err, db) => {
    if (!dealErr(err, res, next, db)) return;

    coll = db.collection('row' + id);

    coll.findOne({ _id: ObjectID(reply.id) }, (err, comInfo) => {
      if (!dealErr(err, res, next, db)) return;

      // 如果没有查到这条评论
      if (!comInfo) {
        res.send(JSON.stringify({ msg: '回复失败' }));
        db.close();
        next();
        return;
      }

      // 插入回复数据
      const data = {
        name,
        text,
        nickname,
        avatarUrl,
        time: Date.now(),
        reply: [comInfo],
      };

      coll.insert(data, (err, { result, ops }) => {
        if (!dealErr(err, res, next, db)) return;

        const msg = result.ok === 1 ? '发表成功' : '发表失败';
        res.send(JSON.stringify({ msg, doc: ops[0] }));
        db.close();
        next();
      });
    });
  });
}
