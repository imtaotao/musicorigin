/*登录*/
const mongo = require('./mongo')

function dealErr (err, res, next, db) {
	if (err) {
		console.log(err)
		db.close()
		res.send(JSON.stringify({msg: '服务器发生错误'}))
		next()
		return false
	}
	return true
}

module.exports = function (app) {
	app.post('/login', (req, res, next) => {
		const {name, pwd} = req.body
		if (!name || !pwd) {
			res.send(JSON.stringify({msg: '参数错误'}))
			next()
			return
		}

		mongo((err, db) => {
			if (!dealErr(err, res, next, db)) return

			// 查找用户
			const collection = db.collection('user')
			collection.findOne({name, pwd}, (err, result) => {
				if (!dealErr(err, res, next, db)) return

				if (!result) {
					res.send(JSON.stringify({msg: '账号或者密码错误'}))
					db.close()
					next()
					return
				}

				res.send(JSON.stringify({msg: '登录成功', data: result}))
				db.close()
				next()
			})

		})
	})
}