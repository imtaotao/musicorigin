window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame;

// 操作部分
export default class Slide {
  constructor(option, imgArr) {
    if (!imgArr || imgArr.length < 2) return;
    (this.index = 0),
      (this.animate = []),
      (this.totalImg = []),
      (this.randomStr = null);
    this.toggle = false;
    this.imgArr = imgArr;
    this.option = option;
    this.defaultUrl = option.defaultUrl || imgArr[1];
    option.mount = option.mount || 5;
    option.mode = option.mode || 'circle';

    this.createImgDOM().then((_) => this.defaultImg((_) => this.move()));
  }

  // 利用闭包为每次的动画增加一个随机戳
  transition(randomStr) {
    return (img) => {
      if (!img) return;
      const { animate, imgArr, index } = this;
      const { dom, mount, change, swap, speed } = this.option;

      // 选择模式
      if (swap) {
        this.toggle = !this.toggle;
        this.toggle
          ? (this.option.mode = 'circle')
          : (this.option.mode = 'rect');
      }

      // 根据模式选择不同的时间
      const mode = this.option.mode;
      const time = this.option.time || 0;
      const t = mode === 'circle' ? 0 : 150;

      this.removeCanvas(dom, animate[animate.length - 1]).then((_) => {
        this.animate = [];
        for (let i = 0; i < mount - 1; i++) {
          setTimeout(() => {
            if (randomStr !== this.randomStr) return;
            this.animate.push(
              new banner(dom, { img, mode, mount, speed, index: i + 1 }),
            );
          }, t * i);
        }

        // 最后一个传入回调
        setTimeout(() => {
          if (randomStr !== this.randomStr) return;
          this.animate.push(
            new banner(
              dom,
              {
                img,
                mode,
                mount,
                speed,
                index: mount,
              },
              (dom) => {
                this.index++;
                if (this.index > imgArr.length - 1) this.index = 0;
                if (this.over() === false) return;

                setTimeout((_) => {
                  if (
                    randomStr !== this.randomStr ||
                    !this.middleware.isanimate
                  )
                    return;
                  this.move();
                }, time);
              },
            ),
          );
        }, t * mount);
      });
    };
  }

  stop() {
    this.middleware.isanimate = false;
    this.animate.forEach((val) => {
      cancelAnimationFrame(this.getAnimete(val));
    });
  }

  defaultImg(callback) {
    const url = this.defaultUrl;
    const img = this.createImg(url);
    const canvas = this.createCanvas(this.option.dom);
    const ctx = canvas.getContext('2d');
    img.onload = (_) => {
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      callback && callback();
    };
  }

  createImgDOM() {
    return new Promise((resolve, reject) => {
      const imgArr = this.imgArr;
      const single = 100;
      const all = single * imgArr.length;
      let progress = 0;

      imgArr.forEach((url) => {
        const img = this.createImg(url);
        this.totalImg.push(img);
        img.onload = (_) => {
          progress += single;
          progress === all && resolve();
        };
      });
    });
  }

  move() {
    if (this.totalImg.length === 0 || this.start() === false) return;
    this.middleware.isanimate = true;
    const randomStr =
      (this.randomStr =
      this.middleware.randomStr =
        Date.now() + this.random(9999999) + this.random(9999999));
    this.transition(randomStr)(this.totalImg[this.index]);
  }

  // 继续
  continue() {
    const animate = this.animate;
    if (animate.length === 0) return;

    const { mode } = this.option;
    this.middleware.isanimate = true;
    animate.forEach((val) => {
      val[`${mode}Move`]();
    });
  }

  // 上一张
  preImg() {
    this.stop();
    this.index--;
    if (this.index < 0) this.index = this.totalImg.length - 1;
    this.move();
  }

  // 下一张
  nextImg() {
    this.stop();
    this.index++;
    if (this.index > this.totalImg.length - 1) this.index = 0;
    this.move();
  }

  getIndex() {
    return this.index;
  }

  specify(num) {
    if (num > this.totalImg.length - 1 || num < 0) return;
    this.stop();
    this.index = num;
    this.move();
  }

  // 每次动画开始和完成后的钩子，return  false 可以终止动画
  start() {}
  over() {}
  // 点击当前播放的canvas的时候
  click() {}

  // 工具方法
  createImg(url) {
    const img = new Image();
    img.src = url;
    return img;
  }

  random(max) {
    return parseInt(Math.random() * (max + 1));
  }

  createCanvas(dom) {
    const canvas = document.createElement('canvas');
    dom.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', (e) => {
      this.click(this.option.img.src, e);
    });
    return canvas;
  }

  getAnimete(banner) {
    return banner.requestAnimationFrame;
  }

  removeCanvas(dom, banner) {
    return new Promise((resolve, reject) => {
      const canvas = dom.querySelectorAll('canvas');
      canvas.forEach((val, i) => {
        i < canvas.length - 1 && dom.removeChild(val);
      });
      if (banner) {
        const { img, width, height, ctx } = banner.option;
        ctx.drawImage(img, 0, 0, width, height);
      }

      resolve();
    });
  }

  // 不能定义属性， mmp 用方法代替
  middleware() {}
}

class banner extends Slide {
  constructor(dom, option, callback) {
    super();
    if (!option || typeof option !== 'object' || !option.img) return;
    const canvas = this.createCanvas(dom);
    const width = (option.width = canvas.offsetWidth);
    const height = (option.height = canvas.offsetHeight);
    option.direct = width > height ? width : height;
    option.speed = option.speed || option.direct / 200;
    this.dom = dom;
    this.callback = callback;
    this.ctx = option.ctx = canvas.getContext('2d');
    this.option = option;
    this.requestAnimationFrame = null;
    this.init();
  }

  init() {
    const { width, height, ctx, mode, next, img } = this.option;
    ctx.drawImage(img, 0, 0, width, height);
    this[`${mode}Draw`]();
    this.position();
  }

  position() {
    const { width, height, mode, mount, index, direct } = this.option;
    if (mode === 'circle') {
      this.option.x = this.random(width);
      this.option.y = this.random(height);
      this.option.raduis = 0;
    }
    if (mode === 'rect') {
      const singleBar = (this.option.singleBar = direct / mount);
      this.option.x = singleBar * (index - 1);
      this.option.add = 0;
    }
  }

  // 绘制圆形
  circleDraw() {
    const { width, height, ctx, img, x, y, raduis } = this.option;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, raduis, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
    this.circleMove();
  }

  circleMove() {
    let isanimate = this.middleware.isanimate;
    let { raduis, direct, speed } = this.option;
    this.requestAnimationFrame = requestAnimationFrame((_) => {
      if (!isanimate) return;
      const distance = direct / 400;
      if (raduis > direct / (distance > 1 ? distance : 1)) {
        !!this.callback && this.callback(this.dom);
        return;
      }

      this.option.raduis += speed / 2;
      this.circleDraw();
    });
  }

  // 绘制方形
  rectDraw() {
    const { width, height, ctx, img, x, add, singleBar, speed } = this.option;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, 0, singleBar + 1, add);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
    this.rectMove();
  }

  rectMove() {
    let { add, direct, width, height, speed } = this.option;
    let isanimate = this.middleware.isanimate;

    this.requestAnimationFrame = requestAnimationFrame((_) => {
      if (!isanimate) return;
      if (add > height) {
        !!this.callback && this.callback(this.dom);
        return;
      }
      this.option.add += speed;
      this.rectDraw();
    });
  }
}
