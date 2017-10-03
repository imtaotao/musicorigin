<template>
	<div class='download-container'>
		<p class="musicList-title download-title">
   			<span 
   			class="animate" 
   			v-for='(key, i) in listBtnText' 
   			:class='i === listBtn && "active-btn-bg"'
   			@click='toggle(i, key)'>{{key}}</span>
   		</p>

   		<!-- 列表 -->
   		<down-list v-show='listBtn === 0'></down-list>
   		<music-list v-show='listBtn === 1'></music-list>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	import musicList from './alrdownlist.vue'
	import downList  from './downloading.vue'

	export default {
		data () {
			return {
				listBtn : 0,
				listBtnText : ['正在下载', '已下载']
			}
		},
		computed: {
			...mapGetters([
	    		'user'
	    	])
		},
		methods: {
			toggle (i, key) {
				if (key === '已下载') {
					if (!this.user._id) {
						this.$event.fire('showLogin', true)
						return
					}
				}
				this.listBtn = i
			}
		},
		components : {
			musicList,
			downList
		}
	}
</script>

<style>
	.download-container {
		padding: 30px 40px;
		height: 100%;
		overflow-x: hidden;
	}
	.download-title {
		padding: 0 !important;
		border-width: 1px;
		width: 304px;
		margin: 0 auto;
		margin-bottom: 40px;
	}
	.download-title span {
		display: inline-block;
		text-align: center;
		width: 150px;
		margin-right: 2px;
	}
</style>