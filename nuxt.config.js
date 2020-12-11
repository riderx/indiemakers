
// const isServerlessEnvironment = process.env.ON_VERCEL === 'true'
// isServerlessEnvironment
//     ? []
//     : [
//         { path: '/api', handler: '~/api/index.js' }
//       ],
export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  env: {
    dev: (process.env.NODE_ENV !== 'production'),
    rss: 'https://anchor.fm/s/414d1d4/podcast/rss',
    baseAPI: 'api',
    domain: (process.env.NODE_ENV === 'production') ? 'https://indiemakers.fr' : 'http://localhost:3000',
    handler: 'indiemakersfr'
  },
  head: {
    title: 'Le 1er podcast francais qui aide les independants a vivre de leur business.',
    script: [
      {
        src: 'https://pls.indiemakers.fr/js/index.js',
        'data-domain': 'indiemakers.fr',
        async: true,
        defer: true
      }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'title', name: 'title', content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.' },
      { hid: 'description', name: 'description', content: 'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en business florissant.' },
      { hid: 'og:title', property: 'og:title', content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'indiemakers.fr' },
      { hid: 'og:article:author', property: 'og:article:author', content: 'Martin DONADIEU' },
      { hid: 'og:description', property: 'og:description', content: 'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en business florissant.' }
    ],
    link: [
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  serverMiddleware: [
        { path: '/api', handler: '~/api/index.js' }
      ],
  /*
  ** Global CSS
  */
  css: [
    'plyr/dist/plyr.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~/plugins/player.js' },
    { src: '~/plugins/oldPath.js' },
    { src: '~/plugins/global.client.js' },
    { src: '~/plugins/firebase.client.js' }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/tailwindcss',
    'nuxt-purgecss',
    '@nuxtjs/eslint-module',
    '@nuxtjs/pwa'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/component-cache',
    '@nuxtjs/sentry'
  ],
  sentry: {
    dsn: 'https://1e9603c479b54389ab04a4be985e1768@o449238.ingest.sentry.io/5431873', // Enter your project's DSN here
    config: {} // Additional config
  }
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
}
