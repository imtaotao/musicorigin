<!-- 导航栏 -->
<template>
  <div class="nav-root">
    <ul class="nav-box">
      <li class="lf">
        <div class="search-box">
          <input
            type="text"
            placeholder="Fireflies"
            value="Moonlight"
            @keyup.enter="search()"
            id="search"
          />
          <img
            src="static/pageimg/search.png"
            width="20"
            height="20"
            @click="search()"
          />
        </div>
      </li>
      <li>
        <span class="shrink-box" @click="shrinkBox" title="可视化窗口" v-ripple>
        </span>
      </li>
      <li>
        <span
          class="streamline-box"
          title="精简模式"
          v-ripple
          @click="streamline"
        ></span>
      </li>
      <li>
        <span
          class="skin-box"
          title="换皮肤"
          v-ripple
          @click="showSkin = !showSkin"
        >
        </span>
      </li>
      <li>
        <span class="login-btn" title="登录" v-ripple @click="loginToggle">
        </span>
      </li>
    </ul>
    <!-- 皮肤窗口 -->
    <theme-box class="theme-box" :showSkin.sync="showSkin"></theme-box>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { util } from "@/common/js/util";
import themeBox from "./theme";

const $ = util.$;

export default {
  data() {
    return {
      // 皮肤窗口
      showSkin: false,
      showLogin: false,
    };
  },

  computed: {
    ...mapGetters(["shrinkAnimate"]),
  },

  methods: {
    streamline() {
      alert("精简模式暂未实现~~");
    },

    search() {
      const name = $("#search").value;
      name && this.showSearchPage(name);
    },

    loginToggle() {
      this.showLogin = !this.showLogin;
      this.$event.fire("showLogin", this.showLogin);
    },

    // 显示搜索页面
    showSearchPage(name) {
      this.$router.push("/search/" + name);
    },

    // 缩小主界面，显示可视化的地方
    shrinkBox() {
      this.shrinkAnimate();
      this.$store.dispatch("showContainer", false);
    },
  },

  created() {
    this.$event.on("login", (_) => {
      this.showLogin = false;
    });
  },

  components: {
    themeBox,
  },
};
</script>

<style>
.nav-root {
  position: relative;
}
.nav-box {
  width: 100%;
  height: 55px;
  overflow: hidden;
}
.nav-box li {
  height: 100%;
  float: right;
  margin: 0 15px;
}
.nav-box li:nth-child(2) {
  margin-right: 50px;
}
.nav-box li span {
  display: inline-block;
  margin-top: 14px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.nav-box li:first-child {
  width: 300px;
  margin-left: 40px;
}
.search-box {
  height: 30px;
  width: 100%;
  margin-top: 9px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
}
.search-box input {
  width: 80%;
  height: 100%;
  background: transparent;
  outline: none;
  margin-left: 10px;
  color: #fff;
  font-size: 14px;
}
.search-box img {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  vertical-align: middle;
  cursor: pointer;
}
.skin-box {
  background: url("~static/pageimg/skin.png");
}
.streamline-box {
  background: url("~static/pageimg/streamline.png");
}
.shrink-box {
  background: url("~static/pageimg/shrink.png");
}
.login-btn {
  background: url("~static/pageimg/login.png");
}

/*皮肤窗口*/
.theme-box {
  position: absolute;
  top: 55px;
  right: 10px;
  z-index: 99999;
}
</style>
