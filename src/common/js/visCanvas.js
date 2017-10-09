import {util} from './util.js'

CanvasRenderingContext2D.prototype.roundRect = function (x , y , w , h , r) {
	(w < 2 * r) && (r = w / 2)
    (h < 2 * r) && (r = h / 2)
    this.beginPath();
    this.moveTo(x+r, y)
    this.arcTo(x+w , y , x+w , y+h , r)   //右上
    this.arcTo(x+w , y+h , x , y+h , r)   //右下
    this.arcTo(x, y+h, x , y , r)         //左下
    this.arcTo(x , y , x+w , y , r)       //左上

    this.closePath()
    return this
}

// 画圆
const allwidth  = 900,
      allheight = 450,
      color     = ['#3974d5', '#a1f1a3'],
      coluColor = ['#77f97b', '#419ff1']

class cicle {
	constructor(canvas, time) {
		if (!canvas) return
		this.canvas  = canvas
		this.x       = 200
		this.y       = 200
		this.radius  = 50
		this.opacity = 0.5
		this.count   = 0
		this.time    = time
		this.ctx     = canvas.getContext('2d')
		this.t       = null
		this.init()
	}

	init () {
		this.ctx.clearRect(0, 0, 900, 450)
		this.font()
		// this.drawCicle(20, 0.1)
		for (let i = 0; i < 3; i++) {
			this.drawCicle(155 + 5 * i, 0.15 - 0.05 * i)
			this.drawCicle(this.radius + 35 * i, this.opacity - 0.117 * i)
		}
		this.animate()
	}

	drawCicle (radius, opc) {
		const {ctx, x, y} = this

		ctx.beginPath()
		ctx.arc(x, y, radius, 0, 2 * Math.PI)
		const opacity = opc ? opc : this.opacity
		ctx.strokeStyle = `rgba(57, 116, 213,${opacity})`
		ctx.lineWidth   = 3
		ctx.stroke()
	}

	font () {
		const {ctx, x, y, time} = this

		ctx.fillStyle    = "#a1f1a3"
		ctx.font         = "normal 25px 微软雅黑"
		ctx.textBaseline = "middle"
		ctx.textAlign    = "center"
		ctx.fillText(time(), x, y)
	}

	animate () {
		this.radius++
		this.count++
		this.opacity -= 0.00333
		this.t = setTimeout(_ => {
			if (this.count >= 35) {
				this.radius  = 50
				this.opacity = 0.5
				this.count   = 0
			}
			this.init()
		}, 30)
	}

	clearAnimate () {
		if (!this.t) return
		clearTimeout(this.t)
		this.t = null
	}
}


// 画圆形可视化区域
class visCicle {
	constructor (canvas, num = 32, data) {
		if (!canvas) return
		this.canvas   = canvas
		this.x        = 200
		this.y        = 200
		this.data     = data || function () {return []}
		this.num      = num
		this.radius   = 50
		this.ctx      = canvas.getContext('2d')
		this.angle    = Math.PI / (num / 2)
		this.t        = null
		this.init()
	}

	init () {
		const conf = {
			x         : this.x,
			y         : this.y,
			num       : this.num,
		    r         : this.radius,
		    width     : 2,
		    color     : color
		}
		this.ctx.clearRect(0, 0, 900, 450)
		this.sym = - this.sym
		this.draw(this.ctx, conf, this.data())
		this.t = requestAnimationFrame(_ => {
			this.init(this.ctx, conf, this.data())
		})
	}

	// 绘制锯齿状图
	draw (ctx, conf, data = []){
		if (!conf) return
		const {x, y, num, r, color} = conf
	    const width = conf && conf.width || 1

	    //开始路径
	    ctx.beginPath()
	    const startX = x + r * Math.cos(2 * Math.PI* 0 / num)
	    const startY = y + r * Math.sin(2 * Math.PI* 0 / num)

	     // 阴影
		ctx.shadowColor = coluColor[0]
		ctx.shadowBlur  = 100

	    ctx.moveTo(startX, startY)

	    for (let i = 0; i < num; i++) {
	    	const nowData  = data[i + 5] || 0
	    	// 高潮部分要加强
	    	const multiple = nowData > 350 ? 
	    					 5  : nowData > 230 ?
	    	                 10  : nowData > 100 ? 
	    	                 13 : 17

	    	const dis   = (i % 2 ? nowData / multiple : -(nowData / multiple))
	    	const disX  = dis * Math.cos(2 * Math.PI * i / num)
	    	const disY  = dis * Math.sin(2 * Math.PI * i / num)

	        const newX  = x + r * Math.cos(2 * Math.PI * i / num) + disX
	        const newY  = y + r * Math.sin(2 * Math.PI * i / num) + disY
	        ctx.lineTo(newX, newY)
	    }
	    ctx.closePath()

	    //路径闭合
	    if (util.isArr(color)) {
	    	if (color.length > 1) {
		    	const grad = ctx.createLinearGradient(100, 100, 100, 300)
				grad.addColorStop(0, color[0])
				grad.addColorStop(1, color[1])
				ctx.strokeStyle = grad
			} else {
				ctx.strokeStyle = color[1]
			}
	    } else {
	    	ctx.strokeStyle = color
	    }
	     
        ctx.lineWidth = width
        ctx.lineJoin = 'round'
        ctx.stroke()
	}

	clearAnimate () {
		if (!this.t) return
		cancelAnimationFrame(this.t)
		this.t = null
	}
}


// 上柱状图
class topColumnar {
	constructor (canvas, num = 32, data) {
		if (!canvas) return
		this.canvas   = canvas
		this.x        = 200
		this.y        = 200
		this.data     = data || function () {return []}
		this.num      = num
		this.ctx      = canvas.getContext('2d')
		this.t        = null
		this.init()
	}

	init () {
		this.ctx.clearRect(0, 0, 900, 450)
		const data = this.data()
		for (let i = 0; i < this.num; i++) {
			this.draw(this.ctx, data[i * 4] / 256 * this.y, i)
		}
		this.t = requestAnimationFrame(_ => this.init())
	}

	// 绘制单条数据
	draw (ctx, h, index) {
		if (!ctx || index == null) return
		(h < 5 || h == null || isNaN(h)) && (h = 5)
		h /= 1.5
		// 柱状图的宽度
		const x       = 300
		const y       = 180
		const singleW = 60
		const singleH = 20
		const num     = Math.floor(h / singleH)
		const lastH   = h % singleH


		//渐变颜色
		const grad = ctx.createLinearGradient(0, allheight, allwidth, allheight)
		grad.addColorStop(0 , coluColor[0])
		grad.addColorStop(1 , coluColor[1])
		ctx.fillStyle = grad

		// 阴影
		ctx.shadowColor = coluColor[0]
		ctx.shadowBlur  = 150
	
		// 画柱子
		for (let i = 0; i < num; i++) {
			ctx.roundRect(x + singleW * index, y - singleH * i, singleW * 0.5, singleH * 0.8, 3)
			.fill()
		}
		const lastY = y - singleH * num + (singleH * 0.8 - lastH)
		ctx.roundRect(x + singleW * index, lastY, singleW * 0.5, lastH, 2).fill()
	}

	clearAnimate () {
		if (!this.t) return
		cancelAnimationFrame(this.t)
		this.t = null
	}
}


// 下柱状图
class bottomColumnar {
	constructor (canvas, num, data) {
		if (!canvas) return
		this.canvas   = canvas
		this.x        = 200
		this.y        = 200
		this.data     = data || function () {return []}
		this.num      = num
		this.ctx      = canvas.getContext('2d')
		this.t        = null
		this.init()
	}

	init () {
		this.ctx.clearRect(0, 0, 900, 450)
		const data = this.data()
		for (let i = 0; i < this.num; i++) {
			this.draw(this.ctx, 12, data[i * 2], i)
		}
		this.t = requestAnimationFrame(_ => this.init())
	}

	draw (ctx, w, h, i) {
		if (!ctx || w == null || i == null) return
		(h < 20 || h == null) && (h = 20)
		const x = 300
		const y = 200
		const procent = h > 300 ? 
    				    0.7  : h > 230 ?
    	                0.55 : h > 100 ? 
    	                0.4  : 0.25

		//渐变颜色
		const grad = ctx.createLinearGradient(0, 0, 0, allheight)
		grad.addColorStop(0 , coluColor[0])
		grad.addColorStop(1 , coluColor[1])
		ctx.fillStyle = grad

		ctx.roundRect(x + w * i, y, w * 0.5, h * procent * 0.8, 3).fill()
	}

	clearAnimate () {
		if (!this.t) return
		cancelAnimationFrame(this.t)
		this.t = null
	}
}

// 线条承托
class setOff {
	constructor (canvas, canvasTwo) {
		if (!canvas || !canvasTwo) return
		this.canvas   = canvas
		this.x        = 250
		this.y        = 200
		this.ctx      = canvas.getContext('2d')
		this.ctxTwo   = canvasTwo.getContext('2d')
		this.init()
	}

	init () {
		const lineOne      = [[280, 70],  [470, 70]]
		const lineTwo      = [[330, 120], [550, 120], [620, 55], [850, 55]]
		const lineThree    = [[580, 90],  [635, 130], [700, 130]]
		const lineFour     = [[350, 220], [380, 220]]
		const lineFive     = [[380, 220], [650, 220]]
		const lineSix      = [[650, 220], [700, 220]]
		const lineSeven    = [[400, 220], [500, 165], [850, 165]]
		const lineEight    = [[425, 220], [530, 250], [620, 250]]
		const lineNine     = [[620, 250], [800, 250]]
		const lineTen      = [[310, 310], [820, 310]]
		const lineEleven   = [[335, 290], [400, 290]]
		const lineTwelve   = [[380, 310], [420, 270], [670, 270]]
		const lineThirteen = [[480, 310], [500, 290], [550, 290]]
		const lineFourteen = [[425, 310], [445, 330], [750, 330]]

		const arr     = [
			lineOne, lineTwo, lineThree, lineFour, lineSix,
			lineSeven, lineNine, lineTen, lineEleven, lineTwelve,
			lineThirteen, lineFourteen
		]
		const boldArr = [lineFive, lineEight]
		arr.forEach(val => this.oneLine(val))
		boldArr.forEach(val => this.oneLine(val, 4, 0.4))

		// 绘制圆圈
		const num          = 40
		const insertCicle  = this.position(num, 35)
		const outsideCicle = this.position(num, 85)

		insertCicle.forEach((insert, i) => {
			this.oneLine([insert, outsideCicle[i]], 3, 0.3, 3, this.ctxTwo)
		})
	}

	// 画一整条线
	oneLine (data, width, opacity, cicleWidth, ctx, style) {
		if (!data || data.length < 2) return
		for (let i = 0; i < data.length - 1; i ++) {
			this.drawLine(
				data[i][0], data[i][1], data[i + 1][0], data[i + 1][1], 
				width, opacity, cicleWidth, ctx, style
			)
		}
	}

	// 单条线
	drawLine (
		startX, startY, endX, endY, 
		width = 2, opacity = 0.2, cicleWidth = 5, ctx, style = color[0]
	) {
		!ctx && ({ctx} = this)
		console.log(ctx, style)
		ctx.beginPath()
		ctx.moveTo(startX, startY)
		ctx.lineTo(endX, endY)
		
		ctx.strokeStyle = style
		ctx.globalAlpha = opacity

		// 样式
		ctx.lineWidth = width
        ctx.lineJoin  = 'round'
        ctx.stroke()
        ctx.closePath()

        // 画圆
        ctx.arc(endX, endY, cicleWidth, 0, 2 * Math.PI)
		ctx.fillStyle = style
		ctx.fill()
	}

	// 弧形的坐标
	position (num, r) {
		if (!num || !r) return []
		const x   = 200,
			  y   = 200,
			  arr = []

		for (let i = 0; i < num; i++) {
			const newX  = x + r * Math.cos(2 * Math.PI * i / num)
			const newY  = y + r * Math.sin(2 * Math.PI * i / num)
			arr.push([newX, newY])
		}

		return arr
	}

	clearAnimate () {}
}

// 线条运动
class animateLine extends setOff {
	constructor (canvas) {
		super()
		if (!canvas) return

		this.ctx      = canvas.getContext('2d')
		this.t        = null
		this.init()
	}

	init () {
		this.oneLine([0,100], [20,40], 3, 0.3, 3, this.ctx, color[1])
	}

	clearAnimate () {
		if (!this.t) return
		cancelAnimationFrame(this.t)
		this.t = null
	}
}

export {
	cicle,
	visCicle,
	topColumnar,
	bottomColumnar,
	setOff,
	animateLine
}
