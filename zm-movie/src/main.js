import Vue from 'vue'
import App from './App'
import '../static/style/style.css'
import { $Toast } from '../static/iView/base/index'
var Fly = require("flyio/dist/npm/wx")
var fly = new Fly
//添加拦截器
fly.interceptors.request.use((config,promise)=>{
    //给所有请求添加自定义header
    config.headers["content-type"] = "application/json"
    return config;
})
//配置请求基地址
fly.config.baseURL='http://58.132.170.53:15555'
// fly.config.baseURL='https://test.dyy.appapi.xgcinema.com'
//fly.config.baseURL='http://192.168.58.172:81'
Vue.prototype.$http = fly //将fly实例挂在vue原型上
Vue.prototype.$Toast = $Toast
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
