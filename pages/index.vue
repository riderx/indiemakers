<template>
  <div>
    <div id="episodes">
      <div class="container w-full px-0 mx-auto">
        <div class="flex flex-wrap w-full">
          <div class="w-full md:w-1/2 md:px-4">
            <!-- <div
              id="header-eps"
              class="flex flex-wrap w-full py-1 border-8 border-white py-md-2"
            >
              <div class="flex-grow px-0 py-2 text-center text-white">
                <p class="text-3xl md:text-4xl font-indie">🎙 Episodes</p>
              </div>
            </div> -->
            <div
              id="scrollable"
              class="
                flex flex-wrap
                w-full
                overflow-hidden
                border-4 border-white
                md:h-78 md:overflow-y-scroll md:custom-scroll
              "
            >
              <NuxtLink
                v-for="episode in episodes"
                :key="episode.id"
                :to="`/episode/${episode.id}`"
                class="w-full text-white border-b align-items-top"
              >
                <ListItem
                  class="w-full"
                  :title="episode.title"
                  :date="episode.date"
                  :preview="episode.preview"
                  :image="episode.imageOptimized"
                />
              </NuxtLink>
            </div>
          </div>
          <div
            id="content"
            class="w-full px-4 text-white md:w-1/2 pt-md-0 px-md-5"
          >
            <div class="flex flex-wrap">
              <div class="w-full mb-3 md:w-1/5 offset-3 offset-md-0">
                <img
                  width="100%"
                  height="100%"
                  class="
                    w-1/2
                    h-auto
                    mx-auto
                    my-10
                    border-white
                    md:m-0 md:w-4/5
                  "
                  alt="IM COVER"
                  :src="image"
                />
              </div>
              <div class="text-center md:w-3/5 md:px-4 md:text-left">
                <h1 class="pb-2 text-3xl font-indie">
                  {{ title }}
                </h1>
              </div>
              <div class="py-1 text-sm">
                <h2 class="text-xl font-indie">
                  Prochain episode dans {{ nextEpisode() }}
                </h2>
              </div>
              <div class="pt-3 text-sm">
                <div v-for="(message, index) in messages" :key="`ep-${index}`">
                  <p class="pb-2">
                    {{ message }}
                  </p>
                </div>
              </div>
              <div class="pt-3 text-sm">
                <p class="pb-2">
                  Par
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://twitter.com/martindonadieu"
                    >Martin DONADIEU</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from '@vue/composition-api'
import {
  defineComponent,
  useFetch,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import { feed } from '~/services/rss'
import { crispLoader } from '~/services/crisp'
import { createMeta } from '~/services/meta'
import { cutText } from '~/services/feed'
import dayjs from '~/services/dayjs'
import { Episode } from '~/services/types'

export default defineComponent({
  components: {
    ListItem: () => import('~/components/ListItem.vue'),
  },
  setup() {
    const image =
      'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg'
    const episodes = ref<Episode[]>([])
    const title = '🚀 Le podcast des entrepreneurs indépendant'
    const messages = [
      "J'échange avec ceux qui ont su transformer leurs idées en business florissant.",
      'Au-delà des belles histoires, je décrypte leur passé, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables en indépendant.',
      'J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur projet profitable.',
      'Un épisode toute les semaines',
    ]
    const { $config } = useContext()
    const { fetch } = useFetch(async () => {
      const items = await feed($config)
      // episodes.value = items
      episodes.value = items.map((episode) => {
        return {
          ...episode,
          preview: cutText(episode.content, 30),
          date: dayjs(episode.pubDate).fromNow(),
        }
      })
    })

    fetch()
    useMeta(() => ({
      title: '🚀 Le podcast des entrepreneurs indépendant',
      meta: createMeta(title, messages[0], image, null, 'Martin Donadieu'),
    }))

    const nextEpisode = (): string => {
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2019, 10, 19)
      const now = new Date()
      const diffDays = Math.round(
        Math.abs((firstDate.getTime() - now.getTime()) / oneDay)
      )
      // const epRepeat = 14
      const epRepeat = 7
      const nextEp = epRepeat - (diffDays % epRepeat)
      return nextEp !== epRepeat ? `${nextEp} jours` : 'DEMAIN 10 heures'
    }
    return { title, image, messages, episodes, nextEpisode }
  },
  head: {},
  beforeMount() {
    window.addEventListener(
      'scroll',
      () => {
        crispLoader()
      },
      { capture: true, once: true, passive: true }
    )
  },
})
</script>
