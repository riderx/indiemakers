<template>
  <div id="makers">
    <div class="container w-full px-0 mx-auto">
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 md:px-4">
          <div
            id="header-mk"
            class="
              flex flex-wrap
              items-center
              justify-between
              w-full
              text-white
              border-8 border-white
              md:pb-1
              md:pt-2
            "
          >
            <h1
              class="
                w-4/5
                my-2
                text-3xl text-center
                font-indie
                md:text-4xl
                md:my-0
              "
            >
              💃 Makers
            </h1>
            <button
              type="button"
              class="w-1/5 p-0 px-4 -mt-4 text-6xl border-0 md:pb-3"
              @click="showAddForm()"
            >
              +
            </button>
          </div>
          <div
            class="
              overflow-hidden
              border-4 border-white
              md:h-78
              md:overflow-y-scroll
              md:custom-scroll
            "
          >
            <div
              v-for="maker in makers"
              :key="maker.id"
              :class="
                'w-full flex flex-wrap text-white border-b align-items-top ' +
                maker.id
              "
            >
              <ListItem
                :title="maker.name"
                :votes="maker.votes"
                :name="maker.login"
                :image="maker.img"
                :preview="getTextLink(maker.bio)"
                @voted="vote(maker)"
                @name="open(linkTw(maker.login))"
                @image="openImage(maker.guid, maker.login)"
              />
            </div>
          </div>
        </div>
        <div
          id="content"
          class="
            order-1
            hidden
            pt-0
            pl-4
            pr-4
            text-white
            md:w-1/2
            px-md-5
            order-md-2
            xl:block
          "
        >
          <div class="flex flex-wrap">
            <div class="text-center text-sm-left">
              <h1 class="pb-2 text-3xl font-indie">
                {{ title }}
              </h1>
            </div>
            <div class="text-sm text-left pt-md-5">
              <p class="pl-2">
                Les Makers sont encore méconnue en France !<br /><br />
                Parfois ils ne font pas de personal branding...<br />
                Parfois ils ne postent qu'en anglais...<br />
                Et parfois on découvre seulement 10 ans plus tard qui était aux
                commandes !<br /><br />
                L'écosysteme est le facteur numéro 1 de succès !<br />
                Ensemble allons plus loin, cassons les barrières vers le succès
                !<br />
                C'est pour cela que cette liste existe !<br /><br />
                Comme Producthunt,<br />
                Vote et ajoute pour tes MAKERS favoris,<br />
                en bonus tu gagnes une chance de les voir dans le podcast !
              </p>
              <p class="pt-5 h5 font-indie">
                Tu aimerais qu'un d'eux vienne dans le podcast ?
              </p>
              <p class="pl-2">
                Vote pour lui en cliquant sur "👍" sur sa photo
              </p>
              <p class="pl-2">
                Partage sur Twitter ton vote pour montrer ton soutiens au
                maker,<br />
                s'il n'est pas encore venue dans le podcast cela le motivera à
                venir !
              </p>
              <p class="pt-5 h5 font-indie">
                Ton maker préféré n'est pas dans la liste ?
              </p>
              <p class="pl-2">Clique sur le bonton "+" pour l'ajouter !</p>
              <p class="pb-4 pl-2">
                Partage sur Twitter ton vote, cela le motivera à venir !
              </p>
              <div
                class="
                  flex
                  justify-between
                  w-10/12
                  text-lg text-white
                  font-indie
                "
              >
                <button
                  type="button"
                  class="
                    px-5
                    py-2
                    border-4 border-white
                    font-indie
                    hover:text-royalblue-700
                    hover:bg-white
                  "
                  @click="joinUs()"
                >
                  👉 Deviens un Maker
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import linkifyHtml from 'linkifyjs/html'
import { makers } from '~/services/rss'

export default {
  components: {
    ListItem: () => import('~/components/ListItem.vue'),
  },
  async asyncData({ $config }) {
    const mkrs = await makers($config)
    return { makers: mkrs }
  },
  data() {
    return {
      title: 'Les Makers Français les plus chaud 🔥',
      message:
        'Vote et ajoute tes MAKERS favoris, cela les insite a venir podcast !',
      email: '',
      guid: null,
      isFalse: false,
      user: false,
      sizeHead: '100vh',
      people: [],
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
        { hid: 'description', name: 'description', content: this.message },
        { hid: 'og:title', property: 'og:title', content: this.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.message,
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
          content: `https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg`,
        },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 },
      ],
    }
  },
  mounted() {
    this.setSizeHead()
    this.$modal.show('loading')
    this.$firebase.auth.listen((user) => {
      this.$modal.hide('loading')
      this.user = user
      if (this.user && this.user.displayName === null) {
        this.$modal.show('confirmName')
      }
    })
  },
  methods: {
    joinUs() {
      this.$modal.show('join')
    },
    openImage(guid, login) {
      if (guid) {
        this.$warehouse.set('epFound', guid)
        this.open(`/episode/${guid}`)
      } else if (login) {
        this.$warehouse.get('tweetMaker', login)
        this.$modal.show('fail-open-ep')
      }
    },
    open(url) {
      if (url && url.startsWith('http')) {
        window.open(url, '_blank')
      } else if (url && url.startsWith('/episode/')) {
        this.$modal.show('found')
      } else if (url) {
        this.$router.push(url)
      }
    },
    linkTw(login) {
      return `https://twitter.com/${login}`
    },
    linkEp(guid, login) {
      if (guid) {
        this.$warehouse.set('epFound', guid)
        return `/episode/${guid}`
      }
      return this.linkTw(login)
    },
    getTextLink(text) {
      return linkifyHtml(text, {
        defaultProtocol: 'https',
        className: 'linkified',
        ignoreTags: [],
        format(value, type) {
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
          url: '_blank',
        },
        validate: true,
      })
    },
    vote(person) {
      if (!this.user) {
        this.openRegister()
      } else {
        this.$modal.show('loading')
        this.$firebase.db
          .ref(`people/${person.id}/votes/${this.user.uid}`)
          .set({
            date: Date(),
          })
          .then(() => {
            this.$modal.hide('loading')
            person.votes += 1
            setTimeout(() => {
              if (person.guid) {
                this.$warehouse.set('epFound', person.guid)
                this.$modal.show('found')
              } else {
                this.$warehouse.set('tweetMaker', person.login)
                this.$modal.show('voted')
                this.reload()
              }
            }, 50)
          })
          .catch((error) => {
            this.$modal.hide('loading')
            // eslint-disable-next-line no-console
            console.error('Error writing document: ', error)
            if (person.guid) {
              this.guid = person.guid
              this.$modal.show('found')
            } else {
              this.$warehouse.set('tweetMaker', person.login)
              this.$modal.show('fail-vote')
            }
          })
      }
    },
    openRegister() {
      this.$modal.show('register')
    },
    openAdd() {
      this.$modal.show('add')
    },
    showAddForm() {
      if (!this.user) {
        this.openRegister()
      } else {
        this.openAdd()
      }
    },
    setSizeHead() {
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
    },
  },
}
</script>
