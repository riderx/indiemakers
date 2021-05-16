<template>
  <div>
    <div id="episodes">
      <div class="container w-full px-0 mx-auto">
        <div class="flex flex-wrap w-full">
          <div class="w-full md:w-1/2 md:px-4">
            <div
              id="header-eps"
              class="flex flex-wrap w-full py-1 border-8 border-white py-md-2"
            >
              <div class="flex-grow px-0 py-2 text-center text-white">
                <p class="text-3xl md:text-4xl font-indie">🎙 Episodes</p>
              </div>
            </div>
            <div
              id="scrollable"
              class="
                flex flex-wrap
                w-full
                overflow-hidden
                border-4 border-white
                md:h-78
                md:overflow-y-scroll
                md:custom-scroll
              "
            >
              <NuxtLink
                v-for="episode in episodes"
                :key="episode.id"
                :to="`/episode/${episode.id}`"
                class="w-full text-white border-b align-items-top"
              >
                <ListItem
                  class="w-full"
                  :title="episode.title"
                  :date="episode.date"
                  :preview="episode.preview"
                  :image="episode.itunes.image"
                />
              </NuxtLink>
            </div>
          </div>
          <div
            id="content"
            class="w-full px-4 text-white md:w-1/2 pt-md-0 px-md-5"
          >
            <div class="flex flex-wrap">
              <div class="w-full mb-3 md:w-1/5 offset-3 offset-md-0">
                <img
                  width="100%"
                  height="100%"
                  class="
                    w-1/2
                    h-auto
                    mx-auto
                    my-10
                    border-white
                    md:m-0
                    md:w-4/5
                  "
                  alt="IM COVER"
                  :src="image"
                />
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
              <div class="pt-3 text-sm">
                <p class="pb-2">
                  Par
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://twitter.com/martindonadieu"
                    >Martin DONADIEU</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { feed } from '~/services/rss'
import { crispLoader } from '~/services/crisp.client'

export default Vue.extend({
  components: {
    ListItem: () => import('~/components/ListItem.vue'),
  },
  async asyncData({ $config }) {
    const items = await feed($config)
    return { episodes: items }
  },
  data() {
    return {
      show_loader: false,
      sizeHead: '100vh',
      // https://ik.imagekit.io/gyc0uxoln1/indiemakers/cover-im_0.5x_5ozFHlEvg.png
      image:
        'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg',
      // image: 'v1621019061/indiemakers/cover-im_0.5x_5ozFHlEvg.png',
      episodes: [],
      title: '🚀Le podcast des entrepreneurs indépendant',
      messages: [
        "J'échange avec ceux qui ont su transformer leurs idées en business florissant.",
        'Au-delà des belles histoires, nous décryptons leur passé, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables en indépendant.',
        'J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur projet profitable.',
        'Un épisode tous les 15 jours',
      ],
    }
  },
  head() {
    return {
      title: this.removeEmoji(this.title),
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        {
          hid: 'description',
          name: 'description',
          content: this.removeEmoji(this.messages[0]),
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.removeEmoji(this.title),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.removeEmoji(this.messages[0]),
        },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/png',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg`,
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: `https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg`,
        },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
      ],
    }
  },
  beforeMount() {
    window.addEventListener(
      'scroll',
      () => {
        crispLoader()
      },
      { capture: true, once: true, passive: true }
    )
  },
  mounted() {
    // this.setSizeHead()
  },
  methods: {
    joinUs() {
      this.$modal.show('join')
    },
    removeEmoji(str) {
      return str.replace(
        /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
        ''
      )
    },
    removeAccent(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
    },
    nextEpisode() {
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2019, 10, 19)
      const now = new Date()
      const diffDays = Math.round(Math.abs((firstDate - now) / oneDay))
      const nextEp = 14 - (diffDays % 14)
      return nextEp !== 14 ? `${nextEp} jours` : 'DEMAIN 10 heures'
    },
    setSizeHead() {
      if (
        process.client &&
        document.getElementById('header-eps') &&
        document.getElementById('header') &&
        document.getElementById('content') &&
        document.getElementById('content')?.offsetWidth !== window.innerWidth
      ) {
        const headerEpsSize =
          document.getElementById('header-eps')?.offsetHeight || 0
        const headerSize =
          document.getElementById('header-eps')?.offsetHeight || 0
        const size = `${headerEpsSize + headerSize + 5}px`
        this.sizeHead = `calc(100vh - ${size})`
      } else {
        this.sizeHead = 'auto'
      }
    },
  },
})
</script>
