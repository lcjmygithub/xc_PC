import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import store from './store'
import routes from './routes'
import Mock from './mock'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import VueClipboard from 'vue-clipboard2'
import $ from 'jquery'
import './f';
import common from './common/util'
import axios from 'axios'
import VueBus from './common/$bus' ;
import { getLocal } from "./function/index"
import GoEasy from 'goeasy';
Mock.bootstrap();
Vue.prototype.$goEasy = new GoEasy({
    host:'hangzhou.goeasy.io',
  // appkey: "BC-e79ec5c35cae4142be684ae2f76dd232",
   appkey: "BC-5bc53ddeeecc4a4fa5fd2583428f454a",
  onConnected: function() {
      console.log("----------------")
    console.log('连接成功！')
    console.log("----------------")
  },
  onDisconnected: function() {
    console.log('连接断开！')
  },
  onConnectFailed: function(error) {
    console.log('连接失败或错误！')
  }
})
console.log(Vue.prototype.$goEasy)
Vue.use(VueBus);
Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.use(iview)

const router = new VueRouter({
  routes
})

Vue.prototype.common = common
Vue.prototype.router = router
Vue.prototype.$axios = axios
Vue.prototype.iview = iview

router.beforeEach((to, from, next) => {
  console.log("测试有没运行的main")
  console.log(routes)
  console.log("测试有没运行的main")
  console.log(window.location.href)
  if (to.path != "/login") {
    iview.Spin.show();
    setTimeout(() => {
      iview.Spin.hide();
    }, 1000);
  }
  // store.state.userInfo.userRole
  // console.log(store.state.userInfo)
  let token = store.state.userInfo.token;
  console.log(store.state.userInfo)
  if (!token){
    let userMemory = getLocal("userMemory");
    if (userMemory&&Object.keys(userMemory).length > 0){
      store.dispatch("upVuex", {
        mutations: "setUserInfo",
        value: userMemory.userInfo
      });
      token = userMemory.userInfo.token;
    }
  }



  if (!token && to.path != '/login') {
    // iview.Message.info({
    //   content: '您还没有登录,请先登录哦',
    //   duration: 3
    // });
    next({
      path: '/login' // 跳转到login页
    })
    return;
  }
  else if (to.path == "/") {
    next({
      path: '/login'
    })
  }
  else {
    next();

  }
  //  if (token && to.path == '/login') {
  //   // 已登录且要跳转的页面是登录页
  //   console.log(1)
  //   next({
  //     path: '/login' // 跳转到login页
  //   })
  //   return;
  // }

})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  el: '#app',
  template: '<App/>',
  store,
  router,
  components: { App }
  //render: h => h(Login)
}).$mount('#app')

//router.replace('/login')
