<template>
  <div>
    <ul class="music-charts">
      <li class="lf" v-for="(key, i) in rankingList" v-show="key.playCount">
        <div class="ranking-img lf">
          <span class="ranking-play-count">
            <i></i>
            {{ key.playCount }}
          </span>
          <img :src="key.coverImgUrl" width="180" height="180" />
          <span class="song-list-play animate"
            ><i @click="playMusic(key.listId)"></i
          ></span>
          <b class="ranking-mask-layer" @click="musicList(key.listId)"></b>
        </div>
        <div class="ranking-musicList lf">
          <h6>{{ key.name }}</h6>
          <p
            v-for="(item, j) in key.info"
            class="musin-single hidden-text"
            @click="playNewSong(item.song)"
          >
            <span class="hidden-text">{{ j + 1 }}</span>
            <span class="hidden-text">{{ item.name }}</span>
            <span class="hidden-text">-</span>
            <span class="hidden-text">{{ item.author }}</span>
          </p>
        </div>
      </li>
    </ul>
    <!-- 加载更多 -->
    <div v-show="reqIndex !== rankingList.length" class="load-more">
      <span class="animate" @click="requestRanking">加载更多</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 一次加载的个数
      oneRequest: 6,
      reqIndex: 0,
      isloading: true,
      rankingList: [
        {
          name: "音乐新歌榜",
          ids: 0,
          playCount: "",
          listId: null,
          info: [],
          originInfo: [],
        },
        {
          name: "音乐热歌榜",
          ids: 1,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "原创歌曲榜",
          ids: 2,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "音乐飙升榜",
          ids: 3,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "音乐电音榜",
          ids: 4,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "UK排行榜周榜",
          ids: 5,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "美国Billboard周榜",
          ids: 6,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "KTV嗨榜",
          ids: 7,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "iTunes榜",
          ids: 8,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "Hit FM Top榜",
          ids: 9,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "日本Oricon周榜",
          ids: 10,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "韩国Melon排行榜周榜",
          ids: 11,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "韩国Mnet排行榜周榜",
          ids: 12,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "韩国Melon原声周榜",
          ids: 13,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "中国TOP排行榜(港台榜)",
          ids: 14,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "中国TOP排行榜(内地榜)",
          ids: 15,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "香港电台中文歌曲龙虎榜",
          ids: 16,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "华语金曲榜",
          ids: 17,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "中国嘻哈榜",
          ids: 18,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "法国 NRJ EuroHot 30周榜",
          ids: 19,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "台湾Hito排行榜",
          ids: 20,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
        {
          name: "Beatport全球电子舞曲榜",
          ids: 21,
          playCount: "",
          listId: null,
          info: [],
          originInfo: {},
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["host", "playOneSong", "playMusicList"]),
  },

  methods: {
    playMusic(id) {
      if (!this.isload() || !id) return;
      this.playMusicList(id);
    },

    playNewSong(song) {
      if (!this.isload() || !song) return;
      this.playOneSong(song);
    },

    // 进入歌单详情页面
    musicList(listId) {
      if (!this.isload() && !listId && listId != 0) return;
      this.$router.push(`/collectList/${listId}`);
      this.$event.off("musiclistinit");
    },

    isload() {
      if (!this.isloading) {
        alert("网络不好，请让当前资源加载完吧");
      }
      return this.isloading;
    },

    // 请求排行榜
    requestRanking() {
      if (!this.isloading) {
        alert("网络不好，请让当前资源加载完吧");
        return;
      }
      this.isloading = false;

      let allProgress = this.oneRequest * 100;
      let progress = 0;
      let length = this.reqIndex + this.oneRequest;
      length > this.rankingList.length && (length = this.rankingList.length);

      for (; this.reqIndex < length; this.reqIndex++) {
        const val = this.rankingList[this.reqIndex];

        this.$ajax
          .get(this.host + `/top/list?idx=${val.ids}`)
          .then(({ data }) => {
            if (data.code !== 200) {
              console.error(`code is ${data.code}`);
              alert(`请求${val.name}出现错误啦！！！`);
              return;
            }
            const { result } = data;
            let { id, playCount, coverImgUrl, tracks } = result;
            if (playCount > 10000) {
              playCount = parseInt(playCount / 10000) + "万";
            }
            // 取前三名列出来
            const firstThree = [];
            for (let j = 0; j < 3; j++) {
              val.info.push({
                name: tracks[j].name,
                author: tracks[j].artists[0].name,
                authorid: tracks[j].artists[0].id,
                song: tracks[j],
              });
            }
            val.playCount = playCount;
            val.coverImgUrl = coverImgUrl;
            val.listId = id;
            val.originInfo = data;

            progress += 100;
            progress === allProgress && (this.isloading = true);
          })
          .catch((err) => {
            console.log(err);
            this.isloading = true;
          });
      }
    },
  },

  created() {
    this.requestRanking();
    this.$event.on("musicLoading", (_) => (this.isloading = false));
    this.$event.on("musicLoaded", (_) => (this.isloading = true));
  },
};
</script>

<style>
.music-charts {
  overflow: hidden;
  margin-bottom: 30px;
}
.music-charts li {
  background: rgba(255, 255, 255, 0.15);
  width: 40%;
  height: 180px;
  margin: 20px 5%;
}
.ranking-img {
  width: 180px;
  height: 180px;
  position: relative;
  cursor: pointer;
}
.ranking-mask-layer {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  cursor: pointer !important;
}
.ranking-mask-layer:hover {
  background: rgba(0, 0, 0, 0.3);
}
.ranking-musicList {
  width: calc(100% - 180px);
  height: 180px;
  padding: 20px;
}
.ranking-img:hover {
  background: rgba(0, 0, 0, 0.3);
}
.ranking-img:hover .song-list-play {
  opacity: 1;
}
.ranking-play-count {
  display: inline-block;
  position: absolute;
  width: 65%;
  height: 20px;
  top: 0;
  right: 0;
  color: #fff;
  padding: 3px 10px;
  font-size: 11px;
  text-align: right;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(rgba(0, 0, 0, 0)),
    to(rgba(0, 0, 0, 0.5))
  );
}
.ranking-play-count i {
  display: inline-block;
  height: 10px;
  width: 10px;
  background: url("~static/pageimg/playCount.png") no-repeat;
}
.song-list-play {
  position: absolute;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  right: calc(50% - 15px);
  bottom: calc(50% - 15px);
  border-radius: 50%;
  opacity: 0;
  z-index: 9999;
}
.song-list-play i {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 9999;
  background: url("~static/pageimg/musicPlayIcon.png") no-repeat;
}
.song-list-play:hover {
  background: rgba(0, 0, 0, 0.8);
}

/*榜单*/
.ranking-musicList h6 {
  font-weight: bold;
  margin: 20px 0;
}
.musin-single {
  margin: 15px 0;
  height: 16px;
}
.musin-single span {
  display: inline-block;
  font-size: 14px;
  color: #ccc;
  margin: 0 3px;
  cursor: pointer;
}
.musin-single span:nth-child(2) {
  color: #fff;
}
</style>
