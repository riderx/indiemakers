
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
    baseRSS: 'https://anchor.fm/s/414d1d4/podcast/rss',
    domain: 'https://indiemakers.fr',
    domain_unsecure: 'http://indiemakers.fr',
    handler: 'indiemakersfr'
  },
  head: {
    title: 'Le 1er podcast francais qui aide les independants a vivre de leur business.',
    script: [
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
    ['@nuxtjs/pwa', { workbox: false, oneSignal: false }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/component-cache',
    'bootstrap-vue/nuxt'
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
