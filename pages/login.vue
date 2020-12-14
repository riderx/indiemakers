<template>
  <div class="pt-40 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 px-4 sm:px-4">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          🔑 Email Verification
        </h2>
      </div>
      <form class="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" value="true">
        <div class="shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="elon@musk.com"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
          </div>
        </div>

        <div>
          <button type="submit" class="group relative text-white w-full flex justify-center border-4 border-white hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 font-indie py-2 px-5" @click="sendConfirm()">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: lock-closed -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            🚀 valider
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { domain } from '~/plugins/rss'

export default {
  components: {
  },
  data () {
    return {
      title: 'Login to indie makers',
      message: 'To allow you vote for makers',
      image: require('~/assets/cover-im@0.5x.png'),
      isFalse: false,
      user: null,
      email: null
    }
  },
  mounted () {
    this.email = window.localStorage.getItem('emailForSignIn')
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
        const next = window.localStorage.getItem('nextAfterSign')
        if (next) {
          window.localStorage.removeItem('nextAfterSign')
        }
        this.$router.push(next || '/makers_hunt')
      }
    })
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
          email: this.email
        }).then(() => {
          window.localStorage.removeItem('emailForSignIn')
          this.email = null
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
        { hid: 'og:url', property: 'og:url', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        { hid: 'description', name: 'description', content: this.removeEmoji(this.message) },
        { hid: 'og:title', property: 'og:title', content: this.removeEmoji(this.title) },
        { hid: 'og:description', property: 'og:description', content: this.removeEmoji(this.message) },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>
<style scoped>
</style>
