// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
//elementUI
Vue.use(ElementUI)


import axios from "axios";

axios.disableDefault = false;
// 请求拦截器
axios.interceptors.request.use(
  config => {

    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = window.localStorage.getItem("token");

    //如果存在，直接返回
    if (config.headers.Authorization != undefined) {
      return config;
    }
    //代表是否禁用系统默认的token携带机制
    if (!axios.disableDefault) {
      token && (config.headers.Authorization = token);
    }
    return config;
  },
  error => {
    return Promise.error(error);
  }
);


axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    let status = response.data.code;
    if (status == 200 || status == undefined) {
      return Promise.resolve(response);
    }
    switch (status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        router.replace("/Login");
        break;
      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        // 清除token
        break;

      // 404请求不存在
      case 404:

        break;
      // 其他错误，直接抛出错误提示
      default:
        this.$message(response.data.msg);
    }
    return Promise.reject(response);
  }
);

axios.defaults.withCredentials = true;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

