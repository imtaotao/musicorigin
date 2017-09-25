<template>
	<div>
		<!-- banner图 -->
		<div class="banner-box">
			<div class="banner-container">
				<i class="banner-pre" @click='preImg' v-ripple="'#53FDD6'"></i>
				<div v-banner='getBannerUrl' 
					@mouseenter='bannerStop'
					@mouseleave='bannerContinue'>
					</div>
				<i class="banner-next" @click='nextImg' v-ripple="'#53FDD6'"></i>
			</div>
			<ul>
				<li v-for='(key, i) in urlArr' 
				class="position-btn lf" 
				:class="positionActive(i)"
				@mouseenter='specify(i)'
				:style='{width: (100 / urlArr.length) - 5 + "%"}'></li>
			</ul>
		</div>
		<!-- 推荐歌单 -->
		<div class="song-list-box">
			<p class="mudule-title">
				<span class="lf">推荐歌单</span>
				<span class="rt" @click='toRouter("songList")'>更多&gt;&gt;</span>
			</p>
			<ul>
				<li v-for='(key, i) in songList' class="songList-content lf">
					<div class="song-list-img">
						<span class="play-count">
							<i></i>
							{{key.playCount}}
						</span>
						<span class="song-list-play animate"><i @click='playMusicList(key.id)'></i></span>
						<div class="edit-recommend animate">
							<a>{{key.copywriter}}</a>
						</div>
						<img :src='key.picUrl'>
						<b class="mask-layer" :title='key.copywriter' @click='musicList(key.id)'></b>
					</div>
					<p class="song-list-description">
						<a href="#">{{key.name}}</a>
					</p>
				</li>
			</ul>
		</div>
		<!-- 推荐新音乐 -->
		<div class="new-songs">
			<p class="mudule-title">
				<span class="lf">推荐新音乐</span>
				<span class="rt" @click='toRouter(null)'>更多&gt;&gt;</span>
			</p>
			<ul class="new-music-content">
				<li v-for='(key, i) in newMusic' class="lf">
					<div class="lf ranking">
						<span>{{i + 1}}</span>
					</div>
					<div class="lf musicPic">
						<span @click='playOneSong(key.song)'><i></i></span>
						<img :src="key.picUrl" width="60" height="60">
						<b class="mask-layer"></b>
					</div>
					<div class="lf musicInfo">
						<span class="hidden-text">{{key.name}}</span>
						<span class="hidden-text">{{key.authorName}}</span>
					</div>
				</li>
			</ul>
		</div>
		<!-- 推荐电台 -->
		<div class="radio-station">
			<p class="mudule-title">
				<span class="lf">推荐电台</span>
				<span class="rt" @click='toRouter(null)'>更多&gt;&gt;</span>
			</p>
			<ul class="radio-content">
				<li class='lf' v-for='(key, i) in anchorRadio'>
					<div class="radio-img lf">
						<span><i @click='playOneSong(key.program.mainSong)'></i></span>
						<img :src="key.picUrl" width="80" height="80">
						<b class="mask-layer"></b>
					</div>
					<div class="radio-discription lf">
						<span class="hidden-text">{{key.copywriter}}</span>
						<span class="hidden-text">{{key.name}}</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	export default {
		data () {
			return {
				urlArr	    : [],
				openUrl	    : [],
				bannerActive: 0,
				banner      : null,

				// 推荐歌单
				songList    : [],
				newMusic    : [],

				// 主播电台
				anchorRadio : []
			}
		},
		computed: {
	    	...mapGetters([
	            'host',
	            'forward',
	            'playOneSong',
	            'playMusicList'
	    	])
	    },
	    methods: {
	    	// 轮播
	    	getBannerUrl (callback) {
	    		this.$event.on('banner', url => {
	    			if (callback) {
	    				const banner = this.banner = callback(url.data, {
							swap : true,		// 是否两种模式交替进行
							mount: 8,			// 柱子数量或圆圈数量
							time : 3000, 		// 图片切换间隔时间
							speed: 8
		    			})

	    				// 打开轮播图片的链接
	    				banner.__proto__.click = _ => {
	    					const url = this.openUrl[banner.getIndex()]
	    					if (!url) {
	    						alert('当前图片没有链接(⊙o⊙)')
	    						return
	    					}
	    					window.open(url)
	    				}
	    				// 当前图片的索引
	    				banner.start = _ => {
	    					this.bannerActive = banner.getIndex()
	    				}
	    			}
	    		})
	    	},
	    	bannerStop () {
	    		this.banner && this.banner.stop()
	    	},
	    	bannerContinue () {
				this.banner && this.banner.continue()
	    	},
	    	positionActive (i) {
	    		if (i === this.bannerActive) {
	    			return 'banner-active'
	    		}
	    	},
	    	specify (i) {
	    		const banner = this.banner
	    		if (!banner) return
	    		banner.specify(i)
	    	},
	    	preImg () {
	    		this.banner.preImg()
	    	},
	    	nextImg () {
	    		this.banner.nextImg()
	    	},

	    	// 点击更多跳转路由
	    	toRouter (name) {
	    		let url
	    		name === 'songList' && (url = '/findMusic/songList')

	    		if (name === null)  alert('这个功能我还没有写完 /(ㄒoㄒ)/~~')
	    		!!url && this.$router.push(url)
	    	},

	    	// 进入歌单详情页面
	    	musicList (listId) {
	    		if (!listId && listId != 0) return
	    		this.$router.push(`/collectList/${listId}`)
	    		this.$event.off('musiclistinit')
	    	}
	    },
		created () {
			const host = this.host
			// 请求 banner 图片
			this.$ajax.get(host + '/banner').then(({data}) => {
				if (data.code !== 200) {
					console.error(`code is ${data.code}`)
					alert('网络不好，banner 图拿不到~~~')
					return
				}
				data.banners.forEach(url => {
					this.urlArr.push(url.pic)
					this.openUrl.push(url.url)
				})
				this.$event.fire('banner', this.urlArr)
			})

			// 请求推荐歌单
			this.$ajax.get(host + '/personalized').then(({data}) => {
				if (data.code !== 200) {
					console.error(`code is ${data.code}`)
					alert('网络不好，改歌单数据拿不到~~~')
					return
				}

				this.songList  = []
				const {result} = data
				// 拿到需要的数据
				result.forEach(val =>{
					let {name, picUrl, alg, id, playCount, copywriter} = val
					if (playCount > 10000) {
						playCount = parseInt(playCount / 10000) + '万'
					}
					this.songList.push({name, picUrl, alg, id, playCount, copywriter})
				})

			})


			// 请求新音乐
			this.$ajax.get(host + '/personalized/newsong').then(({data}) => {
				if (data.code !== 200) {
					console.error(`code is ${data.code}`)
					alert('网络不好，新音乐数据拿不到~~~')
					return
				}
				
				this.newMusic = []
				const {result} = data
				result.forEach(val => {
					const {name, song} = val
					const picUrl       = song.album.picUrl
					const authorName   = song.artists[0].name
					this.newMusic.push({name, picUrl, authorName, song})
				})
			})

			// 请求主播电台
			this.$ajax.get(host + '/personalized/djprogram').then(({data}) => {
				if (data.code !== 200) {
					console.error(`code is ${data.code}`)
					alert('网络不好，主播电台数据拿不到~~~')
					return
				}
				
				this.anchorRadio = []
				const {result} = data
				result.forEach(val => {
					const {id, copywriter, picUrl, name} = val
					this.anchorRadio.push({id, copywriter, picUrl, name, program: val.program})
				})
			})
		}
	}
</script>

<style scoped>
	.banner-container,.song-list-box,.new-songs,.radio-station {
		border-radius: 5px;
		width: 100%;
	}
	
	/*每个模块头部*/
	.mudule-title {
		width: 100%;
		padding: 20px 0;
		overflow: hidden;
		border-bottom: .5px solid rgba(255, 255, 255, .1)
	}
	.mudule-title span:first-child {
		color: #fff;
		font-size: 18px;
	}
	.mudule-title span:last-child {
		cursor: pointer;
	}
	.mudule-title span:last-child:hover {
		color: #fff;
	}
	.banner-box {
		width: 100%;
		padding-top: 15px;
	}
	.banner-box ul {
		width: 30%;
		margin:20px auto;
		overflow: hidden;
	}
	.banner-container {
		height: 300px;
		position:relative;
		background: rgba(255, 255, 255, .15);
	}
	.banner-container>div {
		width: 70%;
		height: 100%;
		position: absolute;
		left: 15%;
		border-radius: 5px;
	}
	.banner-container i {
		display: inline-block;
		position: absolute;
		width: 40px;
		height: 60px;
		border-radius: 2px;
		cursor: pointer;
		top: calc(50% - 30px);
	}
	.banner-container i:hover {
		background-color: rgba(0, 0, 0, .3);
	}
	.banner-pre {
		background: url('~static/img/banner.png') no-repeat 0 -360px;
		left: 5%;
	}
	.banner-next {
		background: url('~static/img/banner.png') no-repeat 0 -508px;
		right: 5%;
	}
	.position-btn {
		height: 5px;
		border-radius: 5px;
		background: rgba(255, 255, 255, .1);
		width: calc(15% - 10px);
		margin-left: 10px;
		cursor: pointer;
	}
	.position-btn:first-child {
		margin: 0
	}
	.banner-active {
		background: #1fbce3;
	}

	/*歌单*/
	.song-list-box {
		width: 100%;
	}
	.song-list-box ul {
		width: 100%;
		overflow:hidden;
	}
	.songList-content {
		width: 180px;
		margin-top: 20px;
		margin-right: calc(20% - 180px);
	}
	.songList-content:nth-child(5n + 1) {
		margin-left: calc(10% - 90px);
	}
	.songList-content:nth-child(5n) {
		margin-right: calc(10% - 90px);
	}
	.play-count {
		display: inline-block;
		position: absolute;
		width: 65%;
		height: 20px;
		top: 0;
		right:0;
		color: #fff;
		padding: 3px 10px;
		font-size: 11px;
		text-align: right;
		background: -webkit-gradient(linear,left top, right bottom, from(rgba(0,0,0,0)), to(rgba(0,0,0,.5)));
	}
	.play-count i {
		display: inline-block;
		height: 10px;
		width: 10px;
		background: url('~static/pageimg/playCount.png') no-repeat;
	}
	.song-list-play {
		position: absolute;
	    width: 30px;
	    height: 30px;
	    background: rgba(0,0,0,.4);
	    right: 5px;
	    bottom: 5px;
	    border-radius: 50%;
	    opacity: 0;
	    z-index: 9999;
	}
	.song-list-play:hover {
		 background: rgba(0,0,0,.8);
	}
	.song-list-play i {
		position: absolute;
	    width: 100%;
	    height: 100%;
	    cursor: pointer;
	    background: url('~static/pageimg/musicPlayIcon.png') no-repeat;
	}
	.song-list-img {
		width: 180px;
		height: 180px;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		font-size:15px;
	}
	.song-list-img img {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}
	.edit-recommend {
		width: 100%;
		height: 0;
		position: absolute;
		top: 0;
		background: rgba(0, 0, 0, .8);
		border-bottom: .5px solid rgba(255, 255, 255, .2);
		overflow: hidden;
	}
	.edit-recommend a {
		max-width: 100%;
		position: absolute;
		color: #fff;
		padding: 10px;
		overflow:hidden;
		line-height: 26px;
		cursor: pointer;
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 

	}
	.song-list-img:hover .edit-recommend {
		height: 40%;
	}
	.song-list-img:hover .song-list-play {
		opacity: 1;
	}
	.song-list-description {
		width: 100%;
		margin:5px 0;
	}
	.song-list-description a {
		display: inline-block;
		font-size:14px;
		line-height: 20px;
		height: 40px;
		color: #e3e3e3;
		text-overflow:ellipsis;
		display:-webkit-box;
		overflow:hidden;
		padding: 3px;
		border-radius: 3px;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 
	}
	.song-list-description a:hover {
		color: #fff;
	}

	/*推荐新音乐*/
	.new-music-content {
		width: 100%;
		box-shadow: 0 0 1px rgba(255,255,255,.5);
		overflow: hidden;
	}
	.new-music-content li {
		width: 50%;
		height: 80px;
		overflow: hidden;
		padding:10px 15px;	
	}
	.new-music-content li:hover {
		background: rgba(255, 255, 255, .2) !important;
	}
	.new-music-content li:hover .musicInfo span {
		color: #fff;
	}
	.new-music-content li:nth-child(2n + 1) {
		border-right: .5px solid rgba(208, 210, 211, .3);
	}
	.new-music-content li:nth-child(3) {
		background: rgba(255, 255, 255, .1);
	}
	.new-music-content li:nth-child(4) {
		background: rgba(255, 255, 255, .1);
	}
	.new-music-content li:nth-child(7) {
		background: rgba(255, 255, 255, .1);
	}
	.new-music-content li:nth-child(8) {
		background: rgba(255, 255, 255, .1);
	}
	.ranking {
		width: 10%;
		height: 60px;
		text-align: center;
	}
	.ranking span {
		line-height: 60px;
	}
	.musicPic {
		width: 60px;
		height: 60px;
		margin-left: 20px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	.musicPic span {
		position: absolute;
		width: 30px;
		height: 30px;
		background: rgba(0,0,0,.4);
		top:calc(50% - 15px);
		left: calc(50% - 15px);
		border-radius: 50%;
	}
	.musicPic span i {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 9999;
		cursor: pointer;
		background: url('~static/pageimg/musicPlayIcon.png') no-repeat;
	}
	.musicPic:hover span {
		background: rgba(0,0,0,.8);
	}
	.musicInfo {
		width: calc(90% - 100px);
		height: 60px;
		margin-left: 20px;
	}
	.musicInfo span {
		display: block;
		width: 100%;
		height: 50%;
		line-height: 30px;
		font-size: 16px;
		cursor: pointer;
	}
	.musicInfo span:first-child {
		color: #dfdfdf;
	}
	.musicInfo span:last-child {
		color: #e3e3e3;
		font-size: 14px;
	}

	/*主播电台*/
	.radio-content {
		overflow: hidden;
		margin-bottom: 50px;
		border-bottom: .5px solid rgba(255, 255, 255, .1);
	}
	.radio-content li{
		height: 100px;
		width: 47%;
		margin-top: 5px;
		padding: 10px 15px;
		border-bottom: .5px solid rgba(255, 255, 255, .03);
	}
	.radio-content li:nth-child(2n) {
		margin-left: 3%;
	}
	.radio-content li:nth-child(2n + 1) {
		margin-right: 3%;
	}
	.radio-img {
		height: 80px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	.radio-img:hover span {
		background: rgba(0,0,0,.8);
	}
	.radio-img span {
		position: absolute;
	    width: 30px;
	    height: 30px;
	    background: rgba(0,0,0,.4);
	    right: 5px;
	    bottom: 5px;
	    border-radius: 50%;
	}
	.radio-img span i {
		position: absolute;
	    width: 100%;
	    height: 100%;
	    cursor: pointer;
	    z-index: 9999;
	    background: url('~static/pageimg/musicPlayIcon.png') no-repeat;
	}
	.radio-discription {
		margin-left: 30px;
		width: calc(100% - 110px);
		padding: 10px 0;
	}
	.radio-discription span {
		display: block;
		width: 100%;
		height: 30px;
	}
	.radio-discription span:first-child {
		color: #e0e1e1;
	}
	.radio-discription span:last-child {
		color: #ccc;
		font-size: 14px;
	}
	.radio-discription span:last-child:hover {
		color: #fff;
	}
</style>