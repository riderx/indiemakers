<template>
  <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <article>
        <a class="mb-6 text-sm font-black tracking-wide text-gray-600 uppercase" href="/articles"> ← Tous les articles </a>
        <div class="relative py-16 overflow-hidden bg-white">
          <div class="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
            <div class="relative h-full mx-auto text-lg max-w-prose" aria-hidden="true">
              <svg class="absolute transform translate-x-32 top-12 left-full" width="404" height="384" fill="none" viewBox="0 0 404 384">
                <defs>
                  <pattern
                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      class="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
              </svg>
              <svg class="absolute transform -translate-x-32 -translate-y-1/2 top-1/2 right-full" width="404" height="384" fill="none" viewBox="0 0 404 384">
                <defs>
                  <pattern
                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      class="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
              </svg>
              <svg class="absolute transform translate-x-32 bottom-12 left-full" width="404" height="384" fill="none" viewBox="0 0 404 384">
                <defs>
                  <pattern
                    id="d3eb07ae-5182-43e6-857d-35c643af9034"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      class="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
              </svg>
            </div>
          </div>
          <div class="relative px-4 sm:px-6 lg:px-8">
            <div class="mx-auto text-lg max-w-prose">
              <h1>
                <span class="block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase">{{ page.surtitle }}</span>
                <span class="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">{{ page.title }}</span>
                <span class="block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase">{{ page.subtitle }}</span>
              </h1>
              <p class="mt-8 text-xl leading-8 text-gray-500">
                {{ page.description }}
              </p>
            </div>
            <div class="mx-auto mt-6 prose prose-lg text-gray-500 prose-indigo">
              <nuxt-content :document="page" />
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { domain } from '~/plugins/rss'

export default {
  async asyncData ({ params, $content }) {
    const page = (await $content('articles').where({ slug: params.id }).fetch())[0]
    return {
      page
    }
  },
  head () {
    return {
      title: this.page.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.page.title },
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
        },
        { hid: 'twitter:title', name: 'twitter:title', content: this.page.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.page.description },
        { hid: 'og:title', property: 'og:title', content: this.page.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.page.description
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.page.title
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpg'
        },
        { hid: 'og:image', property: 'og:image', content: this.page.headImage },
        { hid: 'og:image:width', property: 'og:image:width', content: 300 },
        { hid: 'og:image:height', property: 'og:image:height', content: 300 }
      ]
    }
  }
}
</script>
