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
        <v-list>
          <v-list-item v-for="event in authUserEvents" :key="event.id">
            <v-btn block :color="getEventColor(event)">
              <v-row>
                <v-col cols="2" align-self="center" class="text-left">
                  {{ event.name }}
                </v-col>
                <v-col cols="9" align-self="center" class="text-right">
                  {{ getEventDateTime(event) }}
                </v-col>
                <v-col cols="1" icon @click="unsubscribeAuthUser(event)">
                  <v-icon>mdi-close</v-icon>
                </v-col>
              </v-row>
            </v-btn>
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
    async unsubscribeAuthUser(event: IEvent) {
      try {
        await this.$store.dispatch('user/unsubscribeAuthUser', event)
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
