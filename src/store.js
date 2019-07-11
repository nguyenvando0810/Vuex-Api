import Vue from 'vue'
import Vuex from 'vuex'
import * as apiUser from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: []
  },
  mutations: {
    GET_USERS : (state, data) => {
      state.users = [...data]
    },

    ADD_USERS: (state, data) => {
      state.users.unshift(data)
    },

    SEARCH_USERS: (state, data) => {
      state.users = [...data]
    },

    EDIT_USERS: (state, data) => {
      const idUser = state.users.findIndex(el => el.id === data.id)
      state.users[idUser] = data
      state.users = [...state.users]
    }
  },
  actions: {
    getData( {commit} ) {
      return apiUser.getUser().then((res) => {
        commit('GET_USERS', res.data)
      })
    },

    addUser({commit}, user) {
      return apiUser.addUser(user).then((res) => {
        commit('ADD_USERS', res.data.data[0])
      })
    },

    deleteUser(_, idUser) {
      return apiUser.deleteUser(idUser)
    },

    searchUser({commit}, idUser) {
      return apiUser.searchUser(idUser).then((res) => {
        commit('SEARCH_USERS', res.data.data)
      })
    },

    editUser({commit}, user) {
      return apiUser.editUser(user.id, user).then((res) => {
        commit('EDIT_USERS', res.data.data[0])
      })
    }
  }
})
