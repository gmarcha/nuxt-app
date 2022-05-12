import { Plugin } from '@nuxt/types'

const refresh: Plugin = ({ $cookies, $axios, store, redirect }) => {
  $axios.onResponseError((err) => {
    if (err.response?.data.message.includes('token is expired')) {
      return new Promise((resolve, reject) => {
        $axios
          .get('/auth/token/refresh', {
            headers: {
              Authorization: `Bearer ${store.state.auth.token.refreshToken}`,
            },
          })
          .then((res) => {
            const { accessToken, refreshToken, expiresAt, issuedAt } = res.data
            store.commit('auth/AUTH_SUCCESS', res.data)
            $cookies.set('access_token', accessToken)
            $cookies.set('refresh_token', refreshToken)
            $cookies.set('expires_at', expiresAt)
            $cookies.set('issued_at', issuedAt)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
        .then(() => {
          err.config.headers.Authorization = `Bearer ${store.state.auth.token.accessToken}`
          return $axios(err.config)
        })
        .catch((err) => {
          // console.log('catch in refresh plugin:')
          // console.log(err.response?.data)
          if (err.response?.data.message.includes('expired')) {
            $cookies.removeAll()
            redirect('/login')
          }
        })
    }
  })
}

export default refresh
