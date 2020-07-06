<template>
  <div id="makers">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 offset-xl-1 col-xl-5">
          <div id="header-mk" class="row bg-primary border-10 border-light py-1 py-md-4">
            <div class="col col-md-10 pt-3 px-0 text-white text-center">
              <h1>🔥Makers</h1>
            </div>
            <div class="col-3 col-md-2 pt-3 text-white">
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
                :class="'row bg-primary text-white py-3 border-bottom align-items-top ' + person.id"
              >
                <div class="col-4 pr-0 pr-md-5">
                  <img
                    :src="person.img"
                    class="w-100 w-md-75 img-fluid border-5 border-light"
                    :alt="'Picture ' + person.name"
                    @error="imgUrlAlt"
                  >
                </div>
                <div class="col-5 col-md-6">
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
                    <p class="text-center text-md-left px-3 px-md-0 d-none d-md-block" v-html="getTextLink(person.bio)" /></p>
                  </div>
                </div>
                <div class="col-3 col-md-2 pl-0" @click="vote(person)">
                  <button
                    v-tooltip="tooltipVote(person)"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white px-3 px-md-4 py-3 h1"
                  >
                    <fa :icon="['fas', 'play-circle']" class="fa-2x invisible" />
                    <div class="position-absolute ml-2 top">
                      <fa :icon="['fas', 'caret-up']" class="fa-2x" />
                      <p>{{ person.votes }}</p>
                    </div>
                  </button>
                </div>
                <div class="col-12 px-md-5 pt-3 d-block d-md-none">
                  <p class v-html="getTextLink(person.bio)" />
                </div>
              </div>
            </div>
          </client-only>
        </div>
        <div id="content" class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2 d-none d-xl-block">
          <img id="cover" class="img-fluid border-10 border-light" alt="IM COVER" :src="image">
        </div>
      </div>
    </div>
    <client-only>
      <modal height="auto" adaptive :click-to-close="isFalse" name="loading">
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
      <modal height="auto" adaptive name="error">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😨 Quelque chose n'as pas marché</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Essais plus tard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="found">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>Cet Episode existe !</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Grace a ton vote et ceux des autres, ce·tte maker a accepter de venir dans le podcast !</p>
                  <p>Merci ❤❤</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="openEp(guid)"
                  >
                    Ecouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="added">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>🏄‍♂️ Ajout pris en compte</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p>J'ai supposé que tu voulais aussi voter pour lui/elle, alors c'est fait .✅</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                  <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetIt()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-add">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>👀Je ne trouve pas ce·tte Maker</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Je ne peut pas ajouter de Maker qui n'est pas sur Twitter pour le moment.</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="$modal.hide('fail-add')"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-vote">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😨 Hoho</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>tu as deja voté pour ce·tte Maker</p>
                  <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetIt(name)"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-exist">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😝 OUPS</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Ce·tte maker est déjà présent dans la liste, J'ai ajouté ton vote pour lui/elle.</p>
                  <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetIt()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-exist-vote">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😝 OUPS</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Ce·tte maker est déjà présent dans la liste, et tu as déjà voté pour lui/elle 😇.</p>
                  <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetIt()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="add">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>👌Ajouter un·e Maker</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Saisie le nom de son compte Twitter</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                  <div class="form-group mb-0">
                    <input
                      ref="addMaker"
                      v-model="addName"
                      type="text"
                      class="form-control pb-0"
                      aria-describedby="TweetnameHelp"
                      placeholder="elonmusk"
                      @keyup.enter="add()"
                    >
                  </div>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="add()"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="voted">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>💪Vote pris en compte</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white">
                  <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                  <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetIt()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="checkEmail">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>✅Check ta boite email</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Récupère ton lien de login reçût par email et click dessus, c'est tout❤️</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="$modal.hide('checkEmail')"
                  >
                    😎Cool
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="register">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>🔐Pas tout de suite !</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white">
                  <p>Pour pouvoir te tenir au courant de la sortie de l'épisode et éviter les faux votes</p>
                  <h5 class="text-center">
                    j’ai besoin que tu valides ton email
                  </h5>
                  <p>Tu ne recevras des emails seulement pour les makers pour qui tu as voté, et si j'ai une grande nouvelle a te partager (max 3 par ans).</p>
                  <p>Et bien entendu, je ne refile ton e-mail à personne, je déteste ceux qui font ça !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                  <div class="form-group mb-0">
                    <input
                      ref="register"
                      v-model="email"
                      type="email"
                      class="form-control pb-0"
                      aria-describedby="emailHelp"
                      placeholder="elon@musk.com"
                      @keyup.enter="sendLogin()"
                    >
                  </div>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="sendLogin()"
                  >
                    🚀VALIDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
    </client-only>
  </div>
</template>

<script>
import linkifyHtml from 'linkifyjs/html'
import { feed } from '../plugins/rss'
const linkTwitter = 'Son Twitter : <a href="https://twitter.com/USERNAME">@USERNAME</a>'
const defaultImg = require('~/assets/people-default.svg')

export default {
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
      email: '',
      guid: null,
      episodes: [],
      image: require('~/assets/cover-imf@0.5x.png'),
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
    // this.$modal.show("voted");
    // this.$modal.show("loading");
    // this.$modal.show("error");
    // this.$modal.show("added");
    // this.$modal.show("checkEmail");
    // this.openRegister();
    // this.openAdd();
    // this.$modal.show("fail-add");
    // this.$modal.show("fail-vote");
    this.loggin = this.$fireAuth.currentUser
    this.email = window.localStorage.getItem('emailForSignIn')
    this.$fireAuth.onAuthStateChanged((user) => {
      this.loggin = user
      if (this.loggin && this.loggin.displayName === null) {
        this.$router.push('/login')
      }
    })
    await this.$bind(
      'people',
      this.$fireStore
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
    openEp (guid) {
      this.$router.push(`/episode/${guid}`)
    },
    tooltipVote (person) {
      return `Voter pour avoir ${person.name} dans le podcast`
    },
    personImg (person) {
      return `https://twitter-avatar.now.sh/${person.login}`
    },
    imgUrlAlt (event) {
      event.target.src = defaultImg
    },
    tweetIt () {
      const text = `@${this.currentName}, j'aimerais beaucoup que tu sois le·a prochain invité·e du podcast @${process.env.handler} 🚀.`
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
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
        this.$fireAuth
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
        this.$fireStore.collection(`people/${person.id}/votes`)
          .doc(this.loggin.uid)
          .set({
            date: Date()
          })
          .then(() => {
            this.$modal.hide('loading')
            person.votes += 1
            this.currentName = '' + person.login
            this.$modal.show('voted')
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
        this.$fireFunc.httpsCallable('addTwiterUser')({ name: this.addName })
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
    setSizeHead () {
      if (process.client && document.getElementById('header-mk') && document.getElementById('header') && document.getElementById('cover') && document.getElementById('cover').offsetHeight > 0) {
        const size = `${document.getElementById('header-mk').offsetHeight + document.getElementById('header').offsetHeight + 5}px`
        this.sizeHead = `calc(100vh - ${size})`
      } else {
        this.sizeHead = 'auto'
      }
    }
  }
}
</script>

<style scoped>

</style>
