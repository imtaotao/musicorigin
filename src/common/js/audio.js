export default class audio {
	constructor (size, duration) {
		this.ac 		 = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)			
											// audiocontext 对象
		this.progress 	 = 0				// 歌曲资源下载的进度
		this.diff	 	 = 0				// 差值（快进后退的
		this.repeat		 = 0 				// 播放的次数
		this.volumeNum 	 = 0.5				// 播放的音量
		this.totalsize	 = null				// 音频解码后的总大小
		this.isLoop 	 = true				// 是否重复播放
		this.duration 	 = duration || 0	// 歌曲时长
		this.size 		 = size < 16 ? 16 : size
		this.Hertz 		 = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

		// 连接顺序为
		// ac.destination -> gainNode -> analyser -> convolver

		// 创建三个状态
		this.oldstatus	 = {}					// 过去状态
		this.futurestatus= {filterstatus:'init'}// 未来状态
		this.nowstatus	 = {filter:{}}			// 当前状态

	}

	/* --------------------- 工具方法 ------------------------- */
	// 钩子函数（音频全部解码完毕）
	over 	     () {}
	playOver     () {}
	loopPlayOver () {}  //单曲循环播放一次调用
	change       () {}
	decodeOver   () {}	//音频资源全部解码完成
	loading      () {}  //音频加载情况，判断是否是在等待加载

	crtAc() {
		return new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)
	}

	// 得到 source
	crtSource () {
		return this.ac.createBufferSource()
	}

	// 音频分析对象
	crtanalyser () {
		const analyser = this.ac.createAnalyser()
		// 傅里叶变换参数
		analyser.fftSize = this.size * 2
		return analyser
	}

	// 得到音量控制对象
	crtGainNode () {
		return this.ac[this.ac.createGain ? 'createGain' : 'createGainNode']()
	}

	// 得到均衡器对象
	crtConvolver () {
		return this.ac.createConvolver()
	}

	// 滤波器
	crtFilter (hertz, gainValue) {
		const ra = this.ac.createBiquadFilter()
		ra.type = 'peaking'
		ra.Q.value = 10
		ra.frequency.value = hertz
		ra.gain.value = gainValue || 0

		return ra;
	}

	// 解码 arraybuffer
	decodeFile (arraybuffer) {
		const self = this
		return new Promise((resolve, reject) => {
			self.ac.decodeAudioData( arraybuffer, buffer => {
				resolve([self, buffer])
			})
		})
	}

	// 音量控制
	volume (precent, callback) {
		let sound = this.volumeNum
		if (!!precent || precent === 0) { sound = this.volumeNum = precent }

		this.nowstatus.gainNode.gain.value = sound * sound;
		!!callback && callback()
		return this
	}

	// 连接各个音频节点
	connectNode (arr) {
		const self = this
		const nowstatus = self.nowstatus
		arr.forEach((node, i) => {
			if (i === 0) {
				nowstatus[node].connect(self.ac.destination)
			} else {
				// 在 buffersouce 前面提前连接好滤波器的节点
				if (node === 'buffersouce') {
					let preNode = nowstatus[arr[i - 1]]

					self.Hertz.forEach(HZ => {
						const nowFilet = self.crtFilter(HZ)
						nowFilet.connect( preNode )
						self.nowstatus.filter[HZ] = preNode = nowFilet
					})

					nowstatus[node].connect(preNode)
				} else {
					nowstatus[node].connect(nowstatus[arr[i - 1]])
				}
			}
		})
		return self
	}

	// souce 的暂停和播放
	souceStart (time) {
		this.nowstatus.buffersouce.buffer = this.nowstatus.audiobuffer
		
		const souce = this.nowstatus.buffersouce
		time == null ? souce[souce.start ? 'start' : 'noteOn'](0)
					 : souce[souce.start ? 'start' : 'noteOn'](0, time)

		this.volume()
		this.filter(this.futurestatus.filterstatus)
		return this
	}
	sourceStop () {
		this.nowstatus.buffersouce[this.nowstatus.buffersouce ? 'stop' : 'noteOff']()
		return this
	}

	// ac 的暂停和播放（都有 1.5s 的延缓）
	play () {
		const self = this
		if (!!self.play.processing) return false

		self.play.processing = true
		const nowVolume = self.volumeNum 
		const sound = nowVolume / 75
		let i = 0
		function Increase (i) {
			setTimeout(() => {
				self.volume(sound * i)
				i < 75 ? Increase(++i) : (self.play.processing = false)
			}, 20)
		}
		self.volume(0, () => self.ac.resume())
		Increase(++i)
		return self
	}

	stop (callback) {
		const self = this
		if (!!self.play.processing) return false

		self.play.processing = true
		const nowVolume = self.volumeNum 
		const sound = nowVolume / 75
		let i = 0
		function Increase (i) {
			setTimeout(() => {
				self.volume(nowVolume - sound * i)
				if (i < 75){
					Increase(++i)
				} else {
					self.ac.suspend()
					self.volumeNum = nowVolume
					self.play.processing = false
					!!callback && callback()
				}
			}, 20)
		}
		Increase(++i)
		return self
	}

	// 得到可视化的资源
	getVisualizer () {
		const analyser = this.nowstatus.analyser
		if (!analyser) return []
		
		let arr = new Uint8Array(analyser.frequencyBinCount)
		analyser.getByteFrequencyData(arr)
		return arr
	}

	isaudiobuffer (buffer) {
		return Object.prototype.toString.call(buffer) === "[object AudioBuffer]"
	}

	isarraybuffer (buffer) {
		return Object.prototype.toString.call(buffer) === "[object ArrayBuffer]"
	}

	// 合并 arraybuffer
	concatArrayBuffer (...args) {
		if (args.length === 1) return args[0]
		function isValidArray(val) {
			return /Int(8|16|32)Array|Uint(8|8Clamped|16|32)Array|Float(32|64)Array|ArrayBuffer/gi.test({}.toString.call(val))
		}

	    if (args.length <= 0 || !isValidArray(args[0])) {
	    	return new Uint8Array(0).buffer
	    }

	    let arrayBuffer = args.reduce(function(cbuf, buf, i) {
			if (i === 0) return cbuf
			if (!isValidArray(buf)) return cbuf

			let tmp = new Uint8Array(cbuf.byteLength + buf.byteLength)
			tmp.set(new Uint8Array(cbuf), 0)
			tmp.set(new Uint8Array(buf), cbuf.byteLength)

			return tmp.buffer
	    }, args[0])

	    return arrayBuffer
	}

	/* --------------------- 状态迁移 ------------------------- */
	futures (buffer, end) {
		// 合并新的资源
		if (this.isarraybuffer(buffer)) {
			this.futurestatus.arraybuffer = buffer
		}
		if (this.isaudiobuffer(buffer)) {
			this.futurestatus.audiobuffer = buffer
			this.futurestatus.Duration = buffer.duration
			this.futurestatus.length = buffer.length
			if (!!end) {
				this.totalsize = buffer.length
				this.over()
			}
		}
	}

	// 状态迁移（第一阶段）
	transition (callback) {
		const oldstatus = this.oldstatus
		const nowstatus = this.nowstatus
		const futurestatus = this.futurestatus

		// nowstatus -> oldstatus
		oldstatus.Duration = nowstatus.Duration || 0
		oldstatus.length = nowstatus.length || 0

		// futurestatus -> nowstatus
		nowstatus.audiobuffer = futurestatus.audiobuffer
		nowstatus.Duration = futurestatus.Duration
		nowstatus.length = futurestatus.length

		// if (nowstatus.length === this.totalsize) {
		// 	// 虽然不能合并状态，但是为了减少内存，释放未来状态的资源
		// 	this.futurestatus = {filterstatus:this.futurestatus.filterstatus}
		// }
		// 切换完毕后更新音频节点资源
		!callback ? this.newSource()
				  : callback.call(nowstatus, this.newSource())
	}

	// 第二阶段
	newSource () {
		const buffersouce = this.nowstatus.buffersouce = this.crtSource()
		const analyser = this.nowstatus.analyser = this.crtanalyser()
		const gainNode = this.nowstatus.gainNode = this.crtGainNode()
		const convolver = this.nowstatus.convolver = this.crtConvolver()

		this.ac.source = buffersouce
		return {gainNode, analyser, buffersouce, convolver}
	}

	// 合并状态
	merge () {
		console.log( '开始合并了' )
		this.oldstatus 	  = null
		this.futurestatus = {filterstatus:this.futurestatus.filterstatus}
	}

	/* --------------------- 操作处理 ------------------------- */
	alldecodeOver () {
		console.log('音频资源全部解码完毕')
		const duration = Number(this.futurestatus.Duration || this.nowstatus.Duration) * 1000
		
		// 如果没有传歌曲的总时长，就从最后一次解码的资源中提取时间
		!this.duration && (this.duration = duration)
		
		// 调用回调
		if (typeof this.decodeOver === 'function') {
			this.decodeOver.call(this)
		} else {
			this.decodeOver.forEach(fun => {
				fun.call(this)
			})
		} 

	}

	getTime () {
		const currentTime = this.ac.currentTime

		// 不晓得原先怎么写的  咋个把歌曲弄成状态里面的了
		const Duration    = this.duration / 1000
		let playTime      = Number(currentTime - (Duration * this.repeat) + this.diff)

		if ( playTime >= Duration) {
			this.repeat++
			// 单曲循环的情况下播放一次完毕
			this.isLoop && this.loopPlayOver()
			playTime = Duration
		}
		return playTime
	}

	// 得到当前播放状态
	getState () {
		return this.ac.state
	}

	// 设置均衡器风格
	filter (name) {
		const param = this.getParm(name)
		if (!param) return false
		this.setFilter(param)
		this.futurestatus.filterstatus = name				// 在未来状态记录当前滤波器状态
		return param
	}
	
	setFilter (param) {
		const self = this
		self.Hertz.forEach((HZ, i) => {
			const nowFilter = self.nowstatus.filter[HZ]
			if (!!nowFilter) {
				nowFilter.gain.value = param[i] * 1.5
			}
		})
	}

	// 设置单条的数据
	setSingleFilter (HZ, data) {
		this.nowstatus.filter[HZ].gain.value = data * 1.5
	}

	getParm (name) {
		switch(name) {
			case 'init' :
				return [0, 0, 0, 0,  0, 0, 0, 0, 0, 0]
			case 'slowSong': 								// 慢歌
	        	return [5, 4, 2, 0, -2, 0, 3, 6, 7, 8]
	        case 'jazz': 									// 爵士
	        	return [0, 0, 0, 5, 5, 5, 0, 3, 4, 5]
	        case 'classical': 								// 古典
	        	return [0, 0, 0, 0, 0, 0, -6, -6, -6, -8]
			case 'blues': 									// 蓝调
	        	return [3, 6, 8, 3, -2, 0, 4, 7, 9, 10]
	       	case 'dance': 									// 舞曲
	        	return [7, 6, 3, 0, 0, -4, -6, -6, 0, 0]
	        case 'popular': 								// 流行	
	        	return [4, 2, 0, -3, -6, -6, -3, 0, 1, 3]
	       	case 'electronicMusic': 						// 电子乐
	        	return [6, 5, 0, -5, -4, 0, 6, 8, 8, 7] 
	        case 'rocking': 								// 摇滚
	        	return [7, 4, -4, 7, -2, 1, 5, 7, 9, 9]
	        case 'rural': 									// 乡村
	        	return [5, 6, 2, -5, 1, 1, -5, 3, 8, 5]  
		}
	}

	// 快进、后台操作
	forward (precent) {
		console.log(precent)
		const time = Number(this.duration * precent / 1000)			// ms
		const alread = (this.futurestatus || this.nowstatus).Duration

		if (time > alread) return false
		this.diff += time - this.getTime()

		// 避免音频结尾事件回调的误调
		this.forward.move = true

		// 状态转移，用新的资源播放
		this.sourceStop()
		// // 根据 old 状态判断资源片段阶段的播放是否结束
		!!this.oldstatus ? this.transition()
						 : this.newSource()

		this.connectNode(['gainNode', 'analyser', 'buffersouce'])
		this.souceStart(time)
		this.nowstatus.buffersouce.loopStart = 0
		// 每一次快进后退都有一个随机标识码
		this.forward.random = this.random(9999999) + this.random(99999).toString(32)

		this.nowstatus.buffersouce.onended = this.forwardMusicEnd()
		// 用新的资源快进后退时，设置重复播放属性，不需要事件来进行操作
		if ( this.nowstatus.length === this.totalsize ) {
			// 传递 true 代表是新的完整的资源
			this.insertLoop(this.isLoop, true)
			this.merge()
		}
	}

	// 判断播放完毕还是网络差没有加载新的资源快
	isLoaded () {
		// 判断 now 与 future 的 audiobuffer 大小等不等
		if (!this.totalsize) {
			const load = this.oldstatus.length === this.futurestatus.length
			this.loading(load)
			return load
		}
		// 音频加载完毕就不需要判断网络情况了
		return false
	}

	// 快进后音频片段播放完的回调（通用一个函数实在太乱了）
	forwardMusicEnd () {
		let self = this
		// 利用闭包记住每一次回调的随机标识码
		let random = self.forward.random
		return function () {
			console.log('结束了（快进）')
			// 判断是否切换资源播放
			if (random !== self.forward.random || !self.oldstatus) {
				self = null
				random = null
				return
			}

			self.transition()
			self.connectNode(['gainNode', 'analyser', 'buffersouce'])
			if ( !!self.forwardMusicEnd.end ) { 
				self.originLoop()
				return 
			}
			if ( self.nowstatus.length === self.totalsize ) {
				self.alldecodeOver()
				self.forwardMusicEnd.end = true 
			}


			if (!self.isLoaded() && !!self.oldstatus) {
				console.log(self.oldstatus.Duration)
				self.souceStart(self.oldstatus.Duration)
				self.nowstatus.buffersouce.onended = self.forwardMusicEnd()
			} else {
				// 监听一个数据变动的事件，等待加载
				self.change = function () {
					self.loading(false)
					self.souceStart( self.oldstatus.Duration )
					self.nowstatus.buffersouce.onended = self.forwardMusicEnd()
				}
			}
		}
	}

	// 音频片段播放完的回调
	musicEnd () {
		let self = this
		return function () {
			console.log( '结束了' )
			// 避免混合
			if (!!self.forward.move || !self.oldstatus) { self = null; return }

			self.transition()
			self.connectNode(['gainNode', 'analyser', 'buffersouce'])
			if ( !!self.musicEnd.end ) { self.originLoop(); return }
			if ( self.nowstatus.length === self.totalsize ) {
				self.alldecodeOver()
				self.musicEnd.end = true
			}
			
			// 网络不好的时候，等待加载
			// 需要判断是当前播放的资源本来就是最终资源
			if (!self.isLoaded() && !!self.oldstatus) {
				console.log(self.oldstatus.Duration)
				self.souceStart(self.oldstatus.Duration)
				self.nowstatus.buffersouce.onended = self.musicEnd()
			} else {
				// 监听一个数据变动的事件，等待加载
				self.change = function () {
					console.log('网络不好', self.oldstatus.Duration)
					self.loading(false)
					self.souceStart( self.oldstatus.Duration )
					self.nowstatus.buffersouce.onended = self.musicEnd()
				}
			}
		}
	}

	originLoop () {
		this.isLoop && this.souceStart()
		this.insertLoop(this.isLoop)
		this.merge()			// 可以合并状态了
	}

	random (max) {
		return parseInt(Math.random() * (max + 1))
	}

	insertLoop (loop, isComplete) {
		this.nowstatus.buffersouce.loop = loop

		// 单曲循环的情况
		if (this.isLoop) {
			this.nowstatus.buffersouce.onended = this.playOver
		}	

		// 不是单曲循环的情况
		if (!this.isLoop && !isComplete) { 		// 如果不是通过快进，完整的资源

			this.playOver() 									
		}

		if (!!isComplete) { 					// 如果是快进，完整的资源
			let random = this.forward.random
			this.nowstatus.buffersouce.onended = () => {
				if (random !== this.forward.random) return
				this.playOver()
			}
		}
	}

	loop (loop) {
		this.isLoop = loop
		if (this.nowstatus.buffersouce && !this.oldstatus) {
			this.nowstatus.buffersouce.loop = loop
			this.nowstatus.buffersouce.onended = this.playOver
		}
	}
	/* --------------------- buffer处理 ------------------------- */
	init (arraybuffer) {
		if (!this.isarraybuffer(arraybuffer)) {
			console.err('必须以 arraybuffer 类型传入')
			return
		}

		this.futures(arraybuffer.slice(0))
		this.decodeFile(arraybuffer).then(([audio, buffer]) => {
			audio.futures(buffer)
			audio.transition(node => {
				audio.connectNode(['gainNode', 'analyser', 'buffersouce'])
				audio.souceStart()
			})
			audio.ac.source.onended = audio.musicEnd()
		})
	}

	// 后续的分段传输只是补充 buffer
	continue (arraybuffer, end) {
		if (!this.isarraybuffer(arraybuffer)) {
			console.err('必须以 arraybuffer 类型传入')
			return
		}

		const future = this.futurestatus
		// 合并 arraybuffer
		this.futures(this.concatArrayBuffer(future.arraybuffer, arraybuffer))
		this.decodeFile(future.arraybuffer.slice(0)).then(([audio, buffer]) =>{
			audio.futures(buffer, end)
			// 有新的数据加载，调用change方法
			audio.change()
			audio.change = function () {}	// 清空
		})
	}

	// 销毁实例
	destroy (ajax) {
		// 停止播放 -> 释放资源 -> 停止加载
		this.ac.close()
		this.forward.move = null
		this.musicEnd.end = null
		this.play.processing = null
		this.forwardMusicEnd.end = null
		!!ajax && (ajax.cancell = function () {
			return false
		})
	}
}