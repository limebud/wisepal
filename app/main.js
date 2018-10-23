import Vue from 'nativescript-vue'
import Login from './components/Login/Login'
import Startview from './components/Startview/Startview'


import TestToken from './TestToken'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store';
import axios from 'axios'
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
import "./styles.scss";

// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'fa': './assets/font-awesome.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

axios.defaults.baseURL = 'https://webapitest.wisetalk.se/api'

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

// if(TNS_ENV !== 'production') {
//   Vue.use(VueDevtools)
// }
// Prints Vue logs when --env.production is *NOT* set while building
// Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    store,
    render: h => h('frame', [h(TestToken)])
}).$start()
