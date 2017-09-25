<template>
	<div>
		<div class="nav-tab">
			<span class="lf">标签：</span>
			<ul class="nav-ul lf">
				<li v-for='key in navTab' class="lf" :class='key === nowType ? "active-nav-tab" : ""'>
					<span @click='toggleTab(key)' class='Gray'>{{key}}</span>
				</li>
			</ul>
		</div>

		<!-- 内容 -->
		<div class="song-list">
			<li v-for='(key, i) in songList' class="songList-content lf">
				<div class="song-list-img">
					<span class="play-count">
						<i></i>
						{{key.playCount}}
					</span>
					<span class="song-list-play animate"><i @click='playMusicList(key.id)'></i></span>
					<img :src='key.coverImgUrl' width="220" height="220">
					<b class="mask-layer" @click='musicList(key.id)'></b>
				</div>
				<p class="song-list-description">
					<a href="#">{{key.name}}</a>
				</p>
			</li>
		</div>

		<!-- 分页 -->
		<div class="Paging-tab">
			<span @click='changeActive("less")' class="left-btn" v-ripple="'#53FDD6'"><i></i></span>
			<div class="paging-box">
				<div class="paging-content animate" :style="{
					width: (listPage - 1) * 40 + 'px',
					transform: 'translateX('+ -translate * 40 +'px)'
					}">
					<span 
						v-for='(key, i) in listPage - 1' 
						:class='i + 1 === nowActive ? "acive-btn" : ""'
						@click='toPage(i + 1)'>{{key}}
					</span>
				</div>
			</div>
			<span v-show='omitted'>. . .</span>
			<span 
				:class='listPage === nowActive ? "acive-btn" : ""'
				@click='toPage(listPage)'>{{listPage}}</span>
			<span @click='changeActive("add")' class="right-btn" v-ripple="'#53FDD6'"><i></i></span>
		</div>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'

	export default {
		data () {
			return {
				nowType  : '华语',
				navTab   : ['华语', '流行', '摇滚', '民谣', '电子', '轻音乐', '影视原音', '怀旧', 'ACG', '治愈' ],
				listPage : 1,
				nowActive: 1,
				translate: 0,
				omitted  : true,
				songList : []
			}
		},
		computed: {
			...mapGetters([
	            'host',
	            'playMusicList'
	    	])
		},
		methods: {
			toggleTab (name) {
				if (this.nowType === name) return
				this.nowType = name
				this.getContent()
			},
			getContent (offset = 0) {
				const name = this.nowType
				const url  = `search?keywords=${name}&limit=20&offset=${offset * 20}&type=1000`

				this.$ajax.get(this.host + '/' + url).then(({data}) => {
					if (data.code !== 200) {
						console.errpr(`code is ${data.code}`)
						alert('该歌单获取数据失败~')
						return
					}

					this.songList  					 = []
					const {result} 					 = data
					const {playlistCount, playlists} = result
					this.listPage                    = Math.ceil(playlistCount / 20)

					playlists.forEach(val => {
						let {id, coverImgUrl, playCount, name} = val
						if (playCount > 10000) {
							playCount = parseInt(playCount / 10000) + '万'
						}
						this.songList.push({id, coverImgUrl, playCount, name})
					})
				})
			},
			// 分页
			toPage (i) {
				if (i === this.nowActive) return
				this.nowActive = i
				this.nowPosition()
			},
			changeActive (name) {
				name === 'add' ? this.nowActive++ : this.nowActive--
				this.nowActive < 1 ? this.nowActive = 1
								   : this.nowActive > this.listPage
								   ? this.nowActive = this.listPage
								   : this.nowActive 	
				this.nowPosition()
			},
			// 判断当前位置
			nowPosition () {
				const now  = this.nowActive
				const list = this.listPage
				const i    = now - 1
				this.translate = i

				this.translate < 0 ? this.translate = 0 
								   : this.translate > list - 6 
								   ? this.translate = list - 6
								   : this.translate

				this.translate === list - 6 ? this.omitted = false
											: this.omitted = true

				this.getContent(this.nowActive - 1)
			},

			// 进入歌单详情页面
	    	musicList (listId) {
	    		if (!listId && listId != 0) return
	    		this.$router.push(`/collectList/${listId}`)
	    		this.$event.off('musiclistinit')
	    	}
		},
		created () {
			this.getContent()
		}
	}
</script>

<style scoped>
	.nav-tab {
		width: 100%;
		height: 30px;
		margin: 20px 0;
		overflow: hidden;
	}
	.nav-tab>span {
		display: block;
		width: 10%;
		line-height: 30px;
	}
	.nav-ul {
		width: 80%;
	}
	.nav-ul li {
		width: 10%;
		text-align: center;
	}
	.nav-ul li span {
		display: inline-block;
		width: 100%;
		height: 10px;
		margin-top:10px;
		line-height: 10px;
		font-size: 14px;
		cursor: pointer;
		border-right: .5px solid #cdcdcd;
	}
	.nav-ul li:last-child span {
		border-right: none;
	}
	.nav-ul li span:hover {
		text-decoration: underline;
	}

	/*歌单内容*/
	.song-list {
		width: 100%;
		padding: 0 10px;
		overflow: hidden;
		margin-bottom: 50px;
	}
	.songList-content {
		display: inline-block;
		width: 200px;
		margin-bottom: 30px;
		overflow: hidden;
		border-radius: 10px;
		margin-right: calc(25% - 200px);
	}
	.songList-content:nth-child(4n + 1) {
		margin-left: calc(12.5% - 100px);
	}
	.songList-content:nth-child(4n) {
		margin-right: calc(12.5% - 100px);
	}
	.song-list-img {
		width:100%;
		height: 200px;
		position: relative;
		font-size:15px;
	}
	.song-list-img img {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}
	.song-list-img:hover .mask-layer {
		background-color: rgba(0,0,0,.2);
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
		height: 40px;
		line-height: 20px;
		color: #ccc;
		text-overflow:ellipsis;
		display:-webkit-box;
		overflow:hidden;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 
	}
	.song-list-description a:hover {
		color: #fff;
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
	.active-nav-tab span{
		font-weight: bold;
		color: #fff;
		text-decoration: underline;
	}

	/*分页按钮*/
	.Paging-tab {
		height: 30px;
		width: 400px;
		margin: 0 auto;
		text-align: center;
		margin-bottom: 20px;
	}
	.Paging-tab .paging-box {
		display: inline-block;
		width: 200px;
		height: 30px;
		vertical-align: middle;
		overflow: hidden;
	}
	.Paging-tab span {
		display: inline-block;
		width: 30px;
		height: 30px;
		line-height: 30px;
		cursor: pointer;
		font-size: 12px;
		margin-left: 10px;
		vertical-align: middle;
	}
	.Paging-tab .left-btn {
		background:url('~static/pageimg/left-btn.png') no-repeat 5px 5px;
	}
	.Paging-tab .right-btn {
		background:url('~static/pageimg/right-btn.png') no-repeat 5px 5px;
	}
	.Paging-tab span:hover {
		background-color: rgba(255, 255, 255, .2);
	}
	.acive-btn {
		color: #17a6b9;
    	text-decoration: underline;
	}
</style>