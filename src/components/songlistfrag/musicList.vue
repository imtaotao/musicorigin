<!-- 歌单内容 -->
<template>
  <div>
    <p class="musicList-title">
      <span
        class="lf animate"
        v-for="(key, i) in listBtnText"
        :class="i === listBtn && 'active-btn-bg'"
        @click="toggle(i, key)"
        >{{ key }}</span
      >
    </p>

    <!-- 列表内容 -->
    <div class="list-detail">
      <!-- 歌曲列表 -->
      <table-list
        v-show="nowshow.includes('歌曲列表')"
        :listArr="listArr"
      ></table-list>
      <!-- 歌单网易云的评论 -->
      <comment-list v-show="nowshow.includes('云音乐评论')"></comment-list>
      <!-- 自个的歌单评论 -->
      <local-comment v-show="nowshow.includes('本地评论')"></local-comment>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { util } from '@/common/js/util';
import tableList from './musicListTable';
import commentList from './musicListComment';
import localComment from './localComment';
import { mapGetters, mapActions } from 'vuex';
const { conver } = util;

export default {
  data() {
    return {
      nowshow: '歌曲列表',
      listBtn: 0,
      listBtnText: ['歌曲列表', '云音乐评论', '本地评论'],
      listArr: [],
    };
  },
  computed: {
    ...mapGetters(['user', 'resetCollect']),
  },
  methods: {
    resetData() {
      this.nowshow = '歌曲列表';
      this.listBtn = 0;
      this.listBtnText = ['歌曲列表', '云音乐评论', '本地评论'];
      this.listArr = [];
    },
    toggle(i, name) {
      this.listBtn = i;
      this.nowshow = name;

      name.includes('云音乐评论') && this.$event.fire('netComment');
      name.includes('本地评论') && this.$event.fire('localComment');
    },
  },
  created() {
    this.$event.on('playList', ({ data }) => {
      this.listBtn = 0;
      this.listArr = [];
      const [list, count] = data;
      Vue.set(this.listBtnText, 0, `歌曲列表（${list.length || 0}）`);
      Vue.set(this.listBtnText, 1, `云音乐评论（${count || 0}）`);

      // 根据歌曲id获得
      list.forEach((val) => {
        // 获得当前歌曲是否已经被收藏
        const collect =
          JSON.stringify(this.user.collectMusic).indexOf(val.id) > 0
            ? true
            : false;

        this.listArr.push({
          id: val.id,
          name: val.name,
          time: conver(val.dt),
          singer: val.ar[0].name,
          singerId: val.ar[0].id,
          albumName: val.al.name,
          albumId: val.al.id,
          collect: collect,
          oringeInfo: val,
        });
      });
    });

    this.$event.on('resetCollect', (_) => this.resetCollect(this.listArr));
    this.$event.on('listLocal', ({ data }) => {
      Vue.set(this.listBtnText, 2, `本地评论（${data || 0}）`);
    });

    this.$event.on('musiclistinit', (_) => this.resetData());
  },
  beforeDestroy() {
    // 销毁注册的事件
    this.$event.off('playList');
    this.$event.off('resetCollect');
    this.$event.off('listLocal');
    this.$event.off('musiclistinit');
  },
  components: {
    tableList,
    commentList,
    localComment,
  },
};
</script>
<style>
.detail-nav {
  overflow: hidden;
}
.list-detail {
  margin-bottom: 80px;
}
</style>
