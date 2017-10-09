<template>
	<div class='vis-lyric-container'>
		歌词区域
	</div>
</template>

<script>
	import {util} from '@/common/js/util'
	import {mapGetters, mapActions} from 'vuex'
	export default {
		data () {
			return {}
		},
		computed: {
			...mapGetters([
	    		'lyric'
	    	])
		},
		methods: {
			
		}
	}
</script>

<style>
	.vis-lyric-container {
		
	}
</style>