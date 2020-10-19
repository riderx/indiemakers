<template>
  <LazyHydrate when-idle>
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
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="w-100 img-fluid border-10 border-light"
                  :alt="title"
                >
              </div>
              <div class="col-12 d-block d-sm-none text-white px-0">
                <vue-plyr v-if="showAudio">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
              <div class="col-12 pt-3 d-block d-sm-none text-white">
                <h3>{{ title }}</h3>
              </div>
            </div>
            <div v-if="!loading" class="custom-scroll fix-marging border-5 px-2 border-light border-right-0" :style="{ height: sizeHead }">
              <div class="px-1 px-md-5 pt-3 text-light" v-html="content" />
            </div>
            <div v-if="!loading" class="row bg-primary py-4 d-block d-md-none">
              <div class="col-12 px-1 text-center">
                <button
                  v-tooltip="'Ecoute sur ta plateforme préféré'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                  @click="listen()"
                >
                  🎧 Ecouter1
                </button>
                <button
                  v-tooltip="'Noter l\'épisode'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  v-tooltip="'Partage sur twitter'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  v-tooltip="'Rejoin nous'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg bnt-block text-white m-1 m-md-3 px-4"
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
              </div>
            </div>
          </div>
          <div v-if="!loading" class="col-12 col-md-6 text-center d-none d-md-block">
            <div class="row align-items-center">
              <div class="col-12 offset-md-1 col-md-10 px-md-3 pt-0">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="w-100 img-fluid border-10 border-light"
                  alt="Logo person"
                >
              </div>
              <div class="col-12 offset-md-1 col-md-10 px-md-3 pt-0">
                <vue-plyr v-if="showAudio">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
              <div class="col-12 px-md-5 pt-1 pt-md-3">
                <button
                  v-tooltip="'Ecoute sur ta plateforme préféré !'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="listen()"
                >
                  🎧 Ecoute
                </button>
                <button
                  id="rtp-button"
                  v-tooltip="'Note l\'épisode pour soutenir le podcast'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  v-tooltip="'Partager via twitter'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  v-tooltip="'Commence à gagner ta vie sur internet'"
                  type="button"
                  class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modals :ep-gui="this.$route.params.id" :maker="twitter.name" />
    </div>
  </LazyHydrate>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { feed } from '~/plugins/rss'
const linkTwitterRe = /Son Twitter : <a href="(?<link>.*)">(?<name>.*)<\/a>/g
const linkInstagramRe = /Son Instagram : a href="(?<link>.*)">(?<name>.*)<\/a>/g

export default {
  components: {
    LazyHydrate,
    Modals: () => import('~/components/Modals.vue')
  },
  async fetch () {
    const res = await feed()
    if (res && res.items) {
      res.items.some((element) => {
        if (element.guid === this.$route.params.id) {
          this.title = element.title
          this.content = element.content
          this.twitter = this.findTw(this.content)
          this.insta = this.findInst(this.content)
          this.preview = this.previewText(element.contentSnippet)
          this.image.src = element.itunes.image
          this.audio = element.enclosure.url
          return true
        }
        return false
      })
      if (this.title === '') {
        this.$router.push('/')
      }
      this.loading = false
      // this.setSizeHead()
    }
  },
  data () {
    return {
      loading: true,
      showAudio: false,
      timeoutModal: null,
      title: '',
      twitter: { name: null, link: null },
      instagram: { name: null, link: null },
      preview: '',
      sizeHead: '100vh',
      sendToDB: '',
      content: '',
      image: {
        src: '',
        error: require('~/assets/cover-im_user.png'),
        loading: require('~/assets/cover-im_empty.png')
      },
      audio: ''
    }
  },
  destroyed () {
    if (this.timeoutModal) {
      clearTimeout(this.timeoutModal)
    }
  },
  mounted () {
    window.RTP_CONFIG = { link: 'imf', mode: 'button' }
    this.setSizeHead()
    if (!this.$fetchState.pending) {
      this.postEp(this.$route.params.id)
    }
    setTimeout(() => {
      this.showAudio = true
    }, 2000)
    this.timeoutModal = setTimeout(() => {
      this.showRandomModal()
    }, 15000)
  },
  methods: {
    showRandomModal () {
      const rand = this.getRandomInt(100)
      let modalName = 'upgrade'
      switch (true) {
        case (rand < 25 && !window.localStorage.getItem('emailForNewletter')):
          modalName = 'join'
          break
        case (rand < 50 && !window.localStorage.getItem('emailForNewletter')):
          modalName = 'ebook'
          break
        case (rand < 70):
          modalName = 'share'
          break
        case (rand < 90):
          modalName = 'rate'
          break
        case (rand < 95):
          modalName = 'listen'
          break
      }
      this.$modal.show(modalName)
    },
    getRandomInt (max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    async postEp (gui) {
      // console.log('postEP', gui)
      const ep = {
        udi: gui,
        title: this.title,
        preview: this.preview,
        image: this.image.src,
        content: this.content
      }
      if (this.instagram) {
        ep.instagram = this.instagram
      }
      if (this.twitter) {
        ep.twitter = this.twitter
      }
      try {
        await this.$firebase
          .firestore()
          .collection('episodes')
          .doc(gui)
          .set(ep)
      } catch {
        return null
      }
    },
    tweetIt () {
      const linkEp = `${process.env.domain}/episode/${this.epGui}`
      const tweet = `J'écoute le podcast @${process.env.handler} avec ${this.twitter.name} ${linkEp}`
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    },
    joinUs () {
      this.$modal.show('join')
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
    removeEmoji (str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    },
    listen () {
      this.$modal.show('listen')
    },
    bmc () {
      window.open(`https://www.buymeacoffee.com/${process.env.handler}`, '_blank')
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
        { hid: 'description', name: 'description', content: this.removeEmoji(this.preview) },
        { hid: 'og:title', property: 'og:title', content: this.removeEmoji(this.title) },
        { hid: 'og:description', property: 'og:description', content: this.removeEmoji(this.preview) },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.removeEmoji(this.title) },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/jpg' },
        { hid: 'og:image', property: 'og:image', content: this.image.src },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
        { hid: 'og:audio', property: 'og:audio', content: this.audio },
        { hid: 'og:audio:type', property: 'og:audio:type', content: 'audio/mp3' }
      ]
    }
  }
}
</script>

<style scoped>

</style>
