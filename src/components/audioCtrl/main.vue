<template>
    <div>
        <div class="audio-controls">
            <div class="audio-content">
                <!-- 头像 -->
                <div class="song-head">
                    <img :src='nowInfo.url' width="60" height="60">
                    <div class="bullet-box" @click='enlargeDetail'>
                        <img src="static/pageimg/enlarge.png" width="50" height="50">
                    </div>
                </div>
                <!-- 进度条与快进 -->
                <div class="controls-core">
                    <div class="play-top">
                        <span class="music-name hidden-text ">
                           {{nowInfo.name}}
                        </span>
                        <div class="core-btn">
                            <i class="icon-Previous-track" @click='forward' v-ripple></i>
                            <i 
                                :class='playStopStatus ? "icon-Pause" : "icon-Play"' 
                                @click='playStop'
                                v-ripple>
                                
                            </i>
                            <i class="icon-Next-Track" @click='next' v-ripple></i>
                            <i :class="loopIcon" @click='loop' v-ripple></i>
                            <i class="icon-Volume" @click='volume' v-ripple></i>
                        </div>
                    </div>
                    <div class="progressbar-bottom">
                        <div class="music-time">
                            <span class="start-time">{{playConver(Number(nowPlayTime))}}</span>
                            <span class="end-time">{{conver(Number(nowInfo.duration))}}</span>
                        </div>
                        <div class="music-processbar">
                            <span class="bar-background"></span>
                            <span class="bar-load" :style='{width: loadProgress + "%"}'></span>
                            <span class="bar-play" @input='playInput($event)' @change='playChange($event)'>
                                <i class="dots" id="js_playBar"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 音频操作 -->
                <div class="audio-operating">
                    <i class="icon-Playlist" @click='playList' v-ripple></i>
                    <i class="icon-Equalizer" @click='equalizerCtrl' v-ripple></i>
                    <i class="icon-collect1-list list-collect" 
                        :class='getCollect().status ? "icon-collect2-list" : "icon-collect1-list"'
                        @click='collectMusic(nowPlay)'
                        v-ripple>
                    </i>
                    <i class="icon-Shrink" @click='shink($event)' v-ripple></i>
                </div>
                <!-- 音量条 -->
                <div class="volume-bar" :style='{height: volumeSwitch ? "130px" : 0}'>
                    <div class="volume-barBox">
                        <span class="volume-total"></span>
                        <span class="volume-big" @input='volumeInput($event)' @change='volumeChange($event)'>
                            <i class="volume-dots"></i>
                        </span>
                    </div>
                </div>
                <!-- 均衡器 -->
                <div class="equalizer-box" :style='{height: equalizerSwitch ? "300px" : 0}'>
                    <!-- 标题 -->
                    <div class="equalizer-title">
                        <span>均衡器</span>
                    </div>
                    <!-- 柱状图 -->
                    <div class="equalizer-bar">
                        <div class="equalizer-barBox">
                            <div class="single-bar" v-for='(key, i) in HZData'>
                                <span class="equalizer-total"></span>
                                <span class="equalizer-big"
                                    :class='equaAnimate ? "animate" : ""'
                                    :style='equalizerData(i)'
                                    @input='equalizerChangeInput($event, i)'
                                    @change='equalizerChangeInput($event, i)'>
                                    <i class="equalizer-dots"></i>
                                </span>
                            </div>
                        </div>
                        <div class="equalizer-hz">
                            <span v-for='key in HZ'>{{key}}</span>
                        </div>
                    </div>
                    <!-- 分类 -->
                    <div class="equalizer-sort">
                        <span 
                            v-for='(key, i) in equalizer' 
                            v-ripple='"#0094B9"'
                            :class='i === 0 && "text-gradient"'
                            @click = 'toggle($event, key)'
                        >{{key}}</span>
                    </div>
                </div>
                <!-- 歌曲列表 -->
                <div class="music-list" :style='{height: playListSwitch ? "300px" : 0}'>
                    <div class="list-title equalizer-title">
                        <span>播放列表</span>
                        <span>（{{musicList[0].id === 0 ? 0 : musicList.length}}）</span>
                    </div>
                    <div class="list-content">
                        <ul class='scroll'>
                            <li 
                                class="music-single" 
                                :class='getClass(key.id, key.deletes)'
                                v-for='(key, i) in musicList'
                                @dblclick='dblclick($event, key.id, 
                                {url:key.picUrl, duration:key.musicInfo[3], name:key.musicInfo[1]})'>
                                <span
                                    v-for='(item, j) in key.musicInfo'  
                                    :class='j === 5 ? "icon-delete"
                                                    : j === 4 ? !key.collect ? "icon-collect1-list" : "icon-collect2-list"
                                                    : j === 0 ? !!playStopStatus ? "playing" : "stoping"
                                                    : ""'
                                    @click='j === 5 ? deleteMusic($event, i, key.id) 
                                                    : j === 4 ? collectMusic(musicList[i].id) 
                                                    : ""'>
                                    {{conver(item, j)}}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="list-lyrics equalizer-title">
                        <div class="totallyr-box lyr-animate" :style='{transform: "translateY("+ -28 * translateY +"px)"}'>
                            <div class="single-lyr" v-for='(key, i) in setLyr()' :data-time='key.time'>
                                <span class="lyr-main hidden-text">{{key.lyr}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 歌曲播放顺序 -->
                <div class="play-order" :style='{height: playOrderSwitch ? "130px" : 0}'>
                    <ul>
                        <li v-for='key in playOrder' @click='musicOrder(key)'>{{key}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <shink-ctrl :img='nowInfo.url' :musicInfo.sync='child' @setProgress='childProgress'></shink-ctrl>
    </div>
</template>

<script>
    import Vue from 'vue'
    import shinkCtrl from './shinkctrl'
    import ripples from '@/common/js/ripple'
    import drag from '@/common/js/progress'
    import {util} from '@/common/js/util'
    import interFace from '@/common/js/audioInterFace'
    import {mapGetters, mapActions} from 'vuex'

    const {$, nowPlay} = util

    export default {
        data () {
            return {
                nowInfo: {
                    url: 'static/img/music.jpg',
                    name: '暂无',
                    duration: 0
                },
                nowPlay: 0,

                // 控制器变量
                equalizer: ['自定义', '慢歌', '爵士', '古典', '蓝调', '舞曲', '流行', '电子乐', '摇滚', '乡村'],
                HZ: ['31', '62', '125', '250', '500', '1000', '2000', '4000', '8000', '16000'],
                HZData: [0, 0, 0, 0,  0, 0, 0, 0, 0, 0],
                totalHZ : 28,
                equaAnimate: false,
                playOrder: ['顺序播放', '随机播放', '单曲循环'],
                loopIcon: 'icon-Loop',
                // 各个共享状态
                playStopStatus: false,

                // 各个小组件升起落下的值
                playListSwitch: false,
                volumeSwitch: false,
                equalizerSwitch: false,
                playOrderSwitch: false,

                // 加载进度条
                loadProgress: 0,
                // 当期播放的时间
                nowPlayTime: 0,

                // 组件件进度条函数
                childProcessFun: null,

                // 歌词设置变量
                translateY: 0
            }
        },
        computed: {
            // 传给子组件的值
            child () {
                return [
                    this.getCollect(),
                    this.playStopStatus,
                    this.nowPlay,
                    this.nowPlayTime
                ]
            },
            ...mapGetters([
                'musicList',
                'getPlayOrder',
                'getAudio',
                'audioAjax',
                'playDelay',
                'switchDelay',
                'mainProgress',
                'lyric'
            ])
        },
        methods: {
            // 滑动条的 input 和 change 事件
            volumeInput (e) {
                interFace.volumeInput(e.currentTarget.value)
            },
            volumeChange (e) {
                interFace.volumeChange(e.currentTarget.value)
            },
            playInput (e) {
                interFace.playInput(e.currentTarget.value)
            },
            playChange (e) {
                interFace.playChange(e.currentTarget.value)
            },
            equalizerData (i) {
                const data = []
                const totalHZ = this.totalHZ
                this.HZData.forEach(val => {
                    const now = val += 14
                    val > totalHZ && (val = totalHZ)
                    val < 0       && (val = 0)
                    data.push({height:(now / totalHZ) * 100 + '%'})
                })
                return data[i]
            },
            // 放大当前播放歌曲详情页面
            enlargeDetail () {
                if (!this.nowPlay) {
                    alert('没有正在播放的歌曲~')
                    return
                }
                
                // 先把控件缩小，然后放大
                this.$event.fire('enlargeDetail')
            },

            // input 事件和 手动变化高度不能互相影响
            equalizerChangeInput (e, i) {
                const totalHZ = this.totalHZ
                const value = e.currentTarget.value * totalHZ - totalHZ / 2
                this.HZData[i] = value
                // 只要手动变化就是自定义的
                util.toggle($('.equalizer-sort span:nth-child(1)'), 'text-gradient')
                interFace.equalizerChange(this.HZ[i],  this.HZData[i])
            },

            // 得到当前收藏的歌曲
            getCollect () {
                let collect = {}
                this.musicList.forEach(val => {
                    if (val.id === this.nowPlay) {
                        collect.status = val.collect
                        collect.id = val.id
                    }
                })
                return collect
            },
            // 切换样式
            toggle (e, key) {
                util.toggle(e.currentTarget, 'text-gradient')
                interFace.equalizer(key, data => {
                    if (data.length === this.HZ.length) {
                        this.equaAnimate = true
                        this.HZData = data
                        // 去除动画，重新添加事件
                        setTimeout(() => {
                            this.equaAnimate = false
                            $('.equalizer-barBox .equalizer-dots').forEach(val => {
                                const nowBar = new drag(val, 'Y')
                                nowBar.init()
                            })
                        }, 300)  
                    }
                })
            },
            // 报错函数
            throwErr () {
                if (!this.musicList.length) {
                    alert('当前歌曲列表没有歌曲，可能是添加的歌曲资源过大~')
                    return false
                }
                return true
            },
            // 双击切换歌曲
            dblclick (e, id, info) {
                if (!this.switchDelay.judge || !this.throwErr()) return
                this.$store.dispatch('changeSwitchDelay', false)

                const dom = e.currentTarget
                nowPlay.remove()
                util.toggle(dom, 'active-play')
                nowPlay.add()
                this.nowPlay = id
                this.nowInfo = info
                interFace.forward(id, info.duration, () => {
                    this.playConfig()
                }, isHave => {
                    console.log(isHave)
                    isHave === false && this.next()
                })
            },
            // 基本操作
            forward (index) {
                if (!this.switchDelay.judge || !this.throwErr()) return
                this.$store.dispatch('changeSwitchDelay', false)
                nowPlay.remove()
                let nowIndex = 0
                this.musicList.forEach((val, i) => {
                    if (val.id === this.nowPlay) {
                        nowIndex = --i
                    }
                })

                // 如果传了指定的 index, 就按照指定的 index 播放
                index != null && !isNaN(index) && (nowIndex = index)
                nowIndex < 0 && (nowIndex = this.musicList.length -1)
                
                // 切换id 和 歌曲图片
                console.log(index)
                this.infoData(this.musicList[nowIndex])
                // 添加水波纹和接口
                setTimeout(() => nowPlay.add())
            },
            next () {
                if (!this.switchDelay.judge || !this.throwErr()) return
                this.$store.dispatch('changeSwitchDelay', false)
                nowPlay.remove()
                let nowIndex = 0
                this.musicList.forEach((val, i) => {
                    if (val.id === this.nowPlay) {
                       nowIndex = ++i
                    }
                })
                nowIndex > this.musicList.length - 1 && (nowIndex = 0)
                // 切换id 和 歌曲图片
                this.infoData(this.musicList[nowIndex])
                // 添加水波纹和接口
                setTimeout(() => nowPlay.add())
            },
            // 更改数据
            infoData (current) {
                if (!current) {
                    alert('没有当前音频信息，请刷新重试~')
                    this.$store.dispatch('changeSwitchDelay', true)
                    return
                }

                this.nowPlay = current.id
                this.nowInfo = {
                    url:        current.picUrl,
                    name:       current.musicInfo[1],
                    duration:   current.musicInfo[3]
                }
                 
                interFace.forward(current.id, current.musicInfo[3], () => { // 切换歌曲
                    this.playConfig()
                }, isHave => {
                    this.$store.dispatch('changeSwitchDelay', true)
                    isHave === false && this.next()
                })
            },
            // 播放暂停
            playStop () {
                const audio     = this.getAudio
                const playDelay = this.playDelay
                const store     = this.$store
                if (!playDelay.judge || !audio) return
                const state     = audio.getState()

                store.dispatch('changePlayDelay', false)

                state === 'running' ? this.playStopStatus = false
                                    : this.playStopStatus = true

                interFace.play(this.playStopStatus)
                // 延时恢复
                setTimeout(() => store.dispatch('changePlayDelay', true),playDelay.time)
            },
            loop () {
               this.toggleHeight('playOrderSwitch')
            },
            // 点击音量
            volume (e) {
                if (!this.volumeSwitch) {
                    var volumeBar = new drag($('.volume-dots'), 'Y')
                    setTimeout(() => volumeBar.init(), 300)
                }

                this.toggleHeight('volumeSwitch')
            },
            // 点击歌曲列表
            playList () {
                this.toggleHeight('playListSwitch')
            },
            // 点击均衡器
            equalizerCtrl () {
                if (!this.equalizerSwitch) {
                    $('.equalizer-barBox .equalizer-dots').forEach(val => {
                        const nowBar = new drag(val, 'Y')
                        setTimeout(() => nowBar.init(), 300)
                    })
                }
                this.toggleHeight('equalizerSwitch')
            },
            toggleHeight (com) {
                let arr = ['playOrderSwitch', 'playListSwitch', 'volumeSwitch', 'equalizerSwitch']
                arr.forEach(val => {
                    com === val ? this[com] = !this[com]
                                : this[val] && (this[val] = false)
                })
            },
            musicOrder (key) {
                this.toggleHeight('playOrderSwitch')
                if (key === '随机播放') {this.loopIcon = 'icon-Randommdpi';       interFace.loop('随机')}
                if (key === '顺序播放') {this.loopIcon = 'icon-Loop';             interFace.loop('顺序')}
                if (key === '单曲循环') {this.loopIcon = 'icon-Single-cyclemdpi'; interFace.loop('单曲')}
            },
            // 删除歌曲
            deleteMusic (e, i, id) {
                console.log(this.switchDelay.judge, this.musicList.length, this.deleteMusic.open)
                if (!this.switchDelay.judge) return
                if (this.musicList.length === 1) return
                if (this.deleteMusic.open) return
                this.$store.dispatch('changeSwitchDelay', false)
                nowPlay.remove()

                if (true) {
                    let j = i
                    this.deleteMusic.open = true
                    this.musicList[j].deletes = true
                    setTimeout(() => {
                        if (j > (this.musicList.length - 1)) return
                        // 改变当前数据
                        this.musicList.splice(j, 1)
                        this.deleteMusic.open = false
                        interFace.deleteMusic(id)
                        if (id === this.nowPlay) {
                            const current = this.musicList[0]
                            this.nowPlay = current.id
                            this.nowInfo = {
                                url:        current.picUrl,
                                name:       current.musicInfo[1],
                                duration:   current.musicInfo[3]
                            }
                            interFace.forward(current.id, current.musicInfo[3], () => { // 继续播放
                                this.playConfig()
                            }, isHave => {
                                setTimeout(() => this.$store.dispatch('changeSwitchDelay', true), this.switchDelay.time)
                                isHave === false && this.next()
                            })
                            setTimeout(() => nowPlay.add())
                            return
                        }
                        // 延时恢复
                        setTimeout(() => this.$store.dispatch('changeSwitchDelay', true), this.switchDelay.time)
                        setTimeout(() => nowPlay.add())   
                    }, 200) 
                }  
            },
            getClass (id, isdelete) {
                // active-play remove
                let className = ''
                this.nowPlay === id && (className += 'active-play')
                isdelete && (className += ' remove')
                return className
            },
            // 收藏歌曲
            collectMusic (id) {
                console.log(id)
                this.musicList.forEach(val => {
                    if (val.id === id) {
                        interFace.collect(val)
                    }
                })
            },
            // 缩小
            shink (e) {
               this.shrinkAnimate()
            },
            // 控件缩小动画
            shrinkAnimate (dom = $('.audio-controls')) {
                const shinkDom        = $('.Shrink-box')
                const aside           = $('#js_aside')
                const rightBox        = $('.right-box')
                const songDetail      = $('#songDetail')

                dom.style.overflow    = 'hidden'
                aside      && (aside.style.height      = '100%')
                rightBox   && (rightBox.style.height   = '100%')
                songDetail && (songDetail.style.height = '100%')
               
                dom.animate({
                    height:130,
                    width:20,
                    borderRadius: 130
                }, 250, function () {
                    dom.style.display = 'none'
                    shinkDom.style.display = 'block'
                    shinkDom.style.transform = 'rotate(0)'
                    shinkDom.style.opacity = 1

                    shinkDom.animate({
                        width:220
                    }, 250)
                    .animate({
                        width:110,
                    }, 400)
                    .animate({
                        width:150,
                    }, 450)
                    .animate({
                        width:130,
                    }, 550)
                    .animate({
                        rotate: 45
                    }, 400)
                })
            },
            // 转换时间格式
            conver (duration, j) {
                if (j != null && j !== 3) return duration
                return util.conver(duration)
            },
            // 转换播放的时间格式
            playConver(time) {
                if (!time) return '0:0'
                return util.conver(time * 1000)
            },
            // 设置播放顺序
            setOrder (key) {
                const audio = this.getAudio
                // 单曲已经不用调用下一曲
                switch (key) {
                    case '顺序' :
                        if (!audio) return
                        audio.playOver = () => this.next()
                       break
                    case '随机' :
                        if (!audio) return
                        const random = util.random(0, this.musicList.length)
                        audio.playOver = () => {
                            const nowMusic = this.musicList[random]
                            this.nowPlay = nowMusic.id
                            // 只需要改id, 因为调用的 next  在next中 id++, info 也会相应更换
                            this.next()
                        }
                    break
                }
            },
            setProgress () {
                // 进度条
                if (this.audioAjax) {
                    this.audioAjax.progress = (res, loaded) => {
                        const width = this.audioAjax.procent(loaded)
                        this.loadProgress = width > 100 ? 100 : width
                    }
                }
            },
            setTimeProgress () {
                const {$store, $event, getAudio} = this
                if (!getAudio) return

                // 开始新的进度条
                $store.dispatch('changeMainProgress', () => {return setInterval(() => {
                    const time  = getAudio.getTime()
                    const width = (time * 1000 / getAudio.duration) * 100
                    $('.bar-play').style.width = (width > 100 ? 100 : width) + '%'
                    this.nowPlayTime = time
                }, 70)})
            },
            // 切换歌曲且播放开始后需要做的操作
            playConfig () {
                this.playStopStatus = true
                this.setOrder(this.getPlayOrder)  // 设置播放顺序
                this.setProgress()
                this.setTimeProgress()
                !!this.childProcessFun && this.childProcessFun()
            },
            // 子组件的 progress
            childProgress (childProgressFun) {
                this.childProcessFun = childProgressFun
            },
            // 歌词设置
            setLyr () {
                const lyr   = this.lyric
                const audio = this.getAudio

                if (!lyr || !audio) return [{time:0, lyr: '......'}]  // 未播放的时候
                if (!lyr.oriLrc)    return [{time:0, lyr: '当前音乐为纯音乐，敬请欣赏'}]
                const oriLrc = lyr.oriLrc.content
                if (!oriLrc)        return [{time:0, lyr: '当前音乐暂无歌词'}]
                const t = audio.getTime()

                // 让歌词屏幕动起来
                oriLrc.forEach((val, i) => {
                    // 如果当前播放时间打过指定的时间
                    // 就显示然后设置为 fasle
                    if (t > val.time && val.unover) {
                        val.unover      = false
                        // 会换成最接近当前时间的值，但是会变化很多次，感觉效率很差
                        this.translateY = i
                         // 把当前播放时间散发到全局
                        this.$event.fire('nowPlayTime', i)
                        this.$store.dispatch('nowLyrPosition', i)
                    }

                    // 已经过去了的然后重新设置为 true，用于后退操作
                    if (t < val.time ) {
                        val.unover = true
                    }
                })
                
                return oriLrc
            }
        },
        mounted () {
            const bar = new drag('#js_playBar', 'X')
            bar.init()
            Array.from($('.scroll li span:nth-child(5)')).forEach(val => {
                if (!val) return
                const rip = new ripples(val, '#fff')
                rip.init()
            })
            nowPlay.add()
        },
        // 定义音频接口
        created () {
            const store = this.$store

            // 播放顺序
            interFace.loop = key => {
                console.log(key)
                const audio = this.getAudio
                switch (key) {
                    case '顺序' :
                        store.dispatch('changePlayOrder', '顺序')
                        if (!audio) return
                        audio.playOver = () => this.next()
                        audio.loop(false)
                       break
                    case '单曲' :
                        store.dispatch('changePlayOrder', '单曲')
                        if (!audio) return
                        audio.loop(true)
                        break
                    case '随机' :
                        const random = util.random(0, this.musicList.length)
                        store.dispatch('changePlayOrder', '随机')
                        if (!audio) return
                        audio.playOver = () => {
                            const nowMusic = this.musicList[random]
                            this.nowPlay = nowMusic.id
                            // 只需要改id, 因为调用的 next  在next中 id++, info 也会相应更换
                            this.next()
                        }
                        audio.loop(false)
                    break
                }
            }
            interFace.playInput = () => {
                store.dispatch('changeMainProgress', () => {return null})
            }
            interFace.playChange = precent => {
                const {getAudio, setTimeProgress, $event} = this

                if (!getAudio) return
                setTimeProgress()
                if (getAudio.forward(precent) === false) {
                    alert('该时间段的音频资源还未解码完成哦~~')
                    return
                }

                // 散发快进事件
                $event.fire('playChange', precent)
            }

            // 把快进后退的方法放到 vuex
            store.dispatch('changeNext', this.next)
            store.dispatch('changeForward', this.forward)
            store.dispatch('changePlayStop', this.playStop)
            store.dispatch('changeCollectMusic', this.collectMusic)
            store.dispatch('shrinkAnimate', this.shrinkAnimate)

            // 注册歌词事件
            this.$event.on('lyrics', () => this.translateY = 0)
        },
        components: {
            shinkCtrl
        }
    }
</script>

<style>
    /* 音乐控件class */
    .remove {
        padding: 0 !important;
        height: 0 !important;
        transition: all .2s;
        -moz-transition: all .2s;
        -webkit-transition: all .2s;
    }
    .lyr-animate {
        transition: all .5s;
        -moz-transition: all .5s;
        -webkit-transition: all .5s;
    }
    .audio-controls {
        width: 85%;
        /*background: #171c26;*/
        background: rgba(79, 79, 79, 0.5);
        border-radius: 3px;
        float: right;
        position: fixed;
        right: 7.5%;
        bottom: 5%;
        box-shadow: 0 0 1px rgba(255, 255, 255, .5)
    }
    .audio-content {
        position: relative;
        height: 73px;
        width: 1050px;
        margin: 0 auto;
        border: 1px solid transparent;
        z-index: 999;
    }
    .audio-content>div {
        float: left;
    }
    .song-head {
        margin: 6px 0;
        width: 60px;
        height: 60px;
        background:#f7f7f7;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
    }
    .song-head:hover .bullet-box{
        display: block;
    }
    .song-head .bullet-box {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 5px;
        background: rgba(0,0,0,.5);
        cursor: pointer;
    }
    .bullet-box img {
        position: absolute;
        top: 5px;
        left: 5px;
    }
    .controls-core {
        width: 563px;
        height: 100%;
        margin: 0 50px 0 40px;
    }

    .play-top {
        height: 29px;
        margin-top: 10px;
    }
    .progressbar-bottom {
        height: 34px;
    }
    .core-btn {
        margin: 3px 57px 0 0;
        width: 300px;
        float: right;
    }
    .core-btn i {
        display: inline-block;
        float: left;
        width: 20px;
        height: 20px;
        margin-right: 40px;
        cursor: pointer;
    }

    .core-btn i:nth-child(3) {
        margin-right: 80px;
    }
    .core-btn i:last-child {
        margin-right: 0;
    }
    .music-name {
        display: inline-block;
        width: 160px;
        color: #fff;
        font-size: 14px;
    }
    .music-time {
        font-size: 12px;
        color: #fff;
    }
    .start-time {
        float: left;
    }
    .end-time {
        float: right;
    }

    .audio-operating {
        margin-top: 27.5px;
        width: 283px;
        float: right !important;
    }

    .audio-operating i {
        width: 20px;
        height: 20px;
        display: inline-block;
        float: left;
        cursor: pointer;
        margin-right: 50px;
    }
    .audio-operating i:last-child {
        float: right;
        margin:0;
    }

    /* 进度条 */
    .music-processbar {
        position: relative;
        height: 20px;
        width: 100%;
        top: 13px;
    }
    .music-processbar span {
        position: absolute;
        left: 0;
        top: 7.5px;
        height: 5px;
        border-radius: 10px;
    }
    .bar-background {
        width: 100%;
        background: #6c7b87;
    }
    .bar-load {
        width: 0%;
        background: rgba(255,255,255,.5);
    }

    /*横向进度条*/
    .bar-play {
        width: 0%;
        background:-webkit-gradient(linear,left top, right bottom, from(#0094B9), to(#53FDD6));
    }
    .dots {
        float: right;
        right: 0;
        height: 26px;
        width: 26px;
        background-image: url('~static/img/Dots.png');
        background-size:26px 26px;
        margin:-10px -10px 0 0;
        cursor: pointer;
    }
    /* ------------------- */

    /* 音量条 */
    .volume-bar {
       position: absolute;
        height: 0;
        width: 30px;
        background: #171c26;
        bottom: 72px;
        left: 58%;
        cursor: pointer;
        border-radius: 3px 3px 0 0;
        box-shadow: 0 0 1px rgba(255,255,255,.5);
        overflow: hidden;
        transition: height .3s;
        -moz-transition: height .3s;
        -webkit-transition: height .3s;
        z-index: 995;
    }
    .volume-bar .volume-barBox {
        position: absolute;
        width: 5px;
        height: 70%;
        border-radius: 3px;
        left: 50%;
        top: 50%;
        margin-left:-2.5px;
        margin-top: -135%;
    }
    .volume-bar .volume-barBox span {
        position: absolute;
        display: inline-block;
        width: 100%;
    }
    .volume-total {
        height:100%;
        background: #6c7b87;
    }

    /*纵向进度条*/
    .volume-big {
        height: 50%;
        bottom: 0;
        background:-webkit-gradient(linear,left top, right bottom, from(#53FDD6), to(#0094B9));
    }
    .volume-dots {
        position: absolute;
        display: inline-block;
        height: 15px;
        width: 15px;
        background-image: url('~static/img/Dots.png');
        background-size:15px 15px;
        margin:-5px 0 0 -5px;
        top: 0;
        cursor: pointer;
    }
    /* ----------------------------- */

    /*均衡器*/
    .equalizer-box {
        position: absolute;
        width: 385px;
        height: 0;
        background: #171c26;
        bottom: 72px;
        left: 61.5%;
        cursor: pointer;
        border-radius: 3px 3px 0 0;
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        overflow: hidden;
        transition: height .3s;
        -moz-transition: height .3s;
        -webkit-transition: height .3s;
        z-index: 994;
    }
    .equalizer-title {
        width: 100%;
        height: 10.75%;
        color: #fff;
        box-shadow: 0 0 1px #555865;
    }
    .equalizer-title span {
        display: inline-block;
        margin: 6.25px 0 6.25px 19px;
        font-size: 13px;
    }
    /* 均衡器柱状图 */
    .equalizer-bar {
        overflow: hidden;
        width: 90%;
        height: 65%;
        color: #fff;
        margin:0 auto;
        margin-top: 18px;
        left: 0;
    }
    .equalizer-barBox {
        position: relative;
        height: 85%;
        width: 100%;
    }
    .single-bar {
        width: 10%;
        height: 100%;
        position: absolute;
    }
    .single-bar:nth-child(2) { left: 10% }
    .single-bar:nth-child(3) { left: 20% }
    .single-bar:nth-child(4) { left: 30% }
    .single-bar:nth-child(5) { left: 40% }
    .single-bar:nth-child(6) { left: 50% }
    .single-bar:nth-child(7) { left: 60% }
    .single-bar:nth-child(8) { left: 70% }
    .single-bar:nth-child(9) { left: 80% }
    .single-bar:nth-child(10) { left: 90% }
    .single-bar span {
        display: inline-block;
        position: absolute;
        width: 4px;
        height: 100%;
        background: #6c7b87;
        left: 50%;
        border-radius: 4px;
        margin-left: -2.5px;
    }
    .single-bar .equalizer-big {
        height: 50%;
        bottom: 0;
        background:-webkit-gradient(linear,left top, right bottom, from(#53FDD6), to(#0094B9));
    }
   .equalizer-dots {
        position: absolute;
        display: inline-block;
        height: 20px;
        width: 20px;
        background-image: url(~static/img/Dots.png);
        background-size: 20px 20px;
        margin: -5px 0 0 -8px;
        top: 0;
        cursor: pointer;
    }
    .equalizer-hz {
        width: 100%;
        overflow: hidden;
        margin-top: 10px;
    }
    .equalizer-hz span {
        display: inline-block;
        float: left;
        width: 10%;
        text-align: center;
        font-size: 10px;
    }
    .equalizer-sort {
        width: 90%;
        height: 20%;
        margin:0 auto;
        font-size: 13px;
        overflow: hidden;
        color: rgba(255,255,255,.5);
    }
    .equalizer-sort span:first-child{
        margin-left: 0;
    }
    .equalizer-sort span:nth-child(6){
        margin-left: 0;
    }
    .equalizer-sort span {
        display: inline-block;
        margin-top: 5px;
        margin-left: 6%;
        float: left;
        text-align: center;
        width: 15%;
        height: 21px;
    }
    .equalizer-sort span.text-gradient {
        position: relative;
        top: -2px;
        padding: 1px 3px;
        font-family: '微软雅黑';
        background:-webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0094B9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        border: 1px solid #28a2a1;
        font-weight: bold;
        border-radius: 15px;
    }


    /* 播放列表 */
    .music-list {
        width: 500px; 
        height: 0;
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        position: absolute;
        background: #171c26;
        bottom: 72px;
        left: 10%;
        cursor: pointer;
        border-radius: 3px 3px 0 0;
        overflow: hidden;
        transition: height .3s;
        -moz-transition: height .3s;
        -webkit-transition: height .3s;
        z-index: 992;
    }
    .list-title span {
        display: inline-block;
        margin: 6.25px 0 6.25px 19px;
        font-size: 13px;
    }
    .list-title span:last-child {
        margin-left: 0;
    }
    .list-lyrics {
        border-bottom: none;
        overflow: hidden;
    }
    .totallyr-box {
        width: 100%;
    }
    .single-lyr {
        text-align: center;
        width: 100%;
        height: 28px;
        padding: 0 10px;
        overflow: hidden;
    }
    .list-lyrics span {
        margin: 5.25px 0;
        font-size: 14px;
        font-family: bold;
        display: inline-block;
        cursor: auto;
        overflow: visible;
        /*background: -webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0bc9f9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;*/
    }
    .list-content {
        width: 98%;
        margin:0 auto;
        height: 80%;
    }
    .list-content ul {
        height: 100%;
        margin:0;
        padding: 0;
        overflow-x: hidden;
    }
    .music-single {
        width: 480px;
        float: left;
        height: 45px;
        padding: 20px 25px;
        overflow: hidden;
    }
    .music-single:hover{
        background: rgba(131, 134, 134, 0.2);
    }
    .music-single span {
        display: inline-block;
        text-align: center;
        float: left;
        height: 17px;
        font-size: 11px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        color: rgba(255,255,255,.4);
        margin-right: 10px;
    }
    .music-single span:nth-child(1) {
        width: 16px;
        height: 14px;
        margin-right: 15px;
    }
    .music-single span:nth-child(2) {
        text-align: left;
        width: 30%;
    }
    .music-single span:nth-child(3) {
        text-align: left;
        width: 20%;
    }
    .music-single span:nth-child(4) {
        text-align: left;
        width: 15%
    }
    .music-single span:nth-child(5) {
        width: 20px;
        height: 20px;
        margin-right: 25px;
        padding-top: 2px;
    }
    .music-single span:nth-child(6) {
        width: 20px;
        height: 20px;
        padding-top: 2px;
    }
    .active-play span.playing {
        background: url('~static/img/playing.gif');
        margin-top: -3px;
    }
    .active-play span.stoping {
        background: url('~static/img/stoping.png');
        margin-top: -3px;
    }
    .active-play span:nth-child(2) {
        background:-webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0094B9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .active-play span:nth-child(3) {
        background:-webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0094B9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .active-play span:nth-child(4) {
        background:-webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0094B9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;;
    }
    .active-play span:nth-child(5):before{
        background:-webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0094B9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .active-play span:nth-child(6):before{
        background:-webkit-gradient(linear,0 top, 0 bottom, from(#53FDD6), to(#0094B9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .list-collect:before {
        color: #fff !important;
    }

    /* 滚动条样式 */
    .scroll::-webkit-scrollbar {
        width:7px;
        height:7px;
    }
    .scroll::-webkit-scrollbar-track     {
        background: rgba(64, 65, 66, .5);
    }

    .scroll::-webkit-scrollbar-thumb{
        background: rgba(176, 175, 183, 0.5);
        border-radius:15px;
    }
    .play-order {
        display: block;
        position: absolute;
        height: 0;
        width: 90px;
        background: #171c26;
        bottom: 72px;
        left: 48.5%;
        color: rgba(255,255,255,.5);
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        cursor: pointer;
        border-radius: 3px 3px 0 0;
        overflow: hidden;
        transition: height .3s;
        -moz-transition: height .3s;
        -webkit-transition: height .3s;
        z-index: 995;
    }
    .play-order>ul {
        height: 110px;
        width: 100%;
    }
    .play-order>ul li {
        width: 100%;
        height: 43px;
        line-height: 43px;
        text-align: center;
    }
    .play-order>ul li:hover{
        background: rgba(131, 134, 134, 0.2);
    }
</style>
