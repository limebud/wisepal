import Vue from 'nativescript-vue';
import Vuex from 'vuex';

// import mutations from './mutations.js'
// import * as actions from './actions.js'
// import * as getters from './getters'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const mutations = {
    setToken(state, token) {
        state.token = token
    },
    setCustomerDocuments(state, payload) {
        state.customerDocuments = payload
    },
    setCustomerInformation(state, payload) {
        state.customerInformation = payload
    }
}

const store = new Vuex.Store({
  state: {
    token: null,
    customerDocuments: null,
    customerInformation: null
  },
  mutations,
  getters: {
      getToken: state => {
          return state.token
      },
      getCustomerDocuments: state => {
          return state.customerDocuments
      },
      getCustomerInformation: state => {
          return state.customerInformation
      }
  },
  // actions,
  // getters,
  strict: debug
});

Vue.prototype.$store = store;

export default store;
