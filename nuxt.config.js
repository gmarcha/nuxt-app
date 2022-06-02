import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - tutor-client',
    title: 'tutor-client',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['animate.css/animate.min.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/filters',
    '@/plugins/device',
    '@/plugins/refresh',
    // { src: '~/plugins/persistedState', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/dayjs',
    'cookie-universal-nuxt',
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.amber.base,
          accent: colors.grey.darken3,
          secondary: colors.blue.darken2,
          info: colors.teal.lighten1,
          warning: colors.amber.darken3,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  server: {
    host: process.env.CLIENT_HOST,
    port: process.env.CLIENT_PORT,
  },

  // // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: {
  //   // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
  //   baseURL: 'https://tutor.localhost/api/v2/',
  // },

  publicRuntimeConfig: {
    serverLogin: process.env.SERVER_LOGIN,
    axios: {
      browserBaseURL: process.env.SERVER_BASEURL,
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: 'http://goswagger:5000/v2/',
    },
  },

  axios: {
    proxy: true,
    credentials: true,
    prefix: process.env.SERVER_BASEURL,
  },

  // proxy: {
  //   '/api/v2/': 'https://tutor.localhost/',
  // },

  dayjs: {
    locales: ['fr'],
    defaultLocale: 'fr',
    defaultTimeZone: 'Europe/Paris',
    plugins: ['utc', 'timezone', 'relativeTime', 'advancedFormat'],
  },
}
