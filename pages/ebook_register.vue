<template>
  <LazyHydrate when-idle>
    <div class="container mx-auto">
      <div class="flex flex-wrap bg-blue py-2 border-10 border-light">
        <div class="w-1/62 text-center">
          <img class="w-1/4 pb-5 pb-md-3" src="/book.svg">
          <h1 class="pl-2 py-2 m-0 text-white text-center">
            {{ title }}
          </h1>
          <p class="px-5 text-white">
            {{ desc }}
          </p>
          <p class="px-5 text-white">
            Tu seras également informé de la sortie des épisodes !
          </p>
          <div class="md:mx-1/4 md:w-1/2 pr-4 pl-4 pt-3 text-white text-center">
            <div class="mb-4 mb-0">
              <input
                ref="name"
                v-model="email"
                type="text"
                class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-grey-darker border border-grey rounded pb-0"
                aria-describedby="TweetnameHelp"
                placeholder="Elon@tesla.com"
              >
            </div>
          </div>
          <div class="md:mx-1/4 md:w-1/2 pr-4 pl-4 pt-3 text-white text-center">
            <div class="mb-4 mb-0">
              <input
                ref="name"
                v-model="name"
                type="text"
                class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-grey-darker border border-grey rounded pb-0"
                aria-describedby="TweetnameHelp"
                placeholder="Elon Musk"
              >
            </div>
          </div>
          <div class="md:mx-1/4 md:w-1/2 pr-4 pl-4 pt-3 pb-3 text-white text-center">
            <button
              type="button"
              class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline text-blue-lightest bg-blue hover:bg-blue-light border-5 border-light py-3 px-4 text-xl leading-tight block w-full text-grey-lightest px-4 h1"
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
import { domain } from '../plugins/domain'

export default {
  components: {
    LazyHydrate,
    Modals: () => import('~/components/Modals.vue')
  },
  data () {
    return {
      email: '',
      name: '',
      title: 'Le guide pour lancer ton projet !',
      desc: 'Reçoit mon guide en 6 étapes qui te fera éviter bien des erreurs et gagner un temps précieux !'
    }
  },
  mounted () {
  },
  methods: {
    addEMailSub () {
      this.$firebase
        .db
        .ref(`users/${this.name}`)
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
        { hid: 'og:url', property: 'og:url', content: `${domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.desc },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.desc },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>
<style scoped>
.form-size {
  height: 800px;
}
@media (max-width: 400px) {
  .form-size {
    height: 900px;
  }
}
</style>
