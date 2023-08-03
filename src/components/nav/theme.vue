<!-- 皮肤弹窗 -->
<template>
  <div
    class="theme-main animate"
    :style="!showSkin ? { height: 0, opacity: 0, overflow: 'hidden' } : ''"
  >
    <div class="up-arrow"></div>
    <div class="theme-content-box">
      <!-- 主题和纯色切换按钮 -->
      <p class="theme-title">
        <span
          v-for="(key, i) in titleText"
          class="Gray"
          :class="i === nowBtn && 'active-btn'"
          @click="toggle(i)"
          >{{ key }}</span
        >

        <!-- 自动切换 -->
        <i
          class="toggle-btn rt animate"
          @click="toggleSwith"
          :style="{
            background: autoSwith
              ? 'rgba(255,255,255,.3)'
              : 'rgba(255,255,255,.1)',
          }"
        >
          <i
            class="move-circle animate"
            :style="{ left: autoSwith ? '32px' : '2.5px' }"
          ></i>
        </i>
        <span class="Gray auto-toggle rt">自动换肤</span>
      </p>

      <!-- 内容展示区 -->
      <div class="show-container">
        <div
          class="show-area animate"
          :style="{ transform: 'translateX(' + -nowBtn * 330 + 'px)' }"
        >
          <ul class="theme-detail lf" v-for="(key, i) in skin">
            <li class="lf" v-for="(item, j) in key">
              <!-- 图片 -->
              <img
                width="100"
                height="100"
                :src="'static/img/' + item.url"
                v-show="nowBtn === 0"
              />
              <!-- 纯色 -->
              <div
                class="show-color"
                v-show="nowBtn === 1"
                :style="{ background: item.rgb }"
              ></div>
              <!-- 遮罩层 -->
              <b class="mask-layer animate" @click="choseskin(i, j)"></b>
              <!-- 名字显示 -->
              <p class="skin-name">
                <span>{{ item.name }}</span>
              </p>

              <!-- 选择的样式 -->
              <i
                class="chose-skin"
                v-show="i === nowSkin[1][0] && j === nowSkin[1][1]"
              ></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { util } from '@/common/js/util';
import { mapGetters, mapActions } from 'vuex';
const { random } = util;

export default {
  props: ['showSkin'],
  data() {
    return {
      nowBtn: 0,
      active: [0, 6],
      titleText: ['主题', '纯色'],
      randomStr: null,
      interval: 20000,
      timeout: null,

      // 主题纯色
      skin: [
        [
          { name: '船', url: '2-3.png' },
          { name: '金字塔', url: '3-2.png' },
          { name: '闪电', url: 'c-3-2.png' },
          { name: '夜晚', url: 'c-1-2.png' },
          { name: '山水', url: 'c-4-1.png' },
          { name: '冬', url: 'c-5-2.png' },
          { name: '主题七', url: '3.jpg' },
          { name: '主题八', url: '11.jpg' },
          { name: '主题九', url: '13.jpg' },
        ],
        [
          { name: '炫酷黑', rgb: '#171c26' },
          {
            name: '深沉红',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#070000), to(#4C0001))',
          },
          {
            name: '主题蓝',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#0094B9), to(#53FDD6))',
          },
          {
            name: '傲娇紫',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#20002c), to(#cbb4d4))',
          },
          {
            name: '清新绿',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#DCE35B), to(#45b649))',
          },
          {
            name: '金贵黄',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#CAC531), to(#F3F9A7))',
          },
          {
            name: '可爱粉',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#d9a7c7), to(#fffcdc))',
          },
          {
            name: '晨光',
            rgb: 'linear-gradient(to top, rgb(240, 194, 123), rgb(75, 18, 72))',
          },
          {
            name: '暗粉',
            rgb: '-webkit-gradient(linear,left top, right bottom, from(#EB5757), to(#000))',
          },
        ],
      ],
    };
  },
  computed: {
    ...mapGetters(['nowSkin', 'autoSwith']),
  },
  methods: {
    toggle(i) {
      this.nowBtn = i;
    },
    choseskin(i, j, auto) {
      const { $store, $event, gradient } = this;
      Vue.set(this.active, 0, i);
      Vue.set(this.active, 1, j);

      // 触发选中皮肤的事件
      gradient((_) => {
        $store.dispatch('nowSkin', [this.skin[i][j], this.active]);
        $event.fire('choseskin');
        if (!auto) {
          $store.dispatch('autoSwith', false);
          this.randomStr = null;
        }
      });
      this.$emit('update:showSkin', false);
    },

    // 按钮开关
    toggleSwith() {
      this.$store.dispatch('autoSwith', !this.autoSwith);

      if (this.autoSwith) {
        this.randomStr = util.randomStr();
        this.autoToggleSkin()();
      }
    },
    // 自动切换皮肤
    autoToggleSkin() {
      const randomStr = this.randomStr;
      return (_) => {
        const { skin, autoSwith } = this;
        this.timeout = setTimeout((_) => {
          if (randomStr !== this.randomStr || !this.autoSwith) return;
          const i = random(0, skin.length - 1);
          const j = random(0, skin[i].length - 1);

          // 渐变
          this.choseskin(i, j, true);
          setTimeout((_) => {
            this.autoToggleSkin()();
          }, 250);
        }, this.interval);
      };
    },
    // 自动换肤时候，渐变过度
    gradient(callback) {
      const img = util.$('.bg-pic');

      if (!img) {
        callback();
        return;
      }

      img.style.opacity = 0;
      setTimeout((_) => {
        callback();
        img.style.opacity = 1;
      }, 250);
    },
  },
  created() {
    const [i, j] = this.active;
    const skin = this.nowSkin || [this.skin[i][j], [i, j]];
    this.$store.dispatch('nowSkin', skin);
    this.$event.fire('choseskin');

    // 自动换肤
    this.randomStr = util.randomStr();
    this.autoToggleSkin()();
  },
  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  },
};
</script>

<style>
.theme-main {
  border-radius: 2px;
  width: 360px;
  background: rgba(0, 0, 0, 0.5);
  height: 425px;
}
.up-arrow {
  width: 10px;
  height: 10px;
  margin-top: -20px;
  margin-left: 200px;
  border: 10px solid transparent;
  border-bottom: 10px solid rgba(0, 0, 0, 0.5);
}
.theme-content-box {
  width: 100%;
  padding: 20px;
}
.theme-title {
  padding: 10px 0;
}
.theme-title span {
  display: inline-block;
  width: 40px;
  border-radius: 2px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
.theme-title span:last-child {
  margin-left: 20px;
}
.theme-title span:hover {
  color: #fff;
}
.theme-title span.active-btn {
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

/*主题内容区*/
.show-container {
  width: 330px;
  overflow: hidden;
}
.show-area {
  width: 660px;
  overflow: hidden;
}
.theme-detail {
  width: 330px;
}
.theme-detail li {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 10px 10px 0;
}

.theme-detail li img {
  cursor: pointer;
}
.show-color {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.theme-detail li b:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.skin-name {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 25px;
  line-height: 19px;
  padding: 3px 8px;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.2);
}
.chose-skin {
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
  background: url('~static/pageimg/choseskin.png');
}
.auto-toggle {
  width: 80px !important;
  cursor: auto !important;
}
.auto-toggle:hover {
  color: #a4b5b9 !important;
}
</style>
