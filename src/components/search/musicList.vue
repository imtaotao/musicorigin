<template>
  <div>
    <ul class="song-list-nav">
      <li v-for="key in navTitle" class="lf list-li">
        <span class="Gray">{{ key }}</span>
      </li>
    </ul>
    <ul
      v-for="(key, i) in showMusicList"
      class="music-list-content"
      :class="i % 2 !== 0 && 'stripe'"
      @dblclick="dbPlay(key.oringeInfo, i)"
    >
      <li class="lf list-li">
        <span class="Gray">{{ i + 1 }}</span>
      </li>
      <li class="lf list-li">
        <i
          :class="key.collect ? 'icon-collect2-list' : 'icon-collect1-list'"
          @click="collect(i)"
          v-ripple
        ></i>
        <i
          class="downLoad"
          v-ripple
          @click="downclick(key.id, getCell(0, key), key.oringeInfo)"
        ></i>
      </li>
      <li v-for="(item, i) in 4" class="lf list-li">
        <span :class="i !== 0 ? 'Gray' : 'White'">{{ getCell(i, key) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { util } from "@/common/js/util";
import interFace from "@/common/js/audioInterFace";

export default {
  props: ["showMusicList", "alrcollect"],

  data() {
    return {
      navTitle: ["", "操作", "音乐标题", "歌手", "专辑", "时长"],
    };
  },

  computed: {
    ...mapGetters(["playOneSong", "resetCollect", "musicList", "download"]),
  },

  methods: {
    dbPlay(song, i) {
      if (!song) return alert("当前歌曲播放出现问题了 /(ㄒoㄒ)/~~");
      this.playOneSong(song);
    },

    getCell(i, key) {
      switch (i) {
        case 0:
          return !this.alrcollect ? key.name : key.musicName;
        case 1:
          return key.singer;
        case 2:
          return key.albumName;
        case 3:
          return util.conver(key.time);
      }
    },

    // 收藏歌曲
    collect(i) {
      interFace.collect(this.showMusicList[i], (_) => {
        this.resetCollect(this.musicList);
      });
    },

    downclick(id, name, info) {
      this.$event.fire("downclick", 1);
      this.download(id, name, info);
    },
  },
};
</script>

<style>
.song-list-nav {
  width: 100%;
  overflow: hidden;
  border-top: 0.5px solid rgba(255, 255, 255, 0.1);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
}
.song-list-nav li {
  height: 30px;
  text-align: left;
  padding: 0 10px;
  border-right: 0.5px solid rgba(255, 255, 255, 0.1);
}
.song-list-nav li:hover {
  background: rgba(255, 255, 255, 0.1);
}
.song-list-nav li span {
  line-height: 30px;
}
.music-list-content {
  overflow: hidden;
}
.music-list-content:hover {
  background: rgba(255, 255, 255, 0.1);
}
.music-list-content li {
  height: 30px;
  text-align: left;
  padding: 0 10px;
  font-size: 14px;
  line-height: 30px;
  cursor: pointer;
}
.stripe {
  background: rgba(255, 255, 255, 0.05);
}
.list-li i {
  display: inline-block;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.list-li i:last-child {
  background-size: 100% 100%;
}

.list-li:nth-child(1) {
  width: 5%;
}
.list-li:nth-child(2) {
  width: 100px;
}
.list-li:nth-child(3) {
  width: 30%;
}
.list-li:nth-child(4) {
  width: 20%;
}
.list-li:nth-child(5) {
  width: 20%;
}
.list-li:nth-child(6) {
  width: 10%;
}
</style>
