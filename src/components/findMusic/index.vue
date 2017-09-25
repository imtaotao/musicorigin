<template>
	<div class="find-container">
		<!-- tab栏 -->
		<div>
			<ul class="nav-list">
				<li class='lf'  v-for='key in routerCig'>
					<router-link :to="key.url" active-class='active-li'>
						<span v-ripple="'#53FDD6'">{{key.name}}</span>
					</router-link>
				</li>
			</ul>
		</div>
		<transition :name="transition" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {util} from '@/common/js/util'
	export default {
		data () {
			return {
				transition: 'slide-left',
				routerCig : [
					{name: '个性推荐', url: '/findMusic/recommend'},
					{name: '歌单', 	   url: '/findMusic/songList'},
					{name: '排行榜',   url: '/findMusic/ranking'}
				]
			}
		},
		methods: {
			routerChange (defaultPath) {
				const now = this.$router.currentRoute.path
				const go = this.$router.currentRoute.query.go || defaultPath

				go && this.$router.replace(now + go)
			}
		},
		watch: {
  			'$route' (to, from) {
  				this.routerChange()
  			}
  		},
  		created () {
  			const path 		  = this.$router.currentRoute.path
  			const defaultPath = path.includes('recommend') || 
  								path.includes('songList')  ||
  								path.includes('ranking')   ? '' : '/recommend'
  			this.routerChange(defaultPath)
  		}
	}
</script>

<style>
	.find-container {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		padding: 40px
	}
	.nav-list {
		width: 100%;
		border-bottom: .5px solid rgba(255, 255, 255, .1);
		padding: 10px 20% 0 20%;
		overflow: hidden;
	}
	.nav-list li {
		width: 33%;
	}
	.nav-list li a span {
		display: inline-block;
		width: 100px;
		height: 40px;
		color: #fff;
		line-height: 30px;
		text-align: center;
		cursor: pointer;
	}
	.nav-list li a span:hover {
		background: rgba(255, 255, 255, .2);
		color: #fff;
	}
	.active-li span{
		color: #fff;
		border-bottom: 2px solid #53FDD6;
	}
</style>