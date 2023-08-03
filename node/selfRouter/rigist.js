/*注册*/
const mongo = require('./mongo');

function dealErr(err, res, next, db) {
  if (err) {
    console.log(err);
    db.close();
    res.send(JSON.stringify({ msg: '服务器发生错误' }));
    next();
    return false;
  }
  return true;
}

module.exports = function (app) {
  app.post('/rigist', (req, res, next) => {
    const { name, pwd } = req.body;
    if (!name || !pwd) {
      res.send(JSON.stringify({ msg: '参数错误' }));
      next();
    }

    mongo((err, db) => {
      if (!dealErr(err, res, next, db)) return;

      // 查找用户
      const collection = db.collection('user');
      collection.findOne({ name }, (err, result) => {
        if (!dealErr(err, res, next, db)) return;

        // 如果用户已经存在
        if (result) {
          res.send(JSON.stringify({ msg: '用户已存在' }));
          db.close();
          next();
          return;
        }

        /*
					用户名
					密码
					等级
					头像
					经验
					经验值百分比
					昵称
					收藏歌曲
					收藏歌单
					下载过的歌曲信息
				*/
        const data = {
          name,
          pwd,
          grade: 1,
          pic: 'static/img/defaultPic.jpg',
          ex: 0,
          percent: 0,
          nickname: '昵称',
          birthday: Date.now(),
          collectMusic: [],
          collectList: [],
          downList: [],
        };

        // 否则就注册用户
        collection.insert(data, (err) => {
          if (!dealErr(err, res, next, db)) {
            res.send(JSON.stringify({ msg: '注册失败' }));
            return;
          }
          res.send(JSON.stringify({ msg: '注册成功' }));
          db.close();
          next();
        });
      });
    });
  });
};
