<template>
  <LazyHydrate when-idle>
    <div id="emission">
      <div class="container w-full px-0 mx-auto">
        <div class="flex flex-wrap">
          <div class="w-full text-sm text-white lg:w-1/2 md:px-4">
            <div
              id="header-title"
              class="flex flex-wrap justify-center pt-3 border-t-8 md:pb-1 bg-blue md:border-8 border-light"
            >
              <h1 class="text-3xl text-center font-indie">
                {{ title }}
              </h1>

              <div class="block w-full px-0 sm:hidden">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  :src="loadingImg"
                  class="w-full h-auto max-w-full border-t-8 md:border-8 border-light"
                  :alt="title"
                >
              </div>
              <div class="block w-full px-0 text-white sm:hidden">
                <vue-plyr v-if="showAudio" ref="plyr">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
            </div>
            <div
              class="px-5 overflow-hidden border-4 md:h-78 md:overflow-y-scroll border-light md:custom-scroll"
            >
              <div
                class="px-1 content_html px-md-5 md:pt-3 text-grey-lightest"
                v-html="content"
              />
            </div>
            <div
              class="flex flex-wrap py-4 bg-blue md:hidden"
            >
              <div class="px-1 text-center">
                <button
                  type="button"
                  class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 rounded select-none bg-blue border-light bnt-block m-md-3"
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  type="button"
                  class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 rounded select-none bg-blue border-light bnt-block m-md-3"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 rounded select-none bg-blue border-light bnt-block m-md-3"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 rounded select-none bg-blue border-light bnt-block m-md-3"
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
              </div>
            </div>
          </div>
          <div
            class="hidden px-6 text-center lg:w-1/2 md:block"
          >
            <div class="flex flex-col flex-wrap align-items-center">
              <div class="flex flex-col w-11/12">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="w-full h-auto max-w-full border-8 border-light"
                  alt="Logo person"
                >
                <vue-plyr v-if="showAudio" ref="plyr2">
                  <audio>
                    <source :src="audio" type="audio/mp3">
                  </audio>
                </vue-plyr>
              </div>
              <div
                class="flex justify-between w-11/12 pt-4 text-lg text-white font-indie"
              >
                <button
                  type="button"
                  class="px-3 pt-2 pb-1 border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  id="rtp-button"
                  type="button"
                  class="px-3 pt-2 pb-1 border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="px-3 pt-2 pb-1 border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="px-3 pt-2 pb-1 border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
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
import { domain, ep } from '~/plugins/rss'

export default {
  components: {
    LazyHydrate
  },
  async asyncData ({ params, redirect, $config }) {
    const element = await ep(params.id, $config)
    if (params.id === 'latest') {
      redirect(`episode/${element.guid_fix}`)
    }
    return {
      guid: element.guid_fix,
      title: element.title,
      titleNoEmoji: element.title_no_emoji,
      contentNoEmoji: element.content_no_emoji,
      previewNoEmoji: element.preview_no_emoji,
      content: element.content,
      imageBig: element.image_big,
      imageFallback: element.itunes.image,
      imageOptimized: element.image_optimized,
      imageLoading: element.image_loading,
      twitter: element.twitter,
      instagram: element.instagram,
      linkedin: element.linkedin,
      audio: element.enclosure.url
    }
  },
  data () {
    return {
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
      guid: null,
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
        this.showAudio = true
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
      window.localStorage.setItem('tweetMaker', this.twitter.name)
      window.localStorage.setItem('epGui', this.guid)
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
        { hid: 'og:url', property: 'og:url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${this.$route.fullPath}` },
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
        { hid: 'og:image:width', property: 'og:image:width', content: 300 },
        { hid: 'og:image:height', property: 'og:image:height', content: 300 },
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
<style >
:root {
  --plyr-color-main: rgba(75, 39, 155, 1);
  --plyr-badge-border-radius: 0px;
  --plyr-control-icon-size: 18px;
}
</style >
<style scoped>

.content_html >>> hr {
  border-top: 10px solid rgba(255, 255, 255, 1);
  border-radius: 0px!important;
}

.content_html >>> hr {
  border-top: 10px solid rgba(255, 255, 255, 1);
  border-radius: 0px!important;
}
.content_html >>> hr.rounded{
  border-radius: 0px!important;
}
.content_html >>> ul {
  list-style: disc;
  margin: initial;
  padding: initial;
}
.content_html >>> p, blockquote,
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
pre {
  margin: revert!important;
}
.content_html >>> h1, h2, h3, h4, h5, h6, p, pre, blockquote, form, ul, ol, dl {
  margin: 20px 0!important;
}
.content_html >>> li, dd, blockquote {
  margin-left: 40px!important;
}
.content_html >>> table {
  border-collapse: collapse!important;
  border-spacing: 0!important;
}
</style>
