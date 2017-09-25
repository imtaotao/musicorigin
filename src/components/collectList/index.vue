<template>
	<div class="right-container">
		<!-- 歌单介绍 -->
		<music-intro class='musiclist-intro'></music-intro>
	
		<!-- 歌单内容 -->
		<music-list class='musiclist-content'></music-list>
	</div>
</template>

<script>
	import musicIntro from '@/components/songlistfrag/musicListIntro'
	import musicList from '@/components/songlistfrag/musicList'
	import {mapGetters, mapActions} from 'vuex'
	import Vue from 'vue'

	export default {
		data () {
			return {
				listId: null
			}
		},
		computed: {
			 ...mapGetters([
	            'host'
	        ])
		},
		methods: {
			init () {
				const {listId, $store, $event, getData} = this
				
				// 把当前歌单id放到 vuex
				$store.dispatch('musicListId', listId)

				// 每次切换歌单，初始化一次
				Vue.nextTick(_ => {
					$event.fire('musiclistinit', listId)
					getData()
				})
				
			},
			// 请求数据
			getData () {
				if (!this.listId) return
				const {listId, host, $event, $ajax} = this

				$ajax(host + `/playlist/detail?id=${listId}`).then(({data}) => {
					if (data.code !== 200) {
						console.error(`code is ${data.code}`)
						alert('网络不好，当前歌单获取失败~~~')
						return
					}

					$event.fire('playlistintro', data.playlist)
					$event.fire('playList', [data.playlist.tracks, data.playlist.commentCount])
				})
			}
		},
		watch: {
			'$route' (to, from) {
				this.listId = to.params.name
				this.init()
			}
		},
		created () {
			this.listId = this.$route.params.name
			this.init()
		},
		components: {
			musicList,
			musicIntro
		}
	}
</script>

<style>
	.right-container {
		width: 100%;
	    height: 100%;
	    overflow-x: hidden;
	    padding: 40px;
	}
	
	.musiclist-intro {
		margin: 20px 0 80px 0;
	}
</style>