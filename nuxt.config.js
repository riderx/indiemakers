const isServerlessEnvironment = process.env.ON_VERCEL === 'true'
const serverMiddleware = isServerlessEnvironment
  ? []
  : [{ path: '/api', handler: '~/api_index.ts' }]
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  publicRuntimeConfig: {
    DOMAIN:
      process.env.NODE_ENV === 'production'
        ? 'https://indiemakers.fr'
        : 'http://localhost:3000',
    VERCEL_URL: process.env.VERCEL_URL,
    BASEAPI: 'api',
    handler: 'indiemakersfr',
  },
  env: {
    dev: process.env.NODE_ENV !== 'production',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title:
      'Le 1er podcast francais qui aide les independants a vivre de leur business.',
    script: [
      {
        src: 'https://pls.indiemakers.fr/js/index.js',
        'data-domain': 'indiemakers.fr',
        async: true,
        defer: true,
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'title',
        name: 'title',
        content:
          'Le 1er podcast francais qui aide les independants a vivre de leur business.',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          "Ici, tu trouveras des podcasts où j'échange avec ceux qui ont su transformer leurs idées en business florissant.",
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content:
          'Le 1er podcast francais qui aide les independants a vivre de leur business.',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'indiemakers.fr',
      },
      {
        hid: 'og:article:author',
        property: 'og:article:author',
        content: 'Martin DONADIEU',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "Ici, tu trouveras des podcasts où j'échange avec ceux qui ont su transformer leurs idées en business florissant.",
      },
    ],
    link: [
      {
        rel: 'alternate',
        hreflang: 'fr',
        title: 'RSS INDIE MAKERS',
        type: 'application/rss+xml',
        href: 'https://indiemakers/rss.xml',
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  serverMiddleware,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/oldPath.ts' },
    { src: '~/plugins/modal.ts' },
    { src: '~/plugins/vue-plyr.client.ts' },
    { src: '~/plugins/global.client.ts' },
    { src: '~/plugins/firebase.client.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'vue-warehouse/nuxt',
    '@nuxtjs/component-cache',
    '@nuxtjs/sentry',
    [
      'nuxt-font-loader-strategy',
      {
        ignoreLighthouse: true,
        ignoredEffectiveTypes: ['2g', 'slow-2g'],
        fonts: [
          {
            fileExtensions: ['woff2', 'woff'],
            fontFamily: 'Rex Bold',
            fontFaces: [
              {
                preload: true,
                localSrc: ['Rex Bold', 'Rex-Bold'],
                src: '@/assets/fonts/Rex-Bold',
                fontWeight: 400,
                fontStyle: 'normal',
              },
            ],
          },
        ],
      },
    ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      theme_color: '#4b279b',
    },
    manifest: {
      name: 'INDIE MAKERS',
      lang: 'fr',
      short_name: 'IM',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  sentry: {
    dsn: 'https://1e9603c479b54389ab04a4be985e1768@o449238.ingest.sentry.io/5431873', // Enter your project's DSN here
    config: {}, // Additional config
  },
}
