<template>
  <LazyHydrate when-idle>
    <div id="makers">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 offset-xl-1 col-xl-5">
            <div id="header-mk" class="row bg-primary border-10 border-light py-1 py-md-4">
              <div class="col col-md-10 pt-3 px-0 text-white text-center">
                <h1>🔥Makers</h1>
              </div>
              <div
                class="col-3 col-md-2 pt-3 text-white"
              >
                <button
                  v-tooltip="'Ajouter un·e maker'"
                  type="button"
                  class="btn btn-primary btn-lg border-5 border-light text-light px-3 px-md-4 display-1"
                  @click="showAddForm()"
                >
                  <strong>+</strong>
                </button>
              </div>
            </div>
            <client-only>
              <div v-if="loading" slot="placeholder" class="row bg-white px-3">
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
              <div
                v-if="!loading"
                class="custom-scroll fix-marging border-5 px-2 border-light border-right-0"
                :style="{ height: sizeHead }"
              >
                <div
                  v-for="person in people"
                  :key="person.id"
                  :class="'row bg-primary text-white py-2 py-md-3 border-bottom align-items-top ' + person.id"
                >
                  <div class="col-3 col-md-4 pr-0 pr-md-5">
                    <img
                      v-lazy="getImgObj(person.img)"
                      class="w-100 img-fluid border-5 border-light"
                      :alt="'Picture ' + person.name"
                    >
                  </div>
                  <div class="col-6 col-md-5">
                    <h3 class="mb-0">
                      {{ person.name }}
                    </h3>
                    <div>
                      <p
                        v-tooltip="'Ouvrir son profils Twitter'"
                        class="text-success fit-content cursor-pointer"
                        @click="openAccount(person.login)"
                      >
                        @{{ person.login }}
                      </p>
                      <p class="text-center text-md-left px-2 px-md-0 d-none d-md-block" v-html="getTextLink(person.bio)" /></p>
                    </div>
                  </div>
                  <div class="col-3 col-md-2 pl-0" @click="vote(person)">
                    <button
                      v-tooltip="tooltipVote(person)"
                      type="button"
                      class="btn btn-primary border-5 border-light btn-lg text-white px-2 px-md-4 py-2 py-md-3 h1"
                    >
                      <fa :icon="['fas', 'play-circle']" class="fa-2x invisible" />
                      <div class="position-absolute ml-2 top">
                        <fa :icon="['fas', 'caret-up']" class="fa-2x" />
                        <p>{{ person.votes }}</p>
                      </div>
                    </button>
                  </div>
                  <div class="col-12 px-md-5 pt-0 d-block d-md-none">
                    <p class v-html="getTextLink(person.bio)" />
                  </div>
                </div>
              </div>
            </client-only>
          </div>
          <div id="content" class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2 d-none d-xl-block text-white">
            <div class="row">
              <div class="col-md-3 offset-3 offset-md-0 col-6 py-3 pt-md-0 px-3 pl-md-0 pr-md-5">
                <img
                  v-lazy="image"
                  width="100%"
                  height="100%"
                  class="img-fluid border-10 border-light"
                  alt="IM COVER"
                  :src="loadingImg"
                >
              </div>
              <div class="col-12 col-md-9 text-center text-sm-left">
                <h1 class="pb-2">
                  Les Makers Français les plus 🔥!
                </h1>
              </div>
              <div class="col-12 text-left">
                <p class="h3 pt-3">
                  Ici tu trouveras les maker les plus demandé dans le podcast !
                </p>
                <p class="h5 pt-3">
                  Si tu aimerais qu'un d'eux vienne dans le podcast:
                </p>
                <p class="pl-2">
                  - Clique sur la fleche a côté de son nom pour voter pour lui
                </p>
                <p class="pl-2">
                  - Partage sur tweeter ton interet pour lui, cela le motivera a venir !
                </p>
                <p class="h5 pt-3">
                  Ton maker préféré n'est pas dans la liste ?
                </p>
                <p class="pl-2">
                  - Clique sur le bonton "plus" pour l'ajouter !
                </p>
                <p class="pl-2">
                  - Partage sur tweeter ton interet pour lui, cela le motivera a venir !
                </p>
                <p class="h5 pt-3">
                  Tu veux m'aider ?
                </p>
                <div class="col-12 px-md-5 pt-1 pt-md-3 text-center">
                  <button
                    id="rtp-button"
                    v-tooltip="'Note l\'épisode pour soutenir le podcast'"
                    type="button"
                    class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="rate()"
                  >
                    <fa :icon="['fas', 'star']" />
                    Note
                  </button>
                  <button
                    v-tooltip="'Partager via twitter'"
                    type="button"
                    class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="tweetItShare()"
                  >
                    <fa :icon="['fas', 'pizza-slice']" />
                    Partage
                  </button>
                </div>
                <p class="h5 pt-3">
                  Tu veux avancer plus vite sur la voie du maker ?
                </p>
                <div class="col-12 px-md-5 pt-1 pt-md-3 text-center">
                  <button
                    v-tooltip="'Commence à gagner ta vie sur internet'"
                    type="button"
                    class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="joinUs()"
                  >
                    <fa :icon="['fas', 'hand-point-right']" />
                    Deviens Indie maker
                  </button>
                  <button
                    v-tooltip="'Multiplie ton CA en 4 semaines !'"
                    type="button"
                    class="btn bg-primary border-5 border-light btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="bmc()"
                  >
                    <fa :icon="['fas', 'chart-line']" />
                    Passe à l'étape supérieure
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modals :email.sync="email" :name.sync="addName" :maker.sync="currentName" />
        </div>
      </div>
    </div>
  </lazyhydrate>
</template>

<script>
import linkifyHtml from 'linkifyjs/html'
import LazyHydrate from 'vue-lazy-hydration'
import { feed } from '../plugins/rss'
// eslint-disable-next-line no-unused-vars
// import { fb } from '../plugins/firebase.client'
const linkTwitter = 'Son Twitter : <a href="https://twitter.com/USERNAME">@USERNAME</a>'

export default {
  components: {
    Modals: () => import('~/components/Modals.vue'),
    LazyHydrate
  },
  async fetch () {
    const res = await feed()
    // eslint-disable-next-line no-console
    // console.log(res)
    if (res && res.items) {
      this.episodes = res.items
    }
  },
  data () {
    return {
      loadingImg: require('~/assets/cover-im_empty.png'),
      image: {
        src: require('~/assets/cover-im@0.5x.png'),
        error: require('~/assets/cover-im_user.png'),
        loading: require('~/assets/cover-im_empty.png')
      },
      title: 'Vote pour ton maker preféré',
      message: 'Cela me permettra de decouvrir de nouveau maker a inviter',
      email: '',
      guid: null,
      episodes: [],
      isFalse: false,
      loggin: false,
      loading: true,
      sizeHead: '100vh',
      addName: '',
      currentName: '',
      people: []
    }
  },
  async mounted () {
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
    await this.$bind(
      'people',
      this.$firebase
        .firestore()
        .collection('people')
        .orderBy('votes', 'desc')
        .orderBy('addDate', 'asc')
    )
    this.people.forEach((person) => {
      person.img = this.personImg(person)
    })

    this.setSizeHead()
    this.loading = false
  },
  methods: {
    bmc () {
      window.open(`https://www.buymeacoffee.com/${process.env.handler}`, '_blank')
    },
    joinUs () {
      this.$modal.show('join')
    },
    rate () {
      window.open('https://ratethispodcast.com/imf', '_blank')
    },
    removeEmoji (str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    },
    findInEp (name) {
      let found = false
      const link = linkTwitter.replace(/USERNAME/g, name)
      this.episodes.forEach((element) => {
        if (element.content.includes(link)) {
          found = element.guid
        }
      })
      return found
    },
    tooltipVote (person) {
      return `Voter pour avoir ${person.name} dans le podcast`
    },
    personImg (person) {
      return `https://twitter-avatar.now.sh/${person.login}`
    },
    tweetItShare () {
      const tweet = 'J\'écoute le podcast @indiemakers https://indiemakers.fr'
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    },
    getTextLink (text) {
      return linkifyHtml(text, {
        defaultProtocol: 'https',
        className: 'linkified',
        ignoreTags: [],
        format (value, type) {
          let newVal = value + ''
          if (type === 'url' && newVal.includes('https://')) {
            newVal = newVal.replace('https://', '')
          } else if (type === 'url' && newVal.includes('http://')) {
            newVal = newVal.replace('http://', '')
          }
          if (type === 'url' && newVal.length > 50) {
            newVal = newVal.slice(0, 50) + '…'
          }
          return newVal
        },
        nl2br: true,
        tagName: 'a',
        target: {
          url: '_blank'
        },
        validate: true
      })
    },
    sendLogin () {
      if (this.email) {
        window.localStorage.setItem('emailForSignIn', this.email)
        const actionCodeSettings = {
          url: `${process.env.domain}/login`,
          handleCodeInApp: true
        }
        this.$modal.hide('register')
        this.$modal.show('loading')
        this.$firebase
          .auth()
          .sendSignInLinkToEmail(this.email, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem('emailForSignIn', this.email)
            this.$modal.hide('loading')
            this.$modal.show('checkEmail')
          })
          .catch((error) => {
            this.$modal.hide('loading')
            console.error(error)
          })
      }
    },
    vote (person) {
      const found = this.findInEp(person.login)
      if (found) {
        this.guid = found
        this.$modal.show('found')
        return
      }
      if (!this.loggin) {
        this.openRegister()
      } else {
        this.$modal.show('loading')
        this.$firebase
          .firestore()
          .collection(`people/${person.id}/votes`)
          .doc(this.loggin.uid)
          .set({
            date: Date()
          })
          .then(() => {
            this.$modal.hide('loading')
            person.votes += 1
            this.currentName = '' + person.login
            setTimeout(() => {
              this.$modal.show('voted')
            }, 50)
          })
          .catch((error) => {
            this.$modal.hide('loading')
            console.error('Error writing document: ', error)
            this.currentName = '' + person.login
            this.$modal.show('fail-vote')
          })
      }
    },
    openRegister () {
      this.$modal.show('register')
      setTimeout(() => {
        this.$refs.register.focus()
      }, 50)
    },
    openAdd () {
      this.$modal.show('add')
      setTimeout(() => {
        this.$refs.addMaker.focus()
      }, 50)
    },
    showAddForm () {
      if (!this.loggin) {
        this.openRegister()
      } else {
        this.openAdd()
      }
    },
    openAccount (name) {
      window.open(`https://twitter.com/${name}`, '_blank')
    },
    add () {
      this.$modal.hide('add')
      this.$modal.show('loading')
      if (!this.loggin) {
        this.$modal.hide('loading')
        this.openRegister()
      } else {
        this.$firebase
          .functions().httpsCallable('addTwiterUser')({ name: this.addName })
          .then((addJson) => {
            const added = addJson.data
            this.$modal.hide('loading')
            if (added.error && added.error === 'Already voted') {
              this.currentName = '' + this.addName
              this.$modal.show('fail-exist-vote')
            } else if (added.error) {
              console.error(added)
              this.$modal.show('fail-add')
            } else if (added.done && added.done === 'Voted') {
              this.currentName = '' + this.addName
              this.$modal.show('fail-exist')
            } else {
              this.currentName = '' + this.addName
              this.$modal.show('added')
            }
            this.addName = ''
          })
          .catch((err) => {
            this.$modal.hide('loading')
            this.$modal.show('error')
            console.error(err)
          })
      }
    },
    getImgObj (img) {
      return {
        src: img,
        error: require('~/assets/cover-im_user.png'),
        loading: require('~/assets/cover-im_empty.png')
      }
    },
    setSizeHead () {
      if (process.client && document.getElementById('header-mk') && document.getElementById('header') && document.getElementById('cover') && document.getElementById('cover').offsetHeight > 0) {
        const size = `${document.getElementById('header-mk').offsetHeight + document.getElementById('header').offsetHeight + 5}px`
        this.sizeHead = `calc(100vh - ${size})`
      } else {
        this.sizeHead = 'auto'
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
