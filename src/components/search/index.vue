<template>
	<div class='search-main-container'>
		<div class="search-content">
			<p class='search-main-title'>
				<span class='Gray'>搜索</span>
				<span class='White'>{{name}}</span>
				<span class='Gray'>结果有{{total}}条</span>
			</p>

			<ul class='title-ul'>
				<li v-for='key in title' class='lf' @click='titleClick(key)'>
					<span>{{key}}</span>
				</li>
			</ul>
			
			<music-list :showMusicList='musicList'></music-list>
			
			<!-- 加载更多 -->
			<div class="load-more search-load-more" v-show='loadCount !== total'>
				<span class="animate" @click='loadMore'>加载更多</span>
			</div>
		</div>
	</div>
</template>

<script>
	import down      from '@/common/js/download'
	import Queue     from '@/common/js/Queue'
	import {mapGetters, mapActions} from 'vuex'
	import musicList from './musicList'

	export default {
		data () {
			return {
				// 标题
				title      : ['全部播放', '全部下载'],

				name       : null,
				loadCount  : null,
				total      : 0,
				page       : 0,
				oringeList : [],
				musicList  : []
			}
		},
		computed: {
			...mapGetters([
				'host',
				'forward',
				'user',
				'download',
				'resetCollect'
			])
		},
		methods: {
			// 标题点击事件
			titleClick (key) {
				if (key === '全部播放') this.playAll()
				if (key === '全部下载') this.downAll()
			},
			playAll () {
				const {$store, oringeList, forward} = this
				$store.dispatch('changeMusicList', oringeList)
				forward(0)
			},
			downAll () {
				this.musicList.forEach(song => {
					const {id, name, oringeInfo} = song

					this.download(id, name, oringeInfo)
				})
			},
			reset (name) {
				this.name       = name
				this.loadCount  = null,
				this.total      = 0,
				this.page       = 0,
				this.oringeList = [],
				this.musicList  = []
			},
			// 得到歌曲信息
			loadMore () {
				this.page++
				this.getInfo()
			},
			filter (list) {
				let arr = []
				const collectId = JSON.stringify(this.user.collectMusic)

				list.forEach(val => {
					// 当前搜索到的歌曲列表有哪些已经被收藏
					const collect = collectId.indexOf(val.id) > 0 ? true : false

					arr.push({
						id        : val.id,
						name      : val.name,
						singer    : val.artists[0].name,
						singerId  : val.artists[0].id,
						time      : val.duration,
						albumId   : val.album.id,
						albumName : val.album.name,
						oringeInfo: val,
						collect   : collect
					})
				})

				return arr
			},
	        getInfo () {
	        	const {$ajax, name, page, oringeList, musicList, filter} = this

	            $ajax.get(this.host + `/search?keywords=${name}&offset=${30 * page}`).
	            then(({data}) => {
	                const res = data.result
	                if (!res.songs || res.songs.length === 0) {
	                	alert('暂无搜索结果')
	                	this.loadCount = 0
	                	return
	                }

	                const {songCount, songs} = res
	          
	                this.total      = songCount || 0
	                this.loadCount  += songs.length
	                this.oringeList = oringeList.concat(songs)
	                this.musicList  = musicList.concat(filter(songs))
	            })
	        }
	        
		},
		created () {
			this.name = this.$route.params.name
			this.getInfo()
			this.$event.on('searchInit', _ => {
				this.reset(this.$route.params.name)
				this.getInfo()
			})

			this.$event.on('resetCollect', _ => this.resetCollect(this.musicList))
		},
		beforeDestroy () {
			// 销毁注册的事件
			this.$event.off('searchInit')
			this.$event.off('resetCollect')
		},
		components: {
			musicList
		}
	}
</script>

<style>
	.search-main-container {
		height: 100%;
		padding: 20px 50px;
		overflow-x: hidden;
		padding-bottom: 40px;
	}
	.search-content {
		width: 100%;
		/*height: 100%;*/
	}
	.search-main-title {
		width: 100%;
		height: 45px;
		line-height: 25px;
		font-size: 16px;
		padding: 10px;
		border-radius: 2px;
		background: rgba(255,255,255,.1);
		margin-bottom: 15px;
	}
	.search-main-title span {
		margin-right: 10px;
	}
	.search-content .load-more {
		margin: 30px 0 0 0;
		height: 100px;
	}

	.search-content .title-ul {
		width: 100%;
		overflow:hidden;
	}

	.search-content .title-ul li {
		width: 10%;
		min-width: 100px;
		text-align: center;
		height: 35px;
		line-height: 35px;
		border-radius: 5px;
		background: rgba(255,255,255,.1);
		cursor: pointer;
		color: #a4b5b9;
		margin: 0 10px 15px 0;
	}
	.search-content .title-ul li:hover {
		color: #fff;
		background: rgba(255,255,255,.2);
	}
	.search-content .title-ul li span {
		cursor: pointer;
	}
</style>









