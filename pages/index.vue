<template>
  <LazyHydrate when-visible>
    <div id="episodes">
      <div class="container mx-auto">
        <div class="flex flex-wrap">
          <div class="lg:w-1/2 pr-4 pl-4">
            <div
              id="header-eps"
              class="flex flex-wrap bg-blue border-10 border-light py-1 py-md-4"
            >
              <div
                class="flex-grow pt-3 px-0 text-white text-center font-indie text-3xl"
              >
                <h1>🎙 Episodes</h1>
              </div>
            </div>
            <div v-if="loading" class="flex flex-wrap bg-white px-3">
              <div class="p-5 text-center">
                <div
                  class="spinner-gflex flex-wrap text-blue"
                  style="width: 6rem; height: 6rem"
                  role="status"
                >
                  <span class="">Chargement...</span>
                </div>
              </div>
            </div>
            <div
              v-if="!loading"
              id="scrollable"
              class="custom-scroll fix-marging border-5 border-light border-r-0"
              :style="{ height: sizeHead }"
            >
              <div
                v-for="episode in episodes"
                :key="episode.guid_fix"
                :class="
                  'flex flex-wrap cursor-pointer bg-blue text-white border-b align-items-top' +
                    episode.guid_fix
                "
                @click="openEp(episode.guid_fix)"
              >
                <ListItem :title="episode.title" :name="episode.social.name" :preview="preview" :image="episode.image_optimized" :loading-image="episode.image_loading" />
              </div>
            </div>
          </div>
          <div
            id="content"
            class="md:w-1/2 pr-4 pl-4 pt-md-0 px-md-5 text-white"
          >
            <div class="flex flex-wrap">
              <div
                class="md:w-1/5 pr-4 pl-4 offset-3 offset-md-0 w-1/2 py-3 pt-md-0 px-3 pl-md-0"
              >
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="max-w-full h-auto border-10 border-light"
                  alt="IM COVER"
                  :src="loadingImg"
                >
              </div>
              <div class="md:w-3/4 pr-4 pl-4 text-center text-sm-left">
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
                  class="border-4 border-white font-indie py-2 px-5"
                  @click="openAdd()"
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
                  Ici pas de cookie, juste de l'<a
                    rel="noreferrer"
                    target="_blank"
                    href="https://plausible.io/indiemakers.fr"
                  >Open data</a>
                  qui te respecte
                </p>
                <p class="pb-2">
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="/tools"
                  >Mes outils</a>
                  quotidiens pour gerer mes projets !
                </p>
                <p>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://amzn.to/3lXjALg"
                  >Mon Livre</a>
                  Lancer sa startup en indépendant, publié au éditions Broché
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
      <Modals />
    </div>
  </LazyHydrate>
</template>
<script>
import LazyHydrate from 'vue-lazy-hydration'
import { feed } from '../plugins/rss'
import { domain } from '../plugins/domain'

import { crispLoader } from '../plugins/crisp.client'
const linkTwitterRe = /Son Twitter : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkInstagramRe = /Son Instagram : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkLinkedinRe = /Son Linkedin : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
export default {
  components: {
    Modals: () => import('~/components/Modals.vue'),
    ListItem: () => import('~/components/ListItem.vue'),
    LazyHydrate
  },
  async fetch () {
    const items = await feed()
    if (items) {
      this.episodes = items
      this.loading = false
    }
  },
  data () {
    return {
      loading: true,
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
    goMakers () {
      this.$router.push('/makers')
    },
    findTw (text) {
      const founds = linkTwitterRe.exec(text)
      if (!founds || !founds.groups) {
        return { name: null, link: null }
      }
      return founds.groups
    },
    findLinkedin (text) {
      const founds = linkLinkedinRe.exec(text)
      if (!founds || !founds.groups) {
        return { name: null, link: null }
      }
      return founds.groups
    },
    findInst (text) {
      const founds = linkInstagramRe.exec(text)
      if (!founds || !founds.groups) {
        return { name: null, link: null }
      }
      return founds.groups
    },
    nextEpisode () {
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2019, 10, 19)
      const now = new Date()
      const diffDays = Math.round(Math.abs((firstDate - now) / oneDay))
      const nextEp = 14 - (diffDays % 14)
      // const nextEpDate = new Date();
      // nextEpDate.setHours(10, 0, 0);
      // nextEpDate.setDate(now.getDate() + nextEp);
      return nextEp !== 14 ? `${nextEp} jours` : 'DEMAIN 10 heures'
    },
    previewText (text) {
      let first = text.split(/[.!]+/)[0]
      if (first.split(' ').length > 30) {
        first = `${first.split(' ').splice(0, 17).join(' ')} ...`
      }
      return first
    },
    openEp (guid) {
      const id = encodeURIComponent(guid)
      this.$router.push(`/episode/${id}`)
    },
    openAdd () {
      this.$router.push('/makers_hunt')
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
        { hid: 'og:url', property: 'og:url', content: `${domain}${this.$route.fullPath}` },
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
        { hid: 'og:image', property: 'og:image', content: `${domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>
<style>
</style>
