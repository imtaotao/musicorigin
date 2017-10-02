const http    = require('http')
const request = require('request')

module.exports = function (app) {
	app.get('/download', (req, res, next) => {
		// 获取歌曲id
		const {url} = req.query
		if (!url || url === 'null') {
			res.send(JSON.stringify({msg: '参数错误'}))
			return next()
		}

		// getUrl(id, (err, url) => {
			// if (err) {
			// 	console.log(err)
			// 	res.send(JSON.stringify({msg: '服务器发生错误'}))
			// 	return next()
			// }

			// // 如果没有 url 
			// if (!url) {
			// 	res.send(JSON.stringify({msg: '暂无数据'}))
			// 	return next()
			// }

			// 根据得到的 url，获取歌曲资源
			request(url).pipe(res)
		// })
	})
}


// 得到音乐的 url 
// function getUrl (id, callback) {
// 	request('http://localhost:8081/music/url?id=' + id, (err, res, body) => {
// 		if (err) return callback(err, null)
		
// 		const {data} = JSON.parse(body)

// 		if (!data) return callback(null, null)
		
// 		callback(null, data[0].url)
// 	})
// }