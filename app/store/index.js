import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as fs from 'tns-core-modules/file-system'

import * as Toast from 'nativescript-toast';
import * as appSettings from 'tns-core-modules/application-settings'
import * as mutations from './mutations.js'
import * as actions from './actions.js'
import * as getters from './getters'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


const store = new Vuex.Store({
  state: {
    token: appSettings.getString("token") || '',
    tempId: '',
    customerDocuments: [],
    customerInformation: [],
    searchResults: [],
    playFile: null,
    readFile: null,
    recordedFiles: [],
    notes: [],
    recentVisit: [],
    partyType: '',
    searchBarActive: false,
    recordingStatus: null
  },
  mutations,
  getters,
  actions,
  strict: debug
});

Vue.prototype.$store = store;

export default store;
