/*获得歌单歌单评论*/
const mongo     = require('./mongo')
const Queue     = require('../util/Queue')
const {dealErr} = require('../util/util')

module.exports = function (app) {
	// 获得歌单评论
	app.get('/getListComments', (req, res, next) => {
		getComments(req, res, next, 'listComments')
	})

	// 获得歌曲评论
	app.get('/getMusicComments', (req, res, next) => {
		getComments(req, res, next, 'musicComments')
	})
}


function getComments (req, res, next, dbName) {
	let {id, limit, offset} = req.query
	if (!id) {
		res.send(JSON.stringify({msg: '参数错误'}))
		return next()
	}

	// 指定默认参数
	limit  = limit  || 20
	offset = offset || 0

	mongo(dbName, (err, db) => {
		if (!dealErr(err, res, next, db)) return

		const coll = db.collection('row' + id)

		// 默认查找 20 条
		const cursor = coll.find()
		.limit(Number(limit))
		.skip(Number(offset))
		.sort({"time": -1})
		.toArray()
		.then(result => {
			coll.stats().then(stats => {
				filterInfo(res, next, result, stats.count)
				db.close()
			})
			.catch (err => {
				res.send(JSON.stringify({result: [], count: 0}))
				db.close()
				next()
			})
		})
		.catch (err => {
			res.send(JSON.stringify({result: [], count: 0}))
			db.close()
			next()
		})			
	})
}


function filterInfo (res, next, result, count) {
	result.forEach((doc, i) => {
		Queue.on('getUser', nextFun => {
			getUser(doc.name, (nickname, avatarUrl) => {
				doc.nickname  = nickname
				doc.avatarUrl = avatarUrl
				nextFun()
			})

			// 如果当前留言有回复信息的话
			if (doc.reply.length) {
				Queue.on('getUser', nextFun => {
					getUser(doc.reply[0].name, (nickname, avatarUrl) => {
						doc.reply[0].nickname  = nickname
						doc.reply[0].avatarUrl = avatarUrl
						nextFun()
					})
				})
			}
		})
	})


	// 队列结束
	Queue.end('getUser', _ => {
		res.send(JSON.stringify({result, count}))
		next()
	})
	
	
}


function getUser (name, callback) {
	mongo((err, db) => {
		if (err) {
			console.log(err)
			callback(null, null)
		}

		db.collection('user').findOne({name}, (err, result) => {
			if (err || !result) {
				err && console.log(err)
				callback(null, null)
			}

			callback(result.nickname, result.pic)
			db.close()
		})
	})
}