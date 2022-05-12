import { MutationTree } from 'vuex'

export interface IRootState {
  isMobile: boolean
  auth: {
    token: {
      accessToken: string
    }
  }
}

export const state = () => ({
  isMobile: false,
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_MOBILE: (state, value) => {
    state.isMobile = value
  },
}
