export default class drag {
	constructor (dom, direction) {
		if (this.typeOf(dom) === '[object String]') {
			dom = document.querySelector(dom)
		} else if (
			   this.typeOf(dom) !== '[object HTMLElement]'
			&& this.typeOf(dom) !== '[object HTMLLIElement]'
			&& this.typeOf(dom) !== '[object HTMLSpanElement]'
			&& dom !== document
		) { return }

		this.param = {dom, direction}
	}

	init () {
		const {dom, direction} = this.param
		const parent  	  = dom.parentElement
		const nowPosition = this.nowPosition(parent)

		const reviseW 	  = this.getW(dom) / 2
		const reviseH 	  = this.getH(dom) / 2
		
		const totalX 	  = this.getW(parent.parentElement)
		const totalY      = this.getH(parent.parentElement)

		// 剩下的的长度
		const lastX 	  = totalX * (1 - nowPosition)
		const lastY   	  = totalY * (1 - nowPosition)

		this.position(dom)
		parent.value = nowPosition
		dom.onmousedown = this.mousedown()

		this.param = {dom, parent, totalX, totalY, direction, reviseH, reviseW, lastX, lastY, nowPosition}
	}

	mousedown () {
		const self = this
		return function (e) {
			const {dom, parent, totalX, totalY} = self.param
			self.param.X = e.clientX - dom.offsetLeft
		    self.param.Y = e.clientY - dom.offsetTop

		    document.onmousemove = self.mousemove()
		    document.onmouseup = function () {
		    	self.fire(parent, 'change')
		        document.onmousemove = null
		        document.onmouseup   = null

		        const nowPosition 	 = self.nowPosition(parent)
		        self.param.lastX 	 = totalX * (1 - nowPosition)
				self.param.lastY   	 = totalY * (1 - nowPosition)
		    }
		}
	}

	mousemove () {
		const self = this
		return function (e) {
			e.preventDefault()
			const {dom, totalX, totalY, reviseH, reviseW, lastX, lastY, direction, X, Y} = self.param
		    self.param.left = e.clientX - X
		    self.param.top = e.clientY - Y

		    if (direction === 'X') {
		    	if (self.param.left < -reviseW)
		    	 	self.param.left = -reviseW
		    	if (self.param.left > totalX -reviseW)
		    		self.param.left = totalX -reviseW
		    }
		    
		   	// 往上为负，下为正 
		    if (direction === 'Y') {
		    	// 移动的距离不能大于限定的长度
		    	const alrY = totalY - lastY
		    	if (self.param.top > alrY - reviseH / 2) 
		    		self.param.top = alrY - reviseH / 2
		    	if (self.param.top < -(lastY + reviseH / 2))
		    		self.param.top = -(lastY + reviseH / 2)
		    }
			self.distance()
		}
	}

	distance () {
		let {totalX, totalY, left, top, reviseH, reviseW, direction, lastY} = this.param
		if (direction === 'X') {
			if (top > -70 && top < 70) {
				const nowVal  = left + reviseW
				const precent   = nowVal / totalX

				this.changeattr('width', precent)
			}
		}

		if (direction === 'Y') {
			if (left > -70 && left < 70) {
				const alrY = totalY - lastY - reviseH / 2
				const precent = (alrY - top) / totalY

				this.changeattr ('height', precent)
			}
		}
	}

	changeattr (attr, precent) {
		const {dom, parent} = this.param
		parent.style[attr]  = precent * 100 + '%'
		parent.value 		= precent
		this.fire(parent, 'input')
	}

	typeOf (val) {
		return Object.prototype.toString.call(val)
	}

	nowPosition (parent) {
		const direction   = this.param.direction
		const grandfather = parent.parentElement
		if (direction === 'X') {
			const width   = this.getW(parent)
			const parentW = this.getW(grandfather)
			return width / parentW
		}

		if (direction === 'Y') {
			const height  = this.getH(parent)
			const parentH = this.getH(grandfather)
			return height / parentH
		}
	}

	position (dom) {
		const position = getComputedStyle(dom.parentElement).position
		if (position === 'static') {
			dom.style.position = 'relative'
			return
		}
		dom.style.position = 'absolute'
	}

	getH (dom) {
		return parseInt(getComputedStyle(dom).height)
	}

	getW (dom) {
		return parseInt(getComputedStyle(dom).width)
	}

	fire (el, type) {
		const event = new Event(type)
		el.dispatchEvent(event)
	}
}