export default {
	// 接口地址
	host			: 'http://localhost:8081',
	// host			: 'http://39.108.72.180:8081/',

	// 默认登录的网易云音乐账号
	phone           : 15211133566,
	password		: 'chentao1994',

	// 加载图标
	loadingShow		: false,

	// 当前歌曲列表
	musicList 		: [{
		id: 0, 
		collect:  false, 
		deletes : false,
		album : {},
		singerId: 0,
		picUrl: 'static/img/music.jpg',
		musicInfo: ['', '暂无', '暂无', '0', '', '']
	}],

	// 播放顺序，默认为顺序播放
	playOrder		: '顺序',

	// 音频实例
	audio 			: null,

	// 控件的缩小 放大
	shrinkAnimate   () {},
	bigAnimate 	    () {},
	// ajax 实例
	audioAjax		: null,

	// 播放延时，切花歌曲延时
	playDelay		: {judge: true, time: 1500},
	switchDelay		: {judge: true, time: 2500},
	volume			: 0.5,
	// 住进度条
	mainProgress	: null,
	shinkProgress	: null,
	next			: () => {},
	forward			: () => {},
	playStop		: () => {},
	collectMusic	: () => {},

	// 当前播放歌曲歌词
	lyric			: null,

	// 歌单播放函数
	playMusicList   () {},

	// 单首歌曲播放函数
	playOneSong     () {},

	// 当前歌单 id
	musicListId		: null,

	// 当前歌曲 id
	nowPlayId		: null,

	// 当前皮肤
	nowSkin			: null,

	// 当前播放的歌词位置
	nowLyrPosition  : 0,

	// 显示路由页面（对应的是搜索页面）
	showRouter      : true,

	// 用户信息
	user            : (_ => {
		const user = localStorage.getItem('user')
		if (user) return JSON.parse(user)

		return {
			_id          : null,
			nickname     : '--',
			pic	  	     : 'static/img/defaultPic.jpg',
			grade	     : '--',
			ex           : 0,
			percent      : 0,
			collectList  : [],
			collectMusic : []
		}
	})(),

	// 登录函数
	login           : _ => {}
}