<template>
  <LazyHydrate when-idle>
    <div id="makers">
      <div class="container mx-auto mx-auto">
        <div class="flex flex-wrap">
          <div class="w-1/62 xl:mx-1/6 xl:w-2/5 pr-4 pl-4">
            <div id="header-mk" class="flex flex-wrap bg-blue border-10 border-light py-1 py-md-4">
              <div class="flex-grow pt-3 px-0 text-white text-center">
                <h1>💃 Makers</h1>
              </div>
              <div
                class="w-1/4 md:w-1/5 pr-4 pl-4 py-2"
              >
                <button
                  type="button"
                  class="text-blue-lightest bg-blue hover:bg-blue-light border-0 bigg p-0"
                  @click="showAddForm()"
                >
                  +
                </button>
              </div>
            </div>
            <client-only>
              <div v-if="loading" slot="placeholder" class="flex flex-wrap bg-white px-3">
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
              <div
                v-if="!loading"
                class="custom-scroll fix-marging border-5 px-2 border-light border-r-0 w-full"
                :style="{ height: sizeHead }"
              >
                <div
                  v-for="episode in people"
                  :key="episode.id"
                  :class="'w-full flex flex-wrap cursor-pointer bg-blue text-white py-2 py-md-0 border-b align-items-top ' + episode.id"
                >
                  <div class="offset-2 offset-md-0 w-2/3 md:w-1/3 pr-4 pl-4 order-1 order-md-2 px-0 py-3 py-md-0" @click="vote(episode)">
                    <img
                      v-lazy="getImgObj(episode.img)"
                      width="100%"
                      height="100%"
                      :src="loadingImg"
                      class="w-full w-md-75 max-w-full h-auto border-5 border-light"
                      :alt="'Picture ' + episode.name"
                    >
                    <div class="tumb_up px-3 my-3 my-md-2 border-5 border-light text-center bg-blue">
                      👍<br>
                      {{ episode.votes }}
                    </div>
                  </div>
                  <div class="w-1/62 md:w-2/3 pr-4 pl-4 order-2 p-2 order-md-2 text-center text-md-left">
                    <h3>{{ episode.name }}</h3>
                    <p
                      v-if="episode.login"
                      class="text-green fit-content cursor-pointer mb-0 hidden md:block"
                      @click="openAccount(episode.login)"
                    >
                      @{{ episode.login }}
                    </p>
                    <div class="text-center text-md-left px-3 px-md-0 hidden md:block">
                      <p class v-html="getTextLink(episode.bio)" />
                    </div>
                  </div>
                  <div class="w-1/62 px-0 px-md-5 pt-1 pt-md-3 order-3 block d-mhidden">
                    <p
                      v-if="episode.login"
                      class="text-green text-center text-md-left mb-0"
                      @click="openAccount(episode.login)"
                    >
                      {{ episode.login }}
                    </p>
                    <div class="text-center text-md-left px-3 px-md-0">
                      <p class v-html="getTextLink(episode.bio)" />
                    </div>
                  </div>
                </div>
              </div>
            </client-only>
          </div>
          <div id="content" class="w-1/62 md:w-1/2 pr-4 pl-4 pt-0 px-md-5 order-1 order-md-2 hidden xl:block text-white">
            <div class="flex flex-wrap">
              <div class="w-1/62 text-center text-sm-left">
                <h1 class="pb-2 pt-md-5">
                  {{ title }}
                </h1>
              </div>
              <div class="w-1/62 text-left pt-md-5">
                <p class="pl-2">
                  Les Makers sont une espèce d'entrepreneurs encore méconnue en France.<br><br>
                  Parfois ils ne postent qu'en anglais...<br>
                  Parfois ils ne font pas de personal branding !<br>
                  Et parfois on découvre seulement 10 ans plus tard qui était aux commandes !<br><br>
                  Pourtant l'écosysteme est le facteur numéro 1 de succès,<br>
                  ensemble nous allons plus loin, cassons les barrières vers le succès !<br>
                  C'est pour cela que cette liste existe !<br><br>
                  Comme Producthunt,<br>
                  Suis, ajoute et votes pour tes MAKERS favoris,<br>
                  en bonus tu gagnes une chance de les voir dans le podcast !
                </p>
                <p class="h5 pt-5">
                  Tu aimerais qu'un d'eux vienne dans le podcast ?
                </p>
                <p class="pl-2">
                  Vote pour lui en cliquant sur "👍" sur sa photo
                </p>
                <p class="pl-2">
                  Partage sur Twitter ton vote pour montrer ton soutiens au maker,<br>
                  s'il n'est pas encore venue dans le podcast cela le motivera à venir !
                </p>
                <p class="h5 pt-5">
                  Ton maker préféré n'est pas dans la liste ?
                </p>
                <p class="pl-2">
                  Clique sur le bonton "+" pour l'ajouter !
                </p>
                <p class="pl-2 pb-5">
                  Partage sur Twitter ton vote, cela le motivera à venir !
                </p>
                <p class="h3 pt-3 text-center">
                  Avance maintenant sur la voie du maker !
                </p>
                <div class="w-1/62 px-md-5 pt-0 text-center">
                  <button
                    type="button"
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="joinUs()"
                  >
                    👉 Reçoit mes emails
                  </button>
                  <button
                    id="rtp-button"
                    type="button"
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="rate()"
                  >
                    ⭐️ Note
                  </button>
                  <button
                    type="button"
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline bg-blue border-5 border-light py-3 px-4 text-xl leading-tight text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-3 h1"
                    @click="tweetItShare()"
                  >
                    ❤️ Partage
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
    const items = await feed()
    // eslint-disable-next-line no-console
    // console.log(res)
    if (items) {
      this.episodes = items
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
      title: 'Les Makers Français les plus chaud !',
      message: 'Suis, ajoute et votes pour tes MAKERS favoris, en bonus tu gagnes une chance de les voir dans le podcast !',
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
      .ref('people')
      .query()
      .orderBy('votes', 'desc')
      .orderBy('addDate', 'asc')
      .run()
      .then((results) => {
        this.people = results.map((data) => {
          data.img = this.personImg(data)
          return data
        })
        this.setSizeHead()
        this.loading = false
      })
  },
  methods: {
    joinUs () {
      this.$modal.show('join')
    },
    rate () {
      this.$modal.show('rate')
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
    personImg (person) {
      return `/api/makers/${person.login}`
    },
    tweetItShare () {
      this.$modal.show('share_hunt')
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
    vote (person) {
      const found = this.findInEp(person.login)
      if (!this.loggin) {
        this.openRegister()
      } else {
        this.$modal.show('loading')
        this.$firebase
          .db
          .ref(`people/${person.id}/votes/${this.loggin.uid}`)
          .set({
            date: Date()
          })
          .then(() => {
            this.$modal.hide('loading')
            person.votes += 1
            this.currentName = '' + person.login
            setTimeout(() => {
              if (found) {
                this.guid = found
                this.$modal.show('found')
              } else {
                this.$modal.show('voted')
              }
            }, 50)
          })
          .catch((error) => {
            this.$modal.hide('loading')
            // eslint-disable-next-line no-console
            console.error('Error writing document: ', error)
            if (found) {
              this.guid = found
              this.$modal.show('found')
            } else {
              this.currentName = '' + person.login
              this.$modal.show('fail-vote')
            }
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
          .func('addTwiterUser', { name: this.addName })
          .then((addJson) => {
            const added = addJson.data
            this.$modal.hide('loading')
            if (added.error && added.error === 'Already voted') {
              this.currentName = '' + this.addName
              this.$modal.show('fail-exist-vote')
            } else if (added.error) {
              // eslint-disable-next-line no-console
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
            // eslint-disable-next-line no-console
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
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.message },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.message },
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
.bigg {
    font-size: 6rem;
    line-height: 0.5;
}
.tumb_up {
  position: absolute;
  bottom: 0px;
  right: 0px;
}
@media screen and (min-width: 768px) {
.tumb_up {
  bottom: -10px;
  font-size: 30px;
  }
}
</style>
