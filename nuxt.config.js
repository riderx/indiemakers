
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
    baseRSS: 'https://anchor.fm/s/414d1d4/podcast/rss'
  },
  head: {
    title: process.env.npm_package_name || '',
    script: [
      // { hid: 'FA', src: 'https://kit.fontawesome.com/0a896015b4.js', defer: true }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'title', name: 'title', content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.' },
      { hid: 'og:title', name: 'og:title', content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:locale', name: 'og:locale', content: 'fr_FR' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'indiemakers.fr' },
      { hid: 'og:article:author', name: 'og:article:author', content: 'Martin DONADIEU' },
      { hid: 'description', name: 'description', content: 'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en en business florissant.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      // <script src="https://kit.fontawesome.com/0a896015b4.js" crossorigin="anonymous" defer></script>

    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~/plugins/fontawesome.js' },
    { src: '~plugins/crisp.js', ssr: false },
    { src: '~/plugins/global.client.js' }
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
    ['@nuxtjs/pwa', { workbox: false }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/firebase'
  ],
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['faHeadphones', 'faHeart', 'faPizzaSlice', 'faCaretUp', 'faCaretCircleRight'],
      brands: ['faSpotify', 'faInstagram', 'faTwitter']
    }
  },
  firebase: {
    config: {
      production: {
        apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
        authDomain: 'indiemakerfr.firebaseapp.com',
        databaseURL: 'https://indiemakerfr.firebaseio.com',
        projectId: 'indiemakerfr',
        storageBucket: 'indiemakerfr.appspot.com',
        messagingSenderId: '600956995728',
        appId: '1:600956995728:web:17aacb03e66648e2d63015',
        measurementId: 'G-HCXN7ZEMJ8'
      },
      development: {
        apiKey: 'AIzaSyAC0aCq1umg8bZtOuhzH8GkflqUCtInOp8',
        authDomain: 'indiemakerfr.firebaseapp.com',
        databaseURL: 'https://indiemakerfr.firebaseio.com',
        projectId: 'indiemakerfr',
        storageBucket: 'indiemakerfr.appspot.com',
        messagingSenderId: '600956995728',
        appId: '1:600956995728:web:17aacb03e66648e2d63015',
        measurementId: 'G-HCXN7ZEMJ8'
      }
    },
    onFirebaseHosting: false,
    services: {
      auth: {
        persistence: 'local'
      },
      firestore: {
        memoryOnly: false, // default
        enablePersistence: true
      },
      ssr: false,
      functions: true,
      storage: false,
      realtimeDb: false,
      performance: true,
      analytics: true,
      messaging: false
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extend (config, { isDev, isClient, isServer }) {
      if (isServer) {
        config.externals = {
          '@firebase/app': 'commonjs @firebase/app',
          '@firebase/firestore': 'commonjs @firebase/firestore'
        }
      }
    }
  }
}
