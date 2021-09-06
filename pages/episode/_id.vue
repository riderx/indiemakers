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
                md:pb-1 md:border-8
              "
            >
              <p class="px-3 text-3xl text-center font-indie">
                {{ episode.title }}
              </p>

              <div class="block w-full px-0 h-w-screen sm:hidden">
                <img
                  width="100%"
                  height="100%"
                  :src="episode.image"
                  class="
                    w-full
                    h-auto
                    max-w-full
                    border-t-8 border-white
                    md:border-8
                  "
                  :alt="episode.title"
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
                    <source :src="episode.audio" type="audio/mp3" />
                  </audio>
                </vue-plyr>
              </div>
            </div>
            <div
              class="
                px-5
                overflow-hidden
                bg-white
                border-4 border-white
                md:h-78 md:overflow-y-scroll md:custom-scroll
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
                v-html="episode.content"
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
                  👉 Rejoins la communauté
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
                      :src="episode.image"
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
                      <source :src="episode.audio" type="audio/mp3" />
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
                  👉 Rejoins la communauté
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script lang="ts">
import {
  ref,
  computed,
  onMounted,
  defineComponent,
  useFetch,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import Vue from 'vue'
import { cutText, removeEmoji } from '~/services/feed'
import { feed, ep } from '~/services/rss'
import { createMeta } from '~/services/meta'
import { Episode } from '~/services/types'

export default defineComponent({
  setup() {
    const { title, meta, script, link } = useMeta()
    const { $config, $warehouse, $modal, params } = useContext()
    const episode = ref({} as Episode)
    const timeoutPlayer = ref()
    const plyr = ref()
    const plyr2 = ref()
    const playerSet = ref(false)
    const timeoutModal = ref()
    const sizeHead = ref('')
    const showAudio = ref(false)
    const episodes = ref([] as Episode[])
    const titleNoEmoji = computed(() => removeEmoji(episode.value.title))
    const contentNoEmoji = computed(() => removeEmoji(episode.value.content))
    const previewNoEmoji = computed(() => cutText(contentNoEmoji.value))

    const randomEp = (length: number): number => {
      return Math.floor(Math.random() * length) + 0
    }
    const checkNext = () => {
      const epIndex = Number(episode.value.id) - 1
      const totalLength = episodes.value.length
      let newEp = randomEp(totalLength)
      while (newEp === epIndex) {
        newEp = randomEp(totalLength)
      }
      const nextId = episodes.value[newEp].id
      $warehouse.set('nextGuid', nextId)
      $modal.show('random-ep')
    }
    const playerListener = (player: any) => {
      const currentTime = localStorage.getItem(`${params.value.id}:currentTime`)
      player.on('play', () => {
        if (!playerSet.value) {
          player.currentTime = parseFloat(currentTime || '0')
          playerSet.value = true
        }
      })
      player.on('pause', () => {
        localStorage.setItem(
          `${params.value.id}:currentTime`,
          player.currentTime
        )
      })
      player.on('ended', () => {
        checkNext()
      })
      player.on('timeupdate', () => {
        localStorage.setItem(
          `${params.value.id}:currentTime`,
          player.currentTime
        )
      })
    }
    const showRandomModal = () => {
      const rand = getRandomInt(100)
      let modalName = 'upgrade'
      switch (true) {
        case rand < 70 && !$warehouse.get('emailForNewletter'):
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
      $modal.show(modalName)
    }
    const getRandomInt = (max: number): number => {
      return Math.floor(Math.random() * Math.floor(max))
    }
    const tweetIt = () => {
      $warehouse.set('tweetMaker', episode.value.twitter.name)
      $warehouse.set('epGui', episode.value.guid)
      $modal.show('share')
    }
    const joinUs = () => {
      // this.$modal.show('join')
      window.open('https://discord.gg/GctKEcDpxk', '_blank')
    }
    const setSizeHead = () => {
      const headerTitle = document.getElementById('header-title')
      const header = document.getElementById('header')
      if (
        process.client &&
        headerTitle &&
        header &&
        headerTitle.offsetWidth !== window.innerWidth
      ) {
        const size = `${headerTitle.offsetHeight + header.offsetHeight + 5}px`
        sizeHead.value = `calc(100vh - ${size})`
      } else {
        sizeHead.value = 'auto'
      }
    }
    const rate = () => {
      $modal.show('rate')
    }
    const listen = () => {
      $modal.show('listen')
    }

    const { fetch } = useFetch(async () => {
      const [items, element] = await Promise.all([
        feed($config),
        ep(params.value.id, $config),
      ])
      if (!element || !items) {
        return
      }
      episode.value = element
      episodes.value = items
    })
    fetch()
    onMounted(() => {
      setSizeHead()
      timeoutPlayer.value = setTimeout(() => {
        Vue.use((window as any).VuePlyr, {
          plyr: {
            fullscreen: { enabled: false },
          },
        })
        showAudio.value = true
        setTimeout(() => {
          if (plyr.value) {
            playerListener(plyr.value.player)
          }
          if (plyr2.value) {
            playerListener(plyr2.value.player)
          }
        }, 150)
      }, 2000) as any
      timeoutModal.value = setTimeout(() => {
        if (!$warehouse.get(`randomModal:${episode.value.id}`)) {
          showRandomModal()
          $warehouse.set(`randomModal:${episode.value.id}`, 'done')
        }
      }, 15000) as any
    })
    link.value = [
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/vue-plyr/dist/vue-plyr.css',
      },
    ]
    script.value = [
      {
        type: 'text/javascript',
        src: 'https://unpkg.com/@skjnldsv/vue-plyr',
        async: true,
        defer: true,
      },
    ]
    title.value = titleNoEmoji.value
    meta.value = createMeta(
      titleNoEmoji.value,
      previewNoEmoji.value,
      episode.value.imageOptimized,
      episode.value.audio
    )
    return {
      episode,
      showAudio,
      timeoutModal,
      timeoutPlayer,
      listen,
      rate,
      joinUs,
      tweetIt,
    }
  },
  head: {},
  destroyed() {
    if (this.timeoutModal) {
      clearTimeout(this.timeoutModal)
    }
    if (this.timeoutPlayer) {
      clearTimeout(this.timeoutPlayer)
    }
  },
})
</script>
<style>
:root {
  --plyr-color-main: rgba(75, 39, 155, 1);
  --plyr-badge-border-radius: 0;
  --plyr-control-icon-size: 18px;
}
</style>
