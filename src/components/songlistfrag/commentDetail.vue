<!-- 评论列表 -->
<template>
	<ul class="comment-ul">
		<li class="comment-title">{{name}}</li>
		<li v-for='(key, i) in comments' class="single-comment">
			<img :src="key.user.avatarUrl" width="50" height="50" class="lf">
			<div class="comment-detail lf">
				<!-- 主要评论 -->
				<p class="user-text">
					<span class="Blue">{{key.user.nickname}}：</span>
					<span class="Silver">{{key.content}}</span>
				</p>
				<!-- 回答 -->
				<div class="be-replied" v-if='key.beReplied.length'>
					<p v-for='item in key.beReplied'>
						<span class="Blue">@{{item.user.nickname}}:</span>
						<span class="Gray">{{item.content}}</span>
					</p>
				</div>
				<!-- 评论时间 -->
				<p class="comment-time">
					<span class="Gray">{{new Date(key.time).format('/')}}</span>
					<span class="Gray">{{new Date(key.time).format(':', 'after', true)}}</span>
					<span 
					v-if='!self'
					class="rt like-icon" 
					@click='alertWarn'>（{{key.likedCount}}）</span>

					<span 
					v-if='self'
					class='rt Gray answer-btn' 
					@click='selfCallback(key.id, key.user.name, key.user.nickname) 
					|| Placeholder()'>
						回复
					</span>
				</p>
			</div>
		</li>
	</ul>
</template>

<script>
	export default {
		props: ['comments', 'name', 'self', 'selfCallback'],
		methods: {
			alertWarn () {
				alert('暂不能对网易云评论进行操作，您可以在本地评论模块留言！')
			},
			Placeholder () {}
		}
	}
</script>

<style>
	.comment-ul {
		width: 100%;
	}
	.comment-ul li {
		border-bottom: 1px solid rgba(255,255,255,.1);
	}
	.comment-title {
		padding: 20px 0;
		font-size: 25px;
	}
	.single-comment {
		width: 100%;
		padding: 30px 0;
		overflow:hidden;
	}
	.single-comment img {
		margin-right: 20px;
		border-radius: 50%;
	}
	.comment-detail {
		width: calc(100% - 70px);
		margin-top: -5px;
	}
	.user-text, .comment-time {
		min-height: 25px;
		line-height: 25px;
	}
	.user-text span{
		font-size: 15px;
	}
	.comment-time {
		width: 100%;
		margin-top: 10px;
		font-size: 14px;
	}
	.like-icon {
		padding-left: 20px;
		height: 20px;
		line-height: 20px;
		display: block;
		margin-top: 2.5px;
		cursor: pointer;
		background: url('~static/pageimg/like.png') no-repeat;
	}
	.be-replied {
		width: calc(100% - 20px);
		background: rgba(255,255,255,.1);
		border-radius: 5px;
		padding: 10px;
		margin: 10px 0 0 20px;
	}
	.be-replied p {
		margin-bottom:15px;
	}
	.be-replied p span {
		line-height: 25px;
	}
	.be-replied p:last-child {
		margin:0;
	}
	.comment-time span {
		cursor: pointer;
	}
	.answer-btn:hover {
		color: #fff;
	}
</style>