import ripple from './ripple'
import banner from './banner'
import {util} from '@/common/js/util'
import Ev     from '@/common/js/event'
const event = Ev.install()

export default function (Vue) {
	// 气泡指令
	Vue.directive('ripple', {
		inserted (el, binding) {
			const color    = binding.value || '#fff'
			const instance = new ripple(el, color)
			instance.init()
		}
	})

	// 轮播指令
	Vue.directive('banner', {
		inserted (el, binding) {
			const data = binding.value
			if (!data) return

			// 如果是以回调的形式
			if (typeof data === 'function') {
				data((url, option) => {
					option.dom = el
					return new banner(option, url)
				})
			}

			// 如果是以对象的形式传入URL
			if (typeof data === 'object' && data !== null) {
				return new banner(data.option, data.urlArr)
			}
		}
	})


	// 滚动到顶部标签
	Vue.directive('scrollTop', {
		inserted (el, binding) {
			const fun = binding.value
			if (!fun) return

			el.addEventListener('scroll', function(e) {
				// 置顶标签
				const windowH = this.scrollTop

				fun(el, windowH)
			})
		}
	})

	// 鼠标滚轮事件
	Vue.directive('mousewheel', {
		inserted (el, binding) {
			const [exceptDom, mousewheel] = binding.value

			util.onWheel(el, exceptDom, mousewheel)
		}
	})
}