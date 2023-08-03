// 得到音频资源
const fs = require("fs");
const path = require("path");
const url = require("url");
const http = require("http");

let musicurl = "";

// 从网易云获得资源
class neteaseCloud {
  constructor(range) {
    this.range = range;
    this.config = {};
  }

  // 解析url，得到请求头信息
  options() {
    const param = url.parse(musicurl);
    const headers = this.header();
    return {
      hostname: param.host,
      method: "GET",
      port: param.port || 80,
      path: param.path,
      headers: headers,
    };
  }

  getMusic(callback) {
    const self = this;
    const options = self.options();
    // 资源加载完毕后进行检查发送给前台，后续的加载就不需要请求资源了
    const req = http.request(options, (res) => {
      callback(res);
    });
    req.end();
  }

  header() {
    return {
      Range: this.range,
    };
  }

  // 返回给前台的响应头
  resposeHead(header) {
    // 如果是响应的不是 206 就不要 content-range 响应头了
    if (!!header["content-range"]) {
      return {
        "content-type": header["content-type"],
        "content-range": header["content-range"],
        "content-length": header["content-length"],
      };
    } else {
      return {
        "content-type": header["content-type"],
        "content-length": header["content-length"],
      };
    }
  }
}

module.exports = function (app) {
  app.get("/getMusic", (req, res) => {
    musicurl = req.query.url;
    const range = req.headers.range;
    if (!range) return;
    const partil = new neteaseCloud(range);
    partil.getMusic((Reuestres) => {
      const header = partil.resposeHead(Reuestres.headers); // 响应头
      const status = Reuestres.statusCode; // 状态码

      if (status === 403) {
        res.writeHead(403);
        res.end("服务器拒绝访问");
        return;
      }
      if (status === 206 || status === 200) {
        res.writeHead(status, header);
        Reuestres.pipe(res);
        return;
      }
      res.writeHead(404);
      res.end("404");
    });
  });
};
