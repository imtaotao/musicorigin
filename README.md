# [个人音乐网站（木汐音乐）](http://39.108.72.180:8081)
**本网站属于个人作品展示，所有技术具有高度实验性质**

## 网站兼容性，暂考虑chrome、firefox、safari三端（完全不考虑IE）
``` bash
1. Chrome 完全兼容
2. Firefox 对歌曲下载暂不兼容，但是后续考虑在firefox下补全下载功能
3. Safari 因为webaudioapi的差异性，导致无法兼容歌曲分段传输
```

## 网站功能介绍
# 音乐控件
``` bash
1. 切换歌曲，为了避免歌曲混乱，时间限制为2s
2. 歌曲快进，必须等歌曲片段加载并解码完成才能播放，若是加载还未解码时，不能快进
3. 当前播放歌曲列表栏，提供歌曲收藏，删除于当前播放列表的功能，双击歌曲播放
4. 均衡器按钮，提供不同的歌曲音质选择
5. 缩小按钮，使控件以缩小模式展示
6. 缩小控件提供的功能与主控件提供的功能基本一致
```
# 左边栏
``` bash
1. 点击个人头像可以进行头像上传
2. 点击昵称可以进行昵称更改
3. 登录后在本网站停留一分钟增加一点经验
```
# 导航栏
``` bash
1. 搜索按钮，输入音乐名称，得到搜索结果，默认做分页处理，显示30条数据，点击**加载更多**加载更多数据
2. 登录按钮，点击弹出登录注册页面，左边为登录界面，右边为注册界面
3. 主题切换按钮，点击弹出主题切换界面，分为主题和纯色两类，功能实现为手动切换和自动切换，当手动选择一个主题时，默认退出自动切换模式
4. 精简按钮，功能暂未实现（以后有时间会补上）
5. 可视化窗口按钮，进入音乐可视化界面，自我感觉还是挺好看的，可视化窗口分为可视化界面和歌词界面，因时间所限，歌词窗口暂未实现
```

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
