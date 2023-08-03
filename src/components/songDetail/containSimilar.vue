<template>
  <div>
    <!-- 相似歌曲 -->
    <div class="contain-box">
      <p class="contain-title">
        <span>相似音乐</span>
      </p>
      <ul class="contain-ul">
        <li v-for="(key, i) in songs" @click="playOneSong(key)">
          <div class="img-box lf">
            <img :src="key.album.picUrl" width="50" height="50" />
            <b class="mask-layer"></b>
          </div>
          <div class="lf">
            <p class="contain-music-list hidden-text">
              {{ key.name }}
            </p>
            <p class="contain-play-count Dark hidden-text">
              {{ key.artists[0].name }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      songs: [],
    };
  },
  computed: {
    ...mapGetters(['host', 'nowPlayId', 'playOneSong']),
  },
  methods: {
    resetDate() {
      this.songs = [];
    },
    getData() {
      const { host, nowPlayId, $ajax } = this;

      $ajax.get(host + `/simi/song?id=${nowPlayId}`).then(({ data }) => {
        if (data.code !== 200) {
          alert('获取相似音乐失败~~');
          return;
        }

        this.songs = data.songs || [];
      });
    },
  },
  created() {
    const { $event, resetDate, getData } = this;
    $event.on('songDetailReset', (_) => {
      resetDate();
      getData();
    });
    getData();
  },
};
</script>

<style>
/*包含这首歌的歌单*/
.contain-title {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.contain-title span {
  font-size: 25px;
}
.contain-ul li {
  width: 100%;
  height: 70px;
  overflow: hidden;
  margin: 10px 0;
  padding: 10px 10px 10px 0;
  font-size: 14px;
}
.contain-ul li:hover {
  background: rgba(255, 255, 255, 0.05);
}
.contain-ul li * {
  cursor: pointer;
}
.contain-ul li .img-box {
  margin-right: 10px;
  width: 50px;
  height: 50px;
  position: relative;
}
.contain-ul li .img-box b {
  border-radius: 0;
}
.contain-ul li div {
  width: calc(100% - 60px);
  height: 50px;
}
.contain-ul li div p {
  height: 25px;
  line-height: 25px;
}
</style>
