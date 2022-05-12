import Vue from 'vue'
import { IUser } from '@/store/user'
import { IEvent, IEventType } from '@/store/events'

export const eventMethods = Vue.extend({
  methods: {
    getEventType(event: IEvent): IEventType {
      return event.edges?.category || {}
    },
    getEventTypeColor(eventType: IEventType): string {
      return eventType.color || 'grey darken-4'
    },
    getEventColor(event: IEvent): string {
      return this.getEventTypeColor(this.getEventType(event))
    },
    getEventUsers(event: IEvent): IUser[] {
      return event.edges?.users || []
    },
    getNumberUsers(users: IUser[]): number {
      return users.length || 0
    },
    getEventNumberUsers(event: IEvent): number {
      return this.getNumberUsers(this.getEventUsers(event))
    },
    getEventSubscription(event: IEvent): string {
      const { tutorsRequired } = event
      return `${this.getEventNumberUsers(event)}${
        tutorsRequired ? '/' + tutorsRequired : ''
      }`
    },
    getEventDateTime({ startAt, endAt }: IEvent): string {
      const format = 'dddd D MMMM-HH[h]mm'
      const [startDate, startTime] = this.$dayjs(startAt)
        .format(format)
        .split('-')
      const [endDate, endTime] = this.$dayjs(endAt).format(format).split('-')
      if (startDate === endDate)
        return `${startDate} - ${startTime} à ${endTime}`
      return `${startDate} à ${startTime} - ${endDate} à ${endTime}`
    },
    getEventTime({ startAt, endAt }: IEvent): string {
      const format = 'HH[h]'
      const startTime = this.$dayjs(startAt).format(format)
      const endTime = this.$dayjs(endAt).format(format)
      return `${startTime} - ${endTime}`
    },
  },
})
