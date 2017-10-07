import Ev from '@/common/js/event'
const event = Ev.install()

export default {
	changeLoading (state, isChange) {
		state.loadingShow = isChange
	},
	showContainer (state, boole) {
        state.showContainer = boole
    },
	// 更改歌曲列表
	addMusicList (state, data) {
		// 如果歌曲列表没有歌曲，清除默认提示语句
		if (state.musicList.length === 1 && state.musicList[0].id === 0) {
			state.musicList = []
		}
		
		// 避免重复添加歌曲
		for (let i = 0; i < state.musicList.length; i++ ) {
			if (data.id === state.musicList[i].id) {
				alert('该歌曲已经在歌曲列表中了哦~')
				// 传递出当前歌曲在列表中的位置
				event.fire('playPosition', i)
				return
			}
		}
		state.musicList.unshift(data)
	},
	removeMusic (state, id) {
		for (let i = 0; i < state.musicList.length; i++ ) {
			if (id === state.musicList[i].id) {
				state.musicList.splice(i, 1)
			}
		}
	},
	changeMusicList (state, musicList) {
		state.musicList = musicList
	},
	changePlayOrder (state, order) {
		state.playOrder = order
	},
	changeAudio (state, audio) {
		state.audio = audio
	},
	changeAudioAjax (state, ajax) {
		state.audioAjax = ajax
	},
	changePlayDelay (state, judge) {
		state.playDelay.judge = judge
	},
	changeSwitchDelay (state, judge) {
		state.switchDelay.judge = judge
	},
	changeVolume (state, volume) {
		state.volume = volume
	},
	changeMainProgress (state, mainProgress) {
		if (state.mainProgress !== null) {
			// 去除上一个定时器
			clearInterval(state.mainProgress)
			state.mainProgress = null
		}

		// 添加新的定时器
		state.mainProgress =  mainProgress()
	},
	changeShinkProgress (state, shinkProgress) {
		if (state.shinkProgress !== null) {
			// 去除上一个定时器
			clearInterval(state.shinkProgress)
			state.shinkProgress = null
		}
		state.shinkProgress = shinkProgress()
	},

	// 快进后退的方法
	changeNext (state, next) {
		state.next = next
	},
	changeForward (state, forward) {
		state.forward = forward
	},
	changePlayStop (state, playStop) {
		state.playStop = playStop
	},
	changeCollectMusic (state, collectMusic) {
		state.collectMusic = collectMusic
	},

	// 歌词
	changelyric (state, lyric) {
		state.lyric = lyric
	},
	playMusicList (state, fun) {
		state.playMusicList = fun
	},
	playOneSong (state, fun) {
		state.playOneSong = fun
	},

	// 当前歌单 id
	musicListId (state, id) {
		state.musicListId = id
	},

	nowPlayId (state, id) {
		state.nowPlayId = id
	},

	// 放大 缩小控件的函数
	shrinkAnimate (state, fun) {
		state.shrinkAnimate = fun
	},
	bigAnimate (state, fun) {
		state.bigAnimate = fun
	},

	// 当前是否自动切换皮肤
	autoSwith (state, autoSwith) {
		state.autoSwith = autoSwith
	},

	// 当前皮肤
	nowSkin (state, skin) {
		state.nowSkin = skin
	},

	// 当前歌词时间
	nowLyrPosition (state, position) {
		state.nowLyrPosition = position
	},

	// 显示路由页面还是搜索页面
	showRouter (state, bool) {
		state.showRouter = bool
	},

	// 用户信息
	user (state, user) {
		state.user = user
	},

	// 登录函数
	login (state, fun) {
		state.login = fun
	},

	// 音乐下载
	download (state, fun) {
		state.download = fun
	},

	// 下载队列
	downQueue (state, data) {
		state.downQueue.push(data)
	},

	// 队列出栈
	downUnshift (state, randomStr) {
		state.downQueue.forEach((val, i) => {
			if (val.randomStr === randomStr) {
				state.downQueue.splice(i, 1)
			}
		})
	}
}