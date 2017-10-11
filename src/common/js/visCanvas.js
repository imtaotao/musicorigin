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
			ctx.roundRect(x + singleW * index, y - singleH * i, singleW * 0.45, singleH * 0.8, 3)
			.fill()
		}
		const lastY = y - singleH * num + (singleH * 0.8 - lastH)
		ctx.roundRect(x + singleW * index, lastY, singleW * 0.45, lastH, 2).fill()
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
		const lineOne      = [[280, 80],  [515, 80]]
		const lineTwo      = [[330, 120], [550, 120], [620, 55], [850, 55]]
		const lineThree    = [[580, 90],  [635, 130], [700, 130]]
		const lineFour     = [[350, 220], [380, 220], [650, 220], [700, 220]]
		const lineSeven    = [[400, 220], [500, 165], [850, 165]]
		const lineEight    = [[425, 220], [530, 250], [620, 250], [850, 250]]
		const lineTen      = [[310, 310], [850, 310]]
		const lineEleven   = [[335, 290], [400, 290]]
		const lineTwelve   = [[380, 310], [420, 270], [670, 270]]
		const lineThirteen = [[480, 310], [500, 290], [550, 290]]
		const lineFourteen = [[425, 310], [445, 340], [750, 340]]

		const arr     = [
			lineOne, lineTwo, lineThree, lineFour,
			lineSeven, lineTen, lineEleven, lineTwelve,
			lineThirteen, lineFourteen, lineEight
		]

		arr.forEach(val => this.oneLine(val))

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
		width = 2, opacity = 0.1, cicleWidth = 5, ctx, style = color[0]
	) {
		!ctx && ({ctx} = this)

		if (style === true) {
			var style = this.ctx.createLinearGradient(startX, startY, endX, endY)
			style.addColorStop(0, 'rgba(0,0,0,0)')
			style.addColorStop(1, coluColor[1])
		}

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
		this.oneX     = 330
		this.twoX     = 310
		this.threeX   = 425
		this.fourX    = 400
		this.fiveX    = 380
		this.sixX     = 425
		this.sevenX   = 350 
		this.add      = 2
		this.init()
	}

	init () {
		// 线条
		const style = true
		this.ctx.clearRect(0, 0, 900, 450)
		this.oneX   += this.add
		this.twoX   += this.add * 1.2
		this.threeX += this.add * 0.7
		this.fourX  += this.add * 0.4
		this.fiveX  += this.add * 0.6
		this.sixX   += this.add * 0.5
		this.sevenX += this.add * 0.4

		// 动画
		requestAnimationFrame(_ => {
			this.init()
			this.oneLine(this.getOP(), 5, 0.4, 4,  this.ctx, style)
			this.oneLine(this.getTP(), 5, 0.2, 5,  this.ctx, style)
			this.oneLine(this.getTHP(), 6, 0.5, 5, this.ctx, style)
			this.oneLine(this.getFP(), 5, 0.5, 5,  this.ctx, style)
			this.oneLine(this.getFIP(), 5, 0.4, 5, this.ctx, style)
			this.oneLine(this.getSP(), 5, 0.4, 5,  this.ctx, style)
			this.oneLine(this.getSEP(), 4, 0.4, 4, this.ctx, style)
		})
	}

    // 得到线条运动公式
	getOP () {
		if (this.oneX >= 950)  this.oneX = 330
		const oneX = this.oneX + 30
		const y1   = this.positionOne(this.oneX)
		const y2   = this.positionOne(oneX)
		return [[this.oneX, y1], [oneX, y2]]
	}

	getTP () {
		if (this.twoX >= 950) this.twoX = 330
		return [[this.twoX, 310], [this.twoX + 120, 310]]
	}

	getTHP () {
		if (this.threeX > 950) this.threeX = 425
		const threeX = this.threeX + 40
		const y1     = this.positionThree(this.threeX)
		const y2     = this.positionThree(threeX)
		return [[this.threeX ,y1], [threeX, y2]]
	}

    getFP () {
    	if (this.fourX > 950) this.fourX = 400
    	const fourX = this.fourX + 35
    	const y1    = this.positionFour(this.fourX)
		const y2    = this.positionFour(fourX)
		return [[this.fourX ,y1], [fourX, y2]]
    }

    getFIP () {
    	if (this.fiveX > 640) this.fiveX = 380
    	const fiveX = this.fiveX + 30
    	const y1    = this.positionFive(this.fiveX)
		const y2    = this.positionFive(fiveX)
		return [[this.fiveX ,y1], [fiveX, y2]]
    }

    getSP () {
    	if (this.sixX > 710) this.sixX = 380
    	const sixX = this.sixX + 40
    	const y1   = this.positionSix(this.sixX)
		const y2   = this.positionSix(sixX)
		return [[this.sixX ,y1], [sixX, y2]]
    }

    getSEP () {
    	if (this.sevenX > 650) this.sevenX = 350
    	return [[this.sevenX, 220], [this.sevenX + 100, 220]]
    }

	// 线的运动公式
	positionOne (x) {
		// const position = [[330, 120], [550, 120], [620, 55], [850, 55]]
		const one     = x => {return 120}    // y轴不变
		const two     = x => {
			const k = 65 / -70
			const b = 120 - (550 * k)
			return k * x + b
		}
		const three   =  x => {return 55} 
		const formula = x < 550 ? one : x < 620 ? two : three

		return formula(x)
	}

	positionThree (x) {
		// const position = [[425, 220], [530, 250], [620, 250], [800, 250]]
		const one      = x => {
			const k = 2 / 7
			const b = 220 - (k * 425)
			return k * x + b
		}
		const two      = x => {return 250}
		const formula  = x < 530 ? one : two

		return formula(x)
	}

	positionFour (x) {
		// const position = [[400, 220], [500, 165], [850, 165]]
		const one      = x => {
			const k = - 11 / 20
			const b = 220 - (k * 400)
			return k * x + b
		}
		const two      = x => {return 165}
		const formula  = x < 500 ? one : two

		return formula(x)
	}

	positionFive (x) {
		// [[380, 310], [420, 270], [670, 270]]
		const one     = x => {
			const k = -1
			const b = 690
			return k * x + b
		}
		const two     = x => {return 270}
		const formula = x < 420 ? one : two
		return formula(x)
	}

	positionSix (x) {
		// [[425, 310], [445, 330], [750, 330]]
		const one     = x => {
			const k = 1
			const b = -115
			return k * x + b
		}
		const two     = x => {return 340}
		const formula = x < 445 ? one : two
		return formula(x)
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
