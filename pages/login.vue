<template>
  <v-container fill-height fluid>
    <SnackBar></SnackBar>
    <v-row justify="center">
      <v-card flat align="center">
        <h1 class="ma-4 text-center">La ruche 🐝</h1>
        <v-btn
          dark
          x-large
          :elevation="0"
          :loading="loading"
          color="grey darken-3"
          class="ma-4"
          @click="login"
        >
          Connexion
          <img src="42_logo.svg" class="logo" />
        </v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'

export default Vue.extend({
  name: 'LoginPage',

  layout: 'login',

  middleware({ $cookies, redirect }) {
    const accessToken = $cookies.get('access_token')
    if (accessToken) redirect('/')
  },

  async asyncData({ query, store, redirect }) {
    const { code: authCode, state: authState } = query
    if (authCode && authState) {
      try {
        await store.dispatch('auth/login', { authCode, authState })
        redirect('/')
      } catch (err) {
        return {
          error: true,
        }
      }
    }
  },

  data: () => ({
    error: false,
    loading: false,
  }),

  created() {
    if (this.error) {
      this.setSnackbarColor('red')
      this.setSnackbarIcon('mdi-alert-circle')
      this.setSnackbarMessage('Erreur lors de la connexion.')
      this.setSnackbar(true)
    }
  },

  methods: {
    login() {
      this.loading = true
      window.location.href = `https://tutor.localhost:8080/api/v2/auth/login`
    },
    ...mapMutations({
      setSnackbar: 'snackbar/SET_SHOW',
      setSnackbarColor: 'snackbar/SET_COLOR',
      setSnackbarIcon: 'snackbar/SET_ICON',
      setSnackbarMessage: 'snackbar/SET_MESSAGE',
    }),
  },
})
</script>

<style scoped>
.logo {
  height: 1rem;
  margin-left: 0.5rem;
}
</style>
