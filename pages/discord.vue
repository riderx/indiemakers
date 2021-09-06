<template>
  <div class="container mx-auto">
    <div class="flex flex-wrap py-2">
      <div class="w-full mx-auto border-8 border-white md:w-1/2">
        <img
          :id="logo.title"
          class="w-1/2 pb-5 mx-auto pb-md-3"
          width="100%"
          height="100%"
          :src="logo.source"
          :alt="logo.title"
          :aria-label="logo.title"
        />
        <h1 class="py-2 pl-2 m-0 text-3xl text-center text-white font-indie">
          {{ title }}
        </h1>
        <p class="px-5 text-white">
          {{ desc }}
        </p>
        <p class="px-5 text-white">
          Tu seras également informé de la sortie des épisodes !
        </p>
        <div class="pt-3 pl-4 pr-4 mx-auto text-center md:w-1/2">
          <div class="mb-0 mb-4">
            <input
              ref="name"
              v-model="email"
              type="text"
              class="
                block
                w-full
                px-2
                py-1
                pb-0
                mb-1
                text-base
                leading-normal
                bg-white
                border
                rounded
                appearance-none
                text-grey-darker
                border-grey
              "
              aria-describedby="TweetnameHelp"
              placeholder="Elon@tesla.com"
            />
          </div>
        </div>
        <div class="pt-3 pl-4 pr-4 mx-auto text-center md:w-1/2">
          <div class="mb-4">
            <input
              ref="name"
              v-model="name"
              type="text"
              class="
                block
                w-full
                px-2
                py-1
                pb-0
                mb-1
                text-base
                leading-normal
                bg-white
                border
                rounded
                appearance-none
                text-grey-darker
                border-grey
              "
              aria-describedby="TweetnameHelp"
              placeholder="Elon Musk"
            />
          </div>
        </div>
        <div
          class="pt-3 pb-3 pl-4 pr-4 mx-auto text-center text-white md:w-1/2"
        >
          <button
            type="button"
            class="
              px-4
              py-1
              border-4 border-white
              rounded-none
              hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200
              text-light
              h1
            "
            @click="joinDiscord()"
          >
            Rejoindre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  ref,
  defineComponent,
  useContext,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'
import { createMeta } from '~/services/meta'

export default defineComponent({
  setup() {
    const { $firebase, $modal } = useContext()
    const { title, meta } = useMeta()
    const email = ref('')
    const name = ref('')
    const router = useRouter()
    const logo = {
      title: 'Communauté LOGO',
      source:
        'https://res.cloudinary.com/forgr/image/upload/v1621019061/indiemakers/undraw_connection_b38q_czvwhb.svg',
    }
    const desc =
      "Plus de 300 Makers Français qui construise leur projets et s'entre aide !"
    title.value = 'Rejoint le Discord'
    meta.value = createMeta(
      title.value,
      desc,
      'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg'
    )
    const joinDiscord = () => {
      $firebase.db
        .ref(`users/${email.value}`)
        .set({
          first_name: name.value,
          email: email.value,
        })
        .then(() => {
          window.open('https://discord.gg/GctKEcDpxk', '_blank')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
        .catch(() => {
          $modal.show('already_register')
          window.open('https://discord.gg/GctKEcDpxk', '_blank')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
    }
    return { joinDiscord, logo, title, desc, email, name }
  },
  head: {},
})
</script>
<style scoped>
.form-size {
  height: 750px;
}
@media (max-width: 400px) {
  .form-size {
    height: 800px;
  }
}
</style>
