<template>
	<div class='down-loading'>
		<ul class='down-list'>
			<li class='down-list-title'>
				<span></span>
				<span>进度</span>
				<span>音乐标题</span>
			</li>

			<!-- 下载的歌曲列表 -->
			<li v-for='(key, i) in downQueue'>
				<span>{{i + 1}}</span>
				<span class='down-bar'>
					<b :style='{width: key.procent * 70 + "%"}'></b>
					<b></b>
				</span>
				<span>{{key.name}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	export default {
		data () {
			return {
				downLoadList: []
			}
		},
		computed: {
			...mapGetters([
	    		'host',
	    		'downQueue'
	    	])
		}
	}
</script>

<style>
	.down-list {
		font-size: 14px;
	}
	.down-list li {
		width: 100%;
		height: 35px;
		overflow: hidden;
	}
	.down-list-title {
		border-top:.5px solid rgba(255,255,255,.1);
		border-bottom:.5px solid rgba(255,255,255,.1);
	}
	.down-list-title span {
		border-right: .5px solid rgba(255,255,255,.1);
	}
	.down-list-title span:hover {
		background: rgba(255,255,255,.1);
		cursor: pointer;
	}
	.down-list li span {
		display: inline-block;
		float: left;
		line-height: 35px;
		padding-left: 25px;
		height: 35px;
	}
	.down-list li span:nth-child(1) {
		width: 10%;
		padding:0;
	}
	.down-list li span:nth-child(2) {
		width: 35%;
	}
	.down-list li span:nth-child(3) {
		width: 55%;
		border: none;
	}

	/*进度条*/
	.down-bar {
		position: relative;
		padding: 0 !important;
		text-align: center;
		padding: 13.5px 0 13.5px 25px !important;
	}
	.down-bar b {
		position: absolute;
		display: block;
		margin:0 auto;
		height: 8px;
		border-radius: 5px;
	}
	.down-bar b:first-child {
		width: 0%;
		background: rgba(215, 235, 231, .8);
		z-index: 2;
	}
	.down-bar b:last-child {
		width: 70%;
		background: rgba(255,255,255,.15);
		z-index: 1;
	}
</style>