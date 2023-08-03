<template>
  <div class="collect-music">
    <!-- 个人信息 -->
    <div class="lf">
      <img :src="user.pic" width="200" height="200" />
    </div>
    <div class="info-main lf">
      <p class="user-info-title">
        <span>我喜欢的音乐（{{ user.collectMusic.length }}）</span>
      </p>
      <div class="user-info-main">
        <span>{{ user.nickname }}</span>
        <span>于 {{ new Date(user.birthday).format('-', true) }} 创建</span>
      </div>

      <ul class="title-ul">
        <li v-for="key in title" class="lf" @click="titleClick(key)">
          <span>{{ key }}</span>
        </li>
      </ul>
    </div>

    <!-- 歌曲列表 -->
    <music-list
      :showMusicList="filterUser"
      :alrcollect="true"
      class="like-music-list"
    >
    </music-list>
  </div>
</template>

<script>
import musicList from '@/components/search/musicList';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      // 标题
      title: ['全部播放', '全部下载'],
    };
  },
  computed: {
    ...mapGetters(['host', 'user', 'forward', 'download']),
    filterUser() {
      // 在已收藏列表中，所有的歌曲都应该是收藏状态
      this.user.collectMusic.forEach((val) => {
        val.collect = true;
      });
      return this.user.collectMusic;
    },
  },
  methods: {
    playAll() {
      this.user.collectMusic.forEach((song) => {
        this.$store.dispatch('addMusicList', song.oringeInfo);
        this.forward(0);
      });
    },
    downloadAll() {
      const list = this.user.collectMusic;
      this.$event.fire('downclick', list.length);
      list.forEach((song) => {
        const { id, musicName, oringeInfo } = song;
        this.download(id, musicName, oringeInfo);
      });
    },
    titleClick(key) {
      key === '全部播放' && this.playAll();
      key === '全部下载' && this.downloadAll();
    },
  },
  components: {
    musicList,
  },
};
</script>

<style>
.collect-music {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 40px;
}

.info-main {
  width: calc(100% - 250px);
  margin-left: 50px;
  margin-bottom: 30px;
}
.user-info-title {
  width: 100%;
  height: 45px;
  line-height: 25px;
  font-size: 16px;
  padding: 10px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12.5px 0 25px 0;
}
.user-info-main {
  display: inline-block;
  height: 45px;
  font-size: 16px;
  line-height: 25px;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.1);
}

.info-main .title-ul {
  width: 100%;
  overflow: hidden;
}

.like-music-list {
  margin-bottom: 50px;
}

.info-main .title-ul li {
  width: 10%;
  min-width: 100px;
  text-align: center;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: #a4b5b9;
  margin: 0 10px 15px 0;
}
.info-main .title-ul li:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}
.info-main .title-ul li span {
  cursor: pointer;
}
</style>
