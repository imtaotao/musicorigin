<!-- 歌单列表内容 -->
<template>
	<div>
		<ul class="detail-nav">
			<li v-for='key in navTitle' class="lf list-li">
				<span class="Gray">{{key}}</span>
			</li>
		</ul>

		<!-- 歌曲内容 -->
		<div>
			<ul v-for='(key, i) in listArr' 
			class="detail-content" 
			:class='i % 2 !== 0 && "stripe"'
			@dblclick='dbPlay(key.oringeInfo, i)'>
				<li class="lf list-li">
					<span class="Gray">{{i + 1}}</span>
				</li>
				<li class="lf list-li">
					<i 
					:class="key.collect ? 'icon-collect2-list' : 'icon-collect1-list'"
					v-ripple
					@click='collect(i)'></i>
					<i class="downLoad" v-ripple></i>
				</li>
				<li v-for='(item, i) in 4' class="lf list-li">
					<span :class="i !== 0 ? 'Gray' : 'White'">{{getCell(i, key)}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	import interFace from '@/common/js/audioInterFace'

	export default {
		props: ['listArr'],
		data () {
			return {
				navTitle : ['', '操作', '音乐标题', '歌手', '专辑', '时长']
			}
		},
		computed: {
			 ...mapGetters([
	            'host',
	            'listId',
	            'playOneSong',
	            'musicList',
	            'resetCollect'
	        ])
		},
		methods: {
			// 双击播放歌曲
			dbPlay (song, i) {
				if (!song) {
					alert('当前歌曲播放出现问题了 /(ㄒoㄒ)/~~')
					return
				}
				this.playOneSong(song)
			},
			getCell (i, key) {
				switch (i) {
					case 0 :
						return key.name
					case 1 :
						return key.singer
					case 2 : 
						return key.albumName
					case 3 : 
						return key.time
				}
			},
			// 收藏歌曲
			collect (i) {
				interFace.collect(this.listArr[i], _ => {
					this.resetCollect(this.musicList)
				})
			}
		}
	}
</script>

<style>
	.detail-nav {
		width: 100%;
		border-bottom: .5px solid rgba(255,255,255,.1);
	}
	.detail-nav li {
		height: 30px;
		text-align: left;
		padding: 0 10px;
		border-right: .5px solid rgba(255,255,255,.1);
	}
	.detail-nav li:hover {
		background: rgba(255, 255, 255, .1);
	}
	.detail-nav li span {
		line-height: 30px;
	}
	.list-li:nth-child(1) {
		width: 5%;
	}
	.list-li:nth-child(2) {
		width: 100px;
	}
	.list-li:nth-child(3) {
		width: 30%;
	}
	.list-li:nth-child(4) {
		width: 20%;
	}
	.list-li:nth-child(5) {
		width: 20%;
	}
	.list-li:nth-child(6) {
		width: 10%;
	}

	/*详情*/
	.detail-content {
		overflow: hidden;
	}
	.detail-content li {
		height: 30px;
		text-align: left;
		padding: 0 10px;
		font-size: 14px;
		line-height: 30px;
		cursor: pointer;
	}
	.detail-content:hover {
		background: rgba(255,255,255,.1);
	}
	.stripe {
		background: rgba(255,255,255,.05);
	}
	.list-li i {
		display: inline-block;
		width: 15px;
		height: 15px;
		cursor: pointer;
	}
	.list-li i:last-child {
		background-size: 100% 100%;
	}
</style>