import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'

export interface IToken {
  accessToken: string
  refreshToken: string
  expiresAt: string
  issuedAt: string
}

export const state = () => ({
  isAuthenticated: false,
  token: {} as IToken,
  authStatus: '',
})

export type AuthState = ReturnType<typeof state>

export const mutations: MutationTree<AuthState> = {
  AUTH_REQUEST: (state) => {
    state.authStatus = 'loading'
  },
  AUTH_SUCCESS: (state, token: IToken) => {
    state.authStatus = 'success'
    state.isAuthenticated = true
    state.token = token
  },
  AUTH_ERROR: (state) => {
    state.authStatus = 'error'
  },
  AUTH_LOGOUT: (state) => {
    state.authStatus = ''
    state.isAuthenticated = false
    state.token = {} as IToken
  },
}

export const actions: ActionTree<AuthState, RootState> = {
  async login(
    { commit },
    { authCode, authState }: { authCode: string; authState: string }
  ) {
    commit('AUTH_REQUEST')
    try {
      const res = await this.$axios.$get(
        `/auth/callback?code=${authCode}&state=${authState}`
      )
      const { accessToken, refreshToken, expiresAt, issuedAt } = res
      this.$cookies.set('access_token', accessToken)
      this.$cookies.set('refresh_token', refreshToken)
      this.$cookies.set('expires_at', expiresAt)
      this.$cookies.set('issued_at', issuedAt)
      commit('AUTH_SUCCESS', res)
      return res
    } catch (err) {
      this.$cookies.removeAll()
      commit('AUTH_ERROR')
      throw err
    }
  },
  logout({ commit }) {
    this.$cookies.removeAll()
    commit('AUTH_LOGOUT')
  },
}
