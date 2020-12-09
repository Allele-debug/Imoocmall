// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

// 全局过滤器
// import {currency from} './util/currency.js'

import './assets/iconfont.js'
import './assets/css/base.css'
import './assets/css/product.css'
import './assets/css/checkout.css'
Vue.config.productionTip = false

// 使用全局过滤器
// Vue.use("currency",currency); Vue.use("名称",值) 

Vue.use(VueLazyload,{
	loading:"/static/loading-svg/loading-bars.svg"
})
Vue.use(infiniteScroll)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
