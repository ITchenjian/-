// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/lib/bootstrap.css';
import './assets/css/reset.css';
import './assets/css/baselist.css';
import './assets/css/ele-reset.css';

import layer from 'vue-layer';

import axios from 'axios';
import {get,post,deleteRequest} from './api/http';

Vue.use(ElementUI);


Vue.prototype.$layer = layer(Vue, {
    msgtime: 3
});

Vue.prototype.$post=post;
Vue.prototype.$get=get;
Vue.prototype.$deleteRequest=deleteRequest;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

