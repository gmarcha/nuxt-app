<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
        <v-card flat>
          <h1 class="ma-4 text-center">La ruche 🐝</h1>
          <v-btn
            class="ma-4"
            color="grey darken-3"
            dark
            :elevation="0"
            x-large
            @click="$fetch"
          >
            Connexion
            <img src="42_logo.svg" class="logo"/>
          </v-btn>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>

export default {
  layout: 'login',

  components: {},

  async fetch() {
    const ip = await this.$axios.$get('http://goswagger:5000')
    this.ip = ip
    console.Log(ip)
  }

  // async asyncData({ $axios, query, redirect, $config, $cookies, store }) {
  //   if (query.error === 'user') {
  //     store.commit('snackbar/setMessage', 'Impossible de récupérer les informations utilisateur')
  //     store.commit('snackbar/setColor', 'error')
  //     store.commit('snackbar/setIcon', 'mdi-alert-circle')
  //     store.commit('snackbar/setShow', true)
  //     return
  //   } else if (query.error === 'refresh') {
  //     store.commit('snackbar/setMessage', 'Impossible de rafraichir le jeton de l\'api 42')
  //     store.commit('snackbar/setColor', 'error')
  //     store.commit('snackbar/setIcon', 'mdi-alert-circle')
  //     store.commit('snackbar/setShow', true)
  //     return
  //   } else if (query.code) {
  //     try {
  //       const authCode = query.code
  //       const clientId = $config.intra42.clientId
  //       const clientSecret = $config.intra42.clientSecret
  //       const redirectUri = $config.redirectUri
  //       const apiUri = $config.intra42.uri
  //       const requestUri = `${apiUri}/oauth/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${authCode}&redirect_uri=${redirectUri}`
  //       const auth = await $axios.$post(requestUri)
  //       $cookies.set('access_token', auth.access_token)
  //       $cookies.set('refresh_token', auth.refresh_token)
  //       $cookies.set('expires_in', auth.expires_in)
  //       $cookies.set('created_at', auth.created_at)
  //       redirect('/')
  //     } catch (error) {
  //       console.error(`login: ${error}`)
  //       store.commit('snackbar/setMessage', 'Erreur lors de la tentative de connexion')
  //       store.commit('snackbar/setColor', 'error')
  //       store.commit('snackbar/setIcon', 'mdi-alert-circle')
  //       store.commit('snackbar/setShow', true)
  //       return
  //     }
  //   } else if ($cookies.get('access_token')) {
  //     redirect('/')
  //   }
  // },

  // computed: {
  //   loginUri() {
  //     const clientId = this.$config.intra42.clientId
  //     const redirectUri = this.$config.redirectUri
  //     const apiUri = this.$config.intra42.uri
  //     return `${apiUri}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  //   }
  // },
}
</script>

<style scoped>
.logo {
  height: 1rem;
  margin-left: 0.5rem;
}
</style>
