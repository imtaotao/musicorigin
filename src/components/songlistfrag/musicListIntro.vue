<!-- 歌单介绍 -->
<template>
  <div class="intro-box">
    <div class="lf">
      <img :src="introInfo.picUrl" width="250" height="250" />
    </div>
    <div class="lf right-text">
      <p class="intro-title">
        <span>歌单</span>
        <span>{{ introInfo.name }}</span>
        <span class="rt Gray"
          ><i class="play-count"></i>{{ introInfo.playCount }}</span
        >
      </p>
      <p>
        <span class="Gray"
          >网易云音乐用户于 {{ introInfo.createTime }} 创建</span
        >
      </p>
      <ul class="operate-btn">
        <li v-for="(key, i) in operate" class="lf" @click="operateClick(key)">
          <i :class="getClass(i)" class="lf"></i>
          <span>{{ key }}</span>
        </li>
      </ul>

      <!-- 标签与简介 -->
      <p v-for="(key, i) in tagDis" class="tag-dis">
        <span>{{ key.name }}</span>
        <span
          class="discription-content Gray hidden-text"
          :title="key.dis"
          @click="
            i === 0 &&
              $router.push({ path: '/findMusic', query: { go: '/songList' } })
          "
          >{{ key.dis }}</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Queue from "@/common/js/Queue";

export default {
  data() {
    return {
      introInfo: {
        name: "暂无歌单名",
        createTime: "20xx-xx-xx",
        playCount: "0",
        picUrl: null,
      },
      operate: ["播放全部", "收藏", "分享", "下载全部"],
      tagDis: [
        { name: "标签：", dis: "暂无" },
        { name: "简介：", dis: "暂无" },
      ],
      // 判断是收藏还是取消收藏
      collectVale: null,
    };
  },

  computed: {
    ...mapGetters(["host", "playMusicList", "listId", "user", "download"]),

    collect: {
      get() {
        // 如果是第一次进入判断是否已经收藏
        if (this.collectVale === null) this.resetCollect();
        return this.collectVale;
      },

      set(newVal) {
        this.collectVale = newVal;
      },
    },
  },

  methods: {
    // 登录成功后重新判断当前页面收藏清空，因为可能切换账号了
    resetCollect() {
      const { listId, user } = this;
      let i = 0,
        list = user.collectList;
      length = list.length;

      for (; i < length; i++) {
        if (list[i].id == listId) {
          return (this.collectVale = true);
        }
      }
      this.collectVale = false;
    },

    getClass(i) {
      switch (i) {
        case 0:
          return "play-all";
        case 1:
          return !this.collect ? "collect-list-false" : "collect-list-true";
        case 2:
          return "share-it";
        case 3:
          return "down-all";
      }
    },

    // 四个操作按钮
    operateClick(key) {
      key === "播放全部" && this.playMusicList(this.listId);
      key === "收藏" && this.collectList();
      key === "下载全部" && this.downAll();
      key === "分享" && alert("分享功能暂未实现~😯~");
    },

    // 收藏歌单
    collectList() {
      const {
        listId,
        $ajax,
        user,
        host,
        $event,
        collect,
        isCollect,
        introInfo,
      } = this;

      if (!user._id) {
        alert("请先登录");
        $event.fire("showLogin", true);
        return;
      }
      if (!listId || introInfo.name === "暂无歌单名") {
        return alert("收藏失败");
      }

      Queue.on("listCollect", (next) => {
        $ajax
          .post(host + "/listCollect", {
            name: user.name,
            id: listId,
            listName: introInfo.name,
            collect: this.collect, // true是已经收藏，false是没有收藏
          })
          .then(({ data }) => {
            alert(data.msg);

            // -1 为参数错误，0为操作失败
            if (data.code === -1 || data.code === 0) return next();

            if (!this.collect) {
              this.user.collectList.push({
                id: listId,
                listName: introInfo.name,
              });
            } else {
              this.user.collectList.forEach((val, i) => {
                if (val.id === listId) {
                  this.user.collectList.splice(i, 1);
                }
              });
            }

            this.collect = !this.collect;
            $event.fire("changeUser");
            next();
          });
      });
    },

    // 下载全部
    downAll() {
      const { host, $ajax, listId, download, $event } = this;
      if (!listId) {
        alert("该歌单找不到");
        return;
      }

      // 通过歌单 id 请求歌单数据并播放
      $ajax.get(host + `/playlist/detail?id=${listId}`).then(({ data }) => {
        if (data.code !== 200) {
          console.error(`code is ${data.code}`);
          return alert("网络不好哦！刷新一下吧");
        }
        const { tracks } = data.playlist;
        $event.fire("downclick", tracks.length);
        tracks.forEach((val) => {
          const { id, name } = val;
          download(id, name, val);
        });
      });
    },
  },

  created() {
    this.$event.on("playlistintro", ({ data }) => {
      let tag = "";
      const tags = data.tags;

      if (tags.length) {
        tags.forEach((val) => (tag += val + " / "));
        tag = tag.slice(0, tag.length - 2);
      } else {
        tag = typeof tags === "object" ? null : tags;
      }

      this.tagDis[0].dis = tag || "暂无";
      this.tagDis[1].dis = data.description || "暂无";
      this.introInfo.name = data.name;
      this.introInfo.createTime = new Date(data.createTime).format("-", true);
      this.introInfo.picUrl = data.coverImgUrl;
      this.introInfo.playCount =
        data.playCount > 100000
          ? parseInt(data.playCount / 10000) + "万"
          : data.playCount;
    });

    this.$event.on("loginSuccess", (_) => this.resetCollect());
  },

  beforeDestroy() {
    // 销毁注册的事件
    this.$event.off("playlistintro");
    this.$event.off("loginSuccess");
  },
};
</script>

<style>
.intro-box {
  overflow: hidden;
}
.right-text {
  width: calc(100% - 300px);
  margin-left: 50px;
}
.right-text p:first-child {
  margin-top: 10px;
}
.right-text p {
  width: 100%;
  height: 50px;
  text-align: left;
  padding: 10px;
}
.right-text p span {
  line-height: 30px;
}
.operate-btn {
  width: 100%;
  padding: 10px;
  overflow: hidden;
}

.intro-title span:first-child {
  float: left;
  display: inline-block;
  width: 50px;
  height: 30px;
  text-align: center;
  border-radius: 3px;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(#0094b9),
    to(#53fdd6)
  );
}
.intro-title span:nth-child(2) {
  float: left;
  font-size: 25px;
  margin-left: 10px;
}
.operate-btn li {
  width: 15%;
  min-width: 110px;
  height: 30px;
  padding: 5px;
  line-height: 20px;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
}
.operate-btn li:hover {
  background: rgba(255, 255, 255, 0.2);
}
.operate-btn li span {
  cursor: pointer;
  vertical-align: top;
}
.operate-btn i {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 10px;
}

/*小图标*/
.play-all {
  background: url("~static/pageimg/play-all.png") no-repeat;
}
.collect-list-false {
  background: url("~static/pageimg/collect-list-false.png") no-repeat;
}
.collect-list-true {
  background: url("~static/pageimg/collect-list-true.png") no-repeat;
}
.share-it {
  background: url("~static/pageimg/share-it.png") no-repeat;
}
.down-all {
  background: url("~static/pageimg/down-all.png") no-repeat;
}

.play-count {
  display: inline-block;
  height: 10px;
  width: 10px;
  background: url("~static/pageimg/playCount.png") no-repeat;
  margin-right: 10px;
}
.tag-dis {
  width: 100%;
}
.tag-dis span {
  display: inline-block;
  font-size: 15px;
  cursor: pointer;
}
.tag-dis span:nth-child(1) {
  width: 60px;
}
.tag-dis span:nth-child(2) {
  max-width: calc(100% - 80px);
  vertical-align: bottom;
}
</style>
