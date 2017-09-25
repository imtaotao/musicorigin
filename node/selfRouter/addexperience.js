/*增加经验*/
const mongo     = require('./mongo')
const EX        = require('./expreience')
const {dealErr} = require('../util/util')


module.exports = function (app) {
	app.get('/addexperience', (req, res, next) => {
		const {name} = req.query
		if (!name) {
			res.send(JSON.stringify({msg: '参数错误', code: -1}))
			return next()
		}

		// 正式开始
		mongo((err, db) => {
			if (!dealErr(err, res, next, db)) return

			// 先获取该用户原先的数据
			const coll = db.collection('user')

			coll.findOne({name}, (err, userInfo) => {
				if (!dealErr(err, res, next, db)) return
				if (!userInfo) {
					res.send(JSON.stringify({msg: '该用户不存在', code: 0}))
					return next
				}

				const {grade, ex} = userInfo
				const gradeInfo   = level(grade, ex)

				coll.update(
					{name},
					{$set: gradeInfo},
					(err, {result}) => {
						if (!dealErr(err, res, next, db)) return

						if (result.ok !== 1) {
							res.send(JSON.stringify({msg: '入库出错', code: 0}))
							return next()
						}

						gradeInfo.allEx = allEx(gradeInfo.grade) + gradeInfo.ex
						res.send(JSON.stringify({msg: '增加成功', result: gradeInfo, code: 1}))
						next()
						db.close()
					}
				)
			})
		})
	})
}


function level (grade, ex) {
	let obj = {grade, ex: ex + 1}

	// 判断当前经验值有没有升级
	const nextGrade = EX[grade + 1]
	if (obj.ex >= nextGrade) {
		obj.grade++
		obj.ex = obj.ex - nextGrade
	}

	obj.percent = obj.ex / EX[grade + 1]
	return obj
}

function allEx (grade) {
	let ex = 0
	for (let i = 0; i < grade; i++) {
		ex += EX[grade] 
	}
	return ex
}