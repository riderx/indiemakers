<template>
  <div>
    <ClientOnly>
      <div class="container w-full px-0 mx-auto">
        <div class="flex flex-wrap w-full">
          <div class="w-full md:w-1/2 md:px-4">
            <div class="flex flex-wrap w-full overflow-hidden border-4 border-white md:h-78 md:overflow-y-scroll md:custom-scroll" ref='scrollComponent'>
            <div v-for="(empty, index) in empties" :key="index" class="w-full text-white border-b align-items-top">
              <ListItem class="w-full" :title="empty" />
            </div>
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
          <div id="content" class="w-full px-4 text-white md:w-1/2 pt-md-0 px-md-5">
            <div class="flex flex-wrap">
              <div class="w-full mb-3 md:w-1/5 offset-3 offset-md-0">
                <img width="100%" height="100%" class="w-1/2 h-auto mx-auto my-10 border-white md:m-0 md:w-4/5" alt="IM COVER" :src="image" />
              </div>
              <div class="text-center md:w-3/5 md:px-4 md:text-left">
                <h1 class="pb-2 text-3xl font-indie">
                  {{ title }}
                </h1>
              </div>
              <div class="py-1 text-sm">
                <h2 class="text-xl font-indie">Prochain episode en septembre ! C'est la Pause estivale ❤️</h2>
                <!-- <h2 class="text-xl font-indie">Prochain episode dans {{ nextEpisode() }}</h2> -->
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
                  <a rel="noreferrer" target="_blank" href="https://twitter.com/martindonadieu">Martin DONADIEU</a>
                </p>
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
  import { crispLoader } from '~/services/crisp'
  import { createMeta } from '~/services/meta'
  import { cutText } from '~/services/feed'
  import dayjs from '~/services/dayjs'
  import { Episode } from '~/services/types'

  const scrollComponent = ref(null)
  const image = 'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg'
  const empties = computed(() => (episodes.value && episodes.value.length === 0 ? [null, null, null] : []))
  const title = '🚀 Le podcast des entrepreneurs indépendant'
  const messages = [
    "J'échange avec ceux qui ont su transformer leurs idées en business florissant.",
    'Au-delà des belles histoires, je décrypte leur passé, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables en indépendant.',
    'J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur projet profitable.',
    'Un épisode toute les semaines',
  ]
  const { data: episodes } = await useAsyncData('episodes', () => {
    return $fetch('/api/podcasts').then(res => {
        return (res as Episode[]).map<Episode>((episode) => {
          return {
            ...episode,
            preview: cutText(episode.content, 30),
            date: dayjs(episode.pubDate).fromNow(),
          } as Episode
        })
    })
  })

  useHead(() => ({
    titleTemplate: '🚀 Le podcast des entrepreneurs indépendant',
    meta: createMeta(title, messages[0] + messages[3], image, 'Martin Donadieu'),
  }))
  onMounted(() => {
    window.addEventListener(
      'scroll',
      () => {
        crispLoader()
      },
      { capture: true, once: true, passive: true }
    )
  })
  // const nextEpisode = (): string => {
  //   const oneHours = 60 * 60 * 1000 // minutes*seconds*milliseconds
  //   const oneDay = 24 * oneHours // 24*hours
  //   const firstDate = new Date(2019, 10, 19, 10, 0)
  //   const tomorow = new Date()
  //   tomorow.setHours(10)
  //   tomorow.setMinutes(0)
  //   tomorow.setMilliseconds(0)
  //   tomorow.setDate(tomorow.getDate() + 1)
  //   const now = new Date()
  //   const diffDays = Math.round(Math.abs((firstDate.getTime() - now.getTime()) / oneDay))
  //   const diffHours = tomorow.getTime() - now.getTime()
  //   const epRepeat = 7
  //   const nextEp = epRepeat - (diffDays % epRepeat)
  //   const nextEpH = 24 + Math.round(diffHours / oneHours - 24)
  //   return nextEp > 1 ? `${nextEp} jours` : `${nextEpH} heures`
  // }
</script>
