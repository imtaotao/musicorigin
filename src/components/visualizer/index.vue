<template>
  <div class="visualizer-container">
    <img :src="nowInfo.picUrl" width="800" height="800" />
    <div
      class="visualizer-area"
      :style="{ background: 'rgba(7,17,77,' + brightness + ')' }"
    >
      <p class="shinkctrl-main-btn rt">
        <span
          class="rt animate-five"
          @click="btnClick(key, i)"
          v-ripple="'#53FDD6'"
          v-for="(key, i) in btnText"
          >{{ key }}
        </span>
      </p>

      <div class="brightness-box rt">
        <span class="brightness-bg"></span>
        <span class="brightness-progress" @input="input($event)">
          <i class="dots" v-drag></i>
        </span>
      </div>
      <transition name="fade" mode="out-in">
        <vis-view v-if="showVis"></vis-view>
        <vis-lyric v-else></vis-lyric>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import visView from "./view";
import visLyric from "./lyric";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      btnText: ["进入主页面", "可视化"],
      showVis: true,
      brightness: 0.75,
    };
  },

  computed: {
    ...mapGetters(["nowPlayInfo", "bigAnimate", "lyric", "nowPlayId"]),

    nowInfo() {
      if (!this.nowPlayId) {
        return { picUrl: "static/img/music.jpg" };
      }
      return this.nowPlayInfo(this.nowPlayId);
    },
  },

  methods: {
    btnClick(key, i) {
      key === "进入主页面" && this.bigPage();
      i === 1 && this.toggle();
    },

    // 放大界面
    bigPage() {
      this.$store.dispatch("showContainer", true);
      this.bigAnimate();
    },

    // 切换
    toggle() {
      this.showVis = !this.showVis;
      const text = this.btnText[1] === "可视化" ? "歌词" : "可视化";
      Vue.set(this.btnText, 1, text);
    },

    // 背景透明度
    input(e) {
      this.brightness = e.currentTarget.value || 0;
    },
  },

  components: {
    visView,
    visLyric,
  },
};
</script>

<style>
.visualizer-container {
  position: fixed;
  width: 100%;
  height: 100%;
}
.visualizer-area {
  position: absolute;
  background: rgba(7, 17, 77, 1);
  width: 100%;
  height: 100%;
  padding: 50px 150px;
  z-index: 2;
}
.visualizer-container img {
  position: absolute;
  width: 100%;
  height: 100%;
  filter: blur(30px);
  z-index: 1;
}
.shinkctrl-main-btn {
  width: 100%;
  position: relative;
  z-index: 99;
}
.shinkctrl-main-btn span {
  display: inline-block;
  margin-left: 5px;
  padding: 0 10px;
  height: 25px;
  width: 100px;
  line-height: 25px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.05);
}
.shinkctrl-main-btn span:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
}

.brightness-box {
  position: relative;
  top: 13px;
  width: 120px;
  height: 20px;
  z-index: 99;
}
.brightness-box span {
  position: absolute;
  left: 0;
  top: 7.5px;
  height: 5px;
  border-radius: 10px;
}
.brightness-bg {
  width: 100%;
  background: #4f5360;
}
.brightness-progress {
  width: 75%;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(#a1f1a3),
    to(#3974d5)
  );
}
.brightness-box .doc {
  margin-left: -10px;
}
</style>
