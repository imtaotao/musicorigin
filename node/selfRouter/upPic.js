// 上传头像
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const util = require("../util/util");
const mongo = require("./mongo");

function dealErr(err, res, next, db) {
  if (err) {
    console.log(err);
    db && db.close();
    res.send(JSON.stringify({ msg: "服务器发生错误" }));
    next();
    return false;
  }
  return true;
}

function updataFile(req, callback) {
  const form = new formidable.IncomingForm();
  form.encoding = "utf-8";

  form.parse(req, function (err, fields, files) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, fields, files);
  });
}

// 存储图片并更新数据库
function savePic(res, db, next, name, newUrl, saveUrl, currentFile) {
  // 然后把新的图片存放到服务器，更新数据库
  fs.renameSync(currentFile.path, saveUrl);
  // 更新文档
  db.collection("user").updateOne(
    { name },
    { $set: { pic: newUrl } },
    { upsert: true },
    (err, result) => {
      if (!dealErr(err, res, next, db)) return;
      if (result.result.ok === 1) {
        res.send(newUrl);
        db.close();
      }
    }
  );
}

module.exports = function (app) {
  app.post("/upPic", (req, res, next) => {
    updataFile(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        res.send(JSON.stringify({ msg: "服务器发生错误" }));
        return next();
      }
      const name = fields.name;
      const currentFile = files.userfile;
      const fileName =
        Date.now() + util.random(0, 999999) + path.extname(currentFile.name);
      const newUrl = "static/userImg/" + fileName;
      const saveUrl = path.join(__dirname, "../../" + newUrl);

      // 把路径存放到数据库
      mongo((err, db) => {
        if (!dealErr(err, res, next, db)) return;

        // 先删除原先在数据库的数据
        db.collection("user").findOne({ name }, (err, result) => {
          if (!dealErr(err, res, next, db)) return;

          const originUrl = path.join(__dirname, "../../" + result.pic);
          // 删除原先在服务器的图片（判断文件是否存在）

          if (fs.existsSync(originUrl) && !result.pic.includes("defaultPic")) {
            fs.unlink(originUrl, (err) => {
              if (!dealErr(err, res, next, db)) return;
              savePic(res, db, next, name, newUrl, saveUrl, currentFile);
            });
            return;
          }
          savePic(res, db, next, name, newUrl, saveUrl, currentFile);
        });
      });
    });
  });
};
