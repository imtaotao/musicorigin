<template>
  <div>
    <!-- 总体容器 -->
    <transition name="long-fade">
      <div class="all-container animate-five" v-if="showContainer">
        <loading v-if="isLoading"></loading>
        <transition name="zoom">
          <div class="mainpage-box" v-if="!songDetail">
            <div
              class="bg-pic animate"
              :style="{ background: bgStyle() }"
            ></div>
            <!-- 左边栏 -->
            <aside class="lf" id="js_aside">
              <!-- 个人登录信息 -->
              <div class="sigle-tab-box user-info">
                <p class="tab-title">个人信息</p>
                <div class="person-info">
                  <div class="pic-box">
                    <input
                      type="file"
                      class="hide-input"
                      title="上传个人头像"
                      id="upPic"
                      @change="upPic"
                    />
                    <div class="border-cicle"></div>
                    <img :src="user.pic" width="80" height="80" />
                  </div>

                  <div @click.self="changeNick" class="user-nick">
                    <span title="修改昵称" @click.self="changeNick">{{
                      user.nickname
                    }}</span>
                    <div
                      class="change-nick animate"
                      :class="nickChangeBar ? '' : 'hide-bar'"
                    >
                      <div class="nick-corners"></div>
                      <input
                        type="text"
                        v-model="inputNick"
                        @keyup.enter="submitNick"
                      />
                    </div>
                  </div>
                  <p class="user-grade">{{ user.grade }}</p>
                  <!-- 经验条 -->
                  <div class="experience-bar">
                    <span></span>
                    <span
                      class="animate-os"
                      :style="{ width: exprocent(user.percent) }"
                    >
                      <i class="show-box animate">
                        <div class="sharp-corners"></div>
                        {{ user.ex }}/{{ exprocent(user.percent) }}
                      </i>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 歌单部分 -->
              <div class="list-box">
                <div class="sigle-tab-box" v-for="item in leftLum">
                  <p class="tab-title" v-if="item.title">{{ item.title }}</p>
                  <ul>
                    <router-link
                      :to="key.url"
                      v-for="key in item.content"
                      tag="li"
                      class="tab-btn"
                      v-show="showColumn(key.name)"
                    >
                      <i
                        :class="getIcon(item.title, key.name)"
                        v-ripple="'#0094B9'"
                      ></i>
                      <span>{{ key.name }}</span>

                      <!-- 下载 -->
                      <span
                        class="down-icon rt animate-os"
                        v-if="key.name === '下载音乐'"
                        :class="showDown ? 'show-down' : ''"
                      >
                        + {{ downlength }}
                      </span>
                    </router-link>
                  </ul>
                </div>

                <!-- 歌单列表 -->
                <div class="sigle-tab-box">
                  <p class="tab-title">收藏的歌单</p>
                  <ul>
                    <router-link
                      :to="'/collectList/' + key.id"
                      v-for="key in user.collectList"
                      tag="li"
                      class="tab-btn"
                    >
                      <i class="musicList" v-ripple="'#0094B9'"></i>
                      <span class="hidden-text list-name" :title="key.listName">
                        {{ key.listName }}
                      </span>
                    </router-link>
                  </ul>
                </div>
              </div>
            </aside>
            <!-- 右边栏 -->
            <div class="right-box rt animate">
              <go-up class="go-top" v-show="showGoUp"></go-up>
              <!-- tab 栏 -->
              <nav>
                <nav-com></nav-com>
                <div class="border-bottom"></div>
              </nav>
              <transition :name="transition" mode="out-in">
                <router-view class="right-content-details" v-scrollTop="scroll">
                </router-view>
              </transition>
            </div>
          </div>
        </transition>
        <!-- 当前播放歌曲详情 -->
        <transition name="zoom">
          <songDetail
            v-if="songDetail"
            class="song-detail"
            :songDetail.sync="songDetail"
          ></songDetail>
        </transition>

        <!-- 登录窗口 -->
        <login-box class="login-box"></login-box>
      </div>

      <visualizer v-if="!showContainer"></visualizer>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import navCom from "@/components/nav";
import loginBox from "@/components/nav/login";
import visualizer from "@/components/visualizer";
import songDetail from "@/components/songDetail";
import { util } from "@/common/js/util";

const { $ } = util;

export default {
  data() {
    return {
      transition: "fade",
      leftLum: {
        search: {
          content: [{ name: "search", url: "/search" }],
        },
        recommend: {
          title: "推荐",
          content: [{ name: "发现音乐", url: "/findMusic" }],
        },
        myMusic: {
          title: "我的音乐",
          content: [{ name: "下载音乐", url: "/download" }],
        },
        createList: {
          title: "喜欢的音乐",
          content: [{ name: "我的音乐", url: "/likeMusic" }],
        },
      },
      showGoUp: false,
      // 皮肤选择
      bgValue: false,
      // 皮肤值
      skinValue: null,
      // 显示歌曲详情页面
      showChild: false,
      // 跟改的nickname
      inputNick: null,
      // 昵称修改条的显示
      nickChangeBar: false,
      // 显示下载提示
      showDown: false,
      // 当前的下载数量
      downlength: 1,
    };
  },

  computed: {
    ...mapGetters([
      "isLoading",
      "nowPlayId",
      "host",
      "shrinkAnimate",
      "nowSkin",
      "user",
      "showContainer",
    ]),

    // 是否显示歌曲详情页面
    songDetail: {
      get() {
        return this.showChild;
      },

      set(newVal) {
        this.showChild = newVal;
      },
    },
  },

  methods: {
    bgStyle() {
      const { skinValue, bgValue } = this;
      return !bgValue ? skinValue : `url("static/img/${skinValue}") no-repeat`;
    },

    exprocent(percent) {
      return (percent * 100).toFixed(2) + "%";
    },

    showColumn(name) {
      if (name !== "我的音乐") return name !== "search";
      return this.user._id;
    },

    getIcon(title, name) {
      if (name === "下载音乐") return "downLoad";
      if (name === "我喜欢的音乐") return "likeMusic";
      if (name === "发现音乐") return "findMusic";
      return "musicList";
    },

    // scroll 回调
    scroll(el, winH) {
      winH > 200 ? (this.showGoUp = true) : (this.showGoUp = false);
    },

    // 点击回到顶部
    goUp() {
      const el = $(".right-content-details");
      if (!el) return;
      let distance = el.scrollTop;
      const singleMove = distance / 12;
      function t() {
        requestAnimationFrame((_) => {
          distance -= singleMove;
          distance < 0 && (distance = 0);
          el.scrollTop = distance;
          distance > 0 && t();
        });
      }
      t();
    },

    // 搜索页面触发事件
    searchInit() {
      this.$event.fire("searchInit");
    },

    // 登录成功后
    login(data) {
      if (!data) return;
      const { $store, $event } = this;
      // 把当前用户信息放到全局
      $store.dispatch("user", data);
      this.userInfo = data;
      $store.dispatch("resetMusicList", data);
      $event.fire("loginSuccess");
    },

    // 跟改昵称
    changeNick() {
      if (!this.user._id) return alert("请您先登录");
      this.nickChangeBar = !this.nickChangeBar;
      !this.nickChangeBar && this.submitNick();
    },

    submitNick() {
      const { $ajax, $store, $event, host, inputNick, user } = this;
      if (!inputNick || inputNick === this.user.nickname) return;
      $ajax
        .post(host + "/nickname", { nickname: inputNick, name: user.name })
        .then(({ data }) => {
          if (data.msg) return alert(data.msg);

          this.user.nickname = data.nickname;
          this.nickChangeBar = false;
          $event.fire("changeUser");
          alert("修改成功");
        });
    },

    // 上传头像
    upPic() {
      if (!this.user._id) {
        this.$event.fire("showLogin", true);
        return alert("请先登录~");
      }
      const file = util.$("#upPic").files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("userfile", file);
      fd.append("name", this.user.name);
      this.$ajax.post(this.host + "/upPic", fd).then(({ data }) => {
        if (data.msg) return alert(data.msg);
        this.user.pic = data;
        this.$event.fire("changeUser");
      });
    },

    // 显示下载提示框
    downPrompt(num = 1) {
      this.showDown = true;
      this.downlength = num;
      setTimeout((_) => {
        this.showDown = false;
      }, 1000);
    },
  },

  watch: {
    $route(to, from) {
      this.searchInit();
    },
  },

  created() {
    // 滑动按钮
    const { $event, goUp, login, downPrompt } = this;

    $event.on("scrollTop", (_) => goUp());
    // 选择主题
    $event.on("choseskin", (_) => {
      const data = this.nowSkin[0];
      const type = data.url ? "url" : "rgb";
      if (type === "url") {
        this.bgValue = true;
        this.skinValue = data.url;
      }
      if (type === "rgb") {
        this.bgValue = false;
        this.skinValue = data.rgb;
      }
    });
    // 放大当前播放歌曲详情
    $event.on("enlargeDetail", (_) => {
      const { nowPlayId, shrinkAnimate } = this;
      !nowPlayId && alert("没有获得当前播放歌曲的信息~");
      if (!nowPlayId || this.songDetail) return;
      this.songDetail = true;
      setTimeout((_) => shrinkAnimate());
    });
    // 登录界面
    $event.fire("showLogin", this.showLogin);
    $event.on("login", ({ data }) => login(data));
    // 下载信息
    $event.on("downclick", ({ data }) => downPrompt(data));
  },

  components: {
    navCom,
    songDetail,
    loginBox,
    visualizer,
  },
};
</script>

<style>
.all-container {
  position: fixed;
  width: 85%;
  height: 90%;
  top: 5%;
  left: 7.5%;
  bottom: 0;
  right: 0;
  cursor: move;
  color: #fff;
  background: #709e98;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(40, 41, 43, 0.8);
  overflow: hidden;
}
.mainpage-box {
  width: 100%;
  height: 100%;
}
.bg-pic {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-size: cover !important;
  top: 0;
  left: 0;
}
.all-container * {
  cursor: auto;
}
.right-content-details {
  background: rgba(0, 0, 0, 0.2);
}
.list-box {
  height: calc(100% - 245px);
  overflow-x: hidden;
}
nav {
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.4);
}
.border-bottom {
  width: 100%;
  height: 5px;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(#0094b9),
    to(#53fdd6)
  );
}
aside {
  width: 18%;
  height: calc(100% - 73px);
  border-right: 0.5px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s;
}
.right-box {
  width: 82%;
  height: calc(100% - 73px);
  overflow: hidden;
}

.sigle-tab-box {
  width: 100%;
  margin-bottom: 15px;
}
.user-info {
  height: 230px;
}
.tab-title {
  width: 100%;
  color: #ccc;
  font-size: 14px;
  padding: 15px 10px;
}
.tab-btn {
  padding: 8px 0 8px 30px;
  cursor: pointer;
  border-left: 5px solid transparent;
}
.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.click-active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-left: 5px solid #0094b9;
}
.tab-btn i {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: sub;
  cursor: pointer;
  margin-right: 10px;
}
.tab-btn span {
  cursor: pointer;
}

/*侧边栏图标*/
.downLoad {
  background: url("~static/pageimg/downMusic.png");
}
.likeMusic {
  background: url("~static/pageimg/likeMusic.png");
}
.musicList {
  background: url("~static/pageimg/musicList.png");
}
.findMusic {
  background: url("~static/pageimg/musicRecommend.png");
}

/*个人信息栏*/
.person-info {
  width: 90%;
  text-align: center;
  border-radius: 3px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 20px;
}

.person-info .pic-box {
  margin: 0 auto;
  border-radius: 50%;
  height: 90px;
  width: 90px;
  text-align: center;
  position: relative;
}
.user-nick {
  margin-top: 10px;
  color: #fff;
  position: relative;
  font-weight: bold;
  z-index: 9999;
}
.user-nick span {
  display: inline-block;
  min-width: 30px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.user-nick span:hover {
  background: rgba(255, 255, 255, 0.2);
}
.user-grade {
  font-weight: bold;
  margin-top: 15px;
  font-style: italic;
  background: -webkit-gradient(
    linear,
    0 top,
    0 bottom,
    from(#53fdd6),
    to(#0094b9)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.pic-box .border-cicle {
  width: 90px;
  height: 90px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  position: absolute;
  border-radius: 50%;
  left: calc(50% - 42.5px);
  z-index: 99;
}
.pic-box img {
  position: absolute;
  border-radius: 50%;
  left: calc(50% - 37.5px);
  top: 5px;
  z-index: 99;
  cursor: pointer;
}
.hide-input {
  height: 90px;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  cursor: pointer;
  opacity: 0;
  z-index: 100;
}

/*经验条*/
.experience-bar {
  position: relative;
  height: 20px;
  width: 50%;
  top: 10px;
  margin: 0 auto;
}
.experience-bar span {
  display: inline-block;
  width: 100%;
  height: 5px;
  position: absolute;
  left: 0;
  top: 7.5px;
  border-radius: 10px;
}
.experience-bar span:nth-child(1) {
  background: #000;
}
.experience-bar span:nth-child(2) {
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    from(#0094b9),
    to(#53fdd6)
  );
  cursor: pointer;
}
.experience-bar span:nth-child(2):hover .show-box {
  opacity: 1;
}
.show-box {
  display: inline-block;
  font-size: 12px;
  min-width: 30px;
  padding: 0 5px;
  line-height: 20px;
  text-align: center;
  height: 20px;
  background: #fff;
  border-radius: 3px;
  top: 13px;
  position: absolute;
  right: -15px;
  font-style: normal;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.5s;
  color: #666;
  opacity: 0;
}
.sharp-corners {
  width: 0;
  border: 5px solid transparent;
  border-bottom: 5px solid #fff;
  margin-top: -10px;
  margin-left: 50%;
}
.go-top {
  position: absolute;
  right: 40px;
  bottom: 150px;
}

/*歌曲详情页面*/
.song-detail {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 11111;
}

/*登录界面*/
/*登录窗口*/
.login-box {
  position: absolute;
  width: 100%;
  height: calc(100% - 55px);
  top: 55px;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999999;
}
.change-nick {
  position: absolute;
  top: 50px;
  width: 100%;
  height: 50px;
  padding: 10px 30px;
  background: #fff;
  border-radius: 10px;
}
.change-nick input {
  background: none;
  height: 30px;
  width: 100px;
  margin-top: 10px;
  outline: none;
  color: #ffbf74;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 2px solid #ffbf74;
}
.nick-corners {
  width: 10px;
  height: 10px;
  margin-top: -30px;
  margin-left: 43%;
  border: 10px solid transparent;
  border-bottom: 10px solid #fff;
}
.hide-bar {
  overflow: hidden;
  height: 0;
  padding: 0;
}

.list-name {
  display: inline-block;
  width: 100px;
}

/*下载按钮颜色*/
.down-icon {
  display: inline-block;
  width: 40px;
  font-size: 15px;
  height: 25px;
  color: #53fdd6;
  font-weight: bold;
  text-align: center;
  line-height: 25px;
  margin-right: 10px;
  opacity: 0;
  transform: translateY(-20px);
}
.show-down {
  opacity: 1;
  transform: translateY(0);
}
</style>
