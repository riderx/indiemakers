<template>
  <div id="emission">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 offset-xl-1 col-xl-5">
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
          <div id="header-ep" class="row bg-primary border-10 border-light">
            <div  class="col-12 pt-md-3 text-white text-center">
              <h1 class="d-none d-sm-block">
                {{ title }}
              </h1>
            </div>
            <div class="col-12 d-block d-sm-none px-0">
              <img
                :src="image"
                class="w-100 img-fluid border-10 border-light"
                :alt="title"
              >
            </div>
            <div class="col-12 d-block d-sm-none text-white px-0">
              <vue-plyr>
                <audio>
                  <source :src="audio" type="audio/mp3">
                </audio>
              </vue-plyr>
            </div>
            <div class="col-12 pt-3 d-block d-sm-none text-white">
              <h3>{{ title }}</h3>
            </div>
          </div>
          <div v-if="!loading" class="row">
            <div class="custom-scroll bg-primary border-5 border-right-0 border-light text-white px-md-5 pt-3 w-100" :style="{ height: sizeHead }">
              <div v-html="content" />
            </div>
          </div>
          <div v-if="!loading" class="row bg-primary py-4 d-block d-md-none">
            <div class="col-12 px-1 px-md-3 text-center">
              <button
                v-tooltip="'Ecouter'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                @click="listen()"
              >
              <fa :icon="['fas', 'headphones']" /> Ecouter
              </button>
              <button
                v-tooltip="'Noter l\'épisode'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                @click="rate()"
              >
                <fa :icon="['fas', 'heart']" />
                Noter
              </button>
              <button
                v-tooltip="'Partager via twitter'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                @click="tweetIt()"
              >
                <fa :icon="['fas', 'pizza-slice']" />
                Partager
              </button>
              <button
                v-tooltip="'buymeacoffee'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                @click="bmc()"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  class="bmc"
                  alt="Buy me a coffee"
                > Soutenir
              </button>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="col-12 col-md-6 text-center d-none d-md-block">
          <div class="row align-items-center">
            <div class="col-12 offset-md-1 col-md-10 px-md-3 pt-0">
              <img
                :src="image"
                class="w-100 img-fluid border-10 border-light"
                alt="Logo person"
              >
            </div>
            <div class="col-12 offset-md-1 col-md-10 px-md-3 pt-0">
              <vue-plyr>
                <audio>
                  <source :src="audio" type="audio/mp3">
                </audio>
              </vue-plyr>
            </div>
            <div class="col-12 px-md-5 pt-1 pt-md-3">
              <button
                v-tooltip="'Ecouter'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                @click="listen()"
              >
                <fa :icon="['fas', 'headphones']" />
                Ecouter
              </button>
              <button
                v-tooltip="'Noter l\'épisode'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                @click="rate()"
              >
                <fa :icon="['fas', 'heart']" />
                Noter
              </button>
              <button
                v-tooltip="'Partager via twitter'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                @click="tweetIt()"
              >
                <fa :icon="['fas', 'pizza-slice']" />
                Partager
              </button>
              <button
                v-tooltip="'buymeacoffee'"
                type="button"
                class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                @click="bmc()"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  alt="Buy me a coffee"
                  class="bmc"
                > Soutenir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
        <modal height="auto" adaptive name="copied">
      <div class="container-fluid">
        <div class="row bg-primary border-10 border-light">
          <div class="col-12">
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 pb-3 text-white text-center">
                <p>Lien Copié</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="listen">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div v-if="!loading" class="row bg-primary border-10 border-light py-4">
              <div class="col-12 pt-1 px-1 px-md-3 text-white text-center">
                <h3>Disponible sur :</h3>
              </div>
              <div class="col-12 pt-1 px-1 px-md-3 text-center">
                <button
                  v-tooltip="'Ecouter l\'épisode sur spotify'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://open.spotify.com/show/6Agf3YmcAdNx4tQMJVoRQg')"
                >
                  Spotify
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Anchor'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://anchor.fm/indiemakers')"
                >
                  Anchor
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Deezer'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://deezer.com/show/689072')"
                >
                  Deezer
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur PocketCast'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://pca.st/yjcdxg09')"
                >
                  Pocket cast
                </button>
                <button
                  v-tooltip="'Copier le flux RSS'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="copyTextToClipboard('https://anchor.fm/s/414d1d4/podcast/rss')"
                >
                  RSS
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Apple podcast'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://podcasts.apple.com/fr/podcast/indie-maker-fr/id1488437972')"
                >
                  Apple
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Breaker podcast'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://www.breaker.audio/indie-maker-france')"
                >
                  Breaker
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Google podcast'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://podcasts.google.com/?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy80MTRkMWQ0L3BvZGNhc3QvcnNz')"
                >
                  Google
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Radio Public'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://radiopublic.com/indie-maker-france-60NJEy')"
                >
                  Radio Public
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Overcast'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://overcast.fm/itunes1488437972/indie-maker-france')"
                >
                  Overcast
                </button>
                <button
                  v-tooltip="'Ecouter l\'épisode sur Castro'"
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                  @click="listenExternal('https://castro.fm/podcast/e3350808-2fc9-481e-a449-a7abe035002e')"
                >
                  Castro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="copied">
      <div class="container-fluid">
        <div class="row https://anchor.fm/s/414d1d4/podcast/rss">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2 border-10 border-light">
              <div class="col-12 pt-2 text-white text-center">
                <h1>✅C'est fait !</h1>
              </div>
            </div>
            <div class="row bg-primary pt-4 border-10 border-light">
              <div class="col-12 pt-2 text-white text-center">
                <p>Lien Copié, je sais pas trop ce que tu compte en faire mais enjoy, c'est tout❤️</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg btn-block text-white px-4 h1"
                  @click="$modal.hide('copied')"
                >
                  😎Cool
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import stripHtml from 'string-strip-html'
import { feed } from '~/plugins/rss'

export default {
  async fetch () {
    const res = await feed()
    if (res && res.items) {
      res.items.forEach((element) => {
        if (element.guid === this.$route.params.id) {
          this.title = element.title
          this.content = element.content
          this.image = element.itunes.image
          this.audio = element.enclosure.url
        }
      })
      this.loading = false
      this.setSizeHead()
    }
  },
  data () {
    return {
      loading: true,
      title: '',
      sizeHead: '100vh',
      content: '',
      image: '',
      audio: ''
    }
  },
  methods: {
    setSizeHead () {
      if (process.client && document.getElementById('header-ep') && document.getElementById('header')) {
        const size = `${document.getElementById('header-ep').offsetHeight + document.getElementById('header').offsetHeight}px`
        console.log('size', size)
        this.sizeHead = `calc(100vh - ${size})`
      }
    },
    toEmbed (url) {
      return url.replace('/episodes/', '/embed/episodes/')
    },
    rate () {
      window.open('https://ratethispodcast.com/imf', '_blank')
    },
    listenExternal (url) {
      window.open(url, '_blank')
    },
    goEpisodes () {
      this.$router.push('/episodes')
    },
    fallbackCopyTextToClipboard (text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed' // avoid scrolling to bottom
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        if (!document.execCommand('copy')) {
          console.error('unsuccessful')
        } else {
          this.$modal.hide('listen')
          this.$modal.show('copied')
        }
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      }
      document.body.removeChild(textArea)
    },
    listen () {
      this.$modal.show('listen')
    },
    copyTextToClipboard (text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text)
        return
      }
      navigator.clipboard.writeText(text).then(
        () => {
          // console.log("Async: Copying to clipboard was successful!");
          this.$modal.hide('listen')
          this.$modal.show('copied')
        },
        (err) => {
          console.error('Async: Could not copy text: ', err)
        }
      )
    },
    bmc () {
      window.open('https://www.buymeacoffee.com/indiemakersfr', '_blank')
    },
    tweetIt () {
      const linkEp = `https://indiemakers.fr/#/episode/${this.$route.params.id}`
      const tweet = `J'écoute le podcast ${this.person.title} le podcast @indiemakersfr 🚀 ${linkEp}`
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        // hid est utilisé comme identifiant unique. N'utilisez pas `vmid` car ça ne fonctionnera pas
        { hid: 'description', name: 'description', content: stripHtml(this.content) },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:image:alt', name: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', name: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', name: 'og:image', content: this.image },
        { hid: 'og:image:secure_url', name: 'og:image:secure_url', content: this.image },
        { hid: 'og:image:width', name: 'og:image:width', content: 400 },
        { hid: 'og:image:height', name: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>

<style scoped>

</style>
