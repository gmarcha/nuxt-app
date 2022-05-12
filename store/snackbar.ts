import { MutationTree } from 'vuex'

export const state = () => ({
  show: false,
  color: '',
  icon: '',
  message: '',
})

export type SnackbarState = ReturnType<typeof state>

export const mutations: MutationTree<SnackbarState> = {
  SET_SHOW: (state, value) => {
    state.show = value
  },
  SET_COLOR: (state, value) => {
    state.color = value
  },
  SET_ICON: (state, value) => {
    state.icon = value
  },
  SET_MESSAGE: (state, value) => {
    state.message = value
  },
}
