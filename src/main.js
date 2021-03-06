// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './utils/flexible'
Vue.use(ElementUI)
import router from './router'
// 组件扫描文件
import scanFile from "./scanFile"
Vue.use(scanFile)
// vuex
import store from "./store.js"
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  let { roleId, token } = localStorage
  if(!roleId||!token) {
    if(to.path !== '/Login') {
      next({path: '/Login'})
    } else {
      next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
