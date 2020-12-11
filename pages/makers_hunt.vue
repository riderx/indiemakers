<template>
  <LazyHydrate when-idle>
    <div id="makers">
      <div class="container px-0 mx-auto w-full">
        <div class="flex flex-wrap">
          <div class="md:w-1/2 md:px-4 w-full">
            <div id="header-mk" class="flex flex-wrap w-full justify-between items-center bg-blue border-10 border-light text-white pb-1 pt-2">
              <h1 class="w-4/5 text-center font-indie text-3xl">
                💃 Makers
              </h1>

              <button
                type="button"
                class="border-0 p-0 text-6xl w-1/5 md:w-1/5 px-4 pb-3"
                @click="showAddForm()"
              >
                +
              </button>
            </div>
            <client-only>
              <div v-if="loading" slot="placeholder" class="flex flex-wrap bg-white px-3">
                <div class="p-5 text-center">
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
                class="custom-scroll fix-marging border-5 border-light border-r-0 w-full"
                :style="{ height: sizeHead }"
              >
                <div
                  v-for="episode in people"
                  :key="episode.id"
                  :class="'w-full flex flex-wrap bg-blue text-white border-b align-items-top ' + episode.id"
                >
                  <ListItem
                    :title="episode.name"
                    :link-image="linkEp(episode.guid)"
                    :link-name="`https://twitter.com/${episode.login}`"
                    :votes="episode.votes"
                    :name="episode.login"
                    :preview="getTextLink(episode.bio)"
                    :image="episode.img"
                    @voted="vote(episode)"
                  />
                </div>
              </div>
            </client-only>
          </div>
          <div id="content" class="md:w-1/2 pr-4 pl-4 pt-0 px-md-5 order-1 order-md-2 hidden xl:block text-white">
            <div class="flex flex-wrap">
              <div class="text-center text-sm-left">
                <h1 class="pb-2 font-indie text-3xl">
                  {{ title }}
                </h1>
              </div>
              <div class="text-left pt-md-5 text-sm">
                <p class="pl-2">
                  Les Makers sont encore méconnue en France !<br><br>
                  Parfois ils ne font pas de personal branding...<br>
                  Parfois ils ne postent qu'en anglais...<br>
                  Et parfois on découvre seulement 10 ans plus tard qui était aux commandes !<br><br>
                  L'écosysteme est le facteur numéro 1 de succès !<br>
                  Ensemble allons plus loin, cassons les barrières vers le succès !<br>
                  C'est pour cela que cette liste existe !<br><br>
                  Comme Producthunt,<br>
                  Vote et ajoute pour tes MAKERS favoris,<br>
                  en bonus tu gagnes une chance de les voir dans le podcast !
                </p>
                <p class="h5 pt-5 font-indie">
                  Tu aimerais qu'un d'eux vienne dans le podcast ?
                </p>
                <p class="pl-2">
                  Vote pour lui en cliquant sur "👍" sur sa photo
                </p>
                <p class="pl-2">
                  Partage sur Twitter ton vote pour montrer ton soutiens au maker,<br>
                  s'il n'est pas encore venue dans le podcast cela le motivera à venir !
                </p>
                <p class="h5 pt-5 font-indie">
                  Ton maker préféré n'est pas dans la liste ?
                </p>
                <p class="pl-2">
                  Clique sur le bonton "+" pour l'ajouter !
                </p>
                <p class="pl-2 pb-4">
                  Partage sur Twitter ton vote, cela le motivera à venir !
                </p>
                <div class="flex justify-between font-indie text-white text-lg w-10/12">
                  <button
                    type="button"
                    class="border-2 border-light px-3 pt-2 pb-1"
                    @click="joinUs()"
                  >
                    👉 Deviens un Maker
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
import { domain } from '../plugins/domain'

export default {
  components: {
    ListItem: () => import('~/components/ListItem.vue'),
    Modals: () => import('~/components/Modals.vue'),
    LazyHydrate
  },
  async fetch () {
    const items = await feed()
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
      title: 'Les Makers Français les plus chaud 🔥',
      message: 'Vote et ajoute tes MAKERS favoris, cela les insite a venir podcast !',
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
    this.setSizeHead()
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
          const found = this.findInEp(data.login)
          data.guid = found
          data.img = this.personImg(data)
          return data
        })
        setTimeout(() => {
          this.setSizeHead()
        }, 500)
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
      let found = null
      this.episodes.forEach((element) => {
        if (element?.twitter?.name === name) {
          found = element.guid
        }
      })
      return found
    },
    personImg (person) {
      return `/api/maker/${person.login}`
    },
    tweetItShare () {
      this.$modal.show('share_hunt')
    },
    linkEp (guid) {
      if (guid) {
        return `/episode/${guid}`
      }
      return null
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
      if (
        process.client &&
        document.getElementById('header-mk') &&
        document.getElementById('header') &&
        document.getElementById('content') &&
        document.getElementById('content').offsetWidth !== window.innerWidth
      ) {
        const size = `${
          document.getElementById('header-mk').offsetHeight +
          document.getElementById('header').offsetHeight +
          5
        }px`
        this.sizeHead = `calc(100vh - ${size})`
      } else {
        this.sizeHead = 'auto'
      }
    }
    // setSizeHead () {
    //   if (process.client &&
    //   document.getElementById('header-mk') &&
    //    document.getElementById('header') &&
    //    document.getElementById('cover') &&
    //    document.getElementById('cover').offsetHeight > 0) {
    //     const size = `${document.getElementById('header-mk').offsetHeight + document.getElementById('header').offsetHeight + 5}px`
    //     this.sizeHead = `calc(100vh - ${size})`
    //   } else {
    //     this.sizeHead = 'auto'
    //   }
    // }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.message },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.message },
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
  font-size: 20px;
  }
}
</style>
