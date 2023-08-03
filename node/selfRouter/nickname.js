/*更改昵称*/
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
  app.post('/nickname', (req, res, next) => {
    const { nickname, name } = req.body;
    if (!nickname || !name) {
      res.send(JSON.stringify({ msg: '参数错误' }));
      next();
    }

    mongo((err, db) => {
      if (!dealErr(err, res, next, db)) return;

      // 查找用户
      const collection = db.collection('user');

      collection.update(
        { name: name + '' },
        { $set: { nickname } },
        (err, totalres) => {
          if (!dealErr(err, res, next, db)) return;
          const { result } = totalres;
          if (result.ok != 1) {
            res.send(JSON.stringify({ msg: '更改失败' }));
            db.close();
            next();
            return;
          }
          // 如果跟改成功就返回最新的信息
          collection.findOne({ name }, (err, result) => {
            if (!dealErr(err, res, next, db)) return;
            if (!result) {
              res.send(JSON.stringify({ msg: '用户不存在' }));
            } else {
              res.send(JSON.stringify({ nickname: result.nickname }));
            }
            db.close();
            next();
          });
        },
      );
    });
  });
};
