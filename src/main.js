// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入 font-awesome 字体图标
import 'font-awesome/css/font-awesome.css'
// 引入 axios 模块
import axios from 'axios'
// 引入 socket.io 客户端
import io from 'socket.io-client'

Vue.prototype.$http = axios
Vue.prototype.$io = io.connect('http://localhost:3000/')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
