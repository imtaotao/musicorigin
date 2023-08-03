(function (window) {
  // =====================================第一部分（矩阵操作）======================================= //
  var matrix3d = {
    // 工具函数，拼接成matrix3d字符串
    mtxSplice: function (arr) {
      var newMatrix = 'matrix3d(';

      arr.forEach(function (val, i) {
        newMatrix += i != arr.length - 1 ? val + ',' : val;
      });

      return (newMatrix += ')');
    },
    translate3d: function (matrix, x, y, z) {
      var c12 =
          x * matrix[0] + y * matrix[4] + z * matrix[8] + Number(matrix[12]),
        c13 =
          x * matrix[1] + y * matrix[5] + z * matrix[9] + Number(matrix[13]),
        c14 =
          x * matrix[2] + y * matrix[6] + z * matrix[10] + Number(matrix[14]),
        c15 =
          x * matrix[3] + y * matrix[7] + z * matrix[11] + Number(matrix[15]),
        arr = [
          matrix[0],
          matrix[1],
          matrix[2],
          matrix[3],
          matrix[4],
          matrix[5],
          matrix[6],
          matrix[7],
          matrix[8],
          matrix[9],
          matrix[10],
          matrix[11],
          c12,
          c13,
          c14,
          c15,
        ];

      return arr;
    },
    translateX: function (matrix, x) {
      return this.translate3d(matrix, x, 0, 0);
    },
    translateY: function (matrix, y) {
      return this.translate3d(matrix, 0, y, 0);
    },
    translateZ: function (matrix, z) {
      return this.translate3d(matrix, 0, 0, z);
    },
    translate: function (matrix, x, y) {
      return this.translate3d(matrix, x, y, 0);
    },

    // scale
    scale3d: function (matrix, x, y, z) {
      // 计算
      var s0 = matrix[0] * x,
        s4 = matrix[4] * y,
        s8 = matrix[8] * z,
        s1 = matrix[1] * x,
        s5 = matrix[5] * y,
        s9 = matrix[9] * z,
        s2 = matrix[2] * x,
        s6 = matrix[6] * y,
        s10 = matrix[10] * z,
        s3 = matrix[3] * x,
        s7 = matrix[7] * y,
        s11 = matrix[11] * z,
        arr = [
          s0,
          s1,
          s2,
          s3,
          s4,
          s5,
          s6,
          s7,
          s8,
          s9,
          s10,
          s11,
          matrix[12],
          matrix[13],
          matrix[14],
          matrix[15],
        ];
      return arr;
    },
    scaleX: function (matrix, x) {
      return this.scale3d(matrix, x, 1, 1);
    },
    scaleY: function (matrix, y) {
      return this.scale3d(matrix, 1, y, 1);
    },
    scaleZ: function (matrix, z) {
      return this.scale3d(matrix, 1, 1, z);
    },
    scale: function (matrix, x, y) {
      return this.scale3d(matrix, x, y, 1);
    },

    // rotate
    rotate3d: function (matrix, x, y, z, deg) {
      var agl = (Math.PI * deg) / 180,
        numSqrt = Math.sqrt(x * x + y * y + z * z),
        ux = x / numSqrt,
        uy = y / numSqrt,
        uz = z / numSqrt;

      // 计算
      var r0 = ux * ux * (1 - Math.cos(agl)) + Math.cos(agl),
        r1 = ux * uy * (1 - Math.cos(agl)) + uz * Math.sin(agl),
        r2 = ux * uz * (1 - Math.cos(agl)) - uy * Math.sin(agl),
        r4 = ux * uy * (1 - Math.cos(agl)) - uz * Math.sin(agl),
        r5 = uy * uy * (1 - Math.cos(agl)) + Math.cos(agl),
        r6 = uz * uy * (1 - Math.cos(agl)) + ux * Math.sin(agl),
        r8 = ux * uz * (1 - Math.cos(agl)) + uy * Math.sin(agl),
        r9 = uy * uz * (1 - Math.cos(agl)) - ux * Math.sin(agl),
        r10 = uz * uz * (1 - Math.cos(agl)) + Math.cos(agl);

      var d0 = matrix[0] * r0 + matrix[4] * r1 + matrix[8] * r2,
        d1 = matrix[1] * r0 + matrix[5] * r1 + matrix[9] * r2,
        d2 = matrix[2] * r0 + matrix[6] * r1 + matrix[10] * r2,
        d3 = matrix[3] * r0 + matrix[7] * r1 + matrix[11] * r2,
        d4 = matrix[0] * r4 + matrix[4] * r5 + matrix[8] * r6,
        d5 = matrix[1] * r4 + matrix[5] * r5 + matrix[9] * r6,
        d6 = matrix[2] * r4 + matrix[6] * r5 + matrix[10] * r6,
        d7 = matrix[3] * r4 + matrix[7] * r5 + matrix[11] * r6,
        d8 = matrix[0] * r8 + matrix[4] * r9 + matrix[8] * r10,
        d9 = matrix[1] * r8 + matrix[5] * r9 + matrix[9] * r10,
        d10 = matrix[2] * r8 + matrix[6] * r9 + matrix[10] * r10,
        d11 = matrix[3] * r8 + matrix[7] * r9 + matrix[11] * r10,
        arr = [
          d0,
          d1,
          d2,
          d3,
          d4,
          d5,
          d6,
          d7,
          d8,
          d9,
          d10,
          d11,
          matrix[12],
          matrix[13],
          matrix[14],
          matrix[15],
        ];

      return arr;
    },
    rotateX: function (matrix, deg) {
      return this.rotate3d(matrix, 1, 0, 0, deg);
    },
    rotateY: function (matrix, deg) {
      return this.rotate3d(matrix, 0, 1, 0, deg);
    },
    rotateZ: function (matrix, deg) {
      return this.rotate3d(matrix, 0, 0, 1, deg);
    },
    rotate: function (matrix, deg) {
      return this.rotate3d(matrix, 0, 0, 1, deg);
    },

    // skew
    skew: function (matrix, x, y) {
      var xtan = Math.tan((Math.PI * x) / 180),
        ytan = Math.tan((Math.PI * y) / 180);

      var f0 = Number(matrix[0]) + matrix[4] * ytan,
        f1 = Number(matrix[1]) + matrix[5] * ytan,
        f2 = Number(matrix[2]) + matrix[6] * ytan,
        f3 = Number(matrix[3]) + matrix[7] * ytan,
        f4 = matrix[0] * xtan + Number(matrix[4]),
        f5 = matrix[1] * xtan + Number(matrix[5]),
        f6 = matrix[2] * xtan + Number(matrix[6]),
        f7 = matrix[3] * xtan + Number(matrix[7]),
        arr = [
          f0,
          f1,
          f2,
          f3,
          f4,
          f5,
          f6,
          f7,
          matrix[8],
          matrix[9],
          matrix[10],
          matrix[11],
          matrix[12],
          matrix[13],
          matrix[14],
          matrix[15],
        ];

      return arr;
    },
    skewX: function (matrix, x) {
      return this.skew(matrix, x, 0);
    },
    skewY: function (matrix, y) {
      return this.skew(matrix, 0, y);
    },
  };

  // =====================================第二部分（动画操作）======================================= //

  // 获取时间（生成时间后清空）
  /* ---------------------------------------------------------------------------------------------- */
  function createFxNow() {
    setTimeout(function () {
      Animate.fxNow = undefined;
    });
    return (Animate.fxNow = Date.now());
  }

  // 缓动对象，用于封装每个单独属性的动作
  /* ---------------------------------------------------------------------------------------------- */
  function tweens(val, key, option) {
    this.elem = option.elem; // 元素
    this.transform = option.prop.transform; // transform属性集合
    this.key = key; // 属性名
    this.end = val; // 最终的目标属性值
    this.start = this.now = this.get(); // 目标的开始值
  }

  tweens.prototype = {
    get: function () {
      // 先得到这个元素的所有样式
      var computed = this.getStyles(this.elem),
        endProp;

      // 得到具体的样式
      endProp = computed.getPropertyValue(this.key) || computed[this.key];

      if (!endProp) return;
      // 判断是否是颜色（拿到的值会自动转化为rgb小写）
      if (endProp.includes('rgb')) return this.colorRgba(endProp);

      return this.isNum(parseInt(endProp))
        ? parseInt(endProp)
        : this.getTransform(endProp);
    },

    run: function (percent) {
      // 总距离 * 百分比 + 开始的距离 = 元素应该在的位置
      // 如果start是个数组的话，就代表获取到的是矩阵或者颜色
      if (!this.start && this.start != 0) return;
      if (!this.start.length) {
        this.now = (this.end - this.start) * this.swing(percent) + this.start;

        //动态改变元素css属性值
        this.elem.style[this.key] =
          this.key === ('opacity' || 'zIndex') ? this.now : this.now + 'px';
      } else if (this.start.length > 4) {
        // transfrom的情况
        var result = this.changeProp(this.transform, percent),
          matrix = this.getEnd(this.start, result);

        this.elem.style[this.key] = matrix3d.mtxSplice(matrix);
      } else {
        // 颜色的情况

        // 判断传入的是数组还是颜色值
        if (!this.isArr(this.end)) {
          var end = this.colorRgba(this.end);
        } else {
          var end = this.colorRgba(this.end[0], this.end[1]);
        }

        var colorList = this.changeColor(this.start, end, percent),
          now = 'rgba(' + colorList.join(',') + ')';

        this.elem.style[this.key] = now;
      }

      return this;
    },

    // 随时间变化改变的属性值，用来获取颜色值
    changeColor: function (start, end, percent) {
      for (var i = 0, colorList = []; i < start.length; i++) {
        colorList[i] = (end[i] - start[i]) * this.swing(percent) + start[i];

        // 取整，rgb不能有小数
        if (i != start.length - 1) {
          colorList[i] = Math.floor(colorList[i]);
        }
      }

      return colorList;
    },

    // 随时间变化改变的属性值，用来获取矩阵值
    changeProp: function (prop, percent) {
      // 循环属性值，拿当前值乘以百分比，再回原

      // 先深拷贝prop
      var copy = JSON.parse(JSON.stringify(prop));

      for (var k in prop) {
        // 分别判断四种情况

        // 如果不是数组
        if (!this.isArr(prop[k])) {
          // 如果是scale，就是另外一种处理
          if (!!k.includes('scale')) {
            copy[k] = (prop[k] - 1) * this.swing(percent) + 1;
          } else {
            copy[k] = prop[k] * this.swing(percent);
          }
        }

        // 如果length为2
        // 用 apply 和 ...[] 都可以，暂时不想改了
        else if (prop[k].length == 2) {
          if (!!k.includes('scale')) {
            copy[k][0] = (prop[k][0] - 1) * this.swing(percent) + 1;
            copy[k][1] = (prop[k][1] - 1) * this.swing(percent) + 1;
          } else {
            copy[k][0] = prop[k][0] * this.swing(percent);
            copy[k][1] = prop[k][1] * this.swing(percent);
          }
        }

        // 如果length为3
        else if (prop[k].length == 3) {
          if (!!k.includes('scale')) {
            copy[k][0] = (prop[k][0] - 1) * this.swing(percent) + 1;
            copy[k][1] = (prop[k][1] - 1) * this.swing(percent) + 1;
            copy[k][2] = (prop[k][2] - 1) * this.swing(percent) + 1;
          } else {
            copy[k][0] = prop[k][0] * this.swing(percent);
            copy[k][1] = prop[k][1] * this.swing(percent);
            copy[k][2] = prop[k][2] * this.swing(percent);
          }
        }

        // 如果length为4（只有rotate3d才有四个值的情况）
        else if (prop[k].length == 4) {
          // 前三条是轴（不用动态改变），第四条才是值
          copy[k][3] = prop[k][3] * this.swing(percent);
        }
      }

      return copy;
    },

    // 获取元素样式
    getStyles: function (elem) {
      return elem.currentStyle ? elem.currentStyle : getComputedStyle(elem);
    },

    // * t:当前时间 b:初始位置 c: 结束位置 d:运动时间
    easeOut: function (t, b, c, d, a, p) {
      let s;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (typeof p == 'undefined') p = d * 0.3;
      if (!a || a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a);
      }
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      );
    },

    // 动画公式
    swing: function (percent) {
      return 0.5 - Math.cos(percent * Math.PI) / 2;
    },

    // 截取成数组
    getTransform: function (transform) {
      if (!transform) {
        console.warn('transform is not defined');
        return;
      }

      var matrix = transform,
        dimension = 'matrix(';

      matrix === 'none' &&
        (matrix = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
      matrix.indexOf('3d') > -1 && (dimension = 'matrix3d(');
      matrix = matrix.replace(dimension, '').replace(')', '').split(',');

      // 2d和3d的兼容处理
      if (matrix.length < 7) {
        matrix = [
          matrix[0],
          matrix[1],
          0,
          0,
          matrix[2],
          matrix[3],
          0,
          0,
          0,
          0,
          1,
          0,
          matrix[4],
          matrix[5],
          0,
          1,
        ];
      }
      return matrix;
    },

    isArr: function (val) {
      return Object.prototype.toString.call(val) === '[object Array]';
    },
    isNum: function (val) {
      return (
        Object.prototype.toString.call(val) === '[object Number]' && !isNaN(val)
      );
    },

    // 获取最终的矩阵值
    getEnd: function (start, end) {
      var pre = start,
        min = Math.pow(10, -323);

      // for( var k in end ) {
      // 	if( !this.isArr( end[k] ) ) {
      // 		pre = matrix3d[k]( pre, end[k] );
      // 	}else if( end[k].length == 2 ) {
      // 		pre = matrix3d[k]( pre, end[k][0], end[k][1] );
      // 	}else if( end[k].length == 3 ) {
      // 		pre = matrix3d[k]( pre, end[k][0], end[k][1], end[k][2] );
      // 	}else if( end[k].length == 4 ) {
      // 		pre = matrix3d[k]( pre, end[k][0], end[k][1], end[k][2], end[k][3] );
      // 	}
      // };

      for (var k in end) {
        if (!this.isArr(end[k])) {
          pre = matrix3d[k](pre, end[k]);
        } else {
          pre = matrix3d[k](pre, ...end[k]);
        }
      }

      // 解决视图不准的bug，0 == '0'，所以不需要转化为数字
      for (var i = 0; i < pre.length; i++) {
        if (pre[i] == 0) pre[i] += min;
      }

      return pre;
    },

    // 16进制颜色与rgba之间的转化
    colorRgba: function (val, opacity = 1) {
      opacity > 1 && (opacity = 1);
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

      // 全部转小写
      var color = val.toLowerCase();

      // 存在color且格式是16进制的
      if (color && reg.test(color)) {
        // 先转化为六位的颜色值
        if (color.length === 4) {
          var colorNew = '#';
          for (var i = 1; i < 4; i++) {
            colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
          }
          color = colorNew;
        }

        //处理六位的颜色值（'0x'代表的就是十六进制）
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
          colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
        }

        colorChange.push(opacity);
        return colorChange;
      }

      if (color.includes('rgb')) {
        var prefix = color.includes('rgba') ? 'rgba(' : 'rgb(';
        color = color.replace(prefix, '').replace(')', '').split(',');

        for (var i = 0; i < color.length; i++) {
          color[i] = Number(color[i]);
        }
        color.length == 3 && (color[3] = opacity);
        return color;
      }
    },
  };

  // 动画的主体函数
  /* ---------------------------------------------------------------------------------------------- */
  var Animate = function (elem, prop, time, callback, nextFun) {
    // 把动画结束后应该调用的俩函数存起来
    elem.callback = callback;
    elem.nextFun = nextFun;
    elem.optionProp = prop;
    !elem.timers && (elem.timers = []);

    var filterProp = Animate.filter(prop);

    // 先把参数存起来
    elem.animateOption = {
      elem: elem,
      prop: filterProp,
      originalTime: time,
      time: time,
      startTime: Animate.fxNow || createFxNow(), //动画开始时间
      tweens: [], //存放每个属性的缓动对象，用于动画
    };

    // 如果没有传入属性，就延迟，再返回（用于delay接口）
    if (Object.keys(prop).length == 0) {
      setTimeout(function () {
        nextFun();
      }, time);
      return;
    }

    // 看看传了几个prop
    for (var key in filterProp) {
      // 只有存在而且包含0，所以要用全等
      if (!!filterProp[key] || filterProp[key] === 0) {
        elem.animateOption.tweens.push(
          new tweens(filterProp[key], key, elem.animateOption),
        );
      }
    }

    // tick 函数，动起来的逻辑
    var tick = function () {
      var currentTime = Animate.fxNow || createFxNow(),
        // 保证剩余的时间不会小于0
        remaining = Math.max(
          0,
          elem.animateOption.startTime + elem.animateOption.time - currentTime,
        ),
        temp = remaining / elem.animateOption.time || 0,
        percent = 1 - temp;

      // 我们要遍历了，让每个属性都动起来，调用他们的缓动对象的run方法，go,go,go ~~
      elem.animateOption.tweens.forEach(function (val) {
        val.run(percent);
      });

      // 我们判断停止还继续，来吧
      if (percent < 1 && !!elem.animateOption.tweens.length) {
        return remaining;
      } else {
        return false;
      }
    };
    animateRun.timer.call(elem, tick);
  };

  // 过滤传输的属性对象
  Animate.filter = function (prop) {
    // 先深拷贝prop
    var copy = JSON.parse(JSON.stringify(prop));

    copy.transform = {};

    for (var key in copy) {
      if (
        key.includes('rotate') ||
        key.includes('scale') ||
        key.includes('translate') ||
        key.includes('skew')
      ) {
        // 先拷贝过来
        copy.transform[key] = copy[key];
        // 删除原有的transform属性
        delete copy[key];
      }
    }

    if (Object.keys(copy.transform).length == 0) delete copy.transform;

    return copy;
  };

  // 动画执行自用方法
  /* ---------------------------------------------------------------------------------------------- */
  var animateRun = {
    timer: function (tickFun) {
      // 先入栈
      this.timers.push(tickFun);

      // 如果没有返回false就start，否则就出栈
      !!tickFun() ? animateRun.start.call(this) : this.timers.pop(tickFun);
    },

    start: function () {
      // 通过requestAnimationFrame来进行动画
      var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;

      this.timerId = requestAnimationFrame(animateRun.monitor.bind(this));
    },

    stop: function () {
      var elem = this,
        cancelAnimationFrame =
          window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame;

      cancelAnimationFrame(elem.timerId);
      elem.timerId = null;

      if (!!elem.query && elem.query.length == 0) {
        elem.query = null;
      }

      // 动画结束后调用的函数
      if (!!elem.callback) {
        elem.callback.call(elem, elem.nextFun);
        elem.callback = null;
      }

      !!elem.nextFun ? elem.nextFun() : (elem.query = null);
    },

    // 循环监测
    monitor: function () {
      var timers = this.timers;

      // 这里的val就是Animate里面的tick函数
      timers.forEach(function (val, i) {
        // 如果返回false或者返回0的时候就代表结束了
        !val() && timers.splice(i--, 1);
      });

      // 动画结束与否
      if (!timers.length) {
        animateRun.stop.call(this);
        timers = undefined;
      } else {
        animateRun.start.call(this);
      }

      Animate.fxNow = undefined;
    },
  };

  // =====================================第三部分（动画队列操作）======================================= //

  // 动画出栈调用主体方法
  /* ---------------------------------------------------------------------------------------------- */
  animate.fire = function (elem) {
    // 启动
    // 动画锁的作用是当前动画正在执行的时候，不可能让你下一个动画执行
    if (!elem.fireing) {
      // 动画函数出栈，并且拿到它
      var firstFun = !!elem.query && elem.query.shift();

      if (!!firstFun) {
        // 加上动画锁吧，当前的动画要执行了，不允许后来者的打扰
        elem.fireing = true;

        // 动画开始的时候把这个后来者当成参数传入进去，总得给后来者一条路吧
        firstFun(function () {
          elem.fireing = false; // 解开动画锁，不然路就被堵死了
          animate.fire(elem);
        });
      }
    }
  };

  // 入栈操作，对外接口
  /* ---------------------------------------------------------------------------------------------- */

  function animate(option, time, callback) {
    var elem = this;
    // 先入栈
    if (!elem.query) {
      elem.query = []; // 动画队列
      elem.fireing = false; // 动画锁
      elem.query.push(function (nextFun) {
        // 在这里这个函数根本不会调用！！！
        Animate(elem, option, time, callback, nextFun);
      });
      animate.fire(elem);
    } else {
      elem.query.push(function (nextFun) {
        Animate(elem, option, time, callback, nextFun);
      });
    }
    return elem;
  }

  // =====================================对外接口======================================================= //
  // 停止当前动画
  /* ---------------------------------------------------------------------------------------------- */
  HTMLElement.prototype.stop = function () {
    var elem = this,
      cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame;
    cancelAnimationFrame(elem.timerId);
    elem.timerId = null;

    // 清空队列和回调
    elem.query = null;
    elem.callback = null;

    // 重置时间
    Animate.fxNow = undefined;

    return this;
  };

  // 清除动画队列
  /* ---------------------------------------------------------------------------------------------- */

  HTMLElement.prototype.clearAnimate = function () {
    this.query = undefined;
    return this;
  };

  // 延迟动画
  /* ---------------------------------------------------------------------------------------------- */

  HTMLElement.prototype.delay = function (time) {
    this.animate({}, time);
    return this;
  };

  HTMLElement.prototype.animate = animate;
})(window);
