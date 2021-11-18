<template>
  <div id="makers">
    <div class="container w-full px-0 mx-auto">
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 md:px-4">
          <div id="header-mk" class="flex flex-wrap items-center justify-between w-full text-white border-8 border-white md:pb-1 md:pt-2">
            <div class="w-4/5 my-2 text-3xl text-center font-indie md:text-4xl md:my-0">💃 Makers</div>
            <button type="button" class="w-1/5 p-0 px-4 -mt-4 text-6xl border-0 md:pb-3" @click="showAddForm()">+</button>
          </div>
          <div class="overflow-hidden border-4 border-white md:h-78 md:overflow-y-scroll md:custom-scroll">
            <div
              v-for="maker in makers"
              :key="maker.id_str"
              :class="'w-full flex flex-wrap text-white border-b align-items-top ' + maker.id_str"
            >
              <ListItem
                :title="maker.name"
                :votes="maker.votes"
                :name="maker.login"
                :image="maker.pic"
                :preview="getTextLink(maker.bio)"
                @voted="vote(maker)"
                @name="open(linkTw(maker.login))"
                @image="openImage(maker.id_str, maker.login)"
              />
            </div>
          </div>
        </div>
        <div id="content" class="order-1 hidden pt-0 pl-4 pr-4 text-white md:w-1/2 px-md-5 order-md-2 xl:block">
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
                Et parfois on découvre seulement 10 ans plus tard qui était aux commandes !<br /><br />
                L'écosysteme est le facteur numéro 1 de succès !<br />
                Ensemble allons plus loin, cassons les barrières vers le succès !<br />
                C'est pour cela que cette liste existe !<br /><br />
                Comme Producthunt,<br />
                Vote et ajoute pour tes MAKERS favoris,<br />
                en bonus tu gagnes une chance de les voir dans le podcast !
              </p>
              <p class="pt-5 h5 font-indie">Tu aimerais qu'un d'eux vienne dans le podcast ?</p>
              <p class="pl-2">Vote pour lui en cliquant sur "👍" sur sa photo</p>
              <p class="pl-2">
                Partage sur Twitter ton vote pour montrer ton soutiens au maker,<br />
                s'il n'est pas encore venue dans le podcast cela le motivera à venir !
              </p>
              <p class="pt-5 h5 font-indie">Ton maker préféré n'est pas dans la liste ?</p>
              <p class="pl-2">Clique sur le bonton "+" pour l'ajouter !</p>
              <p class="pb-4 pl-2">Partage sur Twitter ton vote, cela le motivera à venir !</p>
              <div class="flex justify-between w-10/12 text-lg text-white font-indie">
                <button
                  type="button"
                  class="px-5 py-2 border-4 border-white font-indie hover:text-royalblue-700 hover:bg-white"
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
<script lang="ts">
// import linkifyHtml from 'linkifyjs/html'
import linkifyHtml from 'linkify-html'
import { ref, onMounted, defineComponent, useFetch, useContext, useRouter, useMeta } from '@nuxtjs/composition-api'
import { makers as getMakers } from '~/services/rss'
import { Person } from '~/services/types'
import { createMeta } from '~/services/meta'

export interface UserInfo {
  displayName: string | null
  email: string | null
  phoneNumber: string | null
  photoURL: string | null
  providerId: string
  uid: string
}

export default defineComponent({
  setup() {
    const { $config, $firebase, $modal, $warehouse } = useContext()
    const router = useRouter()
    const user = ref({} as UserInfo)
    const sizeHead = ref('')
    const guid = ref()
    const title = 'Les Makers Français les plus chaud 🔥'
    const message = 'Vote et  pour tes MAKERS favoris, cela les insiteras a venir parler de leur parcours dans le podcast !'
    const makers = ref([] as Person[])
    onMounted(() => {
      setSizeHead()
      $modal.show('loading')
      $firebase.auth.listen((usr: UserInfo) => {
        $modal.hide('loading')
        user.value = usr
        if (user.value && user.value.displayName === null) {
          $modal.show('confirmName')
        }
      })
    })
    const { fetch } = useFetch(async () => {
      const mkr = await getMakers($config)
      if (!mkr) {
        return
      }
      makers.value = mkr
    })
    fetch()
    useMeta(() => ({
      title,
      meta: createMeta(title, message, 'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg'),
    }))
    const linkTw = (login: string) => {
      return `https://twitter.com/${login}`
    }
    const joinUs = () => {
      $modal.show('join')
    }
    const openImage = (guid: string, login: string) => {
      if (guid) {
        $warehouse.set('epFound', guid)
        open(`/episode/${guid}`)
      } else if (login) {
        $warehouse.get('tweetMaker', login)
        $modal.show('fail-open-ep')
      }
    }
    const open = (url: string) => {
      if (url && url.startsWith('http')) {
        window.open(url, '_blank')
      } else if (url && url.startsWith('/episode/')) {
        $modal.show('found')
      } else if (url) {
        router.push(url)
      }
    }
    const getTextLink = (text: string) => {
      return linkifyHtml(text, {
        defaultProtocol: 'https',
        className: 'linkified',
        ignoreTags: [],
        format(value: any, type: any) {
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
    }
    const vote = (person: Person) => {
      if (!user.value) {
        openRegister()
      } else {
        $modal.show('loading')
        $firebase.db
          .ref(`people/${person.id_str}/votes/${user.value.uid}`)
          .set({
            date: Date(),
          })
          .then(() => {
            $modal.hide('loading')
            person.votes += 1
            setTimeout(() => {
              if (person.id_str) {
                $warehouse.set('epFound', person.id_str)
                $modal.show('found')
              } else {
                $warehouse.set('tweetMaker', person.login)
                $modal.show('voted')
              }
            }, 50)
          })
          .catch((error: any) => {
            $modal.hide('loading')
            // eslint-disable-next-line no-console
            console.error('Error writing document: ', error)
            if (person.id_str) {
              guid.value = person.id_str
              $modal.show('found')
            } else {
              $warehouse.set('tweetMaker', person.login)
              $modal.show('fail-vote')
            }
          })
      }
    }
    const openRegister = () => {
      $modal.show('register')
    }
    const openAdd = () => {
      $modal.show('add')
    }
    const showAddForm = () => {
      if (!user.value) {
        openRegister()
      } else {
        openAdd()
      }
    }
    const setSizeHead = () => {
      const docHeaderMk = document.getElementById('header-mk')
      const docHeader = document.getElementById('header')
      const docContent = document.getElementById('content')
      if (process.client && docHeaderMk && docHeader && docContent && docContent.offsetWidth !== window.innerWidth) {
        const size = `${docHeaderMk.offsetHeight + docHeader.offsetHeight + 5}px`
        sizeHead.value = `calc(100vh - ${size})`
      } else {
        sizeHead.value = 'auto'
      }
    }
    return {
      makers,
      linkTw,
      joinUs,
      title,
      showAddForm,
      vote,
      getTextLink,
      openImage,
    }
  },
  head: {},
})
</script>
