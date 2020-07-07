
<template>
  <div>
    <client-only>
      <modal height="auto" adaptive name="loading">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 p-5 text-center">
              <div class="spinner-grow text-primary" style="width: 6rem; height: 6rem;" role="status">
                <span class="sr-only">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive :click-to-close="isFalse" name="confirmName">
        <div class="container-fluid">
          <div class="row bg-primary py-2">
            <div class="col-12 pt-2 text-white text-center">
              <h1>😨 Spam ou pas Spam ?</h1>
            </div>
          </div>
          <div class="row bg-success pt-4">
            <div class="col-12 pt-2 text-white text-center">
              <p>Ajoute ton nom pour recevoir par email les épisodes pour lesquels tu as voté.</p>
            </div>
            <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
              <div class="form-group mb-0">
                <input
                  ref="myName"
                  v-model="myName"
                  type="text"
                  class="form-control pb-0"
                  aria-describedby="TweetnameHelp"
                  placeholder="Elon Musk"
                  @keyup.enter="addName()"
                >
              </div>
              <p>Si tu choisie un faux nom ca seras a jamais dans les spams 😢</p>
            </div>
            <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
              <button
                type="button"
                class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                @click="addName()"
              >
                Valider mon Nom
              </button>
            </div>
          </div>
        </div>
      </modal>
    </client-only>
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
  </div>
</template>
<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

export default {
  data () {
    return {
      email: null,
      image: require('~/assets/cover-im@0.5x.png'),
      myName: null,
      isFalse: false,
      user: null
    }
  },
  mounted () {
    this.$fireAuth.onAuthStateChanged((user) => {
      this.user = user
      if (this.user && this.user.displayName === null) {
        this.$modal.show('confirmName')
      } else if (this.user) {
        this.$router.push('/makers')
      }
    })
    if (this.$fireAuth.isSignInWithEmailLink(window.location.href)) {
      this.email = window.localStorage.getItem('emailForSignIn')
      if (this.email) {
        this.sendConfirm()
      }
    }
  },
  methods: {
    addName () {
      this.$modal.hide('confirmName')
      this.$modal.show('loading')
      this.user
        .updateProfile({
          displayName: this.myName
        })
        .then(() => {
          this.$modal.hide('loading')
          this.$router.push('/')
        })
        .catch(() => {
          this.$modal.hide('loading')
        })
    },
    sendConfirm () {
      if (this.email) {
        this.$modal.show('loading')
        this.$fireAuth
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
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${process.env.domain_unsecure}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>

<style scoped>
</style>
