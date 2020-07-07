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
          <div id="header-title" class="row bg-primary border-10 border-light">
            <div class="col-12 pt-md-3 text-white text-center">
              <h1 class="d-none d-sm-block">
                {{ title }}
              </h1>
            </div>
            <div class="col-12 d-block d-sm-none px-0">
              <img
                v-lazy="getImgObj(image)"
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
          <!-- <div v-if="!loading" class="row"> -->
          <div v-if="!loading" class="custom-scroll fix-marging border-5 px-2 border-light border-right-0" :style="{ height: sizeHead }">
            <div class="px-1 px-md-5 pt-3 text-light" v-html="content" />
          </div>
          <!-- </div> -->
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
                v-lazy="getImgObj(image)"
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
    <client-only>
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
    </client-only>
  </div>
</template>

<script>
import stripHtml from 'string-strip-html'
import { feed } from '~/plugins/rss'
const linkTwitter = 'Son Twitter : <a href="https://twitter.com/'
const linkTwitterRe = /Son Twitter : <a href="https:\/\/twitter\.com\/(.*)"/g
// const linkTwitterEnd = '"'
// const linkTwitter = /Son Twitter : <a href="https:\/\/twitter\.com\/*"/
// const re = new RegExp(`${linkTwitter}*${linkTwitterEnd}`, 'g')

export default {
  async fetch () {
    console.log('full', this.$route.query.page)
    const res = await feed()
    if (res && res.items) {
      res.items.forEach((element) => {
        if (element.guid === this.$route.params.id) {
          this.title = element.title
          this.content = element.content
          this.tw = this.findTw(this.content)
          this.image = element.itunes.image
          this.audio = element.enclosure.url
        }
      })
      this.loading = false
      // this.setSizeHead()
    }
  },
  data () {
    return {
      loading: true,
      title: '',
      tw: '',
      sizeHead: '100vh',
      content: '',
      image: '',
      audio: ''
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
    findTw (text) {
      const found = text.match(linkTwitterRe)
      let name = 'error'
      if (found.length > 0) {
        name = found[0].replace(linkTwitter, '')
        name = name.replace('"', '')
      }
      return name
    },
    setSizeHead () {
      if (process.client && document.getElementById('header-title') && document.getElementById('header') && document.getElementById('header-title').offsetWidth !== window.innerWidth) {
        const size = `${document.getElementById('header-title').offsetHeight + document.getElementById('header').offsetHeight + 5}px`
        this.sizeHead = `calc(100vh - ${size})`
      } else {
        this.sizeHead = 'auto'
      }
    },
    rate () {
      window.open('https://ratethispodcast.com/imf', '_blank')
    },
    listenExternal (url) {
      window.open(url, '_blank')
    },
    removeEmoji (str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
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
      window.open(`https://www.buymeacoffee.com/${process.env.handler}`, '_blank')
    },
    tweetIt () {
      const linkEp = `${process.env.domain}/episode/${this.$route.params.id}`
      const tweet = `J'écoute le podcast @${process.env.handler} avec @${this.tw} ${linkEp}`
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    },
    unsecureUrl (url) {
      return url.replace('https://')
    },
    previewText (text) {
      let first = text.split(/[.!]+/)[0]
      if (first.split(' ').length > 20) {
        first = `${first.split(' ').splice(0, 17).join(' ')} ...`
      }
      return first
    }
  },
  head () {
    return {
      title: this.removeEmoji(this.title),
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${process.env.domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        { hid: 'description', name: 'description', content: this.previewText(this.removeEmoji(stripHtml(this.content))) },
        { hid: 'og:title', property: 'og:title', content: this.removeEmoji(this.title) },
        { hid: 'og:description', property: 'og:description', content: this.previewText(this.removeEmoji(stripHtml(this.content))) },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.removeEmoji(this.title) },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/jpg' },
        { hid: 'og:image', property: 'og:image', content: this.image },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
        { hid: 'og:audio', property: 'og:image:audio', content: this.audio },
        { hid: 'og:audio:type', property: 'og:image:audio:type', content: 'audio/mpeg' }
      ]
    }
  }
}
</script>

<style scoped>

</style>
