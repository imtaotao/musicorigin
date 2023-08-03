import Vue from "vue";
import Router from "vue-router";
import { util } from "@/common/js/util";

// 一级模块路由
import download from "@/components/download/index"; // 下载音乐
import likeMusic from "@/components/likeMusic/index"; // 创建的歌单
import collectList from "@/components/collectList/index"; // 收藏的歌单
import findMusic from "@/components/findMusic/index"; // 推荐页面
import search from "@/components/search/index"; // 搜索展示页面

// 首页子路由
import songList from "@/components/findMusic/songList";
import ranking from "@/components/findMusic/ranking";
import recommend from "@/components/findMusic/recommend";

Vue.use(Router);
export default function (option) {
  const routes = [
    { path: "/download", component: download, name: "download" },
    { path: "/likeMusic", component: likeMusic, name: "likeMusic" },
    { path: "/collectList/:name", component: collectList, name: "collectList" },
    { path: "/search/:name", component: search, name: "search" },
    {
      path: "/findMusic",
      component: findMusic,
      name: "findMusic",
      children: [
        { path: "/findMusic/recommend", component: recommend },
        { path: "/findMusic/songList", component: songList },
        { path: "/findMusic/ranking", component: ranking },
      ],
    },
  ];

  const route = new Router({
    linkActiveClass: "click-active",
    scrollBehavior: () => ({ y: 0 }),
    routes,
  });

  // 默认路由，以及刷新在原来的路由
  util.router = route;

  route.beforeEach((to, from, next) => {
    util.savePath(to.path);
    next();
  });
  util.open();
  return route;
}
