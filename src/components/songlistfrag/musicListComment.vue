<!-- 歌单评论 -->
<template>
	<div class="netComment-container">
		<div class="comment-main">
			<!-- 精彩评论 -->
			<comment-list v-if='hotComments.length'
			:comments='hotComments' :name='"精彩评论"' ></comment-list>
			<!-- 主要评论 -->
			<comment-list 
			:comments='comments' :name='"主要评论"'></comment-list>	
		</div>

		<!-- 加载更多按钮 -->
		<div class="load-more" v-show='commentCount !== total && total !== null'>
			<span class="animate" @click='loadMore'>加载更多</span>
		</div>
	</div>
</template>

<script>
	import commentList from './commentDetail'
	import {mapGetters, mapActions} from 'vuex'

	export default {
		props: ['netFirstAjax'],
		data () {
			return {
				// 分页
				Paging       : 0,
				commentCount : 0,
				total        : null,

				// 评论数据
				comments     : [],
				hotComments  : [],

				firstReq     : true
			}
		},
		computed: {
			...mapGetters([
	            'host',
	            'listId'
	        ])
		},
		methods: {
			loadMore () {
				this.Paging++
				this.getData()
			},
			// 重置数据
			resetData () {
				this.Paging       = 0
				this.commentCount = 0
				this.total        = null
				this.comments     = []
				this.hotComments  = []
				this.firstReq     = true
			},
			getData (init) {
				const {listId, Paging, host, $store, $ajax} = this
				// 只请求一次
				if (!listId) return
		
				// 请求网易云歌单评论
				$ajax.get(host + `/comment/playlist?id=${listId}&offset=${Paging * 20}`)
				.then(({data}) => {
					if (data.code !== 200) {
						alert('获取网易云音乐评论失败~')
						return
					}
					if (!data.comments) {
						alert('暂时没有评论哦~ (○｀ 3′○)')
						return
					}
					console.log(data)

					init && (this.hotComments  = data.hotComments)				  // 精彩评论	
					this.comments     = this.comments.concat(data.comments)		  // 所有评论
					this.total        = data.total								  // 评论总数量		  
					this.commentCount += data.comments.length
					this.firstReq     = false
				})
			}
		},
		created () {
			// 点击云音乐评论才开始获取数据
			this.$event.on('netComment',    _ => {
				const {firstReq, getData} = this
				if (!firstReq) return
				getData(true)
			})
			this.$event.on('musiclistinit', _ => this.resetData())
		},
		beforeDestroy () {
			this.$event.off('netComment')
			this.$event.off('musiclistinit')
		},
		components: {
			commentList
		}
	}
</script>

<style>
	.netComment-container {
		width: 100%;
	}
	.comment-main {
		width: 100%;
		padding: 40px 200px 0 60px;
	}
	
</style>