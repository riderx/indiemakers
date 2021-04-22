<template>
  <LazyHydrate when-idle>
    <div class="container mx-auto">
      <div class="flex flex-wrap py-2 bg-blue">
        <div class="w-1/2 mx-auto text-center">
          <img
            class="w-1/4 pb-3 mx-auto header-image"
            width="100%"
            height="100%"
            src="/tools.svg"
          >
        </div>
        <h1 class="w-full px-2 py-4 text-6xl text-center text-white font-indie">
          {{ title }}
        </h1>
        <div class="w-full ml-auto mr-auto">
          <div v-if="loading" class="flex flex-wrap px-3 bg-white">
            <div class="w-1/2 w-full p-5 text-center">
              <div
                class="flex-wrap spinner-gflex text-blue"
                role="status"
              >
                <span class="">Chargement...</span>
              </div>
            </div>
          </div>
          <div v-if="!loading" class="flex flex-wrap">
            <div
              v-for="tool in tools"
              :key="tool.name"
              class="pl-4 pr-4 mb-4 lg:w-1/3 md:w-1/2 sm:w-1/6"
              @click="openBlank(tool.link)"
            >
              <div class="relative flex flex-col min-w-0 break-words border-8 rounded border-light">
                <img
                  width="100%"
                  height="100%"
                  class="w-full"
                  :src="tool.image"
                  :alt="`${tool.name} Logo`"
                ><div class="flex-auto p-6">
                  <h4 class="mb-3 text-xl text-white font-indie">
                    {{ tool.name }}
                  </h4>
                  <p class="mb-3 text-white">
                    {{ tool.description }}
                  </p>
                  <a rel="noreferrer" :href="tool.link" target="_blank" class="inline-block w-full px-4 py-2 py-3 text-base text-xl font-normal leading-tight leading-normal text-center no-underline whitespace-no-wrap align-middle border border-4 rounded select-none border-light text-blue-lightest bg-blue hover:bg-blue-light">J'en profite</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="w-full px-5 text-center text-white">
          {{ submessage }}
        </p>
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
      desc: 'Voici les meilleurs outils pour concretiser ses projets !',
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
        { hid: 'og:image', property: 'og:image', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/cover-im@0.5x.png')}` },
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
