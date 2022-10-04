<template>
  <div>
    <ClientOnly>
      <div>
        <div class="container w-full px-0 mx-auto">
          <div class="flex flex-wrap">
            <div class="w-full text-sm text-white lg:w-1/2 md:px-4">
              <div class="flex flex-wrap justify-center pt-3 border-t-8 border-white md:pb-1 md:border-8">
                <h1 v-if="episode.title !== 'No title'" class="px-3 text-3xl text-center font-indie">
                  {{ episode.title }}
                </h1>
                <p v-else class="w-4/5 h-8 px-3 animate-pulse bg-orchid-300"></p>
                <h2 class="hidden">{{ episode.name }}</h2>

                <div class="block w-full px-0 h-w-screen sm:hidden">
                  <img
                    width="100%"
                    height="100%"
                    :src="episode.image"
                    class="w-full h-auto max-w-full border-t-8 border-white md:border-8"
                    :alt="episode.title"
                  />
                </div>
                <div class="block w-full px-0 text-white border-b-8 sm:hidden border-royalblue-700">
                  <ClientOnly>
                      <vue-plyr ref="plyr">
                        <audio>
                          <source :src="episode.audio" type="audio/mp3" />
                        </audio>
                    </vue-plyr>
                  </ClientOnly>

                  <!-- <AudioPlayer class="bg-white" ref="plyr" :option="audioPlayerSettings" /> -->
                </div>
              </div>
              <div class="px-5 overflow-hidden bg-white border-4 border-white md:h-78 md:overflow-y-scroll md:custom-scroll">
                <div
                  v-if="episode.content !== 'No content'"
                  class="px-1 prose-sm prose prose-orchid sm:prose lg:prose-lg xl:prose-xl px-md-5 md:pt-3"
                  v-html="episode.content"
                />
                <div v-else>
                  <p class="w-4/5 h-4 px-1 px-md-5 md:pt-3 animate-pulse bg-orchid-300"></p>
                  <p class="w-full h-4 px-1 mt-3 px-md-5 animate-pulse bg-orchid-300"></p>
                  <p class="w-2/5 h-4 px-1 mt-3 px-md-5 animate-pulse bg-orchid-300"></p>
                </div>
              </div>
              <div class="flex flex-wrap py-4 md:hidden">
                <div class="px-1 text-center">
                  <button
                    type="button"
                    class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 border-white rounded select-none bnt-block m-md-3"
                    @click="listen()"
                  >
                    🎧 Ecouter
                  </button>
                  <button
                    type="button"
                    class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 border-white rounded select-none bnt-block m-md-3"
                    @click="rate()"
                  >
                    ⭐️ Note
                  </button>
                  <button
                    type="button"
                    class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 border-white rounded select-none bnt-block m-md-3"
                    @click="tweetIt()"
                  >
                    ❤️ Partage
                  </button>
                  <button
                    type="button"
                    class="inline-block px-4 py-2 py-3 m-1 text-base text-xl font-normal leading-tight leading-normal text-center text-white no-underline whitespace-no-wrap align-middle border border-4 border-white rounded select-none bnt-block m-md-3"
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
                        v-if="episode.image"
                        :src="episode.image"
                        width="100%"
                        height="100%"
                        class="w-full h-auto max-w-full border-8 border-white square_content"
                        :alt="`Couverture podcast ${episode.name}`"
                      />
                      <div v-else class="w-full h-auto max-w-full border-8 border-white square_content animate-pulse bg-orchid-300"></div>
                    </div>
                    <ClientOnly>
                      <vue-plyr ref="plyr2">
                        <audio>
                          <source :src="episode.audio" type="audio/mp3" />
                        </audio>
                      </vue-plyr>
                    </ClientOnly>
                  </div>
                </div>
                <div class="flex justify-between w-11/12 pt-4 text-lg text-white font-indie">
                  <button
                    type="button"
                    class="px-3 pt-2 pb-1 border-4 border-white hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200"
                    @click="listen()"
                  >
                    🎧 Ecouter
                  </button>
                  <button
                    id="rtp-button"
                    type="button"
                    class="px-3 pt-2 pb-1 border-4 border-white hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200"
                    @click="rate()"
                  >
                    ⭐️ Note
                  </button>
                  <button
                    type="button"
                    class="px-3 pt-2 pb-1 border-4 border-white hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200"
                    @click="tweetIt()"
                  >
                    ❤️ Partage
                  </button>
                  <button
                    type="button"
                    class="px-3 pt-2 pb-1 border-4 border-white hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200"
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
      <template #fallback>
        <PageLoader show />
      </template>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
  import { cutText, removeEmoji } from '~/services/feed'
  import { createMeta } from '~/services/meta'
  import { Episode } from '~/services/types'
  import { $vfm } from 'vue-final-modal'
  import Listen from '~/components/Modals/Listen.vue'
  import Join from '~/components/Modals/Join.vue'
  import Rate from '~/components/Modals/Rate.vue'
  import Share from '~/components/Modals/Share.vue'
  import Upgrade from '~/components/Modals/Upgrade.vue'
  import { useMainStore } from '~~/store/main'

  const main = useMainStore()
  const route = useRoute()
  const timeoutPlayer = ref()
  const plyr = ref()
  const plyr2 = ref()
  const playerSet = ref(false)
  const timeoutModal = ref()

  const { data: episodes } = await useFetch<Episode[]>(`/api/podcasts?guid=${route.params.id}&random=${3}`)
  const { data: episode } = await useFetch<Episode>(`/api/podcasts?guid=${route.params.id}`)
  const titleNoEmoji = computed(() => removeEmoji(episode.value.title))
  const contentNoEmoji = computed(() => removeEmoji(episode.value.content))
  const previewNoEmoji = computed(() => cutText(contentNoEmoji.value.replace(/<[^>]*>?/gm, '')))

  const randomEp = (length: number): number => {
    return Math.floor(Math.random() * length) + 0
  }
  const checkNext = () => {
    const totalLength = episodes.value.length
    const newEp = randomEp(totalLength)
    const nextId = episodes.value[newEp].id
    main.nextGuid = nextId
    main.modal = 'random-ep'
  }
  const playerListener = (player: Plyr) => {
    if(!player) return
    const currentTime = localStorage.getItem(`${route.params.id}:currentTime`)
    player.on('play', () => {
      if (!playerSet.value) {
        player.currentTime = parseFloat(currentTime || '0')
        playerSet.value = true
      }
    })

    player.on('pause', () => {
      localStorage.setItem(`${route.params.id}:currentTime`, String(player.currentTime))
    })
    player.on('ended', () => {
      checkNext()
    })
    player.on('timeupdate', () => {
      localStorage.setItem(`${route.params.id}:currentTime`, String(player.currentTime))
    })

    // player
  }
  const showRandomModal = () => {
    const rand = getRandomInt(100)
    let modalComp = 'upgrade'
    switch (true) {
      case rand < 70 && !main.emailForNewletter:
        modalComp = 'join'
        break
      case rand < 80:
        modalComp = 'share'
        break
      case rand < 90:
        modalComp = 'rate'
        break
      case rand < 95:
        modalComp = 'listen'
        break
    }
    main.modal = modalComp
  }
  const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max))
  }
  const tweetIt = () => {
    main.tweetMaker = episode.value?.twitter.name
    main.epGui = route.params.id as string
    main.modal = 'share'
  }
  const joinUs = () => {
    // main.modal = 'join'
    window.open('https://discord.gg/GctKEcDpxk', '_blank')
  }

  const rate = () => {
    console.log('rate')
    main.modal ='rate'
  }
  const listen = () => {
    main.modal = 'listen'
  }


  onMounted(() => {
      setTimeout(() => {
        console.log('player', plyr.value)
        if (plyr.value) {
          playerListener(plyr.value.player)
        }
        if (plyr2.value) {
          playerListener(plyr2.value.player)
        }
      }, 150)
    timeoutModal.value = setTimeout(() => {
      if (!main.randomModal[episode.value.id]) {
        showRandomModal()
        main.randomModal[episode.value.id] = true
      }
    }, 15000) as any
  })
  onBeforeUnmount(() => {
    if (timeoutModal.value) {
      clearTimeout(timeoutModal.value)
    }
    if (timeoutPlayer.value) {
      clearTimeout(timeoutPlayer.value)
    }
  })
  useHead(() => ({
    title: titleNoEmoji.value,
    meta: createMeta(
      titleNoEmoji.value,
      previewNoEmoji.value.replace(/<[^>]*>?/gm, ''),
      episode.value.image,
      episode.value.name,
      episode.value.audio
    ),
  }))
</script>
<style>
:root {
  --plyr-color-main: rgba(75, 39, 155, 1);
  --plyr-badge-border-radius: 0;
  --plyr-control-icon-size: 18px;
}
</style>
