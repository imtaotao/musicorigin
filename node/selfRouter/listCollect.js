/*收藏歌单*/
const mongo     = require('./mongo')
const {dealErr} = require('../util/util')


module.exports = function (app) {
	app.post('/listCollect', (req, res, next) => {
		const {name, id, collect, listName} = req.body
		if (!name || !id || collect == null || !listName) {
			res.send(JSON.stringify({msg: '参数错误', code: -1}))
			next()
			return
		}

		// 查找用户
		mongo((err, db) => {
			if (!dealErr(err, res, next, db)) return

			const coll = db.collection('user')
			coll.findOne({name}, (err, result) => {
				if (!dealErr(err, res, next, db)) return

				if (!result) {
					res.send(JSON.stringify({msg: '用户不存在',code: -1}))
					return next()
				}

				// 根据条件判断是取消收藏还是收藏
				if (collect) {
					var change = {$pull: {collectList: {id, listName}}}
					var prefix = '取消'
				} else {
					var change = {$addToSet: {collectList: {id, listName}}}
					var prefix = ''
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
						next()
						db.close()
					}
				)
			})
		})
	})
}