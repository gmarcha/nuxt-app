<template>
  <div>
    <v-toolbar flat height="64">
      <v-btn icon class="my-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon class="my-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn v-if="isMobile" icon class="my-2" @click="setToday">
        <v-icon>mdi-calendar-today</v-icon>
      </v-btn>
      <v-btn v-else class="my-2" @click="setToday">
        <v-icon class="mr-2">mdi-calendar-today</v-icon>
        Now
      </v-btn>
      <v-select
        v-model="typeSelected"
        :items="typeList"
        label="Format"
        dense
        outlined
        hide-details
        class="ma-2"
      ></v-select>
      <v-spacer />
      <v-select
        v-if="!isMobile"
        v-model="categoriesSelected"
        :items="categoriesNames"
        label="Filtres"
        multiple
        dense
        outlined
        hide-details
        class="ma-2"
      ></v-select>
      <v-dialog v-if="isCalendar" :fullscreen="isMobile" max-width="650">
        <template #activator="{ on, attrs }">
          <v-btn v-if="isMobile" icon v-bind="attrs" class="my-2" v-on="on">
            <v-icon>mdi-table-plus</v-icon>
          </v-btn>
          <v-btn v-else v-bind="attrs" class="my-2" v-on="on">
            <v-icon class="mr-2">mdi-table-plus</v-icon>
            Add
          </v-btn>
        </template>
        <template #default="dialog">
          <EventDialog @close="dialog.value = false"></EventDialog>
        </template>
      </v-dialog>
    </v-toolbar>
    <v-container
      fluid
      style="
        overflow: hidden;
        position: fixed;
        height: calc(100% - 64px - 64px);
        width: 100%;
      "
    >
      <v-calendar
        ref="calendar"
        v-model="value"
        locale="fr-FR"
        :type="type"
        :weekdays="weekday"
        :events="eventsFiltered"
        event-start="startAt"
        event-end="endAt"
        :event-color="getEventColor"
        :event-name="getEventName"
        event-more-text="Afficher plus..."
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateCalendar"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <EventItem @close="selectedOpen = !selectedOpen"></EventItem>
      </v-menu>
    </v-container>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { IUser } from '@/store/user'
import { IEvent, IEventType } from '@/store/events'
import { eventMethods } from '@/mixins/eventMethods'

export default mixins(eventMethods).extend({
  data: () => ({
    value: '',
    type: 'month',
    typeSelected: 'Mois',
    typeList: ['Mois', 'Semaine', 'Jour'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    categoriesSelected: [] as string[],
    selectedOpen: false,
    selectedElement: null as EventTarget | null,
  }),

  computed: {
    ...mapState({
      isMobile: (state: any): boolean => state.isMobile,
      authenticatedUser: (state: any): IUser => state.user.authenticatedUser,
      events: (state: any): IEvent[] => state.events.events,
      categories: (state: any): IEventType[] => state.events.eventTypes,
    }),
    ...mapGetters({
      authenticatedUserRoles: 'user/authenticatedUserRoles',
      isCalendar: 'user/authenticatedUserIsCalendar',
      categoriesNames: 'events/eventTypesNames',
    }),
    eventsFiltered(): IEvent[] {
      if (!this.categoriesSelected.length) return this.events
      return this.events.filter((el: IEvent) =>
        this.categoriesSelected.includes(el.edges.category?.name || '')
      )
    },
  },

  watch: {
    type() {
      this.$nextTick(() => {
        ;(this.$refs.calendar as any).scrollToTime('06:00')
      })
    },
    typeSelected(newType: string) {
      switch(newType) {
        case 'Mois':
          this.type = 'month'
          break
        case 'Semaine':
          this.type = 'week'
          break
        case 'Jour':
          this.type = 'day'
          break
        default:
          this.type = 'month'
      }
    },
  },

  methods: {
    ...mapMutations({
      selectEvent: 'events/SELECT',
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
    setToday(): void {
      this.value = ''
    },
    viewDay({ date }: { date: string }): void {
      this.value = date
      this.type = 'day'
    },
    getEventName({ input: event }: { input: IEvent }) {
      const subscribed = this.getEventNumberUsers(event)
      const required = event.tutorsRequired ? `/${event.tutorsRequired}` : ''
      return `${subscribed}${required} - ${event.name}`
    },
    showEvent({
      nativeEvent,
      event,
    }: {
      nativeEvent: MouseEvent | TouchEvent
      event: IEvent
    }): void {
      const open = () => {
        this.selectEvent(event)
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            this.selectedOpen = true
            return this.selectedOpen
          })
        )
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    async updateCalendar() {
      await this.fetchData()
    },
    async fetchData() {
      try {
        await this.$store.dispatch('events/fetchEventsWithUsers')
        await this.$store.dispatch('events/fetchEventTypes')
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(
          'Erreur lors de la récuperation des évenements.'
        )
        this.setSnackbar(true)
      }
    },
  },
})
</script>
