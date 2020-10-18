<template>
  <LazyHydrate when-idle>
    <div id="episodes">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 offset-xl-1 col-xl-5">
            <div id="header-eps" class="row bg-primary border-10 border-light py-1 py-md-4">
              <div class="col pt-3 px-0 text-white text-center">
                <h1>🎙 Episodes</h1>
              </div>
            </div>
            <div v-if="loading" class="row bg-white px-3">
              <div class="col-12 p-5 text-center">
                <div
                  class="spinner-grow text-primary"
                  style="width: 6rem; height: 6rem;"
                  role="status"
                >
                  <span class="sr-only">Chargement...</span>
                </div>
              </div>
            </div>
            <div
              v-if="!loading"
              id="scrollable"
              class="custom-scroll fix-marging border-5 px-2 border-light border-right-0"
              :style="{ height: sizeHead }"
            >
              <div
                v-for="episode in episodes"
                :key="episode.guid"
                :class="'row cursor-pointer bg-primary text-white py-2 py-md-0 border-bottom align-items-top ' + episode.guid"
                @click="openEp(episode.guid)"
              >
                <div class="offset-4 offset-md-0 col-4 order-1 order-md-2 px-0 py-3 py-md-0">
                  <img
                    v-lazy="getImgObj(episode.itunes.image)"
                    width="100%"
                    height="100%"
                    :src="loadingImg"
                    class="w-100 w-md-75 img-fluid border-5 border-light"
                    :alt="'Cover ' + episode.title"
                  >
                </div>
                <div class="col-12 col-md-8 order-2 p-2 order-md-2 text-center text-md-left">
                  <h3>{{ episode.title }}</h3>
                  <p
                    v-if="episode.social"
                    class="text-success fit-content cursor-pointer mb-0 d-none d-md-block"
                  >
                    {{ episode.social.name }}
                  </p>
                  <p class="text-center text-md-left px-3 px-md-0 d-none d-md-block">
                    {{ episode.preview }}
                  </p>
                </div>
                <div class="col-12 px-0 px-md-5 pt-1 pt-md-3 order-3 d-block d-md-none">
                  <p
                    v-if="episode.social"
                    class="text-success text-center text-md-left mb-0"
                  >
                    {{ episode.social.name }}
                  </p>
                  <p class="text-center text-md-left px-3 px-md-0">
                    {{ episode.preview }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div id="content" class="col-12 col-md-6 pt-md-0 px-md-5 text-white">
            <div class="row">
              <div class="col-md-2 offset-3 offset-md-0 col-6 py-3 pt-md-0 px-3 pl-md-0">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="img-fluid border-10 border-light"
                  alt="IM COVER"
                  :src="loadingImg"
                >
              </div>
              <div class="col-12 col-md-9 text-center text-sm-left">
                <h1 class="pb-2">
                  {{ title }}
                </h1>
              </div>
              <div class="col-12 py-1 py-md-3 text-center text-sm-left">
                <h4>Prochain episode dans {{ nextEpisode() }} </h4>
              </div>
              <div class="col-12 pt-3 text-center text-sm-left">
                <div v-for="(message, index) in messages" :key="`ep-${index}`">
                  <p class="pb-0">
                    {{ message }}
                  </p>
                </div>
              </div>
              <div class="col-12 pt-3 text-center">
                <button
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-light px-4 h1"
                  @click="openAdd()"
                >
                  👉 Découvre les meilleurs Indie makers Fr
                </button>
              </div>
              <div class="col-12 pt-3">
                <p>Par <a rel="noreferrer" target="_blank" href="https://twitter.com/martindonadieu">Martin DONADIEU</a></p>
                <p>Ici pas de cookie, juste de l'<a rel="noreferrer" target="_blank" href="https://plausible.io/indiemakers.fr">Open data</a> qui te respecte </p>
                <p><a rel="noreferrer" target="_blank" href="/tools">Mes outils</a> quotidiens pour gerer mes projets !</p>
              </div>
              <div class="col-12 pt-3 pb-3 px-md-3 order-3 text-white text-center text-sm-left">
                <h5>Mes autres projets:</h5>
                <div class="d-flex flex-column flex-md-row">
                  <a
                    class="text-white d-block px-2 py-3 py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://forgr.ee"
                  >Forgr.ee | Startup studio</a>
                  <a
                    class="text-white d-block px-2 py-3 py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://bewise.love"
                  >Bewise | Une citation par jour</a>
                  <a
                    class="text-white d-block px-2 py-3 py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://apps.apple.com/us/app/captime-crossfit-timer/id1369288585"
                  >Captime | Crossfit timer</a>
                  <a
                    class="text-white d-block px-2 py-3 py-md-0"
                    target="_blank"
                    rel="noreferrer"
                    href="https://lkstats.web.app/welcome"
                  >Lk stats | Linkedin analytics</a>
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
import { crispLoader } from '../plugins/crisp.client'
const linkTwitterRe = /Son Twitter : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkInstagramRe = /Son Instagram : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
export default {
  components: {
    Modals: () => import('~/components/Modals.vue'),
    LazyHydrate
  },
  async fetch () {
    const res = await feed()
    // eslint-disable-next-line no-console
    // console.log(res)
    if (res && res.items) {
      this.feed = res
      this.episodes = res.items
      this.episodes.forEach((element) => {
        const preview = this.previewText(element.contentSnippet)
        element.preview = preview
        const twitter = this.findTw(element.content)
        const insta = this.findInst(element.content)
        if (twitter && twitter.name) {
          element.social = twitter
        } else if (insta && twitter.name) {
          element.social = insta
        }
        // console.log('element', element)
      })
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
      feed: null,
      title: '🚀Le 1er podcast qui t\'aide à vivre de tes projets',
      messages: [
        'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en business florissant.',
        'Au-delà des success-story, nous décryptons leur histoire, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables.',
        'J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur business pérenne.',
        'Qui que tu sois, dans ce podcast tu apprendras à devenir un Indie Maker !',
        'Un épisode tous les 15 jours'
      ]
    }
  },
  beforeMount () {
    window.addEventListener('scroll', () => {
      crispLoader()
    }, { capture: true, once: true, passive: true })
  },
  mounted () {
    this.setSizeHead()
  },
  methods: {
    joinUs () {
      this.$modal.show('join')
    },
    removeEmoji (str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    },
    getImgObj (img) {
      return {
        src: img,
        error: require('~/assets/cover-im_user.png'),
        loading: require('~/assets/cover-im_empty.png')
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
      if (first.split(' ').length > 20) {
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
      if (process.client && document.getElementById('header-eps') && document.getElementById('header') && document.getElementById('content') && document.getElementById('content').offsetWidth !== window.innerWidth) {
        const size = `${document.getElementById('header-eps').offsetHeight + document.getElementById('header').offsetHeight + 5}px`
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
        { hid: 'og:url', property: 'og:url', content: `${process.env.domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        { hid: 'description', name: 'description', content: this.removeEmoji(this.messages[0]) },
        { hid: 'og:title', property: 'og:title', content: this.removeEmoji(this.title) },
        { hid: 'og:description', property: 'og:description', content: this.removeEmoji(this.messages[0]) },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>

<style scoped>

</style>
