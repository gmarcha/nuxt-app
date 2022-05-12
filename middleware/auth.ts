import { Middleware } from '@nuxt/types'

const auth: Middleware = async ({ $cookies, redirect, store }) => {
  const accessToken = $cookies.get('access_token')
  const refreshToken = $cookies.get('refresh_token')
  const expiresAt = $cookies.get('expires_at')
  const issuedAt = $cookies.get('issued_at')
  if (!accessToken) redirect('/login')
  store.commit('auth/AUTH_SUCCESS', {
    accessToken,
    refreshToken,
    expiresAt,
    issuedAt,
  })
  try {
    await store.dispatch('user/fetchAuthUser')
  } catch (err) {
    store.dispatch('auth/logout')
    redirect('/login')
  }
}

export default auth
