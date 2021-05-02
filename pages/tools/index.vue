<template>
  <LazyHydrate when-idle>
    <div class="container mx-auto">
      <div class="relative px-4 pt-10 pb-20 sm:px-6 lg:pt-14 lg:pb-16 lg:px-8">
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
            <NuxtLink v-for="tool in tools" :key="tool.name" :to="`/articles/${tool.slug}`" class="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div class="flex-shrink-0 h-48 bg-gray-600">
                <client-only>
                  <img
                    class="object-cover w-full h-48"
                    width="100%"
                    height="100%"
                    :src="tool.image"
                    :alt="`${tool.name} Logo`"
                  >
                </client-only>
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
                  <a rel="noreferrer" :href="tool.link" target="_blank" class="inline-block w-full px-4 py-3 text-base text-xl font-normal leading-tight leading-normal text-center no-underline whitespace-no-wrap align-middle border border-4 rounded select-none hover:text-orchid-600 hover:border-orchid-600 border-orchid-300">J'en profite</a>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        <PageLoader :show="loading" />
      </div>
    </div>
  </LazyHydrate>
</template>
<script>
import LazyHydrate from 'vue-lazy-hydration'
import { domain } from '~/plugins/rss'

export default {
  components: {
    LazyHydrate
  },
  data () {
    return {
      email: '',
      name: '',
      loggin: false,
      loading: true,
      tools: [],
      title: 'Mes outils quotidiens',
      description: 'Voici les meilleurs outils que j\'ai trouvé pour concretiser mes projets !',
      submessage: 'Pour le moment seul mes outils qui ont un parrainage sont présents !'
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.desc },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.desc },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/images/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/images/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  },
  mounted () {
    this.email = window.localStorage.getItem('emailForSignIn')
    // this.loggin = fb.auth().currentUser
    this.$firebase.auth.listen((user) => {
      this.loggin = user
      if (user) {
        this.$sentry.setUser({ uid: user.uid })
      }
      if (this.loggin && this.loggin.displayName === null) {
        this.$modal.show('confirmName')
      }
    })
    this.$firebase
      .db
      .ref('tools')
      .query()
      .orderBy('votes', 'desc')
      .orderBy('addDate', 'asc')
      .run()
      .then((results) => {
        this.tools = results
        this.loading = false
      })
  },
  methods: {
    openBlank (link) {
      window.open(link, '_blank')
    }
  }
}
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
