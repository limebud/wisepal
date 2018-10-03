import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import * as appSettings from 'tns-core-modules/application-settings'
import * as mutations from './mutations.js'
import * as getters from './getters'

Vue.use(Vuex);


const debug = process.env.NODE_ENV !== 'production';


const store = new Vuex.Store({
  state: {
    token: null,
    customerDocuments: null,
    customerInformation: null
  },
  mutations,
  getters,
  strict: debug
});

Vue.prototype.$store = store;

export default store;
