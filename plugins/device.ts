import { Plugin } from '@nuxt/types'

const device: Plugin = ({ req, store }) => {
  if (process.server) {
    if (/Mobi/.test(req.headers['user-agent'] || '')) {
      store.commit('SET_MOBILE', true)
    }
  }
}

export default device
