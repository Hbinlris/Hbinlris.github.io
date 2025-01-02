import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user
  },

  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    login({ commit }, user) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const foundUser = users.find(u => u.username === user.username);

      if (foundUser) {
        commit('setUser', foundUser);
        commit('setAuthentication', true);
        localStorage.setItem('users', JSON.stringify(users));
      } 
    },

    logout({ commit }) {
      commit('setUser', null);
      commit('setAuthentication', false);
    },

    initializeStore({ commit }) {
      const user = JSON.parse(localStorage.getItem('users')).find(u => u.isAuthenticated);
      if (user) {
        commit('setUser', user);
        commit('setAuthentication', true);
      }
    }
  },
  modules: {
  }


})


