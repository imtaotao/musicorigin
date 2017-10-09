<template>
	<div>
	    <audio-ctrl></audio-ctrl>
	</div>
</template>
<script>
import audioCtrl from './main'
import interFace from '@/common/js/audioInterFace'
import audioctrl from '@/common/js/audio'
import musicHttp from '@/common/js/musicHttp'
import {util} from '@/common/js/util'
import {mapGetters, mapActions} from 'vuex'

export default {
    data () {
        return {
            preAudio     : null,
            randomStr    : null,
            equalizerData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    computed: {
    	...mapGetters([
            'host',
            'getPlayOrder',
            'switchDelay',
            'volume',
            'next',
            'lyric'
    	])
    },
    methods: {
        loading (load) {
            const audio = this.preAudio.audio
            if (load) {
                this.$store.dispatch('showLoading')
                audio.ac.suspend()
            } else {
                this.$store.dispatch('hideLoading')
                audio.ac.resume()
            }
        },
        setPlayOrder (playOrder) {
            switch (playOrder) {
                case '顺序' :
                    this.$store.dispatch('changePlayOrder', '顺序')
                    this.preAudio.audio.loop(false)
                   break
                case '单曲' :
                    this.$store.dispatch('changePlayOrder', '单曲')
                    this.preAudio.audio.loop(true)
                    break
                case '随机' :
                    this.$store.dispatch('changePlayOrder', '随机')
                    this.preAudio.audio.loop(false)
                break
            }
        },
        // 歌词设置
        setLrc (data, callback) {
            console.log(data)
            const oriLrc  = data.lrc                     // 原歌词 lyric
            const cnLrc   = data.tlyric                  // 翻译为中文的歌词

            let oriDecode = null
            let cnDecode  = null

            if (oriLrc) oriDecode = util.astLyrics(oriLrc.lyric)    // 解码歌词
            if (cnLrc)  cnDecode  = util.astLyrics(cnLrc.lyric)     // 解码歌词

            this.$store.dispatch('changelyric', {oriLrc: oriDecode, cnLrc: cnDecode})
            !!callback && callback()
        },
        //开始播放
        startPlay(id, url, duration, callback) {
            const {getPlayOrder, host, setPlayOrder, lyric, $store, $event} = this

            let audio = new audioctrl(128, duration)
            const ajax = new musicHttp({
                url: `${this.host}/getMusic`,
                data: {url},
                method: 'get',
                dataType: 'arraybuffer',
            })

            this.preAudio = {audio, ajax}
            $store.dispatch('changeAudio', audio)
            $store.dispatch('changeAudioAjax', ajax)
            setPlayOrder(getPlayOrder)
            !!callback && callback()

            // 当前歌曲播放id
            $store.dispatch('nowPlayId', id)

            // 开始播放新的歌曲前
            $event.fire('startNewMusic')
            $event.fire('lyrics', lyric)

            // 发起分段传输请求
            ajax.send().then(ajax.afterHttp())

            // 设置当前 audio 对象循环一次播放完毕的回调
            audio.loopPlayOver = _ => {
                this.$event.fire('loopPlayOver')
            }

            audio.loading = this.loading

            // 设置初始音量
            audio.volumeNum = this.volume
            ajax.callback = ({status, response}) => {
                if (status === 403 || status === 404) {
                    console.log(audio, ajax)
                    audio.destroy(ajax)
                    this.preAudio = null
                    return false
                }
                if (status === 200) {
                    ajax.cancell = count => { return false }
                    // 如果不是片段传输，得重新设置回调
                    audio.nowstatus.buffersouce.onended = () => this.next()
                }
                // 第一次调用 init 方法（保证ajax结束完毕后不在调用回调）
                !!ajax.first && !ajax.saveBox.end
                                ? audio.init(response)
                                : audio.continue(response, ajax.saveBox.count === 11)
                // 设置均衡器
                if (this.preAudio && this.preAudio.audio) {
                    this.preAudio.audio.setFilter(this.equalizerData)
                }
            }
        },

        // 得到歌曲url 和 歌词
        getUrlLrc () {
            const randomStr = this.randomStr
            return (id, duration, callback, isHave) => {  
                this.$ajax.get(this.host + `/music/url?id=${id}`).then(({data}) => {
                    // 如果因为网速问题导致冲突就 return
                    if (randomStr !== this.randomStr) return

                    // 先拿到音频文件的 url
                    const url = data.data[0].url
                    if (!url) { isHave(false); return}
                    // 再拿到音频文件的歌词
                    this.$ajax.get(this.host + `/lyric?id=${id}`).then(({data}) => {
                        this.setLrc(data, () => {
                            console.log(url)
                            this.startPlay(id, url, duration, callback)
                        })
                    })
                })
            }
        }

    },
    created () {
        // 定义音频接口
        // 切换歌曲
        interFace.forward = (id, duration, callback, isHave) => {
            const {$store, preAudio, switchDelay, getUrlLrc} = this

            if (duration > 1000 * 60 * 15) {
                alert('该资源过大，解码会导致网页崩溃~~~')
                $store.dispatch('removeMusic', id)
                $store.dispatch('changeSwitchDelay', true)
                return
            }
            if (id === 0) {
                alert('当前播放列表中没有可播放歌曲');
                $store.dispatch('changeSwitchDelay', true)
                return
            }

            // 为每次的异步请求 url 添加一个随机字符串，防止网速过慢引起冲突
            this.randomStr = util.randomStr()

            // 如果没有歌曲id 或者没有时间，就返回
            if (id == null || duration == null ) { isHave(false); return }

            // 先销毁上一首歌曲
            if(preAudio) {
                preAudio.audio.destroy(this.preAudio.ajax)
                this.preAudio = null
            }

            // 延时恢复
            setTimeout(() => {
                $store.dispatch('changeSwitchDelay', true)
            }, switchDelay.time)
            // 请求歌曲 url，歌词
           getUrlLrc()(id, duration, callback, isHave)
        }
        // 播放暂停
        interFace.play = (status) => {
            if (!this.preAudio || !this.preAudio.audio) return
            status ? this.preAudio.audio.play()
                   : this.preAudio.audio.stop()
        }
        interFace.volumeInput = precent => {
            if (!this.preAudio || !this.preAudio.audio) return
            this.preAudio.audio.volume(precent) 
        }
        interFace.volumeChange = precent => {
            this.$store.dispatch('changeVolume', precent)
        }
        interFace.equalizer = (name, callback) => {
            if (!this.preAudio || !this.preAudio.audio) return
            const type = {
                '自定义': 'init', '慢歌': 'slowSong', '爵士': 'jazz', '古典': 'classical', '蓝调': 'blues',
                '舞曲': 'dance', '流行': 'popular', '电子乐': 'electronicMusic', '摇滚': 'rocking', '乡村': 'rural',
            }
            const data = this.preAudio.audio.filter(type[name])
            callback(data)
            this.equalizerData = data
        }
        interFace.equalizerChange = (HZ, data) => {
            if (!this.preAudio || !this.preAudio.audio) return
            const type = {
                '31': 0, '62': 1, '125': 2, '250': 3, '500': 4,
                '1000': 5, '2000': 6, '4000': 7, '8000': 8, '16000': 9,
            }
            this.preAudio.audio.setSingleFilter(HZ, data)
            this.equalizerData[type[HZ]] = data
        }

    },
    components: {
        audioCtrl
    }
}
</script>
<style>
</style>