<template>
  <LazyHydrate when-idle>
    <div id="emission">
      <div class="container mx-auto mx-auto">
        <div class="flex flex-wrap">
          <div class="w-1/62 xl:mx-1/6 xl:w-2/5 pr-4 pl-4">
            <div v-if="loading" class="flex flex-wrap bg-white px-3">
              <div class="w-1/62 p-5 text-center">
                <div
                  class="spinner-gflex flex-wrap text-blue"
                  style="width: 6rem; height: 6rem;"
                  role="status"
                >
                  <span class="">Chargement...</span>
                </div>
              </div>
            </div>
            <div id="header-title" class="flex flex-wrap bg-blue border-10 border-light">
              <div class="w-1/62 pt-md-3 text-white text-center">
                <h1 class="hidden sm:block">
                  {{ title }}
                </h1>
              </div>
              <div v-if="!loading" class="w-1/62 block sm:hidden px-0">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  :src="loadingImg"
                  class="w-full max-w-full h-auto border-10 border-light"
                  :alt="title"
                >
              </div>
              <div v-if="!loading" class="w-1/62 block sm:hidden text-white px-0">
                <vue-plyr v-if="showAudio" ref="plyr">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
              <div v-if="!loading" class="w-1/62 pt-3 block sm:hidden text-white">
                <h3>{{ title }}</h3>
              </div>
            </div>
            <div v-if="!loading" class="custom-scroll fix-marging border-5 px-2 border-light border-r-0" :style="{ height: sizeHead }">
              <div class="px-1 px-md-5 pt-3 text-grey-lightest" v-html="content" />
            </div>
            <div v-if="!loading" class="flex flex-wrap bg-blue py-4 block d-mhidden">
              <div class="w-1/62 px-1 text-center">
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
              </div>
            </div>
          </div>
          <div v-if="!loading" class="w-1/62 md:w-1/2 pr-4 pl-4 text-center hidden md:block">
            <div class="flex flex-wrap align-items-center">
              <div class="w-1/62 md:mx-1/6 md:w-1/6 pr-4 pl-40 px-md-3 pt-0">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="w-full max-w-full h-auto border-10 border-light"
                  alt="Logo person"
                >
              </div>
              <div class="w-1/62 md:mx-1/6 md:w-1/6 pr-4 pl-40 px-md-3 pt-0">
                <vue-plyr v-if="showAudio" ref="plyr2">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
              <div class="w-1/62 px-md-5 pt-1 pt-md-3">
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  id="rtp-button"
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
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
import { ep } from '~/plugins/rss'
export default {
  components: {
    LazyHydrate,
    Modals: () => import('~/components/Modals.vue')
  },
  async fetch () {
    const element = await ep(this.$route.params.id)
    if (element.error) {
      this.$router.push('/')
    }
    if (element) {
      this.title = element.title
      this.titleNoEmoji = element.title_no_emoji
      this.contentNoEmoji = element.content_no_emoji
      this.previewNoEmoji = element.preview_no_emoji
      this.content = element.content
      this.imageBig = element.image_big
      this.imageOptimized = element.image_optimized
      this.imageLoading = element.image_loading
      this.twitter = element.twitter
      this.instagram = element.instagram
      this.linkedin = element.linkedin
      this.audio = element.enclosure.url
      this.loading = false
    }
  },
  data () {
    return {
      loading: true,
      loadingImg: require('~/assets/cover-im_empty.png'),
      imageOptimized: null,
      imageLoading: null,
      titleNoEmoji: null,
      contentNoEmoji: null,
      previewNoEmoji: null,
      imageBig: null,
      playerSet: false,
      showAudio: false,
      timeoutPlayer: null,
      timeoutModal: null,
      title: '',
      twitter: { name: null, link: null },
      linkedin: { name: null, link: null },
      instagram: { name: null, link: null },
      preview: '',
      sizeHead: '100vh',
      content: '',
      audio: ''
    }
  },
  computed: {
    image () {
      return {
        src: this.imageBig,
        error: require('~/assets/cover-im_user.png'),
        loading: this.imageLoading
      }
    },
    player () {
      return this.$refs.plyr ? this.$refs.plyr.player : null
    },
    player2 () {
      return this.$refs.plyr2 ? this.$refs.plyr2.player : null
    }
  },
  destroyed () {
    if (this.timeoutModal) {
      clearTimeout(this.timeoutModal)
    }
    if (this.timeoutPlayer) {
      clearTimeout(this.timeoutPlayer)
    }
  },
  mounted () {
    window.RTP_CONFIG = { link: 'imf', mode: 'button' }
    this.setSizeHead()
    this.timeoutPlayer = setTimeout(() => {
      setTimeout(() => {
        this.showAudio = true
        if (!this.$fetchState.pending) {
          this.postEp(this.$route.params.id)
        }
        const currentTime = localStorage.getItem(this.$route.params.id)
        if (this.player) {
          this.player.on('play', () => {
            if (!this.playerSet) {
              this.player.currentTime = parseFloat(currentTime || 0)
              this.playerSet = true
            }
          })
          this.player.on('pause', () => {
            localStorage.setItem(this.$route.params.id, this.player.currentTime)
          })
        }
        if (this.player2) {
          this.player2.on('play', () => {
            if (!this.playerSet) {
              this.player2.currentTime = parseFloat(currentTime || 0)
              this.playerSet = true
            }
          })
          this.player2.on('pause', () => {
            localStorage.setItem(this.$route.params.id, this.player2.currentTime)
          })
        }
      }, 150)
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
        case (rand < 70 && !window.localStorage.getItem('emailForNewletter')):
          modalName = 'join'
          break
        case (rand < 80):
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
        image: this.imageOptimized,
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
          .db
          .ref(`episodes/${gui}`)
          .set(ep)
      } catch {
        return null
      }
    },
    tweetIt () {
      this.$modal.show('share')
    },
    joinUs () {
      this.$modal.show('join')
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
      this.$modal.show('rate')
    },
    listen () {
      this.$modal.show('listen')
    }
  },
  head () {
    return {
      title: this.titleNoEmoji,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${process.env.domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.titleNoEmoji },
        { hid: 'description', name: 'description', content: this.previewNoEmoji },
        { hid: 'og:title', property: 'og:title', content: this.titleNoEmoji },
        { hid: 'og:description', property: 'og:description', content: this.previewNoEmoji },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.titleNoEmoji },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/jpg' },
        { hid: 'og:image', property: 'og:image', content: this.imageOptimized },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
        { hid: 'og:audio', property: 'og:audio', content: this.audio },
        { hid: 'og:audio:type', property: 'og:audio:type', content: 'audio/mpeg' }
      ]
    }
  }
}
</script>
<style>
:root {
  --plyr-color-main: rgba(75, 39, 155, 1);
  --plyr-badge-border-radius: 0px;
}
hr {
    border-top: 10px solid rgba(255, 255, 255, 1);
}
</style>
