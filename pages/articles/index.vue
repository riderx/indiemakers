<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
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
            <NuxtLink
              v-for="article in articlesOrder"
              :key="article.slug"
              :to="`/articles/${article.slug}`"
              class="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div class="flex-shrink-0 h-48 bg-gray-600">
                <img class="object-cover w-full h-48" width="100%" height="100%" :src="article.headImage" :alt="article.title" />
              </div>
              <div class="flex flex-col justify-between flex-1 p-6 bg-white">
                <div class="flex-1">
                  <p class="text-sm font-medium text-indigo-600">
                    <a href="#" class="hover:underline">
                      {{ article.type }}
                    </a>
                  </p>
                  <a href="#" class="block mt-2">
                    <h2 class="text-xl font-semibold text-gray-900">
                      {{ article.title }}
                    </h2>
                    <p class="mt-3 text-base text-gray-500">
                      {{ article.description }}
                    </p>
                  </a>
                </div>
                <div class="flex items-center mt-6">
                  <div class="flex-shrink-0">
                    <a href="#">
                      <span class="sr-only">{{ article.author }}</span>
                      <img class="w-10 h-10 rounded-full" :src="article.authorImage" :alt="`Author image ${article.author}`" />
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
                        {{ formatTime(article.date) }}
                      </time>
                      <span aria-hidden="true"> &middot; </span>
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
      <template #fallback>
        <PageLoader show />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  import { createMeta } from '~/services/meta'
  import dayjs from '~~/services/dayjs';

  const blogImage = 'https://res.cloudinary.com/forgr/image/upload/v1621019063/indiemakers/blog_li7d4i.svg'
  const title = 'Les articles indie !'
  const description = 'Des articles fait par des indie, des astuces, des conseils, des avancée, ou enrichir la culture indie !'
  const { data: articles } = await useAsyncData('count', () => queryContent('articles').where({ published: true }).find())

  const articlesOrder = computed(() =>articles.value.sort((a, b) => dayjs(b.date, "DD-MM-YYYY").unix() - dayjs(a.date, "DD-MM-YYYY").unix()))

  useHead(() => ({
    titleTemplate: title,
    meta: createMeta(title, description, blogImage),
  }))
  const formatTime = (s: string) => {
    // use dayjs to parse dd-mm-yyyy
    const d = dayjs(s, "DD-MM-YYYY")
    return d.format('DD MMMM YYYY')
  }
</script>
