// 已经下载过的音乐信息
const mongo = require("./mongo");
const { dealErr } = require("../util/util");

module.exports = function (app) {
  app.post("/alrdownload", (req, res, next) => {
    const { name, info } = req.body;
    if (!name || !info) {
      rex.send(JSON.stringify({ msg: "下载信息入库出现异常" }));
      return next();
    }

    // 入库
    mongo((err, db) => {
      if (!dealErr(err, res, next, db)) return;

      const coll = db.collection("user");

      coll.findOne({ name }, (err, result) => {
        if (!dealErr(err, res, next, db)) return;

        // 如果用户不存在
        if (!result) {
          res.send(JSON.stringify({ msg: "用户不存在", code: -1 }));
          db.close();
          next();
          return;
        }

        // 跟改数据库
        coll.update(
          { name },
          { $addToSet: { downList: info } },
          (err, result) => {
            if (!dealErr(err, res, next, db)) return;

            res.send(JSON.stringify({ code: result.result.ok }));
            db.close();
            next();
          }
        );
      });
    });
  });
};
