class Events {
	constructor() {
		// 用于保存事件类型以及内存中的回调函数
		this.listener = {}
	}

	// 注册
	on (type, fun, once, regOnce) {
		if( this.isString(type) && this.isFun(fun)) {
			const arr = this.listener[type]

			// 如果是深度注册，一个观察者允许一个函数存在
			if (regOnce === 'deep' && arr) return
			// 如果有只注册一次的条件，就判断是否已经存在
			if (regOnce && arr) {
				for (let j = 0; j < arr.length; j++) {
					if (fun === arr[j])
						return this
				}
			}

			// 如果有只调用一次的
			once && (fun.once = once)

			// 没有就创建数组并添加，有就push
			if( !arr ) {
				this.listener[type] = [fun]
			}else {
				for(let i = 0, arr = this.listener[type]; i < arr.length; i++) {
					if(arr[i] === fun) return this
				}
				this.listener[type].push(fun)
			}

			return this
		}
	}

	// 触发
	fire (type, data, fun) {
		if(!type || !this.isString(type)) return this

		let event = this.createEvent(type, data)
		let remove = []

		if( !!this.listener[type] && this.isFun(fun)) {
			for(let i = 0, arr = this.listener[type]; i < arr.length ; i++) {
				if(arr[i] === fun) {
					fun.call(this, event);
					fun.once && (remove === i)
					return this
				} 	
			}
			 this.listener[type].splice(remove, 1)
		}

		// 只传了类型，没有指定回调函数
		if(!!this.listener[type] && !this.isFun(fun)) {
			for(let i = 0, arr = this.listener[type]; i < arr.length; i++) {
				arr[i].call(this, event)
				arr[i].once && remove.push(i)
			}
			remove.forEach(val => this.listener[type].splice(val, 1))
		}
		return this
	}

	// 取消
	off(type, fun) {
		if( !type || !this.isString(type)) return this

		if( !!this.listener[type] && this.isFun(fun)) {
			for(let i = 0, arr = this.listener[type]; i < arr.length; i++) {
				if(arr[i] === fun) {
					arr.splice(i, 1);
					return this
				} 	
			}
		}

		// 只传了类型，没有指定回调函数，全部置为空
		if(!fun || !this.isFun(fun)) {
			this.listener[type] = null;
		}

		return this
	}

	// 生产事件对象
	createEvent (type, data) {
		return {
			type,
			data
		}
	}
	isFun (fun) {
		return Object.prototype.toString.call(fun) === '[object Function]'
	}
	isString (string) {
		return Object.prototype.toString.call(string) === '[object String]'
	}
}

const event  = new Events
export default {
	install: function(Vue) {
	    Vue && (Vue.prototype.$event = event)
	    return event
	}
}