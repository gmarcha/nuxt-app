import Vue from 'vue'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { IRootState, RootState } from '@/store'
import { convertEventsDateFormat, IEvent, IEventEdges } from '@/store/events'

export interface IRole {
  id: string
  name: string
}

export interface IUserEdges {
  events: IEvent[]
  roles: IRole[]
}

export interface IUser {
  id: string
  login: string
  firstName: string
  lastName: string
  displayName: string
  imagePath: string
  edges: IUserEdges
}

export const state = () => ({
  authenticatedUser: {} as IUser,
  authenticatedUserRequestStatus: '',
  subscribeAuthUserRequestStatus: '',
  unsubscribeAuthUserRequestStatus: '',
})

export type UserState = ReturnType<typeof state>

export const getters: GetterTree<UserState, RootState> = {
  authenticatedUserRoles: (state): IRole[] =>
    state.authenticatedUser.edges?.roles || [],
  authenticatedUserRolesNames: (_, getters): string[] =>
    getters.authenticatedUserRoles.map((el: IRole) => el.name),
  authenticatedUserIsTutor: (_, getters): boolean =>
    getters.authenticatedUserRolesNames.includes('tutor'),
  authenticatedUserIsCalendar: (_, getters): boolean =>
    getters.authenticatedUserRolesNames.includes('calendar'),
  authenticatedUserIsAdmin: (_, getters): boolean =>
    getters.authenticatedUserRolesNames.includes('admin'),
  authenticatedUserEvents: (state): IEvent[] =>
    state.authenticatedUser.edges?.events || [],
  isSubscriptionLoading: (state): boolean =>
    state.subscribeAuthUserRequestStatus === 'loading' ||
    state.unsubscribeAuthUserRequestStatus === 'loading',
}

export const mutations: MutationTree<UserState> = {
  AUTH_USER_REQUEST: (state) => {
    state.authenticatedUserRequestStatus = 'loading'
  },
  AUTH_USER_SUCCESS: (state, user: IUser) => {
    state.authenticatedUserRequestStatus = 'success'
    if (user.edges.events)
      user.edges.events = convertEventsDateFormat(user.edges.events)
    state.authenticatedUser = user
  },
  AUTH_USER_ERROR: (state) => {
    state.authenticatedUserRequestStatus = 'error'
  },
  SUBSCRIBE_AUTH_USER_REQUEST: (state) => {
    state.subscribeAuthUserRequestStatus = 'loading'
  },
  SUBSCRIBE_AUTH_USER_SUCCESS: (state, event: IEvent) => {
    const {
      id,
      name,
      description,
      startAt,
      endAt,
      tutorsRequired,
      walletsReward,
    } = event
    state.subscribeAuthUserRequestStatus = 'success'
    if (!state.authenticatedUser.edges.events)
      Vue.set(state.authenticatedUser.edges, 'events', [])
    state.authenticatedUser.edges.events.push({
      id,
      name,
      description,
      startAt,
      endAt,
      tutorsRequired,
      walletsReward,
      edges: { category: event.edges.category } as IEventEdges,
    })
  },
  SUBSCRIBE_AUTH_USER_ERROR: (state) => {
    state.subscribeAuthUserRequestStatus = 'error'
  },
  UNSUBSCRIBE_AUTH_USER_REQUEST: (state) => {
    state.unsubscribeAuthUserRequestStatus = 'loading'
  },
  UNSUBSCRIBE_AUTH_USER_SUCCESS: (state, event: IEvent) => {
    state.unsubscribeAuthUserRequestStatus = 'success'
    state.authenticatedUser.edges.events =
      state.authenticatedUser.edges.events.filter(
        (el: IEvent) => el.id !== event.id
      )
  },
  UNSUBSCRIBE_AUTH_USER_ERROR: (state) => {
    state.unsubscribeAuthUserRequestStatus = 'error'
  },
}

export const actions: ActionTree<UserState, RootState> = {
  async fetchAuthUser({ rootState, commit }) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('AUTH_USER_REQUEST')
    try {
      const res = await this.$axios.$get(`/users/me`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('AUTH_USER_SUCCESS', res)
      return res
    } catch (err) {
      commit('AUTH_USER_ERROR')
      throw err
    }
  },
  async subscribeAuthUser({ rootState, commit, state }, event: IEvent) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('SUBSCRIBE_AUTH_USER_REQUEST')
    try {
      const res = await this.$axios.$post(
        `/users/me/events/${event.id}`,
        {},
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )
      commit('SUBSCRIBE_AUTH_USER_SUCCESS', event)
      commit('events/SUBSCRIBE_AUTH_USER', state.authenticatedUser, {
        root: true,
      })
      return res
    } catch (err) {
      commit('SUBSCRIBE_AUTH_USER_ERROR')
      throw err
    }
  },
  async unsubscribeAuthUser({ rootState, commit, state }, event: IEvent) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('UNSUBSCRIBE_AUTH_USER_REQUEST')
    try {
      const res = await this.$axios.$delete(`/users/me/events/${event.id}`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('UNSUBSCRIBE_AUTH_USER_SUCCESS', event)
      commit('events/UNSUBSCRIBE_AUTH_USER', state.authenticatedUser, {
        root: true,
      })
      return res
    } catch (err) {
      commit('UNSUBSCRIBE_AUTH_USER_ERROR')
      throw err
    }
  },
}
