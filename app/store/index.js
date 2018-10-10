import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import axios from 'axios';

import * as Toast from 'nativescript-toast';
import * as appSettings from 'tns-core-modules/application-settings'
import * as mutations from './mutations.js'
import * as getters from './getters'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


const store = new Vuex.Store({
  state: {
    token: null,
    customerDocuments: null,
    customerInformation: null,
    playFile: null,
    recordedFiles: []
  },
  mutations,
  getters,
  actions: {
      authRequest: async ({commit}, auth) => {

          await axios.get('https://webapitest.wisetalk.se/api/Account/BrokerLogin/', {
              params: {
                  pin: auth.pin,
                  username: auth.username,
                  password: auth.password
              }
          })
          .then(res => {
              if (res.data.Success) {
                  commit('setToken', res.data.ClientToken)

                  appSettings.setString("pin", auth.pin)
                  appSettings.setString("username", auth.username)
                  appSettings.setString("token", res.data.ClientToken)

              } else {
                  Toast.makeText(res.data.Messages[0], "long").show()
              }
          })
          .catch(err => { console.log("Error: " + err )})
          }
      },
  strict: debug
});

Vue.prototype.$store = store;

export default store;
