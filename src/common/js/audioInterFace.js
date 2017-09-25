export default {
	play (status) {
		// false 暂停， true 播放
		console.log(status)
	},
	// 切换歌曲
	forward (id) {
		console.log('快进', id)
	},
	// true 收藏，false 取消收藏
	collect ({id, status}) {
		console.log(status, id)
	},
	loop (key) {
		console.log(key)
	},
	deleteMusic (id) {
		console.log(id)
	},
	// 滑动条
	volumeChange (precent) {
		console.log(precent)
	},
	volumeInput (precent) {
		console.log(precent)
	},
	playChange (precent) {
		console.log(precent)
	},
	playInput (precent) {
		console.log(precent)
	},
	// 均衡器滑动条
	equalizer (type, callback) {
		console.log(type)
	},
	equalizerChange (HZ, data) {
		console.log(HZ, data)
	}
}