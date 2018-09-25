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
    setCustomerData(state, payload) {
        state.customerData = payload
    }
}

const store = new Vuex.Store({
  state: {
    token: '',
    customerData: {}
  },
  mutations,
  getters: {
      getToken: state => {
          return state.token
      },
      getCustomer: state => {
          return state.customerData
      }
  },
  // actions,
  // getters,
  strict: debug
});

Vue.prototype.$store = store;

export default store;
