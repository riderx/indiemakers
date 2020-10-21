<template>
  <LazyHydrate when-idle>
    <div class="container">
      <div class="row bg-primary py-2">
        <div class="col-12 text-center">
          <img
            class="w-25 pb-3 header-image"
            width="100%"
            height="100%"
            src="/tools.svg"
          >
        </div>
        <h1 class="text-white text-center w-100 py-4 px-2">
          {{ title }}
        </h1>
        <div class="example col-md-12 ml-auto mr-auto">
          <div v-if="loading" class="row bg-white px-3">
            <div class="col-12 p-5 text-center">
              <div
                class="spinner-grow text-primary"
                style="width: 6rem; height: 6rem;"
                role="status"
              >
                <span class="sr-only">Chargement...</span>
              </div>
            </div>
          </div>
          <div v-if="!loading" class="row">
            <div
              v-for="tool in tools"
              :key="tool.name"
              class="col-lg-4 col-md-6 col-sm-12 mb-4"
              @click="openBlank(tool.link)"
            >
              <div class="card bg-primary border-5 border-light ">
                <img
                  width="100%"
                  height="100%"
                  class="card-img-top"
                  :src="tool.image"
                  :alt="`${tool.name} Logo`"
                ><div class="card-body">
                  <h4 class="card-title text-white">
                    {{ tool.name }}
                  </h4><p class="card-text text-white">
                    {{ tool.description }}
                  </p><a rel="noreferrer" :href="tool.link" target="_blank" class="btn border-5 border-light btn-lg btn-primary text-center w-100">J'en profite</a>
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
    this.$firebase.auth().onAuthStateChanged((user) => {
      this.loggin = user
      if (user) {
        this.$sentry.setUser({ uid: user.uid })
      }
      if (this.loggin && this.loggin.displayName === null) {
        this.$modal.show('confirmName')
      }
    })
    this.$firebase
      .firestore()
      .collection('tools')
      .orderBy('votes', 'desc')
      .orderBy('addDate', 'asc')
      .onSnapshot((querySnapshot) => {
        this.tools = querySnapshot.docs.map(doc => doc.data())
        this.loading = false
      })
  },
  methods: {
    openBlank (link) {
      window.open(link, '_blank')
    },
    addEMailSub () {
      this.$firebase
        .firestore()
        .collection('users')
        .doc(this.email)
        .set({
          first_name: this.name,
          email: this.email
        }).then(() => {
          this.$modal.show('thanks_register')
          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
        }).catch(() => {
          this.$modal.show('already_register')
          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
        })
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
