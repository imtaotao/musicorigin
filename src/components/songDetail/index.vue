<template>
	<main class="animate" v-mousewheel='[exceptDom, mousewheel]' >
		<!-- 背景图片 -->
		<img :src="playInfo.picUrl || bgUrl" class="song-detail-pic">
		<div class="bg-mack-layer"></div>
		<!-- 歌曲信息 -->
		<div class="main-content-box animate-songDatil" @click='hide' id="songDetail" 
		:style='{transform: "translateY("+translateY +"%)"}'>
			<div class="music-information">
				<p class="music-name"><span>{{playInfo.musicInfo[1]}}</span></p>
				<ul>
					<li>
						<span class="Silver">专辑：</span>
						<span class="Bright-blue">{{playInfo.album.name}}</span>
					</li>
					<li>
						<span class="Silver">歌手：</span>
						<span class="Bright-blue">{{playInfo.musicInfo[2]}}</span>
					</li>
				</ul>
			</div>
			<!-- 内容区域 -->
			<div class="main-content">
				<!-- 歌词显示部分 -->
				<div class="lyrics-show" :style='lyricStyle'>
					<div class="lyrics-container animate">
						<p v-for='(key, i) in lyricContent' 
						class="lyrics-row Dark" 
						:class='i === nowLyrPosition ? "active-lyr" : ""'>
							<span>{{key.lyr}}</span>
							<span class="translation-lyr" v-if='lyricCopy'>
								{{lyricCopy[i].lyr}}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="bg-mack-layer secend"></div>
		<!-- 歌曲评论 和 相似歌曲等 -->
		<div class="comment-similar animate-songDatil"
		 :style='{transform: "translateY("+translateY +"%)"}'>
			<!-- 评论 -->
			<comment class='lf song-comment-box'></comment>
			<!-- 相似歌曲和包含这首歌的歌单 -->
			<contain-similar class='rt song-similar-box'></contain-similar>
		</div>
	</main>
</template>

<script>
	import comment  from './comment'
	import containSimilar from './containSimilar'
	import {mapGetters, mapActions} from 'vuex'
	import {util} from '@/common/js/util'
	const {$} = util

	export default {
		props: ['songDetail'],
		data () {
			return {
				lyricsShowH   : 380,
				preIndex      : 0,  // 记录上一次的 index
				allDis        : 0,
				preAllDis     : 0,
				nowAnimateStr : null,
				LyrFirst      : true, // 第一进来或者快进后退操作
				bgUrl         : 'static/img/music.jpg',
				playInfo      : {},
				lyricContent  : null,
				lyricCopy     : null,

				// 滚轮页面滑动的距离
				translateY    : 0
			}
		},
		computed: {
			...mapGetters([
	    		'host',
	    		'isLoading',
	    		'localhost',
	    		'nowPlayId',
	    		'nowPlayInfo',
	    		'bigAnimate',
	    		'lyric',
	    		'getAudio',
	    		'nowLyrPosition'

	    	]),
	    	// 深拷贝歌词
	    	copyLyric () {
	    		return JSON.parse(JSON.stringify(this.lyric))
	    	},

	    	// 歌词框显示
	    	lyricStyle () {
	    		let style = {height: this.lyricsShowH + "px"}

	    		if (util.isFirefox) {
	    			style.height   = '300px'
	    			style.overflow = 'hidden'
	    		}

	    		return style
	    	}
		},
		methods: {
			// 隐藏当前页面
			hide () {
				this.$emit('update:songDetail', false)
				setTimeout(_ => this.bigAnimate(), 450)
				$('.all-container').style['overflow-x'] = 'hidden'
				$('.all-container').style['overflow']   = 'none'
			},

			// 设置数据
			setDate (rcfg) {
				const {nowPlayInfo, nowPlayId, setLyr, matchLyr, resetCfg} = this
				this.playInfo = nowPlayInfo(nowPlayId)
				rcfg && resetCfg()
				setLyr()
				matchLyr()
			},

			setLyr () {
				const audio = this.getAudio
				const lyric = this.copyLyric

				// 未播放的时候
                if (!lyric || !audio) {
                	this.lyricContent = [{time:0, lyr: '......'}]
                	return
                }  
                if (!lyric.oriLrc) {
                	this.lyricContent =  [{time:0, lyr: '当前音乐为纯音乐，敬请欣赏'}]
                	return
                }

                const oriLrc = lyric.oriLrc.content

                if (!oriLrc) {
                	this.lyricContent =  [{time:0, lyr: '当前音乐暂无歌词'}]
                	return
                }
                if (lyric.cnLrc) this.lyric.cnLrc.content[0].lyr = ''
               	
            	this.nowAnimateStr = util.randomStr()
                this.scrollLyr(this.nowLyrPosition)

            	this.lyricContent = oriLrc
			},

			// 把翻译歌词 和 源歌词对应起来
			matchLyr () {
				if (
					!this.lyric 	           ||
					!this.lyric.oriLrc         || 
					!this.lyric.cnLrc     	   ||
					!this.lyric.oriLrc.content ||
					!this.lyric.cnLrc.content
				) return

				this.lyricCopy        = []
				const {oriLrc, cnLrc} = this.lyric

				// 开始匹配
				oriLrc.content.forEach((ori, i) => {
					let lyr = null
					cnLrc.content.forEach((cn, j) => {
						if (ori.time === cn.time) 
							lyr = cn.lyr
					})
					this.lyricCopy.push({lyr})
				})
			},

			// 歌词滑动
			scrollLyr (i) {
				const {lyricsShowH, preIndex, nowLyrPosition} = this
				const container     = $('.lyrics-show')
				if (!container) return

				const insertBox     = container.firstElementChild
				const insertBoxH    = parseInt(util.getAttr(insertBox, 'height'))
				// 判断是否出现滚动条
				if (insertBoxH <= lyricsShowH) return
				const lyrList       = insertBox.children

				// 得到当前正在播放的歌词高度
				
				// 如果当前播放歌词的 index 小于 上一次的index 就代表是回退了
				// 相应的也要更新位置
				if (nowLyrPosition < preIndex) {this.LyrFirst   = true
				}
				// 先把已经过掉的歌词高度加上
				if (this.LyrFirst && i > 1) {
					this.LyrFirst   = false
					this.allDis     = 0
					for (let j = 0; j < i - 1; j++) {
						const nowPlayHeight = parseInt(util.getAttr(lyrList[j], 'height'))
						this.allDis += nowPlayHeight + 20
					}
				}
		
				const nowPlayHeight = parseInt(util.getAttr(lyrList[i], 'height'))
				this.preAllDis      = this.allDis
				this.allDis += nowPlayHeight + 20

				// 滑动动画
				const animateStr    = this.nowAnimateStr
				const nowMove       = this.allDis - this.preAllDis
				const singleMove    = nowMove / 12
				let   distance      = this.preAllDis
				const t = allDis => {
					if (animateStr != this.nowAnimateStr) return
					requestAnimationFrame(_ => {
						distance += singleMove
						distance > allDis && (distance = allDis)

						container.scrollTop = distance
						distance < allDis && t(allDis)
					})
				}
				i >= 1 && t(this.allDis)

				// 保存上一次的index
				this.preIndex = this.nowLyrPosition
			},

			// 重置参数
			resetCfg () {
				const container = $('.lyrics-show')
				this.LyrFirst = true
				this.allDis   = 0
				this.preIndex = 0
				this.$store.dispatch('nowLyrPosition', 0)
				container && (container.scrollTop = 0)
			},

			// 滑动事件
			exceptDom (el, e) {
				// 排除页面上的两个滑动区域
				const lyrDom  = $('.main-content *')
				const comment = $('.song-comment-box *')

				for (let i = 0; i < lyrDom.length; i++) {
					if (e.target === lyrDom[i])
						return false
				}
				for (let i = 0; i < comment.length; i++) {
					if (e.target === comment[i])
						return false
				}
			},
			mousewheel (el, e) {
				e.direction ? this.translateY = 0
							: this.translateY = -100
			}
		},
		created () {
			const {setDate, setLyr, $event} = this

			$event.off('startNewMusic')
			$event.off('nowPlayTime')
			$event.off('playChange')
			$event.off('loopPlayOver')

			$event.on('startNewMusic', _ => {
				setDate(true)
				$event.fire('songDetailReset')
			}) // 歌词开始播放新音乐
			$event.on('nowPlayTime',   _ => setLyr())  // 每次切换歌词
			$event.on('playChange',    _ => this.LyrFirst = true) // 快进后退操作
			$event.on('loopPlayOver',  _ => this.resetCfg())
			setDate()
		},

		// dom生成后
		mounted () {
			const i  		= this.nowLyrPosition
			const container = $('.lyrics-show')
			if (i == null || !container) return

			const insertBox        = container.firstElementChild
			const insertBoxH       = parseInt(util.getAttr(insertBox, 'height'))
			if (insertBoxH > this.lyricsShowH) {
				const lyrList      = insertBox.children
				let scroll         = 0
				for (let j = 0; j < i - 1; j++) {
					const nowPlayHeight = parseInt(util.getAttr(lyrList[j], 'height'))
					scroll += nowPlayHeight + 20
				}
				container.scrollTop = scroll
			}

			$('.all-container').style['overflow-x'] = 'none'
			$('.all-container').style['overflow']   = 'hidden'
		},
		beforeDestroy () {
			this.$event.off('songDetailReset')
		},
		components: {
			comment,
			containSimilar
		}
	}
</script>

<style>
	.song-detail-pic {
		filter: blur(45px);
		position: absolute;
		width: 600px;
		height: 600px;
		max-height: 100%;
		max-width: 100%;
		top: calc(50% - 300px);
		left: calc(50% - 300px);
		border-radius: 50%;
		z-index: 0;
	}
	.bg-mack-layer {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(22,24,28,.7);
		z-index: 1;
	}
	.bg-mack-layer.secend {
		top:100%;
	}
	.main-content-box {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 3;
	}
	.main-content {
		width: 100%;
		height: calc(100% - 120px);
		overflow-x: hidden;
		padding: 30px 150px;
	}

	.music-information {
		width: 100%;
		color: #fff;
		max-height: 120px;
		padding-top: 30px;
		text-align: center;
	}
	.music-information p, .music-information ul {
		width: 100%;
		overflow:hidden;
	}
	.music-information .music-name {
		font-size: 35px;
		margin-bottom: 20px;
	}
	.music-information span {
		vertical-align: text-top;
	}
	.music-information ul li {
		display: inline-block;
		font-size: 20px;
	}
	.music-information ul li:first-child {
		margin-right: 30px;
	}
	.music-information ul li:last-child {
		margin-left: 30px;
	}

	/*歌词显示*/
	.lyrics-show {
		width: 60%;
		overflow-x: hidden;
		margin: 40px auto;
		text-align: center;
		font-size: 18px;
	}
	.lyrics-container {
		width: 100%;
	}

	.lyrics-row {
		padding: 20px 0;
		text-align: center;
		margin-bottom: 20px;
	}
	.lyrics-row span {
		display: block;
		line-height: 20px;
	}
	.translation-lyr {
		margin-top: 30px;
	}
	.active-lyr {
		color: #fff !important;
	}


	/*歌曲评论和歌曲相似*/
	.comment-similar {
		overflow:hidden;
		width: 100%;
		height: 100%;
		padding: 50px 50px;
		padding-bottom: 80px;
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 2;
	}
	.comment-similar .song-comment-box {
		width: 70%;
		height: 100%;
		padding-left: 50px;
	}
	.comment-similar .song-similar-box {
		width: 25%;
	}
	.animate-songDatil {
		transition: all .7s cubic-bezier(.3, .68, .64, .87);
	    -moz-transition: all .7s cubic-bezier(.3, .68, .64, .87);
	    -webkit-transition: all .7s cubic-bezier(.3, .68, .64, .87);
	}
</style>