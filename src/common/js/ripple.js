// 实例
class ripplesMove {
  constructor(dom, event, color) {
    this.dom = dom;
    this.event = event;
    this.color = color;
    this.param = {};
  }

  move() {
    let { dom, event } = this;
    const canvas = this.createCanvas(dom);
    const opacity = 1;
    const color = this.color;
    const ctx = canvas.getContext("2d");
    const radius = 0;
    const centerX = event.offsetX;
    const centerY = event.offsetY;
    const compute = getComputedStyle(canvas);
    const height = parseInt(compute.height);
    const width = parseInt(compute.width);
    const distance = width > height ? width : height;
    const singleMove = distance / 25; // 25 * 17 ms
    const diminished = opacity / 25;
    this.param = {
      ctx,
      canvas,
      radius,
      centerX,
      centerY,
      singleMove,
      opacity,
      color,
      diminished,
      width,
      height,
      distance,
    };
    this.draw();
  }

  draw() {
    const {
      ctx,
      canvas,
      height,
      width,
      radius,
      centerX,
      singleMove,
      centerY,
      opacity,
      color,
      distance,
      diminished,
    } = this.param;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.globalAlpha = Number(opacity.toFixed(5));
    ctx.fillStyle = color;
    ctx.fill();

    this.param.opacity -= diminished;
    this.param.opacity < 0 && (this.param.opacity = 0);
    this.param.radius += singleMove;
    radius < distance
      ? requestAnimationFrame(this.draw.bind(this))
      : canvas.parentElement.removeChild(canvas);
  }

  createCanvas(dom) {
    const canvas = document.createElement("canvas");
    dom.appendChild(canvas);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.position = "absolute";
    canvas.style.left = 0;
    canvas.style.top = 0;
    return canvas;
  }
}

// 初始化操作
export default class ripples {
  constructor(scope, color) {
    if (this.typeOf(scope) === "[object String]") {
      scope = document.querySelector(scope);
    } else if (
      this.typeOf(scope) !== "[object HTMLElement]" &&
      this.typeOf(scope) !== "[object HTMLLIElement]" &&
      this.typeOf(scope) !== "[object HTMLSpanElement]" &&
      scope !== document
    )
      return;
    this.scope = scope;
    this.color = color;
  }

  init() {
    const color = this.color || "rgba(255,255,255,.3)";
    const clickCb = (this.CB = this.press());
    this.scope.addEventListener("click", clickCb, false);
  }

  remove() {
    this.scope.removeEventListener("click", this.CB, false);
  }

  press() {
    const self = this;
    return function (e) {
      const color = self.color;
      let target = e.target;
      if (target.nodeName === "CANVAS") {
        target = target.parentElement;
      }
      self.position(target);
      const instance = new ripplesMove(target, e, color);
      instance.move();
    };
  }

  position(dom) {
    const position = getComputedStyle(dom).position;
    if (position === "static") {
      dom.style.position = "relative";
    }
  }

  typeOf(val) {
    return Object.prototype.toString.call(val);
  }
}

(function requestAnimFrame() {
  return (
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
