<template>
	<div>
		<comment-list :comments='hotComments' :name='"精彩评论"' v-if='hotComments.length'>
		</comment-list>
		<comment-list :comments='comments' :name='"所有评论"'>
		</comment-list>

		<div class="load-more" v-show='conmentCount !== total && total !== null'>
			<span class="animate" @click='loadMore'>加载更多</span>
		</div>
	</div>
</template>

<script>
	import commentList from '@/components/songlistfrag/commentDetail'
	import {mapGetters, mapActions} from 'vuex'
	export default {
		data () {
			return {
				page		 : 0,
				conmentCount : 0,
				total        : null,

				// 评论数据
				comments     : [],
				hotComments  : []
			}
		},
		computed: {
			...mapGetters([
	    		'host',
	    		'nowPlayId'
	    	])
		},
		methods: {
			resetData () {
				this.page		  = 0
				this.conmentCount = 0
				this.total        = null
				this.comments     = []
				this.hotComments  = []
			},
			getData (init) {
				const {host, nowPlayId, $ajax, page} = this

				$ajax.get(host + `/comment/music?id=${nowPlayId}&offset=${page * 20}`).then(({data}) => {
					if (data.code !== 200) {
						alert('获取当前歌曲评论失败~~')
						return
					}

					const {result, total, hotComments} = data
					if (init) {
						this.hotComments  		   	   = hotComments
						this.$emit('total', total)
					}
					this.total 				           = total
					this.comments 					   = this.comments.concat(data.comments)
					this.conmentCount 				   += data.comments.length
					
				})

			},
			loadMore () {
				this.Paging++
				this.getData()
			}
		},
		created () {
			const {$event, resetData, getData} = this
			$event.on('songDetailReset', _ => {
				resetData()
				getData(true)
			})
			getData(true)
		},
		beforeDesdroy () {
			this.$event.off('songDetailReset')
		},
		components: {
			commentList
		}
	}
</script>

<style>
	
</style>