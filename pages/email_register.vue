<template>
  <LazyHydrate when-idle>
    <div class="container">
      <div class="row bg-primary py-2 border-10 border-light">
        <div class="col-12 text-center">
          <img class="w-25 pb-5 pb-md-3" src="/newsletter.svg">
          <h1 class="pl-2 py-2 m-0 text-white text-center">
            {{ title }}
          </h1>
          <p class="px-5 text-white">
            {{ desc }}
          </p>
          <p class="px-5 text-white">
            Tu seras également informé de la sortie des épisodes !
          </p>
          <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
            <div class="form-group mb-0">
              <input
                ref="name"
                v-model="email"
                type="text"
                class="form-control pb-0"
                aria-describedby="TweetnameHelp"
                placeholder="Elon@tesla.com"
              >
            </div>
          </div>
          <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
            <div class="form-group mb-0">
              <input
                ref="name"
                v-model="name"
                type="text"
                class="form-control pb-0"
                aria-describedby="TweetnameHelp"
                placeholder="Elon Musk"
              >
            </div>
          </div>
          <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
            <button
              type="button"
              class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
              @click="addEMailSub()"
            >
              Comfirmer
            </button>
          </div>
        </div>
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
      title: 'Mes Emails privée',
      desc: 'Un email chaque semaine avec mes conseils actionables pour lancer son projet, et gagner sa liberté !'
    }
  },
  mounted () {
  },
  methods: {
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
</style>
