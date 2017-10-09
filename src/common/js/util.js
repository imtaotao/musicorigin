import ripples from '@/common/js/ripple'
export const util = {
	$ (val) {
		const el = document.querySelectorAll(val)
		return  el.length === 1 ? el[0]
			   :el.length === 0 ? null
			   :el
	},

	removeClass (el, className) {
		const removeDom = el.parentElement.querySelector(`.${className}`)
		if (!removeDom) return
		removeDom.classList.remove(className)
	},

	addClass (el, className) {
		el.classList.add(className)
	},

	random(min, max) {
		return max ? parseInt( Math.random() * ( max - min + 1 ) + min )
				   : parseInt( Math.random() * ( min + 1 ) )
	},

	randomStr () {
		return Date.now() + this.random(9999999) + this.random(999999999)
	},

	toggle (el, className) {
		this.removeClass(el, className)
		this.addClass(el, className)
	},
	conver (time) {
		const t = (time / 1000 / 60) + ''
        let   m = parseInt(t)
        let   s = parseInt((t.replace(`${m}`, '0') * 60))
        m < 0 && (m = 0)
        s < 0 && (s = 0)
        return `${m}:${s}`
	},
	nowPlay: {
		domList: null,
	    add () {
	        const nowPlay = util.$('.active-play')
	        if (!nowPlay) return
	        const children = this.domList = nowPlay.children
	    	if (!children) return
	        Array.from(children).forEach(val => {
	            const nowPlayRio = new ripples(val, '#0094B9')
	            val.instance = nowPlayRio
	            nowPlayRio.init()
	        })
	        
	    },
	    remove () {
	        if (!this.domList) return
	        Array.from(this.domList).forEach(val => {
	            if (!val.instance) return
	            val.instance.remove()
	            val.instance = null
	        })
	    }
	},

	// 歌词切分
	astLyrics (text) {
		if (!text) return null
		const ast      = {}
		const info 	   = /\[\w+:([\u4e00-\u9fa5]+|.+)\]/g
		const content  = /\[\d+:\d+.\d+].+/g

		ast.infomation = this.parse(text.match(info ), true) 
		ast.content    = this.parse(text.match(content))

		return ast
	},

	parse (arr, info) {
		let data
		if(!!info) {
			!!arr && (data = {});
			!!arr &&　arr.forEach(val => {
				val = val.replace(']', '')
				// 歌曲名字
				if(val.includes('ti')) {
					data.name = val.replace('[ti:', '')
				};
				// 演唱者
				if(val.includes('ar')) {
					data.author = val.replace('[ar:', '')
				}
			})
		} else {
			!!arr && (data = [{time: 0, lyr: '...... ', unover: true}]);
			!!arr &&　arr.forEach(val => {
				val = val.split(']')
				const time = val[0].replace('[', '').split(':')
				const num = time[0] * 60 + Number(time[1])
				data.push({time: num, lyr: val[1], unover: true})
			})
		}
		return data
	},


	// 路由部分
	router: '',
	savePath (path) {
		const originPath = sessionStorage.getItem('routerPath');
		!originPath && ( path = '/findMusic/recommend')
		sessionStorage.setItem('routerPath', path)
	},
	getPath () {
		return sessionStorage.getItem('routerPath') || '/findMusic'
	},
	open (path) {
		const newPath = !path ? this.getPath() : path
		// 刷新的时候跳转到指定的路由
		this.router.push(newPath)
	},
	isPage (str) {
		return sessionStorage.getItem('routerPath').includes(str)
	},


	// 重写全局 alert 函数
	resetAlert () {
		window.alert = function (text, duration) {
			duration = !isNaN(duration) ? duration : 2000

	        let showBox 	  = document.createElement('div')
	        showBox.innerHTML = text

	        showBox.style.cssText = `height:80px;
	        						min-width:200px;
	        						background:rgba(0,0,0,.6);
	        						color:#fff;
	        						line-height:80px;
	        						font-size:20px;
	        						text-align:center;
	        						border-radius:3px; 
	        						position:fixed;
	        						top:calc(50% - 40px);
	        						left:calc(50% - 200px);
	        						z-index:999999;
	        						padding: 0 20px;
	        						font-weight:bold;`

	        document.body.appendChild(showBox)

	        setTimeout(_ => {
	            showBox.style.webkitTransition = '-webkit-transform 0.5s ease-in, opacity 0.5s ease-in'
	            showBox.style.opacity 		   = '0'
	            setTimeout(_ => document.body.removeChild(showBox), 500)
	        }, duration )
		}
	},

	// 得到一个元素的计算属性
	getAttr (dom, attr) {
		if (!dom || !attr) return
		return getComputedStyle(dom)[attr]
	},
	// 时间格式函数
	timeFormat () {
		Date.prototype.format = function( t , position , fillzero ) {
			/*
			*参数*（ true都是补0操作 ）
				* 所有的默认都是未补0的时间
				* 不传参数，默认显示before，未补0
				* 传参*
					* 参数一 ：连接符 （ 必须传 ）, 如果传true，就是给默认值补0操作
					* 参数二 ：位置 （ 'all' , 'before' , 'after' , true），不传默认显示before，true表式补0
					* 参数三 ：补0操作 （ true 或 false），默认为false
			*/
			var time = this;
			var timeObj = {
				year : time.getFullYear(),
				month : time.getMonth() + 1,
				date : time.getDate(),
				hours : time.getHours(),
				minutes : time.getMinutes(),
				seconds : time.getSeconds(),
				dateTime : null,
				init : function() {
					this.timeFormat();
					this.returnTime();
				},
				fizer : function( value ) {
					//转字符串
					value += '';
					//判断是否有两位数字
					value.length > 1 ? value = value : value = '0' + value;

					return value
				},
				timeFormat : function() {
					this.defaultTime = this.year + '-' + this.month + '-' + this.date + ' ' + this.hours + ':' + 				this.minutes + ':' + this.seconds;
					this.defaultTimeBefore = this.year + '-' + this.month + '-' + this.date;
					this.defaultTimeBeforeZero = this.year + '-' + this.fizer( this.month ) + '-' + 
												 this.fizer( this.date );

					if( !!t ) {
						this.all = this.year + t + this.month + t + this.date + ' ' + this.hours + ':' + 
								   this.minutes + ':' + this.seconds;
						this.allzero = this.year + t + this.fizer( this.month ) + t + this.fizer( this.date ) + ' ' + this.fizer( this.hours ) + ':' + this.fizer( this.minutes ) + ':' + this.fizer( this.seconds );

						//前半部分
						this.before = this.year + t + this.month + t + this.date;
						this.beforezero =  this.year + t + this.fizer( this.month ) + t + this.fizer( this.date );

						//后半部分
						this.after = this.hours + t + this.minutes + t + this.seconds;
						this.afterzero = this.fizer( this.hours ) + t + this.fizer( this.minutes ) + t + 
										 this.fizer( this.seconds );
					}
				},
				returnTime : function() {
					if( !t ) {
						//默认情况
						this.dateTime = this.defaultTimeBefore;
					}else if( t === true ) {
						//默认补0
						this.dateTime = this.defaultTimeBeforeZero;
					}else {
						//有参数的情况
							//没有位置（自然也就没有补0）
						if( !position ) {

							this.dateTime = this.before;
						}else {
							//有位置（根据补0操作来判断）
							if( position === 'all') {

								!fillzero ? this.dateTime = this.all : this.dateTime = this.allzero; 
							}else if( position === 'before' ) {

								!fillzero ? this.dateTime = this.before : this.dateTime = this.beforezero; 
							}else if( position === 'after' ) {

								!fillzero ? this.dateTime = this.after : this.dateTime = this.afterzero;
							}else {

								this.dateTime = this.beforezero;
							}
						}
					};
				}

			};
			timeObj.init();
			return timeObj.dateTime;
		}
	},

	// 判断浏览器
	verifyBrowser() {
		const inBrowser = typeof window !== 'undefined'
		const UA = inBrowser && window.navigator.userAgent.toLowerCase()
		this.isIE 		= UA && /msie|trident/.test(UA)

		this.isIE9 		= UA && UA.indexOf('msie 9.0') > 0

		this.isEdge 	= UA && UA.indexOf('edge/') > 0

		this.isAndroid  = UA && UA.indexOf('android') > 0

		this.isIOS 		= UA && /iphone|ipad|ipod|ios/.test(UA)

		this.isChrome	= UA && /chrome\/\d+/.test(UA) 
							 && !this.isEdge

		this.isFirefox  = UA && /firefox\/\d+/.test(UA) 
							 && !this.isEdge

		this.isSafari   = UA && /safari\/\d+/.test(UA) 
							 && !this.isEdge
							 && !this.isChrome
	},

	direction (e) {
		// friefox 向上为 - 3，chorem 向上为 120
		// 现在统一上为正， 下为负
		const detail = this.isFirefox ? -e.detail 
									  : e.wheelDelta

		if (detail > 0) return true
			return false
	},
	onWheel (dom, except, callback) {
		const wheel  = this.isFirefox ? 'DOMMouseScroll' 
							    	  : 'mousewheel'

		const self   = this,
			  times  = 3
		let   top    = 0,
			  bottom = 0

		// 添加滚轮事件
		dom.addEventListener(wheel, function (e) {
			if (except(this, e) === false) return
		
			// 向上为正，向下为负
			if (self.direction(e)) {
				top++
				if (top > times) top = 0
				bottom = 0
				e.direction = true
			} else {
				bottom++
				if (bottom > times) bottom = 0
				top = 0
				e.direction = false
			}
			
			(top === times || bottom === times) && callback(this, e)
		})
	},

	// 过滤数据，替换成需要的数据格式
	filter (data) {
		if (!data.length) return []
		const arr = []
		data.forEach(val => {
			arr.push({
				user: {
					name     : val.name,
					avatarUrl: val.avatarUrl,
					nickname : val.nickname
				},
				beReplied    : util.filter(val.reply) || [],
				content      : val.text,
				time         : val.time,
				id           : val._id
			})
		})
		console.log(arr)
		return arr
	},


	// 针对不同的浏览器给与不同的提示
	prompt () {
		if (this.isChrome) return

		// 如果是 safari
		if (this.isSafari) {
			return alert('本网站不兼容Safari，为了更好的用户体验，请您用Chrome浏览器访问', 5000)
		}

		if (this.isIE || this.isIE9) {
			return originAlert('本网站不兼容IE，就这样！！！')
		}

		alert('为了更好的用户体验，请您用Chrome浏览器访问', 5000)
	},

	down (url, filename, callback) {
		if (!url) return
		const node = document.createElement('a')
			
		node.href     = url
		node.download = filename
		
		node.click()
		setTimeout(_ => callback && callback())

	},

	isArr (arr) {
		return Object.prototype.toString.call(arr) === '[object Array]'
	}
}