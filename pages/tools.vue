<template>
  <div class="container mx-auto">
    <div class="relative px-4 pt-10 pb-20 sm:px-6 lg:pt-14 lg:pb-16 lg:px-8">
    <ClientOnly>
      <div class="relative mx-auto max-w-7xl">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {{ title }}
          </h1>
          <p class="max-w-2xl mx-auto mt-3 text-xl text-gray-300 sm:mt-4">
            {{ description }}
          </p>
        </div>
        <div class="grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none">
          <a
            v-for="tool in tools"
            :key="tool.name"
            target="_blank"
            :href="tool.link"
            class="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            <div class="flex-shrink-0 h-48 bg-gray-600">
                <img class="object-cover w-full h-48" width="100%" height="100%" :src="tool.image" :alt="`${tool.name} Logo`" />
            </div>
            <div class="flex flex-col justify-between flex-1 p-6 bg-white">
              <div class="flex-1">
                <p class="text-sm font-medium text-indigo-600">
                  <a href="#" class="hover:underline">
                    {{ tool.type }}
                  </a>
                </p>
                <a href="#" class="block mt-2">
                  <p class="text-xl font-semibold text-gray-900">
                    {{ tool.name }}
                  </p>
                  <p class="mt-3 text-base text-gray-500">
                    {{ tool.description }}
                  </p>
                </a>
              </div>
              <div class="flex items-center mt-6">
                <a
                  rel="noreferrer"
                  :href="tool.link"
                  target="_blank"
                  class="
                    inline-block
                    w-full
                    px-4
                    py-3
                    text-base text-xl
                    font-normal
                    leading-tight leading-normal
                    text-center
                    no-underline
                    whitespace-no-wrap
                    align-middle
                    border border-4
                    rounded
                    select-none
                    hover:text-orchid-600 hover:border-orchid-600
                    border-orchid-300
                  "
                  >J'en profite</a
                >
              </div>
            </div>
          </a>
        </div>
      </div>
      <template #fallback>
        <PageLoader show />
      </template>
    </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { createMeta } from '~/services/meta'
  import { Tool } from '~~/services/types';

  const description = "Voici les meilleurs outils que j'ai trouvé pour concretiser mes projets !"
  const title = 'Mes outils quotidiens'
  useHead(() => ({
    titleTemplate: title,
    meta: createMeta(
      title,
      description,
      `https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg`,
      'Martin Donadieu'
    ),
  }))

  const { data: tools } = useFetch<Tool[]>('/api/tools')
</script>
<style scoped>
.form-size {
  height: 750px;
}
@media (max-width: 400px) {
  .form-size {
    height: 800px;
  }
}
@media (max-width: 400px) {
  .header-image {
    width: 50% !important;
  }

  .card-img-top {
    /* height: auto !important; */
    height: 170px !important;
  }
}

.card-img-top {
  width: 100%;
  height: 12vw;
  object-fit: cover;
}
</style>
