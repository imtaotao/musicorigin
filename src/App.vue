<template>
  <div>
    <div
      class="git-url animate hidden-text"
      :class="showTip ? '' : 'hidden-git'"
    >
      本网站介绍以及源码，
      <a :href="gitUrl" target="_blank">点这~</a>
      <span @click="showTip = false">x</span>
    </div>
    <home-main></home-main>
    <audio-ctr></audio-ctr>
  </div>
</template>

<script>
// 模板
import down from '@/common/js/download';
import homeMain from '@/components/home/homeMain';
import audioCtr from '@/components/audioCtrl';
import Queue from '@/common/js/Queue';
import { util } from '@/common/js/util';
import interFace from '@/common/js/audioInterFace';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      gitUrl: 'https://github.com/imtaotao/musicorigin',
      showTip: true,
      t: null, // 自动增加经验的值
      exTime: 60 * 1000, // 自动增加经验的时间间隔(一分钟)
    };
  },
  computed: {
    ...mapGetters([
      'host',
      'phone',
      'password',
      'forward',
      'musicList',
      'changeMusicList',
      'user',
    ]),
  },
  methods: {
    // 播放新音乐（电台）
    playOneSong(song, position = 0) {
      if (!song) {
        alert('该歌曲找不到');
        return;
      }

      this.$store.dispatch('addMusicList', song);
      this.forward(position);
    },

    // 推荐歌单播放
    playMusicList(id) {
      if (!id) {
        alert('该歌单找不到');
        return;
      }
      const { host, forward, $ajax, $store } = this;

      // 通过歌单 id 请求歌单数据并播放
      $ajax.get(host + `/playlist/detail?id=${id}`).then(({ data }) => {
        if (data.code !== 200) {
          console.error(`code is ${data.code}`);
          alert('网络不好哦！刷新一下吧');
          return;
        }

        const { playlist } = data;
        const { tracks } = playlist;

        // 跟改歌单，并判断是否加入进，然后开始播放歌曲
        $store.dispatch('changeMusicList', tracks);
        if (this.musicList.length === 1 && this.musicList[0].id === 0) return;
        forward(0);
      });
    },

    // 默认登录网易云账号
    defaultNetUser() {
      const { host, $ajax, phone, password } = this;
      const loginTime = localStorage.getItem('loginTime');

      if (loginTime) {
        if (Date.now() < loginTime + 60 * 3) return;
      }

      // 默认登录自己的网易云音乐账号，默认 3 分钟登录一次
      $ajax.get(host + '/login/refresh');
      $ajax
        .get(host + `/login/cellphone?phone=${phone}&password=${password}`)
        .then(({ data }) => {
          if (data.code === 415) {
            alert('登录频繁');
            return;
          }
          if (data.code !== 200) {
            alert('默认网易云音乐账号登录失败~~');
            return;
          }

          alert('默认网易云音乐账号登录成功~~');
          // 存一个时间戳
          localStorage.setItem('loginTime', Date.now());
          this.defaultMusicList(data.account.id);
        });
    },

    // 获得默认的网易云账号收藏歌曲，作为默认的歌曲列表
    defaultMusicList(userId) {
      if (!userId) return;

      const { $ajax, host, $store } = this;
      // 得到用户信息
      $ajax.get(host + `/user/playlist?uid=${userId}`).then(({ data }) => {
        const collectlistId = data.playlist[0].id;
        $ajax(host + `/playlist/detail?id=${collectlistId}`).then(
          ({ data }) => {
            if (data.code !== 200) return;
            localStorage.setItem(
              'defaultPlayList',
              JSON.stringify(data.playlist.tracks),
            );
            $store.dispatch('changeMusicList', data.playlist.tracks);
          },
        );
      });
    },

    defaultPlayList() {
      const playlist = localStorage.getItem('defaultPlayList');
      if (!playlist) return;

      this.$store.dispatch('changeMusicList', JSON.parse(playlist));
    },

    collectFilter(data) {
      const or = data.oringeInfo;
      const album = or.album || or.al;
      const artists = or.artists || or.ar;
      return {
        name: this.user.name,
        id: or.id,
        musicName: or.name,
        albumId: album.id,
        albumName: album.name,
        singer: artists[0].name,
        singerId: artists[0].id,
        time: or.duration || or.dt,
        oringeInfo: or,
        collect: data.collect,
      };
    },

    // 收藏歌曲
    collectMusic() {
      const { host, $ajax, $event } = this;

      interFace.collect = (info, callback) => {
        if (!this.user._id) return alert('请先登录');

        Queue.on('listCollect', (next) => {
          if (!info || !info.oringeInfo || info.collect == null) {
            alert('歌曲信息获取失败');
            return next();
          }

          // mmp  true 是取消收藏，false是收藏
          const saveData = this.collectFilter(info);

          $ajax.post(host + '/collecMusic', saveData).then(({ data }) => {
            if (!data) return alert('收藏出错了');
            const { msg, code } = data;
            alert(msg);

            if (code === -1 || code === 0) return;

            // 如果 data.collect === true 代表取消收藏
            if (info.collect) {
              this.user.collectMusic.forEach((val, i) => {
                if (val.id === saveData.id) {
                  this.user.collectMusic.splice(i, 1);
                }
              });
            } else {
              this.user.collectMusic.push(saveData);
            }

            info.collect = !info.collect;
            $event.fire('changeUser');
            $event.fire('resetCollect');
            callback && callback();
            next();
          });
        });
      };
    },

    // 在本网站停留三分钟加一点经验
    addEX() {
      const { user, host, $ajax, $event, exTime, addEX } = this;

      if (!user._id) {
        $event.fire('showLogin', true);
        return alert('登录涨经验哦~~');
      }

      this.t = setTimeout((_) => {
        $ajax
          .get(host + `/addexperience?name=${user.name}`)
          .then(({ data }) => {
            if (data.code !== 1) return addEX();

            const { ex, grade, percent } = data.result;
            this.user.ex = ex;
            this.user.percent = percent;
            this.user.grade = grade;

            $event.fire('changeUser');
            addEX();
          });
      }, exTime);
    },

    // 下载歌曲
    downMusic(id, name = Date.now(), song) {
      if (!id) return alert('未获取到数据~');
      const { $store, $event, download, downsave } = this;

      // 每次下载都有一个下载实例
      const downInstance = new down(name);
      $store.dispatch('downQueue', downInstance);

      Queue.on('down', (next) => {
        download(id, name, (procent) => {
          downInstance.procent = procent;
        }).then((fail) => {
          // 下载完毕后删除当前数据，继续下载
          $store.dispatch('downUnshift', downInstance.randomStr);

          !fail && downsave(song);
          next();
        });
      });
    },

    downsave(info) {
      const { $ajax, $event, user, host } = this;
      if (!user._id) return;

      info.downTime = Date.now();
      $ajax
        .post(host + '/alrdownload', { name: user.name, info })
        .then(({ data }) => {
          if (data.code !== 1) return alert('下载信息保存异常');

          // 实时更新
          this.user.downList.push(info);
          $event.fire('changeUser');
        });
    },

    download(id, name = util.randomStr(), callback) {
      if (!id) return alear('暂无数据~');
      const { $ajax, host, $store } = this;

      return new Promise((resolve, reject) => {
        // 先获取音乐的 url
        $ajax.get(host + `/music/url?id=${id}`).then(({ data }) => {
          const insertData = data.data;
          if (!insertData) return alert('暂无数据~');

          const url = insertData[0].url;
          if (!url) {
            resolve(true);
            return alert('该歌曲可能因为版权问题，不能下载~');
          }

          $ajax({
            url: host + `/download?url=${url}`,
            responseType: 'blob',
            onDownloadProgress({ loaded, total }) {
              $store.dispatch('hideLoading');
              const procent = loaded / total;
              callback && callback(procent);
            },
          }).then(({ data }) => {
            const objectURL = URL.createObjectURL(data);
            const suffix = url.match(/\.[^\.]+$/);
            const filename = name + (suffix ? suffix[0] : '.mp3');
            util.down(objectURL, filename, resolve);
          });
        });
      });
    },
  },

  created() {
    const {
      $store,
      $event,
      forward,
      playMusicList,
      addEX,
      defaultPlayList,
      playOneSong,
      defaultNetUser,
      collectMusic,
      downMusic,
    } = this;

    defaultNetUser();
    addEX();
    // 歌单播放列表 和 单首歌播放 放到 vuex
    $store.dispatch('playMusicList', playMusicList);
    $store.dispatch('playOneSong', playOneSong);
    $store.dispatch('download', downMusic);

    // 当添加的歌曲已经子啊播放列表的时候
    $event.on('playPosition', ({ data }) => {
      forward(data);
    });

    // 修改当前用户信息后
    $event.on('changeUser', (_) => {
      const copyUser = JSON.parse(JSON.stringify(this.user));
      copyUser.pwd = null;
      localStorage.setItem('user', JSON.stringify(copyUser));
    });

    this.$event.on('login', (_) => {
      if (this.t) {
        clearTimeout(this.t);
        this.t = null;
      }
      setTimeout((_) => addEX());
    });
    collectMusic();
    defaultPlayList();
  },

  components: {
    homeMain,
    audioCtr,
  },
};
</script>

<style>
.git-url {
  position: relative;
  top: 2px;
  overflow: hidden;
  width: 220px;
  height: 30px;
  border-radius: 3px;
  padding: 8px 12px;
  left: calc(50% - 110px);
  font-size: 12px;
  color: #7e8c8d;
  text-align: center;
}
.hidden-git {
  left: 80% !important;
  opacity: 0;
  width: 0;
  height: 0;
  padding: 0;
}
.git-url a {
  color: #666;
}
.git-url span {
  display: inline-block;
  width: 15px;
  height: 15px !important;
  font-size: 13px;
  vertical-align: top;
  height: 10px;
  color: #fff;
  background: rgba(100, 108, 125, 1);
  border-radius: 50%;
  margin-top: -2px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
