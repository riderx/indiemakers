<template>
  <LazyHydrate when-idle>
    <div id="episodes">
      <div class="container w-full px-0 mx-auto">
        <div class="flex flex-wrap w-full">
          <div class="w-full md:w-1/2 md:px-4">
            <div
              id="header-eps"
              class="flex flex-wrap w-full py-1 border-8 bg-blue border-light py-md-2"
            >
              <div
                class="flex-grow px-0 py-2 text-center text-white"
              >
                <p class="text-3xl md:text-4xl font-indie">
                  🎙 Episodes
                </p>
              </div>
            </div>
            <div
              id="scrollable"
              class="flex flex-wrap w-full overflow-hidden border-4 md:h-78 md:overflow-y-scroll border-light md:custom-scroll"
            >
              <div
                v-for="episode in episodes"
                :key="episode.id"
                class="w-full text-white border-b bg-blue align-items-top"
              >
                <ListItem
                  class="w-full"
                  :title="episode.title"
                  :date="episode.date"
                  :preview="episode.preview"
                  :image-fallback="episode.itunes.image"
                  :image="episode.image_optimized"
                  :loading-image="episode.image_loading"
                  @name="open(episode.social.link)"
                  @image="open(`/episode/${episode.id}`)"
                />
              </div>
            </div>
          </div>
          <div
            id="content"
            class="w-full px-4 text-white md:w-1/2 pt-md-0 px-md-5"
          >
            <div class="flex flex-wrap">
              <div
                class="w-full mb-3 md:w-1/5 offset-3 offset-md-0"
              >
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="w-1/2 h-auto mx-auto my-10 border-8 md:m-0 md:w-4/5 border-light"
                  alt="IM COVER"
                  :src="loadingImg"
                >
              </div>
              <div class="text-center md:w-3/5 md:px-4 md:text-left">
                <h1 class="pb-2 text-3xl font-indie">
                  {{ title }}
                </h1>
              </div>
              <div class="py-1 text-sm">
                <h2 class="text-xl font-indie">
                  Prochain episode dans {{ nextEpisode() }}
                </h2>
              </div>
              <div class="pt-3 text-sm">
                <div v-for="(message, index) in messages" :key="`ep-${index}`">
                  <p class="pb-2">
                    {{ message }}
                  </p>
                </div>
              </div>
              <div class="flex justify-center w-full pt-3">
                <button
                  type="button"
                  class="px-5 py-2 border-4 border-white font-indie hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                  @click="open('/makers_hunt')"
                >
                  <h3>👉 Découvre les Makers Français</h3>
                </button>
              </div>
              <div class="pt-3 text-sm">
                <p class="pb-2">
                  Par
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://twitter.com/martindonadieu"
                  >Martin DONADIEU</a>
                </p>
                <p class="pb-2">
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://amzn.to/3lXjALg"
                  >Lancer sa startup en indépendant</a>, mon Livre publié aux éditions Broché
                </p>
                <p class="pb-2">
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="/tools"
                  >Mes outils</a>
                  quotidiens pour gerer mes projets !
                </p>
              </div>
              <div class="pt-3 pb-3 text-white">
                <p class="font-indie">
                  Mes autres projets:
                </p>
                <div class="flex text-sm flex-column flex-md-row">
                  <a
                    class="block px-2 py-3 text-white py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://apps.apple.com/us/app/captime-crossfit-timer/id1369288585"
                  >Captime | Crossfit timer</a>
                  <a
                    class="block px-2 py-3 text-white py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://naas.ai"
                  >Naas | outils LowCode </a>
                  <a
                    class="block px-2 py-3 text-white py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://bewise.love"
                  >Bewise | Une citation par jour</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LazyHydrate>
</template>
<script>
import { feed, domain } from '~/plugins/rss'

import { crispLoader } from '~/plugins/crisp.client'
export default {
  components: {
    ListItem: () => import('~/components/ListItem.vue'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  async asyncData ({ params, $config }) {
    const items = await feed($config)
    return { episodes: items }
  },
  data () {
    return {
      sizeHead: '100vh',
      image: { // https://ik.imagekit.io/gyc0uxoln1/indiemakers/cover-im_0.5x_5ozFHlEvg.png?tr=q-5,bl-5,h-150,w-150
        src: 'https://ik.imagekit.io/gyc0uxoln1/indiemakers/cover-im_0.5x_5ozFHlEvg.png?tr=h-100,w-100',
        error: require('~/assets/cover-im_user.png'),
        loading: 'https://ik.imagekit.io/gyc0uxoln1/indiemakers/cover-im_0.5x_5ozFHlEvg.png?tr=q-5,bl-5,h-50,w-50'
      },
      loadingImg: 'https://ik.imagekit.io/gyc0uxoln1/indiemakers/cover-im_0.5x_5ozFHlEvg.png?tr=q-5,bl-5,h-50,w-50',
      episodes: [],
      title: '🚀Le podcast pour lancer sa startup en indépendant',
      messages: [
        "J'échange avec ceux qui ont su transformer leurs idées en business florissant.",
        'Au-delà des belles histoires, nous décryptons leur histoire, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables en indépendant.',
        'J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur projet profitable.',
        'Un épisode tous les 15 jours'
      ]
    }
  },
  beforeMount () {
    window.addEventListener(
      'scroll',
      () => {
        crispLoader()
      },
      { capture: true, once: true, passive: true }
    )
  },
  mounted () {
    // this.setSizeHead()
  },
  methods: {
    joinUs () {
      this.$modal.show('join')
    },
    removeEmoji (str) {
      return str.replace(
        /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
        ''
      )
    },
    getImgObj (imageOptimized, imageLoading) {
      return {
        src: imageOptimized,
        error: require('~/assets/cover-im_user.png'),
        loading: imageLoading
      }
    },
    removeAccent (str) {
      return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
    },
    nextEpisode () {
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2019, 10, 19)
      const now = new Date()
      const diffDays = Math.round(Math.abs((firstDate - now) / oneDay))
      const nextEp = 14 - (diffDays % 14)
      return nextEp !== 14 ? `${nextEp} jours` : 'DEMAIN 10 heures'
    },
    open (url) {
      // console.log('open', url)
      if (url && url.startsWith('http')) {
        window.open(url, '_blank')
      } else if (url) {
        this.$router.push(url)
      }
    },
    setSizeHead () {
      if (
        process.client &&
        document.getElementById('header-eps') &&
        document.getElementById('header') &&
        document.getElementById('content') &&
        document.getElementById('content').offsetWidth !== window.innerWidth
      ) {
        const size = `${
          document.getElementById('header-eps').offsetHeight +
          document.getElementById('header').offsetHeight +
          5
        }px`
        this.sizeHead = `calc(100vh - ${size})`
      } else {
        this.sizeHead = 'auto'
      }
    }
  },
  head () {
    return {
      title: this.removeEmoji(this.title),
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        {
          hid: 'description',
          name: 'description',
          content: this.removeEmoji(this.messages[0])
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.removeEmoji(this.title)
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.removeEmoji(this.messages[0])
        },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>
<style>
</style>
