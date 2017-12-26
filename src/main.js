// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.use(infiniteScroll)
Vue.use(VueLazyLoad,{
	loading: "/static/loading-svg/loading-balls.svg"
})

const store = new Vuex.Store({
	// 定义两个全局的变量
	state:{
		nickName:'',
		cartCount:0
	},
	// 定义这两个方法
	mutations:{
		updateUserInfo(state,nickName){
			state.nickName = nickName
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount
		},
		initCartCount(state,cartCount){
			state.cartCount = cartCount
		}
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
