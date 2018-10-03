import Vue from 'nativescript-vue'

import Login from './components/Login/Login'

import VueDevtools from 'nativescript-vue-devtools'
import store from './store';
import axios from 'axios'

import "./styles.scss";


axios.defaults.baseURL = 'https://webapitest.wisetalk.se/api/'


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
  store,
  render: h => h('frame', [h(Login)])
}).$start()
