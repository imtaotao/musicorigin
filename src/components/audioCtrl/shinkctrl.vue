<template>
  <!-- 缩小的播放控件 -->
  <div class="Shrink-box">
    <div class="outside font-color" @click="clickToggle($event, 'top')">
      <i class="icon-shrink_Enlarge center-btn"></i>
    </div>
    <!-- click-effect-right -->
    <div class="outside font-color" @click="clickToggle($event, 'right')">
      <i class="icon-shrink_Next center-btn"></i>
    </div>
    <!-- click-effect-left -->
    <div class="outside font-color" @click="clickToggle($event, 'left')">
      <i class="icon-shrink_Last center-btn"></i>
    </div>
    <!-- click-effect-bottom -->
    <div class="outside font-color" @click="setCollectMusic($event)">
      <i
        class="center-btn"
        :class="
          musicInfo[0].status ? 'icon-collect2-list' : 'icon-shrink_collect_1'
        "
      ></i>
    </div>
    <div class="insert-box">
      <!-- 进度环 -->
      <div class="dark-progress"></div>
      <div class="circleProgress-wrapper">
        <div class="wrapper right">
          <div
            class="circleProgress rightcircle"
            :style="{ transform: 'rotate(' + rightDeg + 'deg)' }"
          ></div>
        </div>
        <div class="wrapper left">
          <div
            class="circleProgress leftcircle"
            :style="{ transform: 'rotate(' + leftDeg + 'deg)' }"
          ></div>
        </div>
      </div>
      <!-- 歌曲专辑 -->
      <img
        :src="img"
        width="71"
        height="71"
        :class="musicInfo[1] ? 'rotate-animate' : ''"
      />
      <div class="play-stop" @click="playStop">
        <i :class="musicInfo[1] ? 'icon-Pause' : 'icon-Play'"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { util } from '@/common/js/util';
import interFace from '@/common/js/audioInterFace';
import { mapGetters, mapActions } from 'vuex';
const { $, nowPlay } = util;

export default {
  props: ['img', 'musicInfo'],
  data() {
    return {
      animate: true,
      leftDeg: 225,
      rightDeg: 225,
    };
  },
  computed: {
    ...mapGetters([
      'musicList',
      'getAudio',
      'getPlayOrder',
      'playDelay',
      'switchDelay',
      'next',
      'forward',
      'playStop',
      'collectMusic',
    ]),
  },
  methods: {
    setCollectMusic(e) {
      if (!this.animate) return;
      const id = this.musicInfo[0].id;
      this.toggle(e.currentTarget, 'click-effect-bottom');
      this.collectMusic(id);
    },
    // 点击效果
    toggle(dom, className) {
      dom.classList.add(className);
      dom.classList.add('white');
      setTimeout(() => (this.animate = false));
      setTimeout(() => {
        dom.classList.remove(className);
        dom.classList.remove('white');
        this.animate = true;
      }, 200);
    },
    clickToggle(e, type) {
      const target = e.currentTarget;
      if (type === 'top') {
        this.toggle(target, 'click-effect-top');
        this.bigAnimate();
      }

      if (type === 'left') {
        this.toggle(target, 'click-effect-left');
        this.forward();
      }

      if (type === 'right') {
        this.toggle(target, 'click-effect-right');
        this.next();
      }
    },
    setProgress() {
      const audio = this.getAudio;
      const store = this.$store;
      if (!audio) return;

      // 开始新的进度条
      store.dispatch('changeShinkProgress', () => {
        return setInterval(() => {
          // 左右两边 225 -> 45
          const time = audio.getTime();
          const precent = (time * 1000) / audio.duration;

          // 左边
          if (precent > 0 && precent <= 0.5) {
            const increase = 180 * precent;
            const deg = 225 - increase * 2;
            this.rightDeg = 225;
            this.leftDeg = deg < 45 ? 45 : deg;
          }

          // 右边
          if (precent >= 0.5 && precent < 1) {
            const increase = 180 * (precent - 0.5);
            const deg = 225 - increase * 2;
            this.leftDeg = 45;
            this.rightDeg = deg < 45 ? 45 : deg;
          }
        }, 20);
      });
    },
    bigAnimate(dom = $('.Shrink-box')) {
      const bigDom = $('.audio-controls');
      const container = $('.all-container');
      const width = container
        ? parseInt(getComputedStyle(container).width)
        : document.body.clientWidth * 0.85;

      dom.animate(
        {
          opacity: 0,
        },
        500,
        function () {
          this.style.display = 'none';
        },
      );

      bigDom.style.display = 'block';
      bigDom
        .animate(
          {
            opacity: 1,
            height: 73,
            borderRadius: 0,
            width: width + 130,
          },
          250,
        )
        .animate(
          {
            width: width - 40,
          },
          250,
        )
        .animate(
          {
            width: width,
          },
          400,
          function () {
            this.style.overflow = 'inherit';
            const aside = $('#js_aside');
            const rightBox = $('.right-box');
            const songDetail = $('#songDetail');

            aside && (aside.style.height = '92%');
            rightBox && (rightBox.style.height = 'calc(100% - 73px)');
            songDetail && (songDetail.style.height = 'calc(100% - 73px)');
          },
        );
    },
  },
  created() {
    // 把函数传到父组件
    this.$store.dispatch('bigAnimate', this.bigAnimate);
    this.$emit('setProgress', this.setProgress);
    this.$event.on('startNewMusic', (e) => {
      this.leftDeg = this.rightDeg = 225;
    });
  },
};
</script>
<style>
/*动画*/
@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/*页面slide过渡效果*/
.rotate-animate {
  -webkit-animation: rotate 20s linear infinite;
  animation: rotate 20s linear infinite;
}

.Shrink-box {
  opacity: 0;
  display: none;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(79, 79, 79, 0.5);
  overflow: hidden;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.7);
  -webkit-transform: rotate(45deg);
  position: fixed;
  bottom: 5%;
  right: 7.5%;
}
/* 缩小控件 */
.circleProgress-wrapper {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  z-index: 999;
}
.wrapper {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.right {
  right: 0;
}
.left {
  left: 0;
}
.circleProgress {
  width: 71px;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  position: absolute;
  top: 0;
}
.rightcircle {
  border-top: 3px solid #46dab8;
  border-right: 3px solid #46dab8;
  right: 0;
  -webkit-transform: rotate(225deg);
}
.leftcircle {
  border-bottom: 3px solid #46dab8;
  border-left: 3px solid #46dab8;
  left: 0;
  -webkit-transform: rotate(225deg);
}

/* 缩小的音频控件 */
.insert-box {
  width: 71px;
  height: 71px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -36px;
  margin-left: -36px;
  border-radius: 50%;
  background: #eee;
  overflow: hidden;
  box-shadow: inset 1px 1px 20px rgba(0, 0, 0, 0.8);
  -webkit-transform: rotate(-45deg);
}

.dark-progress {
  width: 73px;
  height: 73px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -36.5px;
  margin-left: -36.5px;
  border-radius: 50%;
  border: 5px solid #000;
  z-index: 998;
}

.border {
  position: relative;
  border: 3px solid transparent;
  border-radius: 50%;
  background: linear-gradient(#fff, #fff);
  background-clip: padding-box;
  padding: 10px;
  /* just to show box-shadow still works fine */
  width: 30px;
  height: 30px;
}
.border::after {
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: -4px;
  right: -4px;
  background: linear-gradient(#53fdd6, #0193b9);
  content: '';
  z-index: -1;
  border-radius: 50%;
}
.outside {
  width: 50%;
  height: 50%;
  position: absolute;
  cursor: pointer;
  transition: all 0.2s;
  -moz-transition: all 0.2s;
  -webkit-transition: all 0.2s;
}
.outside:nth-child(1) {
  top: 0;
  left: 0;
}
.outside:nth-child(2) {
  top: 0;
  left: 50%;
}
.outside:nth-child(3) {
  top: 50%;
  left: 0;
}
.outside:nth-child(4) {
  top: 50%;
  left: 50%;
}
.outside .center-btn {
  position: absolute;
  width: 23px;
  height: 23px;
  top: 50%;
  left: 50%;
  -webkit-transform: rotate(-45deg);
}
.outside:nth-child(1) .center-btn {
  margin-top: -15.5px;
  margin-left: -8.5px;
}
.outside:nth-child(2) .center-btn {
  margin-top: -15.5px;
  margin-left: -3.5px;
}
.outside:nth-child(3) .center-btn {
  margin-top: -7.5px;
  margin-left: -8.5px;
}
.outside:nth-child(4) .center-btn {
  margin-top: -9.5px;
  margin-left: -2.5px;
}
.font-color .center-btn:before {
  color: rgba(255, 255, 255, 0.4);
}
.click-effect-top {
  box-shadow: inset -5px -5px 11px rgb(0, 0, 0);
}
.click-effect-bottom {
  box-shadow: inset 5px 5px 11px rgb(0, 0, 0);
}
.click-effect-left {
  box-shadow: inset -5px 5px 11px rgb(0, 0, 0);
}
.click-effect-right {
  box-shadow: inset 5px -5px 11px rgb(0, 0, 0);
}
.white i:before {
  color: #fff !important;
}
/* 播放暂停蒙版 */
.play-stop {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background: rgba(255, 255, 255, 0);
  cursor: pointer;
  transition: background 0.5s;
  -moz-transition: background 0.5s;
  -webkit-transition: background 0.5s;
  z-index: 1000;
}
.play-stop:hover {
  background: rgba(7, 17, 77, 0.5);
}
.play-stop:hover i:before {
  color: rgba(255, 255, 255, 0.8);
}
.play-stop > i {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -8px;
  margin-left: -8px;
  text-align: center;
  line-height: 20px;
}
.play-stop > i:before {
  color: rgba(255, 255, 255, 0);
  transition: color 0.5s;
  -moz-transition: color 0.5s;
  -webkit-transition: color 0.5s;
}
</style>
