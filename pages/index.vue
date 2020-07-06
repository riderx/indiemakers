<template>
  <div id="episodes">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 offset-xl-1 col-xl-5">
          <div id="header-eps" class="row bg-primary border-10 border-light py-1 py-md-4">
            <div class="col col-md-9 pt-3 px-0 text-white text-center">
              <h1>🎙Episodes</h1>
            </div>
            <div class="col-4 col-md-3 pt-1 pt-md-2 text-white">
              <button
                v-tooltip="'Aide moi a trouver les prochain invités'"
                aria-label="Maker hunt"
                type="button"
                class="btn btn-primary border-5 border-light btn-lg text-light px-3 px-md-4 display-1"
                @click="openAdd()"
              >
                <fa :icon="['fab', 'product-hunt']" class="fa-2x" />
              </button>
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
            class="custom-scroll fix-marging border-5 px-2 border-light border-right-0"
            :style="{ height: sizeHead }"
          >
            <div
              v-for="episode in episodes"
              :key="episode.guid"
              :class="'row cursor-pointer bg-primary text-white py-2 py-md-3 border-bottom align-items-top ' + episode.guid"
              @click="openEp(episode.guid)"
            >
              <div class="offset-4 offset-md-0 col-4 order-1 order-md-2 pr-0 pr-md-3 pb-3 pb-md-0">
                <img
                  v-lazy="getImgObj(episode.itunes.image)"
                  :src="loadingImg"
                  class="w-100 w-md-75 img-fluid border-5 border-light"
                  :alt="'Cover ' + episode.twitter"
                >
              </div>
              <div v-tooltip="'Ecouter l\'épisode'" class="col-12 col-md-8 order-2 pl-2 pl-md-0 order-md-2 text-center text-md-left">
                <h3>{{ episode.title }}</h3>
                <p
                  class="text-success fit-content cursor-pointer"
                >
                  @{{ episode.twitter }}
                </p>
                <p class="text-center text-md-left px-3 px-md-0 d-none d-md-block">
                  {{ episode.preview }}
                </p>
              </div>
              <div class="col-12 px-0 px-md-5 pt-1 pt-md-3 order-3 d-block d-md-none">
                <p class="text-center text-md-left px-3 px-md-0">
                  {{ episode.preview }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="content" class="col-12 col-md-6 pt-md-0 px-md-5 text-white">
          <div class="row">
            <div class="col-md-3 offset-3 offset-md-0 col-6 py-3 pt-md-0 px-3 pl-md-0 pr-md-5">
              <img v-lazy="image" class="img-fluid border-10 border-light" alt="IM COVER" :src="loadingImg">
            </div>
            <div class="col-12 col-md-9 text-center text-sm-left">
              <h1 class="pb-2">
                {{ title }}
              </h1>
            </div>
            <div class="col-12 py-1 py-md-3 text-center text-sm-left">
              <h3>Prochain episode dans : {{ nextEpisode() }} !</h3>
            </div>
            <div class="col-12 pt-3 text-center text-sm-left">
              <div v-for="(message, index) in messages" :key="`ep-${index}`">
                <p class="pb-0">
                  {{ message }}
                </p>
              </div>
              <p class="pt-5">
                {{ banner }}
              </p>
              <p>Par <b>Martin DONADIEU</b></p>
            </div>
            <div class="col-12 pt-5 px-md-3 order-3 text-white text-center text-sm-left">
              <h5>Mes autres projets:</h5>
              <div class="d-flex flex-column flex-md-row">
                <a
                  class="text-white d-block px-2 py-3 py-md-0"
                  target="_blank"
                  rel="noreferrer"
                  href="https://forgr.ee"
                >Forgr.ee | Agence de creation de MVP pour entrepreneurs</a>
                <a
                  class="text-white d-block px-2 py-3 py-md-0"
                  target="_blank"
                  rel="noreferrer"
                  href="https://bewise.love"
                >Bewise | Une citation par jour simple et bienveillante.</a>
                <a
                  class="text-white d-block px-2 py-3 py-md-0"
                  target="_blank"
                  rel="noreferrer"
                  href="https://apps.apple.com/us/app/captime-crossfit-timer/id1369288585"
                >Captime | Crossfit timer</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { feed } from '../plugins/rss'
const linkTwitter = 'Son Twitter : <a href="https://twitter.com/'
const linkTwitterRe = /Son Twitter : <a href="https:\/\/twitter\.com\/(.*)"/g

export default {
  async fetch () {
    const res = await feed()
    // eslint-disable-next-line no-console
    // console.log(res)
    if (res && res.items) {
      this.feed = res
      this.episodes = res.items
      this.episodes.forEach((element) => {
        const twitter = this.findTw(element.content)
        const preview = this.previewText(element.contentSnippet)
        element.preview = preview
        if (twitter !== 'error') {
          element.twitter = twitter
        }
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
      title: '🚀Le 1er podcast francais qui aide les independants a vivre de leur business.',
      messages: [
        'Ici, tu trouveras des podcasts où j\'échange avec ceux qui ont su transformer leurs idées en en business florissant.',
        'Au-delà des success-story, nous décryptons leur histoire, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables.',
        'J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur business pérenne.',
        'Qui que tu sois, dans ce podcast tu apprendras à devenir un Indie Maker !',
        'Un épisode tous les 15 jours'
      ],
      banner:
        '#Independant, #Makers, #AutoFormation, #Productivite, #Business, #MRR'
    }
  },
  mounted () {
    this.setSizeHead()
  },
  methods: {
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
    openAccount (name) {
      window.open(`https://twitter.com/${name}`, '_blank')
    },
    findTw (text) {
      const found = text.match(linkTwitterRe)
      let name = 'error'
      if (found && found.length > 0) {
        name = found[0].replace(linkTwitter, '')
        name = name.replace('"', '')
      }
      return name
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
      this.$router.push(`/episode/${guid}`)
    },
    openAdd () {
      this.$router.push('/makers')
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
      title: this.title,
      meta: [
        { hid: 'og:image:alt', property: 'og:image:alt', content: 'Des idées profitables' },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: require('~/assets/cover-im@0.5x.png') },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: require('~/assets/cover-im@0.5x.png') },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>

<style scoped>

</style>
