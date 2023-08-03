<template>
  <div
    class="animate"
    :style="!showLogin ? { opacity: 0, height: 0, overflow: 'hidden' } : ''"
  >
    <div class="login-up-arrow"></div>
    <div class="login-main">
      <div
        class="login-insert-container animate-five"
        :style="{
          transform: 'translateX(' + translateX + '%)',
          backgroundImage: 'url(static/alltheme/' + bgpic + ')',
        }"
      >
        <!-- 登录框 -->
        <div class="login-insert-box lf">
          <p class="login-title lf">Start your</p>
          <p class="login-name lf"><b>Log In</b></p>

          <div class="input-container lf">
            <p>
              <span>账号</span>
              <input type="text" v-model="loginUP.name" />
            </p>
            <p>
              <span>密码</span>
              <input
                type="password"
                @keyup.enter="login"
                v-model="loginUP.pwd"
              />
            </p>
          </div>
        </div>
        <!-- 注册框 -->
        <div class="rigist-insert-box lf">
          <p class="rigist-title lf">Start your</p>
          <p class="rigist-name lf"><b>Rigister</b></p>
          <div class="input-container lf">
            <p>
              <span>账号</span>
              <input type="text" v-model="rigistUP.name" />
            </p>
            <p>
              <span>密码</span>
              <input
                type="password"
                @keyup.enter="rigist"
                v-model="rigistUP.pwd"
              />
            </p>
          </div>
        </div>
      </div>
      <!-- 切换柱子 -->
      <p
        class="toggle-bar login-bar animate-five"
        :style="{ backgroundColor: loginBar, width: loginWidth }"
        @click="loginCl"
      >
        <span>Log In</span>
        <span
          class="confirm-circle rt animate-five"
          :class="loginConfirm ? 'active-confirm' : ''"
          @click="login"
          >confirm
        </span>
      </p>
      <p
        class="toggle-bar rigist-bar animate-five"
        :style="{ backgroundColor: rigistBar, width: rigistWidth }"
        @click="rigistCl"
      >
        <span>Register</span>
        <span
          class="confirm-circle lf animate-five"
          :class="!loginConfirm ? 'active-confirm' : ''"
          @click="rigist"
        >
          confirm</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { util } from "@/common/js/util";

export default {
  data() {
    return {
      showLogin: false,
      translateX: 0,
      loginBar: "#ffbf74",
      rigistBar: "rgba(255,255,255,.3)",
      rigistWidth: "30%",
      loginWidth: "40%",
      loginConfirm: true,
      // 背景图片
      bgpicArr: ["c-5-2.png", "c-2-3.png", "c-1-3.png", "1-3.png", "2-3.png"],
      bgpic: "1-3.png",
      // 账号密码
      loginUP: { name: null, pwd: null },
      rigistUP: { name: null, pwd: null },
    };
  },

  computed: {
    ...mapGetters(["host"]),
  },

  methods: {
    loginCl() {
      const { loginBar, rigistBar, rigistWidth, loginWidth, translateX } = this;
      if (translateX === 0) return;
      this.translateX = 0;
      this.loginConfirm = !this.loginConfirm;
      this.rigistBar = [loginBar, (this.loginBar = rigistBar)][0];
      this.rigistWidth = [loginWidth, (this.loginWidth = rigistWidth)][0];
    },

    rigistCl() {
      const { loginBar, rigistBar, rigistWidth, loginWidth, translateX } = this;
      if (translateX === -50) return;
      this.translateX = -50;
      this.loginConfirm = !this.loginConfirm;
      this.loginBar = [rigistBar, (this.rigistBar = loginBar)][0];
      this.loginWidth = [rigistWidth, (this.rigistWidth = loginWidth)][0];
    },

    randomPic() {
      const random = util.random(0, this.bgpicArr.length - 1);
      this.bgpic = this.bgpicArr[random];
    },

    // 登录函数
    login() {
      const { check, loginUP, $ajax, $event, host } = this;
      if (!check(loginUP)) return;
      $ajax.post(host + "/login", loginUP).then(({ data }) => {
        if (!data.data) {
          alert(data.msg);
          return;
        }
        // 散发登录成功的事件
        $event.fire("login", data.data);
        $event.fire("changeUser");
        $event.fire("showLogin", false);
      });
    },

    //注册函数
    rigist() {
      const { check, rigistUP, $ajax, host } = this;
      if (!check(rigistUP)) return;
      $ajax.post(host + "/rigist", rigistUP).then(({ data }) => {
        alert(data.msg);
        if (data.msg === "注册成功") {
          this.loginCl();
        }
      });
    },

    // 检查表单输入
    check({ name, pwd }) {
      if (!name || !pwd) {
        alert("请完整填写账号密码");
        return false;
      }
      if (name.length < 6 || pwd < 6) {
        alert("账号密码位数必须是6位以上");
        return false;
      }
      return true;
    },
  },

  created() {
    this.$event.on("showLogin", ({ data }) => {
      this.showLogin = data;
      data && this.randomPic();
    });
    this.$store.dispatch("login", this.login);
  },
};
</script>

<style>
.login-main {
  width: 550px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 275px);
}
.login-up-arrow {
  width: 10px;
  height: 10px;
  margin-top: -20px;
  margin-left: calc(100% - 220px);
  border: 10px solid transparent;
  border-bottom: 10px solid rgba(0, 0, 0, 0.5);
}
.login-insert-container {
  width: 200%;
  height: 100%;
  overflow: hidden;
}

/*切换柱子*/
.toggle-bar {
  position: absolute;
  width: 30%;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  font-size: 16px;
  bottom: 20px;
  cursor: pointer;
}
.toggle-bar span {
  cursor: pointer;
}
.login-bar {
  left: 0;
  background: #ffbf74;
  border-radius: 0 20px 20px 0;
}
.rigist-bar {
  right: 0;
  text-align: right;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px 0 0 20px;
}

/*登录注册框*/
.login-insert-box,
.rigist-insert-box {
  width: 50%;
  height: 100%;
  /*background-size: 35% 100% !important;*/
}
.login-insert-container {
  background: url("~static/alltheme/3-2.png") no-repeat;
  background-size: 40% 100%;
  background-position: 50% 0;
}
.rigist-insert-box {
  padding-left: 200px;
}

/*登录注册详情*/
.login-title,
.rigist-title {
  width: 380px;
  height: 40px;
  line-height: 40px;
  padding: 0 40px;
  font-size: 16px;
  color: #d4d8da;
}
.login-name,
.rigist-name {
  width: 300px;
  padding: 0 40px;
  color: #ffbf74;
  font-size: 40px;
}

.input-container {
  width: 300px;
  padding: 20px 40px;
}
.input-container span {
  color: #d4d8da;
  font-size: 12px;
}
.input-container p {
  width: 250px;
  margin: 10px 10px;
}
.input-container input {
  width: 100%;
  font-size: 14px;
  display: block;
  outline: none;
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.input-container p:last-child input {
  font-size: 24px;
  padding: 3px;
  color: #ffbf74;
}
.confirm-circle {
  display: inline-block;
  opacity: 0;
  margin-right: -15px;
  width: 0;
  overflow: hidden;
  height: 30px;
  margin-top: 5px;
  line-height: 30px;
  text-align: center;
  vertical-align: top;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
}
.rigist-bar .confirm-circle {
  margin-left: -15px;
}
.active-confirm {
  width: 70px;
  opacity: 1;
}
</style>
