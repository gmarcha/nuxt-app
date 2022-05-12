import { Middleware } from '@nuxt/types'

const tutor: Middleware = ({ store, error }) => {
  if (!store.getters['user/authenticatedUserIsTutor'])
    error({ statusCode: 403, message: 'Forbidden' })
}

export default tutor
