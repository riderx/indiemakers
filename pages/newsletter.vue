<template>
  <div class="container mx-auto">
    <div class="flex flex-wrap py-2">
      <div class="w-full mx-auto border-8 border-white md:w-1/2">
        <img
          :id="logo.title"
          class="w-1/4 pb-5 mx-auto pb-md-3"
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
        <p class="px-5 text-white">Tu seras également informé de la sortie des épisodes !</p>
        <div class="pt-3 pl-4 pr-4 mx-auto text-center md:w-1/2">
          <div class="mb-0 mb-4">
            <input
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
        <div class="pt-3 pb-3 pl-4 pr-4 mx-auto text-center md:w-1/2">
          <button
            type="button"
            class="
              px-4
              py-1
              text-white
              border-4 border-white
              rounded-none
              hover:border-gray-200 hover:text-royalblue-700 hover:bg-gray-200
              text-light
              h1
            "
            @click="addEMailSub()"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { createMeta } from '~/services/meta'
  import { $vfm } from 'vue-final-modal'
import { useMainStore } from '~~/store/main';

  const { $firebase } = useNuxtApp()
  const name = ref('')
  const email = ref('')
  const router = useRouter()
  const main = useMainStore()
  const logo = {
    title: 'Newletter LOGO',
    source: 'https://res.cloudinary.com/forgr/image/upload/v1621019061/indiemakers/newsletter_hlctgq.svg',
  }
  const desc =
    '💥Tu ne sais pas par où commencer ton projet ? Je te confie mes actions sur mes projets et sur le podcast ! Chaque semaine directement dans ta boîte mail. 💌'
  const title = 'Mes Emails Hebdo'
  useHead(() => ({
    titleTemplate: title,
    meta: createMeta(
      title,
      desc,
      'https://res.cloudinary.com/forgr/image/upload/v1621181948/indiemakers/bot_cover-im_akq50z.jpg',
      'Martin Donadieu'
    ),
  }))

  const addEMailSub = () => {
    $firebase.db
      .ref(`users/${email.value}`)
      .set({
        first_name: name.value,
        email: email.value,
      })
      .then(() => {
        main.modal = 'thanks_register'
        setTimeout(() => {
          router.push('/')
        }, 2000)
      })
      .catch(() => {
        main.modal = 'already_register'
        setTimeout(() => {
          router.push('/')
        }, 2000)
      })
  }
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
