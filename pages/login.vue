
<template>
  <div>
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-md-1 col-md-5">
          <div class="row bg-primary py-0">
            <div class="col pt-3 px-0 border-10 border-light text-white text-center">
              <h1>🔑Email Verification</h1>
            </div>
          </div>
          <div class="row bg-primary border-10 border-light pb-4">
            <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
              <div class="form-group mb-0">
                <input
                  v-model="email"
                  type="email"
                  class="form-control pb-0"
                  aria-describedby="emailHelp"
                  placeholder="elon@musk.com"
                >
              </div>
            </div>
            <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
              <button
                type="button"
                class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                @click="sendConfirm()"
              >
                🚀valider
              </button>
            </div>
          </div>
        </div>
        <div v-if="image" class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2 d-none d-xl-block">
          <img class="img-fluid border-10 border-light" alt="Logo IM" :src="image">
        </div>
      </div>
    </div>
    <Modals :email.sync="email" :name.sync="myName" />
  </div>
</template>
<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
// import { firebaseLib } from '../plugins/firebase.client'

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
    this.$firebase.auth().onAuthStateChanged((user) => {
      this.user = user
      if (user) {
        this.$sentry.setUser({ uid: user.uid })
      }
      if (this.user && this.user.displayName === null) {
        this.$modal.show('confirmName')
      } else if (this.user) {
        this.$firebase
          .firestore()
          .collection('users/')
          .doc(this.user.id)
          .set({
            name: this.user.displayName,
            email: this.user.email
          })
        this.$router.push('/makers')
      }
    })
    if (this.$firebase.auth().isSignInWithEmailLink(window.location.href)) {
      this.email = window.localStorage.getItem('emailForSignIn')
      if (this.email) {
        this.sendConfirm()
      }
    }
  },
  methods: {
    removeEmoji (str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    },
    sendConfirm () {
      if (this.email) {
        this.$modal.show('loading')
        this.$firebase.auth()
          .signInWithEmailLink(this.email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
            this.$modal.hide('loading')
          })
          .catch((error) => {
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
        { hid: 'og:url', property: 'og:url', content: `${process.env.domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.removeEmoji(this.title) },
        { hid: 'description', name: 'description', content: this.removeEmoji(this.message) },
        { hid: 'og:title', property: 'og:title', content: this.removeEmoji(this.title) },
        { hid: 'og:description', property: 'og:description', content: this.removeEmoji(this.message) },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${process.env.domain_unsecure}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>

<style scoped>
</style>
