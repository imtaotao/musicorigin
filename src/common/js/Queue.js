export default {
	fx : {},
	// 入队
	on (type, fun) {
		// 入队操作
		if (!this.fx[type]) {
			this.fx[type] = [(next, parm) => fun(next, parm)]

			// 进程锁
			this.fx[type].open = false

			// 初始化
			this.fire(type)
		} else {
			this.fx[type].push((next, parm) => fun(next, parm))
		}
	},

	fire (type, parm) {
		if (!this.fx[type]) return

		if (!this.fx[type].open) {
			if (Object.keys(this.fx[type]).length === 1) {
				this.fx[type] = null
				return
			}

			// 下一个队列函数（出栈）
			let first = this.fx[type].shift()
			let self  = this

			!!first && (this.fx[type].open = true) && first(function(parm) {
				// 解开进程锁
				self.fx[type].open = false
				self.fire(type, parm)
			}, parm)
		}
	}
}