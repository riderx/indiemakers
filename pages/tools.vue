<template>
  <LazyHydrate when-idle>
    <div class="container mx-auto">
      <div class="flex flex-wrap bg-blue py-2">
        <div class="w-1/62 text-center">
          <img
            class="w-1/4 pb-3 header-image"
            width="100%"
            height="100%"
            src="/tools.svg"
          >
        </div>
        <h1 class="text-white text-center w-full py-4 px-2">
          {{ title }}
        </h1>
        <div class="example md:w-1/6 pr-4 pl-42 ml-auto mr-auto">
          <div v-if="loading" class="flex flex-wrap bg-white px-3">
            <div class="w-1/62 p-5 text-center">
              <div
                class="spinner-gflex flex-wrap text-blue"
                style="width: 6rem; height: 6rem;"
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
              class="lg:w-1/3 pr-4 pl-4 md:w-1/2 pr-4 pl-4 sm:w-1/6 pr-4 pl-42 mb-4"
              @click="openBlank(tool.link)"
            >
              <div class="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-grey-light bg-blue border-5 border-light ">
                <img
                  width="100%"
                  height="100%"
                  class="w-full rounded rounded-t"
                  :src="tool.image"
                  :alt="`${tool.name} Logo`"
                ><div class="flex-auto p-6">
                  <h4 class="mb-3 text-white">
                    {{ tool.name }}
                  </h4><p class="mb-0 text-white">
                    {{ tool.description }}
                  </p><a rel="noreferrer" :href="tool.link" target="_blank" class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline border-5 border-light py-3 px-4 text-xl leading-tight text-blue-lightest bg-blue hover:bg-blue-light text-center w-full">J'en profite</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="px-5 text-white">
          {{ submessage }}
        </p>
      </div>
      <Modals />
    </div>
  </LazyHydrate>
</template>
<script>
import LazyHydrate from 'vue-lazy-hydration'
export default {
  components: {
    LazyHydrate,
    Modals: () => import('~/components/Modals.vue')
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
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${process.env.domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.desc },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.desc },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
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
