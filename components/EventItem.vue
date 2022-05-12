<template>
  <v-card flat>
    <v-toolbar :color="getEventColor(selectedEvent)" dark>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title class="px-5">{{ selectedEvent.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="!isUserSubscribed(selectedEvent)"
        :loading="isSubscriptionLoading"
        :disabled="isSubscriptionLoading"
        @click="subscribeAuthUser(selectedEvent)"
      >
        <v-icon class="mr-2">mdi-check</v-icon>
        S'inscrire
      </v-btn>
      <v-btn
        v-else
        :loading="isSubscriptionLoading"
        :disabled="isSubscriptionLoading"
        @click="unsubscribeAuthUser(selectedEvent)"
      >
        <v-icon class="mr-2">mdi-close</v-icon>
        Se désinscrire
      </v-btn>
    </v-toolbar>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-clock-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{
        getEventDateTime(selectedEvent)
      }}</v-list-item-subtitle>
    </v-list-item>
    <v-list-item v-if="selectedEvent.description">
      <v-list-item-icon>
        <v-icon>mdi-text</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{
        selectedEvent.description
      }}</v-list-item-subtitle>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-account-group</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Tutors</v-list-item-title>
      <v-list-item-subtitle class="text-right"
        >{{
          getEventSubscription(selectedEvent)
        }}
        subscribed</v-list-item-subtitle
      >
    </v-list-item>
    <v-list-item v-if="selectedEvent.walletsReward">
      <v-list-item-icon>
        <v-icon>mdi-currency-usd</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Wallets</v-list-item-title>
      <v-list-item-subtitle class="text-right"
        >{{ selectedEvent.walletsReward }}₳ rewards</v-list-item-subtitle
      >
    </v-list-item>
    <v-divider v-if="getEventNumberUsers(selectedEvent)" />
    <v-list-item
      v-for="user in getEventUsers(selectedEvent)"
      :key="user.id"
      two-line
    >
      <v-list-item-avatar>
        <v-img :alt="user.login" :src="user.imagePath"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{
          user.displayName
            ? user.displayName
            : `${user.firstName} ${user.lastName}`
        }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-chip
            color="grey darken-3"
            label
            text-color="white"
            class="mt-1"
            small
            :href="`https://profile.intra.42.fr/users/${user.login}`"
            target="_blank"
          >
            <img src="42_logo.svg" class="logo" />
            <b>{{ user.login }}</b>
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item v-if="isCalendar">
      <v-spacer />
      <v-list-item-action>
        <v-dialog v-if="isCalendar" :fullscreen="isMobile" max-width="650">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              <v-icon class="mr-1">mdi-table-edit</v-icon>
              Modifier
            </v-btn>
          </template>
          <template #default="dialog">
            <EventDialog
              :key="selectedEvent.id"
              :update="true"
              :name="selectedEvent.name"
              :start="selectedEvent.startAt"
              :end="selectedEvent.endAt"
              :description="selectedEvent.description"
              :tutors="selectedEvent.tutorsRequired"
              :reward="selectedEvent.walletsReward"
              :category="
                selectedEvent.edges.category
                  ? selectedEvent.edges.category.name
                  : ''
              "
              @close="dialog.value = false"
            ></EventDialog>
          </template>
        </v-dialog>
      </v-list-item-action>
      <v-list-item-action>
        <v-dialog max-width="256">
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              <v-icon class="mr-1">mdi-table-remove</v-icon>
              Supprimer
            </v-btn>
          </template>
          <DeleteDialog :title="selectedEvent.name" :action="deleteEvent">
            Les tuteurs inscrits seront perdus.
          </DeleteDialog>
        </v-dialog>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { eventMethods } from '@/mixins/eventMethods'
import { IUser } from '@/store/user'
import { IEvent } from '@/store/events'

export default mixins(eventMethods).extend({
  computed: {
    ...mapState({
      isMobile: (state: any) => state.isMobile,
      authenticatedUser: (state: any) => state.user.authenticatedUser,
      selectedEvent: (state: any) => state.events.selectedEvent,
    }),
    ...mapGetters({
      isCalendar: 'user/authenticatedUserIsCalendar',
      isSubscriptionLoading: 'user/isSubscriptionLoading',
    }),
  },

  methods: {
    ...mapMutations({
      selectEvent: 'events/SELECT',
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
    isUserSubscribed(event: IEvent): boolean {
      return (
        this.getEventUsers(event).filter(
          (el: IUser) => el.id === this.authenticatedUser.id
        ).length !== 0
      )
    },
    async deleteEvent() {
      try {
        await this.$store.dispatch('events/deleteEvent', this.selectedEvent.id)
        this.selectEvent({})
        this.$emit('close')
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage("Erreur lors de la suppression de l'événement.")
        this.setSnackbar(true)
      }
    },
    async subscribeAuthUser(event: IEvent) {
      try {
        await this.$store.dispatch('user/subscribeAuthUser', event)
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage("Erreur lors de l'inscription à l'événement.")
        this.setSnackbar(true)
      }
    },
    async unsubscribeAuthUser(event: IEvent) {
      try {
        await this.$store.dispatch('user/unsubscribeAuthUser', event)
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
.logo {
  height: 12px;
  margin-right: 0.5rem;
}
</style>
