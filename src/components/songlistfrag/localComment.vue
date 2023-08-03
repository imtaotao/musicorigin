<template>
  <div class="localcontent-main">
    <!-- 留言框 -->
    <div class="msg-cotainer">
      <textarea class="msg-box" v-model="msgText"></textarea>
      <div
        class="msg-publish-btn rt animate"
        @click="publish"
        :style="{ background: bgColor }"
      >
        发表
      </div>
    </div>

    <comment-list
      :comments="comments"
      :name="'所有评论'"
      :self="true"
      :selfCallback="answer"
    ></comment-list>

    <p class="no-comment Gray" v-show="!comments.length">
      <span>暂无评论 ...</span>
    </p>
    <!-- 加载更多按钮 -->
    <div class="load-more" v-show="commentCount !== total && total !== null">
      <span class="animate" @click="loadMore">加载更多</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { util } from '@/common/js/util';
import commentList from '@/components/songlistfrag/commentDetail';
const { filter, $ } = util;

export default {
  data() {
    return {
      msgText: '',
      replyTitle: '',
      bgColor: '#fff',
      reply: false,
      Paging: 0,

      // 评论内容
      comments: [],
      total: null,
      commentCount: 0,

      firstReq: true,
    };
  },
  computed: {
    ...mapGetters(['user', 'host', 'listId']),
  },
  methods: {
    loadMore() {
      this.Paging++;
      this.getData();
    },
    // 每次路由变化时重置数据
    resetData() {
      this.msgText = '';
      this.replyTitle = '';
      this.bgColor = '#fff';
      this.reply = false;
      this.Paging = 0;
      this.comments = [];
      this.total = null;
      this.commentCount = 0;
      this.firstReq = true;
      // this.getData(true)
    },
    getData(init) {
      const { host, listId, Paging, $ajax, $event } = this;

      $ajax
        .get(host + `/getListComments?id=${listId}&offset=${Paging * 20}`)
        .then((data) => {
          if (data.status !== 200) {
            return alert('获取评论失败');
          }
          const result = data.data;

          if (init) {
            this.total = result.count;
            $event.fire('listLocal', result.count);
          }

          this.comments = this.comments.concat(filter(result.result));
          this.commentCount += result.result.length;
          this.firstReq = false;
        });
    },
    // 判断是否是回复
    judgment() {
      // 如果删除了 ‘回复xxx：’这几个字就代表不是回复某人了，算是正常的评论
      if (!this.msgText.includes(this.replyTitle)) {
        this.reply = false;
        this.replyTitle = '';
      }
    },
    publish() {
      // 判断一波还是不是回复
      this.judgment();
      const { bgColor, msgText, replyTitle, reply, host, user, $ajax, listId } =
        this;

      if (!user._id) {
        this.$event.fire('showLogin', true);
        return alert('请先登录');
      }

      const text = msgText.replace(replyTitle, '');

      if (!listId) return alert('获取歌单数据出错，请刷新重试吧~');
      if (!text) return alert('写点东西再发表吧，内容不能为空哦~');
      if (text.length > 200) {
        return alert('最多只允许200字的评论哦~');
      }

      this.bgColor = '#b4b5b5';
      setTimeout((_) => (this.bgColor = '#fff'), 250);

      // 发送请求
      const data = {
        name: user.name,
        nickname: user.nickname,
        avatarUrl: user.pic,
        text: text,
        id: listId,
        reply: reply,
      };

      // 恢复默认状态
      this.msgText = '';
      this.replyTitle = '';

      $ajax.post(host + '/listComments', data).then(({ data }) => {
        alert(data.msg);
        if (data.msg.includes('失败')) return (this.reply = false);

        // 添加数据
        this.comments.unshift(filter([data.doc])[0]);
        this.reply = false;
      });
    },

    answer(id, name, nickname) {
      if (!this.user._id) {
        this.$event.fire('showLogin', true);
        return alert('请先登录');
      }
      if (!id) return alert('没有得到当前评论数据，请刷新后重试~');
      const rigthBox = $('.right-content-details');
      rigthBox && (rigthBox.scrollTop = 160);

      const repTitle = `回复${nickname}：`;
      this.reply = { id, name };
      this.replyTitle = repTitle;
      this.msgText = repTitle;
    },
  },
  created() {
    this.$event.on('localComment', (_) => {
      const { firstReq, getData } = this;
      if (!firstReq) return;
      getData(true);
    });
    this.$event.on('musiclistinit', (_) => this.resetData());
  },
  beforeDestroy() {
    this.$event.off('localComment');
    this.$event.off('musiclistinit');
  },
  components: {
    commentList,
  },
};
</script>

<style>
.localcontent-main {
  width: 100%;
  padding: 40px 200px 0 60px;
}
</style>
