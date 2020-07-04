<template>
  <div id="episodes">
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5">
          <div id="header" class="row bg-primary border-10 border-light py-1 py-md-4">
            <div class="col col-md-8 pt-3 px-0 text-white text-center">
              <h1>🎙Episodes</h1>
            </div>
            <div class="col-4 pt-1 pt-md-2 text-white">
              <button
                v-tooltip="'Aide moi a trouver les prochain invités'"
                type="button"
                class="btn btn-primary border-5 border-light btn-lg text-light px-3 px-md-4 display-1"
                @click="openAdd()"
              >
                Makers Hunt
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
            class="custom-scroll border-5 px-2 border-light border-right-0"
            :style="{ height: heightDiv }"
          >
            <div
              v-for="episode in episodes"
              :key="episode.guid"
              :class="'row bg-primary text-white py-3 border-bottom align-items-center ' + episode.guid"
              @click="openEp(episode.guid)"
            >
              <div class="offset-4 offset-md-0 col-4 order-1 order-md-2 pr-0 pr-md-5 pb-3 pb-md-0">
                <img
                  :src="episode.itunes.image"
                  class="w-100 w-md-75 img-fluid border-5 border-light"
                  alt="Logo person"
                >
              </div>
              <div class="col-12 col-md-6 order-2 pl-2 pl-md-0 order-md-2 text-center text-md-left">
                <h3>{{ episode.title }}</h3>
              </div>
              <div class="col-3 col-md-2 order-3 pl-0 d-none d-md-block">
                <button
                  v-tooltip="'Ecouter l\'épisode'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white px-3 px-md-4 py-3 h1"
                >
                  <i class="fas fa-caret-circle-right fa-2x" />
                </button>
              </div>
              <div class="col-12 px-0 px-md-5 pt-1 pt-md-3 order-3">
                <p class="text-center text-md-left px-3 px-md-0">
                  {{ previewText(episode.contentSnippet) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="content" class="col-12 col-md-6 pt-md-0 px-md-5 text-white">
          <div class="row">
            <div class="col-md-3 offset-3 offset-md-0 col-6 py-3 pt-md-0 px-3 pl-md-0 pr-md-5">
              <img class="img-fluid border-10 border-light" alt="IM COVER" :src="image">
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

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { feed } from '../plugins/rss'
// import '~/plugins/global.js'

export default {
  async fetch () {
    const res = await feed()
    // eslint-disable-next-line no-console
    // console.log(res)
    if (res && res.items) {
      this.feed = res
      this.episodes = res.items
      this.loading = false
    }
  },
  data () {
    return {
      loading: true,
      sizeHead: 200,
      image: require('~/assets/cover-imf@0.5x.png'),
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
  computed: {
    heightDiv () {
      if (this.sizeHead === 0) {
        return 0
      }
      return `calc(${this.sizeHead}px)`
    }
  },
  mounted () {
    this.setSizeHead()
  },
  methods: {
    removeAccent (str) {
      return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
    },
    goMakers () {
      this.$router.push('/makers')
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
      if (document.getElementById('content')) {
        this.sizeHead = document.getElementById('content').offsetHeight
      }
    }
  }
}
</script>

<style scoped>

.top {
  top: 0;
}
::-webkit-scrollbar {
  width: 10px;
}

.custom-scroll {
  overflow-y: scroll;
  position: absolute;
  overflow-x: hidden;
  /* height: 600px; */
  margin-left: -15px;
  margin-right: 0px;
}
@media screen and (max-width: 768px) {
.custom-scroll {
    position: inherit;
    margin-right: -15px;
  }
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #df99d8;
}

.fit-content {
  width: fit-content;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 39, 155, 1) !important;
}
</style>
