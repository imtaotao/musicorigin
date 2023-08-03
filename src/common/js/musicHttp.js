/*	demo: 
  const ajax = new $http({ ... })
  ajax.send().then(afterHttp())
  ajax.callback = function({status, response}) { ... }
  ajax.progress = function(res, loaded) { ... }
  ajax.half = function({status, response}) { ... }
  ajax.end = function() { ... }
 */
export default class musicHttp {
  // param : url, data, header, dataType
  constructor({ url, header, dataType = "", data = {}, fileTotal }) {
    const size = (this.firstSize = 102400);
    this.url = url;
    this.data = data;
    this.dataType = dataType;
    this.header = { Range: `bytes=0-${size}` };
    (this.first = true),
      (this.saveBox = {
        count: 1,
        total: fileTotal,
      });
  }

  // 请求的回调
  end() {} // ajax 请求完毕后
  cancell() {} // 取消 ajax 的继续执行
  half() {} // 第五次请求完毕后调用
  callback() {} // 每次请求的回调
  progress() {} // 请求资源的进度

  send() {
    let self = this,
      url = self.url,
      data = self.data,
      dataType = self.dataType,
      method = "GET",
      header = self.header;

    // 请求计数
    return new Promise((resolve, reject) => {
      const xhr = (self.xhr = new XMLHttpRequest());

      // 如果不是第一次请求，每次发起请求前都要变化字节数
      // 改变请求头
      !self.first && self.change();

      url = url + self.serialization(data);

      xhr.open(method, url);
      xhr.responseType = dataType;
      xhr.onload = ({ target }) => resolve([target, self.getAllHead()]);
      xhr.onerror = ({ target }) => reject([target, self.getAllHead()]);
      xhr.onprogress = (e) => self.progress(e.target, e.loaded, e.total);

      // 设置头部
      Object.keys(header).forEach((key) => {
        xhr.setRequestHeader(key, header[key]);
      });
      xhr.send();
    });
  }

  serialization(data) {
    let serializ = "?";
    Object.keys(data).forEach((key) => {
      serializ += `${key}=${data[key]}&`;
    });
    return serializ.slice(0, serializ.length - 1);
  }

  getAllHead() {
    const headObj = {};
    const header = this.xhr.getAllResponseHeaders();
    if (!header) {
      console.warn("没有响应头");
      return alert("网络不好，请刷新重试~");
    }
    const regBefore = /.+?(?=:)/g;

    header.split("\n").forEach((val) => {
      let key = val.match(regBefore);
      if (!key) return;
      let value = val.replace(`${key[0]}: `, "");
      key = key[0].replace(/-/g, "_").toLocaleLowerCase(); // 转义 '-'
      headObj[key] = value;
    });

    return headObj;
  }

  // 第一次配置
  saveChange(header) {
    // 如果有自定义的头部就拿自定义的
    if (!header.X_All_Length && !header.content_range) return;
    const total = header.X_All_Length || header.content_range.split("/")[1];

    this.saveBox.total = this.saveBox.total || Number(total);
    this.saveBox.already = this.firstSize;
    const last = (this.saveBox.last = total - this.firstSize);
    this.saveBox.single = parseInt(last / 10);
  }
  // 动态改变剩余 size
  change(lastLength) {
    this.saveBox.already += this.saveBox.single;
    this.saveBox.last = this.saveBox.total - this.saveBox.already;
    this.header.Range = this.nextSize();
  }

  // 下次请求的 Range 请求头
  nextSize() {
    const total = this.saveBox.total;
    const last = this.saveBox.last;
    const single = this.saveBox.single;
    const start = total - last;
    const end = start + single;
    return this.saveBox.count < 10
      ? `bytes=${start + 1}-${end}`
      : `bytes=${start + 1}-`;
  }

  // 后续十次操作
  beforeHttp(promise) {
    const promiseCB = this.promiseCB();
    promise
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(promiseCB)
      .then(() => {
        this.end();
      });
  }

  // 第一次 send 后的回调
  afterHttp() {
    const self = this;
    return function ([res, head]) {
      self.saveChange(head); // 第一次请求进行配置
      self.header.Range = self.nextSize();

      setTimeout(() => {
        self.first = false;
      });

      // 回调，如果返回false的就不进行下去了
      if (self.callback(res, head) === false) {
        return;
      }
      self.beforeHttp(self.send());
    };
  }

  // promise 的回调，因为逻辑基本相同
  promiseCB() {
    const self = this;
    let isContinue = true;
    return function (res) {
      self.saveBox.count++;
      !!res && self.callback(...res);

      // 取消 ajax 的继续执行
      if (self.cancell(self.saveBox.count) === false) {
        self.cancell = function () {};
        isContinue = false;
        return;
      }

      if (self.saveBox.count === 5 && isContinue !== false) {
        isContinue = self.half(...res);
      }

      if (self.saveBox.count < 11 && isContinue !== false) {
        return self.send();
      } else {
        self.saveBox.end = true;
      }
    };
  }

  procent(now) {
    return (((this.saveBox.already + now) / this.saveBox.total) * 100).toFixed(
      0
    );
  }
}
