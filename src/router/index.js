import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/GoodList',
    component: resolve => require(['../views/GoodsList'], resolve)
  },
  {
    path: '/GoodList',
    component: resolve => require(['../views/GoodsList'], resolve)
  },
  {
    path: '/Cart',
    component: resolve => require(['../views/Cart'], resolve)
  },
  {
    path: '/Address',
    component: resolve => require(['../views/Address'], resolve)
  },
  {
    path: '/OrderConfirm',
    component: resolve => require(['../views/OrderConfirm'], resolve)
  },
  {
    path: '/OrderSuccess',
    component: resolve => require(['../views/OrderSuccess'], resolve)
  }
]

const router = new VueRouter({
	mode : 'history',
  routes
})

export default router
