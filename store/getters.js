export default {
	isLoading (state) {
		return state.loadingShow
	},
	localhost (state) {
		return state.localhost
	},
	host (state) {
		return state.host
	},
	phone (state) {
		return state.phone
	},
	password (state) {
		return state.password
	},
	musicList (state) {
		return state.musicList
	},
	getPlayOrder (state) {
		return state.playOrder
	},
	getAudio (state) {
		return state.audio
	},
	shrinkAnimate (state) {
		return state.shrinkAnimate
	},
	bigAnimate (state) {
		return state.bigAnimate
	},
	audioAjax (state) {
		return state.audioAjax
	},
	playDelay (state) {
		return state.playDelay
	},
	switchDelay (state) {
		return state.switchDelay
	},
	volume (state) {
		return state.volume
	},
	mainProgress (state) {
		return state.mainProgress
	},
	shinkProgress (state) {
		return state.shinkProgress
	},
	next (state) {
		return state.next
	},
	forward (state) {
		return state.forward
	},
	playStop (state) {
		return state.playStop
	},
	collectMusic (state) {
		return state.collectMusic
	},
	lyric (state) {
		return state.lyric
	},
	playMusicList (state) {
		return state.playMusicList
	},
	playOneSong (state) {
		return state.playOneSong
	},

	// 歌单列表 id
	listId (state) {
		return state.musicListId
	},
	//正在播放歌曲 id
	nowPlayId (state) {
		return state.nowPlayId
	},

	// 根据歌曲id 得到该歌曲在播放列表中的信息
	nowPlayInfo (state) {
		return id => {
			const musicList = state.musicList

			if (!musicList) {
				alert('播放列表中没有可播放的歌曲')
			}
			
			let nowInfo   = null
			musicList.forEach(val => {
				if (val.id === id) 
					nowInfo = val
			})

			return nowInfo
		}
	},

	// 当前皮肤
	nowSkin (state) {
		return state.nowSkin
	},

	nowLyrPosition (state) {
		return state.nowLyrPosition
	},

	showRouter (state) {
		return state.showRouter
	},
	user (state) {
		return state.user
	},

	// 重置收藏状态
	resetCollect (state) {
		return listArr => {
			const collectId = JSON.stringify(state.user.collectMusic)
			listArr.forEach(val => {
				val.collect = collectId.indexOf(val.id) > 0 ? true : false
			})	
		}
	},
	login (state) {
		return state.login
	},
	download (state) {
		return state.download
	},
	downQueue (state) {
		return state.downQueue
	}
}