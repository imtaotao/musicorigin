const bodyParser = require( 'body-parser' )

const interfaceName = [
	'./getMusic',			// 获取音频数据
	'./login',				// 登录
	'./rigist',				// 注册
	'./nickname',			// 修改昵称
	'./upPic',				// 上次头像
	'./listCollect',		// 歌单收藏
	'./collectMusic',		// 歌曲收藏
	'./allComments',		// 歌单歌曲评论
	'./getComments',        // 获取歌单歌曲评论
	'./addexperience'	    // 增加经验
]

module.exports = function (app) {
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	interfaceName.forEach(name => {
		require(name)(app)
	})
}
