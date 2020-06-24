import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import http from './utils/http'
import apis from './utils/apis'
import FastClick from 'fastclick'

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$api = apis
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
