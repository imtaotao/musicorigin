<template>
    <div class="mask">
    	<div class="circle-box">
    		<i class="loading"></i>
    	</div>
    </div>
</template>
<script>
	export default {
		install: function(Vue) {
		    Vue.component('loading', this)
		}
	}
</script>
<style scoped>
	.mask {
		width: 85%;
    	height: 90%;
		background-color: rgba(0,0,0,.1);
		position: fixed;
		top: 5%;
	    left: 7.5%;
	    bottom: 0;
	    right: 0;
		z-index: 999999999;
	}
	.circle-box {
		width: 40px;
		height: 40px;
		position: absolute;
		top: calc(50% - 20px);
		left: calc(50% - 20px);
		border-radius: 50%;
		background: rgba(0,0,0,.5);
		box-shadow: -2px 1px 5px rgba(5, 0, 0, .9);
	}
	.loading {
	    width: 3px; height:3px;
	    border-radius: 100%;
	    box-shadow: 0 -10px 0 1px currentColor,           /* top, 1px expand */
	                10px 0px currentColor,                /* right */
	                0 10px currentColor,                  /* bottom */
	                -10px 0 currentColor,                 /* left */

	                -7px -7px 0 .5px currentColor,        /* left-top, 0.5px expand */
	                7px -7px 0 1.5px currentColor,        /* right-top, 1.5px expand */
	                7px 7px currentColor,                 /* right-bottom */
	                -7px 7px currentColor;                /* left-bottom */
		-webkit-animation: spin 1s steps(8) infinite;
		animation: spin 1s steps(8) infinite;
		/*加载图标位于中心*/
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
	}
	/* 菊花装载效果 */
	@-webkit-keyframes spin {
	     0% { -webkit-transform: rotate(0deg); }
	   100% { -webkit-transform: rotate(360deg); }
	}
	@keyframes spin {
	     0% { transform: rotate(0deg); }
	    100% { transform: rotate(360deg); }
	}
</style>