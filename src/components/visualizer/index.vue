<template>
	<div class='visualizer-container'>
		<img :src="nowInfo.picUrl" width='800' height='800'>
		<div class='visualizer-area'>
			<p class='shinkctrl-main-btn rt'>
				<span class='rt animate'
				 @click='btnClick(key)' 
				 v-ripple="'#53FDD6'"
				 v-for='(key, i) in btnText'>{{key}}
				</span>
			</p>
			<div class='visualizer-box'>
				
			</div>
			<div class='lyrics-box'></div>
		</div>
	</div>
</template>

<script>
	import {util} from '@/common/js/util'
	import {mapGetters, mapActions} from 'vuex'

	export default {
		data () {
			return {
				btnText: ['进入主页面', '可视化', '歌词']
			}
		},
		computed: {
			...mapGetters([
	    		'nowPlayInfo',
	    		'bigAnimate',
	    		'lyric',
	    		'nowPlayId'
	    	]),
	    	nowInfo () {
	    		if (!this.nowPlayId) {
	    			return {picUrl: 'static/img/music.jpg'}
	    		}
	    		return this.nowPlayInfo(this.nowPlayId)
	    	}
		},
		methods: {
			btnClick (key) {
				key === '进入主页面' && this.bigPage()
			},
			// 放大界面
			bigPage () {
				this.$store.dispatch('showContainer', true)
				this.bigAnimate()
			}
		},
		created () {
			console.log(this.nowInfo)
		}
	}
</script>

<style>
	.visualizer-container {
		position: fixed;
		width: 100%;
		height: 100%;
	}
	.visualizer-area {
		position: absolute;
		background: rgba(255,255,255,.6);
		width: 100%;
		height: 100%;
		padding: 50px 150px;
		z-index: 2;
	}
	.visualizer-container img {
		position: absolute;
		width: 100%;
		height: 100%;
		filter: blur(40px);
		z-index: 1;
	}
	.shinkctrl-main-btn {
		width: 100%;
	}
	.shinkctrl-main-btn span {
		display: inline-block;
		margin-left:5px;
		padding:0 10px;
		height: 25px;
		width: 100px;
		line-height: 25px;
		text-align: center;
		color: #fff;
		cursor: pointer;
		border-radius: 3px;
		background: rgba(79, 79, 79, 0.1);
	}
	.shinkctrl-main-btn span:hover {
		background: rgba(79, 79, 79, 0.3);
	}
</style>