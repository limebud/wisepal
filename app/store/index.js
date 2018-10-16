import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as fs from 'tns-core-modules/file-system'

import * as Toast from 'nativescript-toast';
import * as appSettings from 'tns-core-modules/application-settings'
import * as mutations from './mutations.js'
import * as getters from './getters'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


const store = new Vuex.Store({
  state: {
    token: null,
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
          },
          recentVisit: async ({commit, state}) => {
              await axios.get('https://webapitest.wisetalk.se/api/Broker/GetRecentVisit', {
                  headers: {
                      'Authorization': state.token,
                      'Culture': 'sv-se'
                  }
              }).
              then(res => {
                  if (res.data.Success) {
                      commit('setRecentVisit', res.data.Result)
                  } else {
                      console.log(res.data.Messages[0])
                  }
              })
              .catch(err => console.log("Error: " + err))
          },
          getFiles: ({commit}, payload) => {
              let folder = fs.knownFolders.currentApp().getFolder(payload.folder + '/' + payload.id)
              folder.getEntities()
              .then(entities => {
                  entities.forEach(entity => {
                      if (payload.folder === 'recordings') {
                          commit('appendRecordedFiles', entity.name)
                      } else if (payload.folder === 'notes') {
                          commit('appendNotes', entity.name)
                      }
                  })
              })
          },
          getNotes: ({commit}, id) => {
              let folder = fs.knownFolders.currentApp().getFolder('notes')
          }
      },
  strict: debug
});

Vue.prototype.$store = store;

export default store;
