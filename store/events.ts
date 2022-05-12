import Vue from 'vue'
import dayjs from 'dayjs'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { IRootState, RootState } from '@/store'
import { IUser, IUserEdges } from '@/store/user'

export interface IEventType {
  id: string
  name: string
  color: string
}

export interface IEventEdges {
  category: IEventType
  users: IUser[]
}

export interface IEvent {
  id: string
  name: string
  description: string
  startAt: string
  endAt: string
  tutorsRequired: number
  walletsReward: number
  edges: IEventEdges
}

export const convertEventDateFormat = (event: IEvent): IEvent => {
  event.startAt = dayjs(event.startAt).format('YYYY-MM-DD HH:mm')
  event.endAt = dayjs(event.endAt).format('YYYY-MM-DD HH:mm')
  return event
}

export const convertEventsDateFormat = (events: IEvent[]): IEvent[] => {
  return events.map((el: IEvent) => convertEventDateFormat(el))
}

export const state = () => ({
  selectedEvent: {} as IEvent,
  events: [] as IEvent[],
  eventTypes: [] as IEventType[],
  eventsRequestStatus: '',
  eventCreateRequestStatus: '',
  eventUpdateRequestStatus: '',
  eventDeleteRequestStatus: '',
  eventSetTypeRequestStatus: '',
  eventTypesRequestStatus: '',
  eventTypeCreateRequestStatus: '',
  eventTypeUpdateRequestStatus: '',
  eventTypeDeleteRequestStatus: '',
})

export type EventsState = ReturnType<typeof state>

export const getters: GetterTree<EventsState, RootState> = {
  eventTypesNames: (state) => state.eventTypes.map((el: IEventType) => el.name),
}

export const mutations: MutationTree<EventsState> = {
  SELECT: (state, event: IEvent) => {
    state.selectedEvent = event
  },
  EVENTS_REQUEST: (state) => {
    state.eventsRequestStatus = 'loading'
  },
  EVENTS_SUCCESS: (state, events: IEvent[]) => {
    state.eventsRequestStatus = 'success'
    state.events = convertEventsDateFormat(events)
  },
  EVENTS_ERROR: (state) => {
    state.eventsRequestStatus = 'error'
  },
  EVENT_CREATE_REQUEST: (state) => {
    state.eventCreateRequestStatus = 'loading'
  },
  EVENT_CREATE_SUCCESS: (state, event: IEvent) => {
    state.eventCreateRequestStatus = 'success'
    state.events.push(convertEventDateFormat(event))
  },
  EVENT_CREATE_ERROR: (state) => {
    state.eventCreateRequestStatus = 'error'
  },
  EVENT_UPDATE_REQUEST: (state) => {
    state.eventUpdateRequestStatus = 'loading'
  },
  EVENT_UPDATE_SUCCESS: (state, event: IEvent) => {
    state.eventUpdateRequestStatus = 'success'
    event = convertEventDateFormat(event)
    // state.events = state.events.map((el: IEvent) => {
    //   if (el.id === event.id) {
    //     el.name = event.name
    //     el.description = event.description
    //     el.startAt = event.startAt
    //     el.endAt = event.endAt
    //     el.tutorsRequired = event.tutorsRequired
    //     el.walletsReward = event.walletsReward
    //   }
    //   return el
    // })
    state.selectedEvent.name = event.name
    state.selectedEvent.description = event.description
    state.selectedEvent.startAt = event.startAt
    state.selectedEvent.endAt = event.endAt
    state.selectedEvent.tutorsRequired = event.tutorsRequired
    state.selectedEvent.walletsReward = event.walletsReward
  },
  EVENT_UPDATE_ERROR: (state) => {
    state.eventUpdateRequestStatus = 'error'
  },
  EVENT_DELETE_REQUEST: (state) => {
    state.eventDeleteRequestStatus = 'loading'
  },
  EVENT_DELETE_SUCCESS: (state, eventID: string) => {
    state.eventDeleteRequestStatus = 'success'
    state.events = state.events.filter((el: IEvent) => el.id !== eventID)
  },
  EVENT_DELETE_ERROR: (state) => {
    state.eventDeleteRequestStatus = 'error'
  },
  EVENT_SET_TYPE_REQUEST: (state) => {
    state.eventSetTypeRequestStatus = 'loading'
  },
  EVENT_SET_TYPE_SUCCESS: (
    state,
    { eventID, eventType }: { eventID: string; eventType: IEventType }
  ) => {
    state.eventSetTypeRequestStatus = 'success'
    state.events = state.events.map((el: IEvent) => {
      if (el.id === eventID) Vue.set(el.edges, 'category', eventType)
      return el
    })
    // Vue.set(state.selectedEvent.edges, 'category', eventType)
  },
  EVENT_SET_TYPE_ERROR: (state) => {
    state.eventSetTypeRequestStatus = 'error'
  },
  EVENT_TYPES_REQUEST: (state) => {
    state.eventTypesRequestStatus = 'loading'
  },
  EVENT_TYPES_SUCCESS: (state, eventTypes: IEventType[]) => {
    state.eventTypesRequestStatus = 'success'
    state.eventTypes = eventTypes
  },
  EVENT_TYPES_ERROR: (state) => {
    state.eventTypesRequestStatus = 'error'
  },
  EVENT_TYPE_CREATE_REQUEST: (state) => {
    state.eventTypeCreateRequestStatus = 'loading'
  },
  EVENT_TYPE_CREATE_SUCCESS: (state, eventType: IEventType) => {
    state.eventTypeCreateRequestStatus = 'success'
    state.eventTypes.push(eventType)
  },
  EVENT_TYPE_CREATE_ERROR: (state) => {
    state.eventTypeCreateRequestStatus = 'error'
  },
  EVENT_TYPE_UPDATE_REQUEST: (state) => {
    state.eventTypeUpdateRequestStatus = 'loading'
  },
  EVENT_TYPE_UPDATE_SUCCESS: (state, eventType: IEventType) => {
    state.eventTypeUpdateRequestStatus = 'success'
    state.eventTypes = state.eventTypes.map((el: IEventType) =>
      el.id === eventType.id ? eventType : el
    )
    state.events = state.events.map((el: IEvent) => {
      if ((el.edges.category?.id || '') === eventType.id)
        el.edges.category = eventType
      return el
    })
  },
  EVENT_TYPE_UPDATE_ERROR: (state) => {
    state.eventTypeUpdateRequestStatus = 'error'
  },
  EVENT_TYPE_DELETE_REQUEST: (state) => {
    state.eventTypeDeleteRequestStatus = 'loading'
  },
  EVENT_TYPE_DELETE_SUCCESS: (state, eventTypeID: string) => {
    state.eventTypeDeleteRequestStatus = 'success'
    state.eventTypes = state.eventTypes.filter(
      (el: IEventType) => el.id !== eventTypeID
    )
    state.events = state.events.map((el: IEvent) => {
      if ((el.edges.category?.id || '') === eventTypeID)
        el.edges.category = {} as IEventType
      return el
    })
  },
  EVENT_TYPE_DELETE_ERROR: (state) => {
    state.eventTypeDeleteRequestStatus = 'error'
  },
  SUBSCRIBE_AUTH_USER: (state, user: IUser) => {
    const { id, login, firstName, lastName, displayName, imagePath } = user
    if (!state.selectedEvent.edges.users)
      Vue.set(state.selectedEvent.edges, 'users', [])
    state.selectedEvent.edges.users.push({
      id,
      login,
      firstName,
      lastName,
      displayName,
      imagePath,
      edges: {} as IUserEdges,
    })
  },
  UNSUBSCRIBE_AUTH_USER: (state, user: IUser) => {
    state.selectedEvent.edges.users = state.selectedEvent.edges.users.filter(
      (el: IUser) => el.id !== user.id
    )
  },
}

export const actions: ActionTree<EventsState, RootState> = {
  async fetchEventsWithUsers({ rootState, commit }) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENTS_REQUEST')
    try {
      const res = await this.$axios.$get(`/events/users`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENTS_SUCCESS', res)
      return res
    } catch (err) {
      commit('EVENTS_ERROR')
      throw err
    }
  },
  async createEvent({ rootState, commit }, event: IEvent) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_CREATE_REQUEST')
    try {
      const res = await this.$axios.$post(`/events`, event, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENT_CREATE_SUCCESS', res)
      return res
    } catch (err) {
      commit('EVENT_CREATE_ERROR')
      throw err
    }
  },
  async updateEvent(
    { rootState, commit },
    { eventID, event }: { eventID: string; event: IEvent }
  ) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_UPDATE_REQUEST')
    try {
      const res = await this.$axios.$patch(`/events/${eventID}`, event, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENT_UPDATE_SUCCESS', res)
      return res
    } catch (err) {
      commit('EVENT_UPDATE_ERROR')
      throw err
    }
  },
  async deleteEvent({ rootState, commit }, eventID: string) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_DELETE_REQUEST')
    try {
      const res = await this.$axios.$delete(`/events/${eventID}`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENT_DELETE_SUCCESS', eventID)
      return res
    } catch (err) {
      commit('EVENT_DELETE_ERROR')
      throw err
    }
  },
  async setEventType(
    { rootState, commit },
    { eventID, eventType }: { eventID: string; eventType: IEventType }
  ) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_SET_TYPE_REQUEST')
    try {
      const res = await this.$axios.$patch(
        `/events/${eventID}/types/${eventType.id}`,
        {},
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )
      commit('EVENT_SET_TYPE_SUCCESS', { eventID, eventType })
      return res
    } catch (err) {
      commit('EVENT_SET_TYPE_ERROR')
      throw err
    }
  },
  async fetchEventTypes({ rootState, commit }) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_TYPES_REQUEST')
    try {
      const res = await this.$axios.$get(`/events/types`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENT_TYPES_SUCCESS', res)
      return res
    } catch (err) {
      commit('EVENT_TYPES_ERROR')
      throw err
    }
  },
  async createEventType({ rootState, commit }, eventType: IEventType) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_TYPE_CREATE_REQUEST')
    try {
      const res = await this.$axios.$post(`/events/types`, eventType, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENT_TYPE_CREATE_SUCCESS', res)
      return res
    } catch (err) {
      commit('EVENT_TYPE_CREATE_ERROR')
      throw err
    }
  },
  async updateEventType({ rootState, commit }, eventType: IEventType) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_TYPE_UPDATE_REQUEST')
    try {
      const res = await this.$axios.$patch(
        `/events/types/${eventType.id}`,
        eventType,
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )
      commit('EVENT_TYPE_UPDATE_SUCCESS', res)
      return res
    } catch (err) {
      commit('EVENT_TYPE_UPDATE_ERROR')
      throw err
    }
  },
  async deleteEventType({ rootState, commit }, eventTypeID: string) {
    const accessToken = (rootState as IRootState).auth.token.accessToken
    commit('EVENT_TYPE_DELETE_REQUEST')
    try {
      const res = await this.$axios.$delete(`/events/types/${eventTypeID}`, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      commit('EVENT_TYPE_DELETE_SUCCESS', eventTypeID)
      return res
    } catch (err) {
      commit('EVENT_TYPE_DELETE_ERROR')
      throw err
    }
  },
}
