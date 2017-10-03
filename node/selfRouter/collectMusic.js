const mongo     = require('./mongo')
const {dealErr} = require('../util/util')

module.exports = function (app) {
	app.post('/collecMusic', (req, res, next) => {
		const {
			name, musicName, id, albumId, albumName, oringeInfo,
			singer, singerId, time, collect
		} = req.body

		if (
			!name       || 
			!musicName  ||
			!albumName  ||
			!oringeInfo ||
			!singer     ||
			time     == null ||
			id       == null || 
			albumId  == null ||
			singerId == null ||
			collect  == null
		) {
			res.send(JSON.stringify({msg: '参数错误', code: -1}))
			next()
			return
		}

		// 判断是收藏还是取消
		if (collect) {
			var change = {$pull: {collectMusic: {id}}}
			var prefix = '取消'
		} else {
			var change = {$addToSet: {collectMusic: {musicName, id, albumId, albumName, singer, singerId, time, oringeInfo}}}
			var prefix = ''
		}

		mongo((err, db) => {
			if (!dealErr(err, res, next, db)) return

			const coll = db.collection('user')
			// 查找用户
			coll.findOne({name}, (err, result) => {
				if (!dealErr(err, res, next, db)) return

				// 如果用户不存在
				if (!result) {
					res.send(JSON.stringify({msg: '用户不存在', code: -1}))
					db.close()
					next()
					return
				}

				// 跟改数据库
				coll.update(
					{name},
					change,
					(err, result) => {
						if (!dealErr(err, res, next, db)) return

					    const msg  = result.result.ok === 1 ? prefix + '收藏成功' : prefix + '收藏失败'
						const code = result.result.ok === 1 ? 1 : 0
						res.send(JSON.stringify({msg, code}))
						db.close()
						next()
					}
				)

			})
		})
	})
}