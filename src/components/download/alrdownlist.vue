<template>
	<div class='down-list-container'>
		<span v-for='key in musiclist()'>{{key.name}} 
			{{new Date(key.downTime || 0).format('-', true)}}</span>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	export default {
		data () {
			return {}
		},
		computed: {
			...mapGetters([
	    		'user'
	    	])
		},
		methods: {
			musiclist () {
				const data = this.user._id ? this.user.downList : []
				return data
			}
		}
	}
</script>

<style>
	.down-list-container span{
		display: block;
	}
</style>