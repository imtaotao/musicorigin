<template>
	<div class='vis-view-container'>
		<canvas id='cicleCanvas' width='900' height='450'></canvas>
		<canvas id='visCicle' width='900' height='450'></canvas>
		<canvas id='topColumnar' width='900' height='450'></canvas>
		<canvas id='bottomColumnar' width='900' height='450'></canvas>
		<canvas id='setOff' width='900' height='450'></canvas>
		<canvas id='lineAnimate' width='850' height='450'></canvas>
		<canvas id='setOffTwo' width='400' height='400' class='rotate-animate'></canvas>
	</div>
</template>

<script>
	import {util} from '@/common/js/util'
	import 
		{cicle, visCicle, topColumnar, bottomColumnar, setOff, animateLine} 
	from '@/common/js/visCanvas'
	import {mapGetters, mapActions} from 'vuex'

	export default {
		data () {
			return {
				vis            : [],
				canvasInstance : []
			}
		},
		computed: {
			...mapGetters([
	    		'lyric',
	    		'getAudio'
	    	])
		},
		methods: {
			playTime () {
	    		if (!this.getAudio) return '0：00'
	    		return util.conver(this.getAudio.getTime() * 1000)
	    	},
	    	visualizer () {
	    		if (!this.getAudio) return []
	    		return this.getAudio.getVisualizer()
	    	}
		},
		mounted () {
			const cicleLine = new cicle(util.$('#cicleCanvas'), this.playTime)
			const visC      = new visCicle(util.$('#visCicle'), 80, this.visualizer)
			const top       = new topColumnar(util.$('#topColumnar'), 9, this.visualizer)
			const bottom    = new bottomColumnar
				(
					util.$('#bottomColumnar'),
					48,
					this.visualizer
				)
				
			const line = new setOff(util.$('#setOff'), util.$('#setOffTwo'))
			const anLine = new animateLine(util.$('#lineAnimate'))

			this.canvasInstance = [cicleLine, visC, top, bottom, line, anLine]
		},
		beforeDestroy () {
			this.canvasInstance.forEach(val => {
				val.clearAnimate && val.clearAnimate()
			})
			this.canvasInstance = []
		}
	}
</script>

<style>
	.vis-view-container {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.vis-view-container canvas {
		position: absolute;
		width: 900px !important;
		height: 450px !important;
		left: calc(50% - 500px);
		top: calc(50% - 225px);
	}
	#setOffTwo {
		width: 400px !important;
		height: 400px !important;
	}
	#lineAnimate {
		width: 850px !important;
	}
	#setOff, #setOffTwo, #visCicle, #lineAnimate {
		z-index: 2;
	}
	#cicleCanvas {
		z-index: 1;
	}
	#topColumnar {
		z-index: 3;
	}
	#bottomColumnar {
		z-index: 4;
	}
</style>