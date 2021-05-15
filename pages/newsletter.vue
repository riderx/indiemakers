<template>
  <LazyHydrate when-idle>
    <div class="container mx-auto">
      <div class="flex flex-wrap py-2">
        <div class="w-full mx-auto border-8 border-white md:w-1/2">
          <nuxt-img
            :id="logo.title"
            class="w-1/4 pb-5 mx-auto pb-md-3"
            width="100%"
            height="100%"
            :src="logo.source"
            :alt="logo.title"
            :aria-label="logo.title"
          />
          <h1 class="py-2 pl-2 m-0 text-3xl text-center text-white font-indie">
            {{ title }}
          </h1>
          <p class="px-5 text-white">
            {{ desc }}
          </p>
          <p class="px-5 text-white">
            Tu seras également informé de la sortie des épisodes !
          </p>
          <div class="pt-3 pl-4 pr-4 mx-auto text-center text-white md:w-1/2">
            <div class="mb-0 mb-4">
              <input
                ref="name"
                v-model="email"
                type="text"
                class="
                  block
                  w-full
                  px-2
                  py-1
                  pb-0
                  mb-1
                  text-base
                  leading-normal
                  bg-white
                  border
                  rounded
                  appearance-none
                  text-grey-darker
                  border-grey
                "
                aria-describedby="TweetnameHelp"
                placeholder="Elon@tesla.com"
              />
            </div>
          </div>
          <div class="pt-3 pl-4 pr-4 mx-auto text-center md:w-1/2">
            <div class="mb-4">
              <input
                ref="name"
                v-model="name"
                type="text"
                class="
                  block
                  w-full
                  px-2
                  py-1
                  pb-0
                  mb-1
                  text-base
                  leading-normal
                  bg-white
                  border
                  rounded
                  appearance-none
                  text-grey-darker
                  border-grey
                "
                aria-describedby="TweetnameHelp"
                placeholder="Elon Musk"
              />
            </div>
          </div>
          <div class="pt-3 pb-3 pl-4 pr-4 mx-auto text-center md:w-1/2">
            <button
              type="button"
              class="
                px-4
                py-1
                text-white
                border-4 border-white
                rounded-none
                hover:border-gray-200
                hover:text-royalblue-700
                hover:bg-gray-200
                text-light
                h1
              "
              @click="addEMailSub()"
            >
              Commencer
            </button>
          </div>
        </div>
      </div>
    </div>
  </LazyHydrate>
</template>
<script>
import LazyHydrate from 'vue-lazy-hydration'
export default {
  components: {
    LazyHydrate,
  },
  data() {
    return {
      email: '',
      name: '',
      logo: {
        title: 'Newletter LOGO',
        source: require('~/assets/images/newsletter.svg'),
      },
      title: 'Mes Emails Hebdo',
      desc: 'Chaque semaine reçoit mes conseils actionables pour lancer ton projet, et generer un revenue !',
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.desc },
        { hid: 'og:title', property: 'og:title', content: this.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.desc,
        },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/png',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${
            this.$config.DOMAIN
          }${require('~/assets/images/cover-im@0.5x.png')}`,
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: `${
            this.$config.DOMAIN
          }${require('~/assets/images/cover-im@0.5x.png')}`,
        },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
      ],
    }
  },
  mounted() {},
  methods: {
    addEMailSub() {
      this.$firebase.db
        .ref(`users/${this.email}`)
        .set({
          first_name: this.name,
          email: this.email,
        })
        .then(() => {
          this.$modal.show('thanks_register')
          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
        })
        .catch(() => {
          this.$modal.show('already_register')
          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
        })
    },
  },
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
