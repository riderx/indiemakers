<template>
  <LazyHydrate when-visible>
    <div id="episodes">
      <div class="container px-0 mx-auto w-full">
        <div class="flex flex-wrap w-full">
          <div class="w-full md:w-1/2 md:px-4">
            <div
              id="header-eps"
              class="flex flex-wrap bg-blue border-8 border-light py-1 py-md-2 w-full"
            >
              <div
                class="flex-grow py-2 px-0 text-white text-center"
              >
                <h1 class="text-3xl md:text-4xl font-indie">
                  🎙 Episodes
                </h1>
              </div>
            </div>
            <div
              id="scrollable"
              class="md:h-78 overflow-hidden md:overflow-y-scroll border-4 border-light md:custom-scroll"
            >
              <div
                v-for="episode in episodes"
                :key="episode.guid_fix"
                class="flex flex-wrap bg-blue text-white border-b align-items-top"
              >
                <ListItem
                  :title="episode.title"
                  :name="episode.social.name"
                  :preview="episode.preview"
                  :image-fallback="episode.itunes.image"
                  :image="episode.image_optimized"
                  :loading-image="episode.image_loading"
                  @name="open(episode.social.link)"
                  @image="open(`/episode/${episode.guid_fix}`)"
                />
              </div>
            </div>
          </div>
          <div
            id="content"
            class="w-full md:w-1/2 px-4 pt-md-0 px-md-5 text-white"
          >
            <div class="flex flex-wrap">
              <div
                class="w-full md:w-1/5 offset-3 offset-md-0 mb-3"
              >
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="mx-auto my-10 w-1/2 md:m-0 md:w-4/5 h-auto border-8 border-light"
                  alt="IM COVER"
                  :src="loadingImg"
                >
              </div>
              <div class="md:w-3/5 md:px-4 text-center md:text-left">
                <h1 class="pb-2 font-indie text-3xl">
                  {{ title }}
                </h1>
              </div>
              <div class="py-1 text-sm">
                <h3 class="font-indie text-xl">
                  Prochain episode dans {{ nextEpisode() }}
                </h3>
              </div>
              <div class="pt-3 text-sm">
                <div v-for="(message, index) in messages" :key="`ep-${index}`">
                  <p class="pb-2">
                    {{ message }}
                  </p>
                </div>
              </div>
              <div class="pt-3 flex justify-center w-full">
                <button
                  type="button"
                  class="border-4 border-white font-indie py-2 px-5 hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                  @click="open('/makers_hunt')"
                >
                  👉 Découvre les Makers Français
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
                <h5 class="font-indie">
                  Mes autres projets:
                </h5>
                <div class="flex flex-column flex-md-row text-sm">
                  <a
                    class="text-white block px-2 py-3 py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://apps.apple.com/us/app/captime-crossfit-timer/id1369288585"
                  >Captime | Crossfit timer</a>
                  <a
                    class="text-white block px-2 py-3 py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://lkstats.web.app/welcome"
                  >Lk stats | Linkedin analytics</a>
                  <a
                    class="text-white block px-2 py-3 py-md-0"
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
import LazyHydrate from 'vue-lazy-hydration'
import { feed, domain } from '~/plugins/rss'

import { crispLoader } from '~/plugins/crisp.client'
export default {
  components: {
    ListItem: () => import('~/components/ListItem.vue'),
    LazyHydrate
  },
  async asyncData ({ params, $config }) {
    const items = await feed($config)
    return { episodes: items }
  },
  data () {
    return {
      sizeHead: '100vh',
      image: {
        src: require('~/assets/cover-im@0.5x.png'),
        error: require('~/assets/cover-im_user.png'),
        loading: require('~/assets/cover-im_empty.png')
      },
      loadingImg: require('~/assets/cover-im_empty.png'),
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
    this.setSizeHead()
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
