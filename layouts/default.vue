<template>
  <v-app>
    <v-app-bar app height="64">
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu transition="slide-x-reverse-transition" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-avatar>
              <v-img :src="imagePath"></v-img>
            </v-avatar>
            <v-col>
              {{ login }}
            </v-col>
          </v-btn>
        </template>

        <v-list class="mt-6">
          <v-dialog
            v-if="isTutor"
            v-model="userEventsDialog"
            :fullscreen="isMobile"
            max-width="650"
          >
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-action>
                  <v-icon>mdi-calendar-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Mes événements</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <UserEventsDialog
              @close="userEventsDialog = false"
            ></UserEventsDialog>
          </v-dialog>
          <v-dialog
            v-if="isAdmin"
            v-model="adminDialog"
            :fullscreen="isMobile"
            max-width="650"
          >
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on" @click="fetchUsers">
                <v-list-item-action>
                  <v-icon>mdi-account-supervisor</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Gestion des tuteurs</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <AdminDialog @close="adminDialog = false"></AdminDialog>
          </v-dialog>
          <v-list-item @click="logoutRedirect">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Déconnexion</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'DefaultLayout',

  data: () => ({
    title: '🐝 La ruche',
    userEventsDialog: false,
    adminDialog: false,
  }),

  computed: {
    ...mapState({
      isMobile: (state: any): boolean => state.isMobile,
      login: (state: any): string => state.user.authenticatedUser.login,
      imagePath: (state: any): string => state.user.authenticatedUser.imagePath,
    }),
    ...mapGetters({
      isTutor: 'user/authenticatedUserIsTutor',
      isAdmin: 'user/authenticatedUserIsTutor',
    }),
  },

  methods: {
    ...mapMutations({
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
    ...mapActions({
      logout: 'auth/logout',
    }),
    logoutRedirect() {
      this.logout()
      this.$router.replace('/login')
    },
    async fetchUsers() {
      try {
        await this.$store.dispatch('users/fetchUsers')
        await this.$store.dispatch('users/fetchRoles')
      } catch (err) {
        this.setSnackbarColor('red')
        this.setSnackbarIcon('mdi-alert-circle')
        this.setSnackbarMessage('Erreur lors de la récuperation des étudiants.')
        this.setSnackbar(true)
      }
    },
  },
})
</script>

<style>
html {
  overflow: hidden;
}
.accent-text {
  color: #ffffff !important;
}
.v-menu__content {
  box-shadow: none;
}
.v-input__icon--prepend {
  font-size: 12px;
}
</style>
