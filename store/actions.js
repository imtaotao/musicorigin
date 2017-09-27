export default {
	showLoading ({state, commit}) {
		commit('changeLoading', true)
	},
	hideLoading ({state, commit}) {
		commit('changeLoading', false)
	},
    addMusicList ({state, commit}, data) {
        // 得到歌曲图片等信息
        const album     = data.album              || data.al
        const artists   = data.artists            || data.ar
        const duration  = data.duration           || data.dt
        const collectId = state.user.collectMusic || []
        const collect   = JSON.stringify(collectId).indexOf(data.id) > 0 ? true : false

        if (duration > 1000 * 60 * 15) {
            alert('该资源过大')
            return
        }

        const info = {
            id         : data.id,
            collect    : collect,
            deletes    : false,
            album      : album,
            picUrl     : album.picUrl,
            singerId   : artists[0].id,
            oringeInfo : data,
            musicInfo: [
                '', 
                data.name,
                artists[0].name,
                duration,
                '',''
            ]
        }
        
        commit('addMusicList', info)
    },
    removeMusic ({state, commit}, id) {
        commit('removeMusic', id)
    },
	changeMusicList ({state, commit}, data) {
	 	/*
        歌曲 id  id
        歌曲名字 name
        歌曲时长 duration
        歌曲头像 album.picUrl
        歌手名字 album.name
        歌手id   album.id
        */
        const info      = []
        const ids       = []
        const collectId = state.user.collectMusic || []
        data.forEach(val => {
            // 去重
            if (ids.includes(val.id)) return
            ids.push(val.id)

            // 得到歌曲图片等信息
            const album    = val.album      || val.al
            const artists  = val.artists    || val.ar
            const duration = val.duration   || val.dt
            const collect  = JSON.stringify(collectId).indexOf(val.id) > 0 ? true 
                                                                           : false
            if (duration > 1000 * 60 * 15) return
                
            info.push({
                id         : val.id,
                collect    : collect,
                deletes    : false,
                album      : album,
                picUrl     : album.picUrl,
                singerId   : artists[0].id,
                oringeInfo : val,
                musicInfo: [
                	'', 
                	val.name,
                	artists[0].name,
                	duration,
                	'',''
                ]
               
            })
        })
        // 如果顾虑后为一个空数组，就不继续进行了
        if (!info.length) {
            alert('该歌单所有资源不符合播放要求')
            return
        }
		commit('changeMusicList', info)
	},

    // 登录成功后改变当前用户的收藏状态
    resetMusicList ({state, commit}) {
        console.log(state.user)
        if (!state.user._id) return
        const data      = state.musicList
        const collectId = JSON.stringify(state.user.collectMusic)

        console.log(data)
        data.forEach(val => {
            val.collect = collectId.indexOf(val.id) > 0 ? true : false
        })
    },
    changePlayOrder ({state, commit}, order) {
        commit('changePlayOrder', order)
    },
    changeAudio ({state, commit}, audio) {
        commit('changeAudio', audio)
    },
    changeAudioAjax ({state, commit}, ajax) {
        commit('changeAudioAjax', ajax)
    },
    changePlayDelay ({state, commit}, judge) {
        commit('changePlayDelay', judge)
    },
    changeSwitchDelay ({state, commit}, judge) {
        commit('changeSwitchDelay', judge)
    },
    changeVolume ({state, commit}, volume) {
        commit('changeVolume', volume)
    },
    changeMainProgress ({state, commit}, mainProgress) {
        commit('changeMainProgress', mainProgress)
    },
    changeShinkProgress ({state, commit}, shinkProgress) {
        commit('changeShinkProgress', shinkProgress)
    },

    // 快进后退的方法
    changeNext ({state, commit}, next) {
        commit('changeNext', next)
    },
    changeForward ({state, commit}, forward) {
        commit('changeForward', forward)
    },
    changePlayStop ({state, commit}, playStop) {
        commit('changePlayStop', playStop)
    },
    changeCollectMusic ({state, commit}, collectMusic) {
        commit('changeCollectMusic', collectMusic)
    },

    // 歌词
    changelyric ({state, commit}, lyric) {
        commit('changelyric', lyric)
    },

    // 歌单播放函数（@param: id）
    playMusicList ({state, commit}, fun) {
        commit('playMusicList', fun)
    },

    // 单首歌曲播放
    playOneSong ({state, commit}, fun) {
        commit('playOneSong', fun)
    },


    // 当前歌单 id
    musicListId ({state, commit}, id) {
        commit('musicListId', id)
    },

    nowPlayId ({state, commit}, id) {
        commit('nowPlayId', id)
    },

    // 放大 缩小控件的函数
    shrinkAnimate ({state, commit}, fun) {
        commit('shrinkAnimate', fun)
    },
    bigAnimate ({state, commit}, fun) {
        commit('bigAnimate', fun)
    },

    // 当前皮肤
    nowSkin ({state, commit}, skin) {
       commit('nowSkin', skin)
    },

    // 当前播放歌词的时间
    nowLyrPosition ({state, commit}, position) {
        commit('nowLyrPosition', position)
    },

    showRouter ({state, commit}, bool) {
        commit('showRouter', bool)
    },

    // 用户信息
    user ({state, commit}, user) {
        commit('user', user)
    },
    // 登录函数
    login ({state, commit}, fun) {
        commit('login', fun)
    }
}