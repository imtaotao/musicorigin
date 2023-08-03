<template>
  <div class="down-list-container">
    <ul class="alrdown-list">
      <li class="alrdown-list-title">
        <span></span>
        <span>音乐标题</span>
        <span>歌手</span>
        <span>专辑</span>
        <span>大小</span>
        <span>下载时间</span>
      </li>
      <!-- 列表 -->
      <li v-for="(key, i) in musiclist" @dblclick="playOneSong(key)">
        <span>{{ i + 1 }}</span>
        <span>{{ key.name }}</span>
        <span>{{ key.artists ? key.artists[0].name : key.ar[0].name }}</span>
        <span>{{ key.album ? key.album.name : key.al.name }}</span>
        <span>{{ musicSize(key) }}</span>
        <span>{{ new Date(key.downTime).format("-", true) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["user", "playOneSong"]),

    musiclist() {
      return this.user._id ? this.user.downList : [];
    },
  },

  methods: {
    musicSize(key) {
      const size = key.lMusic ? key.lMusic.size : key.l.size;
      return (size / 1024 / 1024).toFixed(1) + "M";
    },
  },
};
</script>

<style>
.down-list-container {
  width: 100%;
  overflow-x: hidden;
}
.alrdown-list {
  width: 100%;
}
.alrdown-list-title {
  border-top: 0.5px solid rgba(255, 255, 255, 0.3);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.3);
}
.alrdown-list-title span {
  border-right: 0.5px solid rgba(255, 255, 255, 0.3);
}
.alrdown-list-title span:last-child {
  border: none;
}
.alrdown-list-title span:nth-child(2) {
  color: #a4b5b9 !important;
}
.alrdown-list-title span:hover {
  background: rgba(255, 255, 255, 0.1);
}
.alrdown-list li {
  width: 100%;
  overflow: hidden;
  height: 35px;
  font-size: 15px;
  color: #a4b5b9;
}
.alrdown-list li span {
  float: left;
  display: inline-block;
  height: 35px;
  line-height: 35px;
  padding-left: 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.alrdown-list li span:nth-child(1) {
  width: 5%;
}
.alrdown-list li span:nth-child(2) {
  width: 30%;
  color: #fff;
}
.alrdown-list li span:nth-child(3) {
  width: 20%;
}
.alrdown-list li span:nth-child(4) {
  width: 20%;
}
.alrdown-list li span:nth-child(5) {
  width: 10%;
}
.alrdown-list li span:nth-child(6) {
  width: 15%;
}
</style>
