<template>
  <LazyHydrate when-idle>
    <div id="emission">
      <div class="container mx-auto mx-auto px-0 w-full">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 md:px-4 text-white text-sm">
            <div v-if="loading" class="flex flex-wrap text-black bg-white w-full">
              <div class="p-5 text-center w-full">
                <span class="">Chargement...</span>
              </div>
            </div>
            <div
              id="header-title"
              class="flex flex-wrap justify-center pt-3 md:pb-1 bg-blue border-t-8 md:border-8 border-light"
            >
              <h1 class="font-indie text-3xl text-center">
                {{ title }}
              </h1>

              <div v-if="!loading" class="block sm:hidden px-0">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  :src="loadingImg"
                  class="w-full max-w-full h-auto border-t-8 md:border-8 border-light"
                  :alt="title"
                >
              </div>
              <div v-if="!loading" class="block sm:hidden text-white px-0">
                <vue-plyr v-if="showAudio" ref="plyr">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
            </div>
            <div
              v-if="!loading"
              class="custom-scroll fix-marging border-4 px-2 border-light rounded-none"
              :style="{ height: sizeHead }"
            >
              <div
                class="px-1 px-md-5 md:pt-3 text-grey-lightest"
                v-html="content"
              />
            </div>
            <div
              v-if="!loading"
              class="flex flex-wrap bg-blue py-4 block md:hidden"
            >
              <div class="px-1 text-center">
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-4 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-4 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-4 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-4 border-light py-3 px-4 text-xl leading-tight bnt-block text-white m-1 m-md-3 px-4"
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="!loading"
            class="lg:w-1/2 px-6 text-center hidden md:block"
          >
            <div class="flex flex-wrap flex-col align-items-center">
              <div class="w-11/12 flex flex-col">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="w-full max-w-full h-auto border-8 border-light"
                  alt="Logo person"
                >
                <vue-plyr v-if="showAudio" ref="plyr2">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
              <div
                class="flex justify-between pt-4 font-indie text-white text-lg w-10/12"
              >
                <button
                  type="button"
                  class="border-4 border-light px-3 pt-2 pb-1"
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  id="rtp-button"
                  type="button"
                  class="border-4 border-light px-3 pt-2 pb-1"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="border-4 border-light px-3 pt-2 pb-1"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="border-4 border-light px-3 pt-2 pb-1"
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
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
import { domain } from '../../plugins/domain'
import { ep } from '~/plugins/rss'

export default {
  components: {
    LazyHydrate
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
      this.imageFallback = element.itunes.image
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
      imageFallback: null,
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
        error: this.imageFallback || require('~/assets/cover-im_user.png'),
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
        // this.showAudio = true
        const currentTime = localStorage.getItem(this.$route.params.id)
        if (this.player) {
          this.player.on('play', () => {
            if (!this.playerSet) {
              this.player.currentTime = parseFloat(currentTime || 0)
              this.playerSet = true
            }
          })
          this.player.on('pause', () => {
            localStorage.setItem(
              this.$route.params.id,
              this.player.currentTime
            )
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
            localStorage.setItem(
              this.$route.params.id,
              this.player2.currentTime
            )
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
        case rand < 70 && !window.localStorage.getItem('emailForNewletter'):
          modalName = 'join'
          break
        case rand < 80:
          modalName = 'share'
          break
        case rand < 90:
          modalName = 'rate'
          break
        case rand < 95:
          modalName = 'listen'
          break
      }
      this.$modal.show(modalName)
    },
    getRandomInt (max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    tweetIt () {
      this.$modal.show('share')
    },
    joinUs () {
      this.$modal.show('join')
    },
    setSizeHead () {
      if (
        process.client &&
        document.getElementById('header-title') &&
        document.getElementById('header') &&
        document.getElementById('header-title').offsetWidth !==
          window.innerWidth
      ) {
        const size = `${
          document.getElementById('header-title').offsetHeight +
          document.getElementById('header').offsetHeight +
          5
        }px`
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
        { hid: 'og:url', property: 'og:url', content: `${domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.titleNoEmoji },
        {
          hid: 'description',
          name: 'description',
          content: this.previewNoEmoji
        },
        { hid: 'og:title', property: 'og:title', content: this.titleNoEmoji },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.previewNoEmoji
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.titleNoEmoji
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpg'
        },
        { hid: 'og:image', property: 'og:image', content: this.imageOptimized },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
        { hid: 'og:audio', property: 'og:audio', content: this.audio },
        {
          hid: 'og:audio:type',
          property: 'og:audio:type',
          content: 'audio/mpeg'
        }
      ]
    }
  }
}
</script>
<style>
:root {
  --plyr-color-main: rgba(75, 39, 155, 1);
  --plyr-badge-border-radius: 0px;
  --plyr-control-icon-size: 18px;
}
</style>
<style scoped>

*[v-html] >>> hr {
  border-top: 10px solid rgba(255, 255, 255, 1);
  border-radius: 0px!important;
}
*[v-html] >>> hr.rounded{
  border-radius: 0px!important;
}
*[v-html] >>> ol,
ul {
  list-style: inherit;
  margin: initial;
  padding: initial;
}
*[v-html] >>> blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: initial;
}
*[v-html] >>> h1, h2, h3, h4, h5, h6, p, pre, blockquote, form, ul, ol, dl {
  margin: 20px 0;
}
*[v-html] >>> li, dd, blockquote {
  margin-left: 40px;
}
*[v-html] >>> table {
  border-collapse: collapse;
  border-spacing: 0;
}
</style>
