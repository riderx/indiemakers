<template>
  <client-only>
    <div id="emission">
      <div class="container w-full px-0 mx-auto">
        <div class="flex flex-wrap">
          <div class="w-full text-sm text-white lg:w-1/2 md:px-4">
            <div
              id="header-title"
              class="
                flex flex-wrap
                justify-center
                pt-3
                border-t-8 border-white
                md:pb-1
                md:border-8
              "
            >
              <p class="px-3 text-3xl text-center font-indie">
                {{ title }}
              </p>

              <div class="block w-full px-0 h-w-screen sm:hidden">
                <img
                  width="100%"
                  height="100%"
                  :src="image"
                  class="
                    w-full
                    h-auto
                    max-w-full
                    border-t-8 border-white
                    md:border-8
                  "
                  :alt="title"
                />
              </div>
              <div
                class="
                  block
                  w-full
                  px-0
                  text-white
                  border-b-8
                  sm:hidden
                  border-royalblue-700
                "
              >
                <vue-plyr v-if="showAudio" ref="plyr">
                  <audio>
                    <source :src="audio" type="audio/mp3" />
                  </audio>
                </vue-plyr>
              </div>
            </div>
            <div
              class="
                px-5
                overflow-hidden
                border-4 border-white
                md:h-78
                md:overflow-y-scroll
                md:custom-scroll
              "
            >
              <div
                class="
                  px-1
                  prose-sm prose prose-orchid
                  sm:prose
                  lg:prose-lg
                  xl:prose-xl
                  px-md-5
                  md:pt-3
                "
                v-html="content"
              />
            </div>
            <div class="flex flex-wrap py-4 md:hidden">
              <div class="px-1 text-center">
                <button
                  type="button"
                  class="
                    inline-block
                    px-4
                    py-2 py-3
                    m-1
                    text-base text-xl
                    font-normal
                    leading-tight leading-normal
                    text-center text-white
                    no-underline
                    whitespace-no-wrap
                    align-middle
                    border border-4 border-white
                    rounded
                    select-none
                    bnt-block
                    m-md-3
                  "
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  type="button"
                  class="
                    inline-block
                    px-4
                    py-2 py-3
                    m-1
                    text-base text-xl
                    font-normal
                    leading-tight leading-normal
                    text-center text-white
                    no-underline
                    whitespace-no-wrap
                    align-middle
                    border border-4 border-white
                    rounded
                    select-none
                    bnt-block
                    m-md-3
                  "
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="
                    inline-block
                    px-4
                    py-2 py-3
                    m-1
                    text-base text-xl
                    font-normal
                    leading-tight leading-normal
                    text-center text-white
                    no-underline
                    whitespace-no-wrap
                    align-middle
                    border border-4 border-white
                    rounded
                    select-none
                    bnt-block
                    m-md-3
                  "
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="
                    inline-block
                    px-4
                    py-2 py-3
                    m-1
                    text-base text-xl
                    font-normal
                    leading-tight leading-normal
                    text-center text-white
                    no-underline
                    whitespace-no-wrap
                    align-middle
                    border border-4 border-white
                    rounded
                    select-none
                    bnt-block
                    m-md-3
                  "
                  @click="joinUs()"
                >
                  👉 Lance toi
                </button>
              </div>
            </div>
          </div>
          <div class="hidden px-6 text-center lg:w-1/2 md:block">
            <div class="flex flex-col flex-wrap align-items-center">
              <div class="flex flex-col w-11/12">
                <div>
                  <div class="relative square">
                    <img
                      :src="image"
                      width="100%"
                      height="100%"
                      class="
                        w-full
                        h-auto
                        max-w-full
                        border-8 border-white
                        square_content
                      "
                      alt="Logo person"
                    />
                  </div>
                  <vue-plyr v-if="showAudio" ref="plyr2">
                    <audio>
                      <source :src="audio" type="audio/mp3" />
                    </audio>
                  </vue-plyr>
                </div>
              </div>
              <div
                class="
                  flex
                  justify-between
                  w-11/12
                  pt-4
                  text-lg text-white
                  font-indie
                "
              >
                <button
                  type="button"
                  class="
                    px-3
                    pt-2
                    pb-1
                    border-4 border-white
                    hover:border-gray-200
                    hover:text-royalblue-700
                    hover:bg-gray-200
                  "
                  @click="listen()"
                >
                  🎧 Ecouter
                </button>
                <button
                  id="rtp-button"
                  type="button"
                  class="
                    px-3
                    pt-2
                    pb-1
                    border-4 border-white
                    hover:border-gray-200
                    hover:text-royalblue-700
                    hover:bg-gray-200
                  "
                  @click="rate()"
                >
                  ⭐️ Note
                </button>
                <button
                  type="button"
                  class="
                    px-3
                    pt-2
                    pb-1
                    border-4 border-white
                    hover:border-gray-200
                    hover:text-royalblue-700
                    hover:bg-gray-200
                  "
                  @click="tweetIt()"
                >
                  ❤️ Partage
                </button>
                <button
                  type="button"
                  class="
                    px-3
                    pt-2
                    pb-1
                    border-4 border-white
                    hover:border-gray-200
                    hover:text-royalblue-700
                    hover:bg-gray-200
                  "
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
  </client-only>
</template>
<script>
import Vue from 'vue'
import { feed, ep } from '~/services/rss'

export default {
  async asyncData({ params, redirect, $config }) {
    const [items, element] = await Promise.all([
      feed($config),
      ep(params.id, $config),
    ])
    if (params.id === 'latest') {
      return redirect(`/episode/${element.id}`)
    }
    return {
      guid: element.guid,
      title: element.title,
      titleNoEmoji: element.title_no_emoji,
      contentNoEmoji: element.content_no_emoji,
      previewNoEmoji: element.preview_no_emoji,
      content: element.content,
      image: element.itunes.image,
      twitter: element.twitter,
      instagram: element.instagram,
      linkedin: element.linkedin,
      audio: element.enclosure.url,
      episodes: items,
    }
  },
  data() {
    return {
      loadingImg: require('~/assets/images/cover-im_empty.png'),
      image: null,
      titleNoEmoji: null,
      contentNoEmoji: null,
      previewNoEmoji: null,
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
      audio: '',
      episodes: [],
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/vue-plyr/dist/vue-plyr.css',
        },
      ],
      script: [
        {
          type: 'text/javascript',
          src: 'https://unpkg.com/@skjnldsv/vue-plyr',
          async: true,
          defer: true,
        },
      ],
      title: this.titleNoEmoji,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        { hid: 'title', name: 'title', content: this.titleNoEmoji },
        {
          hid: 'description',
          name: 'description',
          content: this.previewNoEmoji,
        },
        { hid: 'og:title', property: 'og:title', content: this.titleNoEmoji },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.previewNoEmoji,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.titleNoEmoji,
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpg',
        },
        { hid: 'og:image', property: 'og:image', content: this.image },
        { hid: 'og:image:width', property: 'og:image:width', content: 300 },
        { hid: 'og:image:height', property: 'og:image:height', content: 300 },
        { hid: 'og:audio', property: 'og:audio', content: this.audio },
        {
          hid: 'og:audio:type',
          property: 'og:audio:type',
          content: 'audio/mpeg',
        },
      ],
    }
  },
  computed: {
    player() {
      return this.$refs.plyr ? this.$refs.plyr.player : null
    },
    player2() {
      return this.$refs.plyr2 ? this.$refs.plyr2.player : null
    },
  },
  destroyed() {
    if (this.timeoutModal) {
      clearTimeout(this.timeoutModal)
    }
    if (this.timeoutPlayer) {
      clearTimeout(this.timeoutPlayer)
    }
  },
  mounted() {
    this.setSizeHead()
    this.timeoutPlayer = setTimeout(() => {
      Vue.use(window.VuePlyr, {
        plyr: {
          fullscreen: { enabled: false },
        },
      })
      this.showAudio = true
      setTimeout(() => {
        if (this.player) {
          this.playerListener(this.player)
        }
        if (this.player2) {
          this.playerListener(this.player2)
        }
      }, 150)
    }, 2000)
    this.timeoutModal = setTimeout(() => {
      if (!this.$warehouse.get(`randomModal:${this.guid}`)) {
        this.showRandomModal()
        this.$warehouse.set(`randomModal:${this.guid}`, 'done')
      }
    }, 15000)
  },
  methods: {
    randomEp(length) {
      return Math.floor(Math.random() * length) + 0
    },
    checkNext() {
      const epIndex = this.id - 1
      const totalLength = this.episodes.length
      let randomEp = this.randomEp(totalLength)
      while (randomEp === epIndex) {
        randomEp = this.randomEp(totalLength)
      }
      const nextId = this.episodes[randomEp].id
      this.$warehouse.set('nextGuid', nextId)
      this.$modal.show('random-ep')
    },
    playerListener(player) {
      const currentTime = localStorage.getItem(
        `${this.$route.params.id}:currentTime`
      )
      player.on('play', () => {
        if (!this.playerSet) {
          player.currentTime = parseFloat(currentTime || 0)
          this.playerSet = true
        }
      })
      player.on('pause', () => {
        localStorage.setItem(
          `${this.$route.params.id}:currentTime`,
          player.currentTime
        )
      })
      player.on('ended', () => {
        this.checkNext()
      })
      player.on('timeupdate', () => {
        localStorage.setItem(
          `${this.$route.params.id}:currentTime`,
          player.currentTime
        )
      })
    },
    showRandomModal() {
      const rand = this.getRandomInt(100)
      let modalName = 'upgrade'
      switch (true) {
        case rand < 70 && !this.$warehouse.get('emailForNewletter'):
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
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    tweetIt() {
      this.$warehouse.set('tweetMaker', this.twitter.name)
      this.$warehouse.set('epGui', this.guid)
      this.$modal.show('share')
    },
    joinUs() {
      this.$modal.show('join')
    },
    setSizeHead() {
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
    rate() {
      this.$modal.show('rate')
    },
    listen() {
      this.$modal.show('listen')
    },
  },
}
</script>
<style>
:root {
  --plyr-color-main: rgba(75, 39, 155, 1);
  --plyr-badge-border-radius: 0;
  --plyr-control-icon-size: 18px;
}
</style>
<style scoped>
.h-w-screen {
  height: 100vw;
}

.square_content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.square::after {
  content: '';
  display: block;
  padding-bottom: 100%;
}
.prose {
  color: white;
}
</style>
