<template>
  <v-card flat>
    <v-toolbar flat style="z-index: 3">
      <v-toolbar-title>Mes événements</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card class="pa-4">
      <v-card outlined rounded>
        <v-list class="pa-0">
          <v-list-item
            v-for="event in authUserEvents"
            :key="event.id"
            two-line
            class="mx-2 my-2 borderEvent"
            :style="
              `background-color: ${getEventColor(event)};` +
              `border-color: ${getEventColor(event)};`
            ">
            <v-list-content>
              <v-list-item-title>{{ event.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-wrap">{{ getEventDateTime(event) }}</v-list-item-subtitle>
            </v-list-content>
            <v-spacer/>
            <v-list-item-action>
              <v-dialog max-width="256">
                <template #activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on" @click="selectedEvent = event">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <DeleteDialog :title="'l\'inscription à ' + event.name" :action="unsubscribeAuthUser">
                </DeleteDialog>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapGetters, mapMutations } from 'vuex'
import { eventMethods } from '@/mixins/eventMethods'
import { IEvent } from '@/store/events'

export default mixins(eventMethods).extend({
  data: () => ({
    selectedEvent: {} as IEvent,
  }),

  computed: {
    ...mapGetters({
      authUserEvents: 'user/authenticatedUserEvents',
    }),
  },

  methods: {
    ...mapMutations({
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
    async unsubscribeAuthUser() {
      try {
        await this.$store.dispatch('user/unsubscribeAuthUser', this.selectedEvent)
        this.setSnackbarColor('green')
        this.setSnackbarIcon('mdi-checkbox-marked-circle')
        this.setSnackbarMessage('Désincription réussie.')
        this.setSnackbar(true)
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage(
          "Erreur lors de la désincription à l'événement."
        )
        this.setSnackbar(true)
      }
    },
  },
})
</script>

<style scoped>
.borderEvent {
  border-radius: 4px;
}
</style>
