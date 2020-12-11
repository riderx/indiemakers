<template>
  <div>
    <div class="container mx-auto mx-auto">
      <div class="flex flex-wrap pt-md-5">
        <div class="w-1/62 md:mx-1/6 md:w-2/5 pr-4 pl-4">
          <div class="flex flex-wrap bg-blue py-0">
            <div class="flex-grow pt-3 px-0 border-10 border-light text-white text-center">
              <h1 class="text-3xl font-indie">
                🔑Email Verification
              </h1>
            </div>
          </div>
          <div class="flex flex-wrap bg-blue border-10 border-light pb-4">
            <div class="md:mx-1/4 md:w-1/2 pr-4 pl-4 pt-3 text-white text-center">
              <div class="mb-4 mb-0">
                <input
                  v-model="email"
                  type="email"
                  class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-grey-darker border border-grey rounded pb-0"
                  aria-describedby="emailHelp"
                  placeholder="elon@musk.com"
                >
              </div>
            </div>
            <div class="md:mx-1/4 md:w-1/2 pr-4 pl-4 pt-0 text-white text-center">
              <button
                type="button"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline text-blue-lightest bg-blue hover:bg-blue-light border-5 border-light py-3 px-4 text-xl leading-tight block w-full text-grey-lightest px-4 h1"
                @click="sendConfirm()"
              >
                🚀valider
              </button>
            </div>
          </div>
        </div>
        <div v-if="image" class="w-1/62 md:w-1/2 pr-4 pl-4 pt-0 px-md-5 order-1 order-md-2 hidden xl:block">
          <img class="max-w-full h-auto border-10 border-light" alt="Logo IM" :src="image">
        </div>
      </div>
    </div>
    <Modals :email.sync="email" :name.sync="myName" />
  </div>
</template>
<script>
import { domain } from '../plugins/domain'

export default {
  components: {
    Modals: () => import('~/components/Modals.vue')
  },
  data () {
    return {
      title: 'Login to indie makers',
      message: 'To allow you vote for makers',
      email: null,
      image: require('~/assets/cover-im@0.5x.png'),
      myName: null,
      isFalse: false,
      user: null
    }
  },
  mounted () {
    this.$firebase.auth.listen((user) => {
      this.user = user
      if (user) {
        this.$sentry.setUser({ uid: user.uid })
      }
      if (this.user && this.user.displayName === null) {
        this.$modal.show('confirmName')
      } else if (this.user) {
        this.$firebase
          .db
          .ref(`users/${this.user.id}`)
          .set({
            name: this.user.displayName,
            email: this.user.email
          })
        this.$router.push('/makers')
      }
    })
    this.email = window.localStorage.getItem('emailForSignIn')
    if (this.email) {
      this.sendConfirm()
    }
  },
  methods: {
    removeEmoji (str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    },
    sendConfirm () {
      if (this.email) {
        this.$modal.show('loading')
        this.$firebase.auth.handleSignInRedirect({
          email: window.localStorage.getItem('emailForSignIn')
        }).then(() => {
          window.localStorage.removeItem('emailForSignIn')
          this.$modal.hide('loading')
        }).catch((error) => {
          console.error(error)
          this.$modal.hide('loading')
          this.$router.push('/')
        })
      }
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        { hid: 'description', name: 'description', content: this.removeEmoji(this.message) },
        { hid: 'og:title', property: 'og:title', content: this.removeEmoji(this.title) },
        { hid: 'og:description', property: 'og:description', content: this.removeEmoji(this.message) },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>
<style scoped>
</style>
