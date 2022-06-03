<template>
  <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ClientOnly>
        <article>
          <a class="text-sm font-black tracking-wide text-gray-300 uppercase" href="/articles"> ← Tous les articles </a>
          <div class="relative py-16 mt-4 overflow-hidden bg-white">
            <div class="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
              <div class="relative h-full mx-auto text-lg max-w-prose" aria-hidden="true">
                <svg class="absolute transform translate-x-32 top-12 left-full" width="404" height="384" fill="none" viewBox="0 0 404 384">
                  <defs>
                    <pattern id="74b3fd99-0a6f-4271-bef2-e80eeafdf357" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
                </svg>
                <svg
                  class="absolute transform -translate-x-32 -translate-y-1/2 top-1/2 right-full"
                  width="404"
                  height="384"
                  fill="none"
                  viewBox="0 0 404 384"
                >
                  <defs>
                    <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
                </svg>
                <svg class="absolute transform translate-x-32 bottom-12 left-full" width="404" height="384" fill="none" viewBox="0 0 404 384">
                  <defs>
                    <pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
                </svg>
              </div>
            </div>
            <div class="relative px-4 sm:px-6 lg:px-8">
              <div class="mx-auto text-lg max-w-prose">
                <div>
                  <span class="block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase">{{ page.surtitle }}</span>
                  <h1 class="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">
                    {{ page.title }}
                  </h1>
                  <h2 class="block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase">{{ page.subtitle }}</h2>
                </div>
                <h3 class="mt-8 text-xl leading-8 text-gray-500">
                  {{ page.description }}
                </h3>
              </div>
              <div class="mx-auto mt-6">
                <!-- <ContentDoc path="/about" /> -->
                <ContentRenderer class="mx-auto prose-sm prose prose-blue sm:prose lg:prose-lg xl:prose-2xl" :value="page" />
                <!-- <nuxt-content class="mx-auto prose-sm prose prose-blue sm:prose lg:prose-lg xl:prose-2xl" :document="page" /> -->
              </div>
            </div>
          </div>
        </article>
        <template #fallback>
          <PageLoader show />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { createMeta } from '~/services/meta'

  const config = useRuntimeConfig()
  const route = useRoute()
  const noImge = 'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'

  console.log('route', route.params.id)
  const { data: page } = await useAsyncData('articleData', () => queryContent('articles').where({ slug: route.params.id }).findOne())
  console.log('page', page)

  useHead(() => ({
    titleTemplate: page.value?.title || 'pas de titre',
    meta: createMeta(
      page.value?.title || 'pas de titre',
      page.value?.description || 'pas de description',
      page.value && page.value.headImage ? page.value?.headImage : noImge,
      page.value?.author || 'Martin Donadieu'
    ),
  }))
</script>
