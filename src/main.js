// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import stores from '../store'
import router from './router'
import event from '@/common/js/event'
import order from '@/common/js/order'
import Loading from '@/components/loading'
import top from '@/components/top'
import '@/common/js/animate'
import '@/common/css/reset.css'
import '@/common/css/style.css'
import '@/common/css/General.css'
import {util} from '@/common/js/util'
import interFace from '@/common/js/audioInterFace'

Vue.config.productionTip = false
//axios的一些配置
//配置发送请求的信息
axios.interceptors.request.use(config => {
	stores.dispatch('showLoading')
    // 跨域添加cookie
    config.withCredentials = true
	return config
}, error => {
    alert('请求发起时发生错误')
    stores.dispatch('hideLoading')
    return Promise.reject(error)}
)

//配置请求回来的信息
axios.interceptors.response.use(response => { 
	stores.dispatch('hideLoading')
	return response
},  error => {
    alert('请求发生错误')
    stores.dispatch('hideLoading')
    return Promise.reject(error)
})

Vue.prototype.$ajax = axios

/* eslint-disable no-new */
order(Vue)
Vue.use(event)
Vue.use(Loading)
Vue.use(top)

window.originAlert = window.alert
util.resetAlert()
util.timeFormat()
util.verifyBrowser()
setTimeout(_ => util.prompt(), 4000)

new Vue({
    el: '#app',
    template: '<App/>',
    created () {
    	
    },
    store:stores,
    router: router(),
    components: { App }
})
