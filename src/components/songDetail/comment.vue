<template>
  <div class="songDetil-total-box">
    <p class="musicList-title">
      <span
        class="lf animate"
        v-for="(key, i) in listBtnText"
        :class="i === listBtn && 'active-btn-bg'"
        @click="toggle(i, key)"
        >{{ key }}
      </span>
    </p>
    <div class="song-comment" v-scrollTop="scrollTop">
      <go-up
        class="go-top"
        v-show="showGoUp"
        :style="{ top: 'calc(80% + ' + scroll + 'px)' }"
      ></go-up>
      <comment-list @total="netComment" v-show="nowshow.includes('云音乐评论')">
      </comment-list>
      <local-comment
        class="comment-type-box"
        v-show="nowshow.includes('本地评论')"
      >
      </local-comment>
    </div>
  </div>
</template>

<script>
import commentList from './commentList';
import localComment from './localComment';
import { util } from '@/common/js/util';
import Vue from 'vue';

export default {
  data() {
    return {
      showGoUp: false,
      listBtn: 0,
      scroll: 0,
      nowshow: '云音乐评论',
      listBtnText: ['云音乐评论', '本地评论'],
    };
  },

  methods: {
    toggle(i, name) {
      this.listBtn = i;
      this.nowshow = name;

      if (name.includes('本地评论')) {
        this.$event.fire('songLoaclComment');
      }
    },
    netComment(total) {
      Vue.set(this.listBtnText, 0, `云音乐评论（${total || 0}）`);
    },
    // 歌曲评论的滑动
    scrollTop(el, windowH) {
      windowH > 200 ? (this.showGoUp = true) : (this.showGoUp = false);

      if (windowH < 200) return;
      this.scroll = windowH;
    },
  },

  created() {
    // 点击滑动到顶部
    this.$event.on('scrollTop', (_) => {
      const el = util.$('.song-comment');
      if (!el) return;

      let distance = el.scrollTop;
      const singleMove = distance / 12;

      function t() {
        requestAnimationFrame((_) => {
          distance -= singleMove;
          distance < 0 && (distance = 0);
          el.scrollTop = distance;

          distance > 0 && t();
        });
      }
      t();
    });

    // 更改歌曲评论数量
    this.$event.on('songLocal', ({ data }) => {
      Vue.set(this.listBtnText, 1, `本地评论（${data}）`);
    });
  },
  beforeDesdroy() {
    this.$event.off('scrollTop');
    this.$event.off('songLocal');
  },
  components: {
    commentList,
    localComment,
  },
};
</script>

<style>
.songDetil-total-box .musicList-title {
  height: 36px;
  border-color: rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
  border-width: 1px;
}
.song-comment {
  width: 100%;
  height: calc(100% - 49px);
  overflow-x: hidden;
  padding-right: 30px;
  position: relative;
}
.song-comment .go-up {
  position: absolute;
  top: 80%;
}
</style>
