<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="relative px-4 pt-16 pb-20 bg-gray-50 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
    <div class="absolute inset-0">
      <div class="bg-white h-1/3 sm:h-2/3" />
    </div>
    <div class="relative mx-auto max-w-7xl">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {{ title }}
        </h2>
        <p class="max-w-2xl mx-auto mt-3 text-xl text-gray-500 sm:mt-4">
          {{ description }}
        </p>
      </div>
      <div class="grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none">
        <NuxtLink v-for="article in articles" :key="article.slug" :to="`/articles/${article.slug}`" class="flex flex-col overflow-hidden rounded-lg shadow-lg">
          <div class="flex-shrink-0">
            <img class="object-cover w-full h-48" :src="article.headImage" alt="">
          </div>
          <div class="flex flex-col justify-between flex-1 p-6 bg-white">
            <div class="flex-1">
              <p class="text-sm font-medium text-indigo-600">
                <a href="#" class="hover:underline">
                  {{ article.type }}
                </a>
              </p>
              <a href="#" class="block mt-2">
                <p class="text-xl font-semibold text-gray-900">
                  {{ article.title }}
                </p>
                <p class="mt-3 text-base text-gray-500">
                  {{ article.description }}
                </p>
              </a>
            </div>
            <div class="flex items-center mt-6">
              <div class="flex-shrink-0">
                <a href="#">
                  <span class="sr-only">{{ article.author }}</span>
                  <img class="w-10 h-10 rounded-full" :src="article.authorImage" alt="">
                </a>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  <a href="#" class="hover:underline">
                    {{ article.author }}
                  </a>
                </p>
                <div class="flex space-x-1 text-sm text-gray-500">
                  <time datetime="2020-03-16">
                    {{ article.date }}
                  </time>
                  <span aria-hidden="true">
                    &middot;
                  </span>
                  <span>
                    {{ article.readTime }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { domain } from '~/plugins/rss'

export default {
  async asyncData ({ $content }) {
    const articles = await $content('articles').sortBy('title').fetch()

    return {
      articles
    }
  },
  data () {
    return {
      blogImage: require('~/assets/blog.svg'),
      title: 'Les news indie !',
      description: 'Chaque semaine un maker du discord est désigné pour ecrire un article sur son projet, et nous partager ses avancée !'
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.title },
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        { hid: 'og:title', property: 'og:title', content: this.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.description
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.title
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpg'
        },
        { hid: 'og:image', property: 'og:image', content: this.blogImage },
        { hid: 'og:image:width', property: 'og:image:width', content: 300 },
        { hid: 'og:image:height', property: 'og:image:height', content: 300 }
      ]
    }
  }
}
</script>
