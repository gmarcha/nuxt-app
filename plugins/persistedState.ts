import { Plugin } from '@nuxt/types'
import { VuexPersistence } from 'vuex-persist'

const persistState: Plugin = ({ store }) => {
  new VuexPersistence().plugin(store)
}

export default persistState
