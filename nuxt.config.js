const serverMiddleware = () => {
  if (process.env.VERCEL) {
    return []
  }
  if (process.env.DEPLOY_API_ONLY) {
    return [{ path: '/', handler: '~/services/local.ts' }]
  }
  if (process.env.DEPLOY_API) {
    return [{ path: '/api', handler: '~/services/local.ts' }]
  }
  return []
}
const baseDomain = () => {
  if (process.env.VERCEL) {
    return process.env.VERCEL_URL
  }
  return 'indiemakers.fr'
}
const baseUrl = () => {
  if (process.env.VERCEL) {
    return `https://${baseDomain()}`
  }
  return 'http://localhost:3000'
}
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',
  publicRuntimeConfig: {
    DOMAIN: baseDomain(),
    BASEAPI: `${baseUrl()}/api`,
    handler: 'indiemakersfr',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'fr',
    },
    title: 'Le 1er podcast francais qui aide les independants a vivre de leur business.',
    script: [
      {
        src: 'https://indiemakers-pls.digitalshift-ee.workers.dev/js/script.js',
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
        content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.',
      },
      {
        hid: 'description',
        name: 'description',
        content: "Ici, tu trouveras des podcasts où j'échange avec ceux qui ont su transformer leurs idées en business florissant.",
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Le 1er podcast francais qui aide les independants a vivre de leur business.',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: baseUrl(),
      },
      {
        hid: 'og:article:author',
        property: 'og:article:author',
        content: 'Martin DONADIEU',
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: "Ici, tu trouveras des podcasts où j'échange avec ceux qui ont su transformer leurs idées en business florissant.",
      },
    ],
    link: [
      {
        rel: 'alternate',
        title: 'RSS INDIE MAKERS',
        type: 'application/rss+xml',
        href: `${baseUrl()}/rss.xml`,
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  serverMiddleware: serverMiddleware(),
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'canny_all',
        path: '/canny/*',
        component: resolve(__dirname, 'pages/canny/index.vue'),
      })
    },
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/modal.ts' }, { src: '~/plugins/firebase.client.ts' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/composition-api/module',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // '@nuxt/image',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/markdownit',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'vue-warehouse/nuxt',
    // 'nuxt-speedkit',
  ],
  markdownit: {
    runtime: true, // Support `$md()`
    html: true,
    linkify: true,
    typographer: true,
  },
  // speedkit: {
  //   detection: {
  //     performance: true,
  //     browserSupport: true,
  //   },
  //   performance: {
  //     device: {
  //       hardwareConcurrency: { min: 2, max: 48 },
  //       deviceMemory: { min: 2 },
  //     },
  //     timing: {
  //       fcp: 800,
  //       dcl: 1200,
  //     },
  //     lighthouseDetectionByUserAgent: false,
  //   },
  //   fonts: [
  //     {
  //       family: 'Rex Bold',
  //       locals: ['Rex Bold'],
  //       fallback: ['Arial', 'sans-serif'],
  //       variances: [
  //         {
  //           style: 'normal',
  //           weight: 400,
  //           sources: [
  //             { src: '@/assets/fonts/Rex-Bold.woff', type: 'woff' },
  //             { src: '@/assets/fonts/Rex-Bold.woff2', type: 'woff2' },
  //           ],
  //         },
  //       ],
  //     },
  //   ],

  //   componentAutoImport: false,
  //   componentPrefix: undefined,

  //   /**
  //    * IntersectionObserver rootMargin for Compoennts and Assets
  //    */
  //   lazyOffset: {
  //     component: '0%',
  //     asset: '0%',
  //   },
  // },
  // image: {
  //   imagekit: {
  //     baseURL: 'https://ik.imagekit.io/gyc0uxoln1',
  //   },
  //   cloudinary: {
  //     baseURL: 'https://res.cloudinary.com/forgr/image/upload/',
  //   },
  // },
  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
  },
  purgeCSS: {
    whitelistPatterns: [/vm--/, /icon--/, /label--/, /vue-dialog/, /vue-modal/],
  },
}
