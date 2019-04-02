// The Vue build version to load with the `import` command

// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'vue-fullpage/vue-fullpage.css'
import VueFullpage from 'vue-fullpage'

import vConsole from 'vconsole'
import { V_CONSOLE } from '@/constants/interface'
if (V_CONSOLE) {
    new vConsole();
}
// vux 引入组件
import { AlertPlugin, ToastPlugin, ConfirmPlugin, WechatPlugin  } from 'vux'
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(VueFullpage)
// Vue.use(vConsole)
Vue.use(WechatPlugin)
Vue.config.productionTip = false
// 解决点击延迟
// const FastClick = require('fastclick')
// FastClick.attach(document.body)
 
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})