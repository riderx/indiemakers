
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
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
    baseRSS: 'p/rss',
    domain: (process.env.NODE_ENV === 'production') ? 'https://indiemakers.fr' : 'http://localhost:3000',
    domain_unsecure: 'http://indiemakers.fr',
    handler: 'indiemakersfr'
  },
  proxy: {
    '/p/rss': 'https://anchor.fm/s/414d1d4/podcast/rss',
    '/p/an': 'https://www.googletagmanager.com/gtag/js?id=UA-111666797-4'
    // '/p/pls': { changeOrigin: false, target: 'https://plausible.io/js/plausible.js' }
  },
  head: {
    title: 'Le 1er podcast francais qui aide les independants a vivre de leur business.',
    script: [
      {
        src: 'https://plausible.io/js/plausible.js',
        'data-domain': 'indiemakers.fr',
        async: true,
        defer: true
      }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'title', name: 'title', content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.' },
      { hid: 'description', name: 'description', content: 'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en en business florissant.' },
      { hid: 'og:title', property: 'og:title', content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'indiemakers.fr' },
      { hid: 'og:article:author', property: 'og:article:author', content: 'Martin DONADIEU' },
      { hid: 'og:description', property: 'og:description', content: 'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en en business florissant.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'plyr/dist/plyr.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~/plugins/player.js' },
    { src: '~/plugins/oldPath.js' },
    { src: '~/plugins/fontawesome.js' },
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
    '@nuxtjs/eslint-module',
    ['@nuxtjs/google-analytics', {
      id: 'UA-111666797-4',
      customResourceURL: (process.env.NODE_ENV === 'production') ? 'https://indiemakers.fr/p/an' : 'http://localhost:3000/p/an'
    }],
    ['@nuxtjs/pwa', { workbox: false, oneSignal: false }]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/component-cache',
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/proxy',
      {
        logProvider: () => {
          const provider = {
            log: console.log,
            debug: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error
          }

          return provider
        },
        logLevel: 'debug'
      }
    ]
  ],
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['faHeadphones', 'faHeart', 'faPizzaSlice', 'faCaretUp', 'faCaretCircleRight'],
      brands: ['faSpotify', 'faInstagram', 'faTwitter']
    }
  }
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
}
