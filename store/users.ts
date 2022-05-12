import Vue from 'vue'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { IRootState, RootState } from '@/store'
import { IRole, IUser } from '@/store/user'

export const state = () => ({
  users: [] as IUser[],
  roles: [] as IRole[],
  usersRequestStatus: '',
  userCreateRequestStatus: '',
  userUpdateRequestStatus: '',
  userDeleteRequestStatus: '',
  setRoleRequestStatus: '',
  unsetRoleRequestStatus: '',
  rolesRequestStatus: '',
})

export type UsersState = ReturnType<typeof state>

export const getters: GetterTree<UsersState, RootState> = {
  roleAdmin: (state) => state.roles.find((el: IRole) => el.name === 'admin'),
  roleCalendar: (state) =>
    state.roles.find((el: IRole) => el.name === 'calendar'),
  roleTutor: (state) => state.roles.find((el: IRole) => el.name === 'tutor'),
  areUsersLoading: (state) => state.usersRequestStatus === 'loading',
}

export const mutations: MutationTree<UsersState> = {
  USERS_REQUEST: (state) => {
    state.usersRequestStatus = 'loading'
  },
  USERS_SUCCESS: (state, users: IUser[]) => {
    state.usersRequestStatus = 'success'
    state.users = users
  },
  USERS_ERROR: (state) => {
    state.usersRequestStatus = 'error'
  },
  USER_CREATE_REQUEST: (state) => {
    state.userCreateRequestStatus = 'loading'
  },
  USER_CREATE_SUCCESS: (state, user: IUser) => {
    state.userCreateRequestStatus = 'success'
    state.users.push(user)
  },
  USER_CREATE_ERROR: (state) => {
    state.userCreateRequestStatus = 'error'
  },
  USER_UPDATE_REQUEST: (state) => {
    state.userUpdateRequestStatus = 'loading'
  },
  USER_UPDATE_SUCCESS: (state, user: IUser) => {
    state.userUpdateRequestStatus = 'success'
    state.users = state.users.map((el: IUser) =>
      el.id === user.id ? user : el
    )
  },
  USER_UPDATE_ERROR: (state) => {
    state.userUpdateRequestStatus = 'error'
  },
  USER_DELETE_REQUEST: (state) => {
    state.userDeleteRequestStatus = 'loading'
  },
  USER_DELETE_SUCCESS: (state, userID: string) => {
    state.userDeleteRequestStatus = 'success'
    state.users = state.users.filter((el: IUser) => el.id !== userID)
  },
  USER_DELETE_ERROR: (state) => {
    state.userDeleteRequestStatus = 'error'
  },
  SET_ROLE_REQUEST: (state) => {
    state.setRoleRequestStatus = 'loading'
  },
  SET_ROLE_SUCCESS: (
    state,
    { userID, role }: { userID: string; role: IRole }
  ) => {
    state.setRoleRequestStatus = 'success'
    state.users = state.users.map((el: IUser) => {
      if (el.id === userID) {
        if (!el.edges.roles) Vue.set(el.edges, 'roles', [])
        el.edges.roles.push(role)
      }
      return el
    })
  },
  SET_ROLE_ERROR: (state) => {
    state.setRoleRequestStatus = 'error'
  },
  UNSET_ROLE_REQUEST: (state) => {
    state.unsetRoleRequestStatus = 'loading'
  },
  UNSET_ROLE_SUCCESS: (
    state,
    { userID, roleID }: { userID: string; roleID: string }
  ) => {
    state.unsetRoleRequestStatus = 'success'
    state.users = state.users.map((el: IUser) => {
      if (el.id === userID)
        el.edges.roles = el.edges.roles.filter((el: IRole) => el.id !== roleID)
      return el
    })
  },
  UNSET_ROLE_ERROR: (state) => {
    state.unsetRoleRequestStatus = 'error'
  },
  ROLES_REQUEST: (state) => {
    state.rolesRequestStatus = 'loading'
  },
  ROLES_SUCCESS: (state, roles: IRole[]) => {
    state.rolesRequestStatus = 'success'
    state.roles = roles
  },
  ROLES_ERROR: (state) => {
    state.rolesRequestStatus = 'error'
  },
}

export const actions: ActionTree<UsersState, RootState> = {
  async fetchUsers({ rootState, commit }) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('USERS_REQUEST')
    try {
      const res = await this.$axios.$get(`/users`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('USERS_SUCCESS', res)
      return res
    } catch (err) {
      commit('USERS_ERROR')
      throw err
    }
  },
  async createUser({ rootState, commit }, user: IUser) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('USER_CREATE_REQUEST')
    try {
      const res = await this.$axios.$post(`/users`, user, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('USER_CREATE_SUCCESS', res)
      return res
    } catch (err) {
      commit('USER_CREATE_ERROR')
      throw err
    }
  },
  async updateUser({ rootState, commit }, user: IUser) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('USER_UPDATE_REQUEST')
    try {
      const res = await this.$axios.$patch(`/users/${user.id}`, user, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('USER_UPDATE_SUCCESS', user)
      return res
    } catch (err) {
      commit('USER_UPDATE_ERROR')
      throw err
    }
  },
  async deleteUser({ rootState, commit }, userID: string) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('USER_DELETE_REQUEST')
    try {
      const res = await this.$axios.$delete(`/users/${userID}`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('USER_DELETE_SUCCESS', userID)
      return res
    } catch (err) {
      commit('USER_DELETE_ERROR')
      throw err
    }
  },
  async setRole(
    { rootState, commit },
    { userID, role }: { userID: string; role: IRole }
  ) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('SET_ROLE_REQUEST')
    try {
      const res = await this.$axios.$post(
        `/users/${userID}/role/${role.name}`,
        {},
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )
      commit('SET_ROLE_SUCCESS', { userID, role })
      return res
    } catch (err) {
      commit('SET_ROLE_ERROR')
      throw err
    }
  },
  async unsetRole(
    { rootState, commit },
    { userID, role }: { userID: string; role: IRole }
  ) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('UNSET_ROLE_REQUEST')
    try {
      const res = await this.$axios.$delete(
        `/users/${userID}/role/${role.name}`,
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )
      commit('UNSET_ROLE_SUCCESS', { userID, roleID: role.id })
      return res
    } catch (err) {
      commit('UNSET_ROLE_ERROR')
      throw err
    }
  },
  async fetchRoles({ rootState, commit }) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('ROLES_REQUEST')
    try {
      const res = await this.$axios.$get(`/users/roles`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('ROLES_SUCCESS', res)
      return res
    } catch (err) {
      commit('ROLES_ERROR')
      throw err
    }
  },
}
