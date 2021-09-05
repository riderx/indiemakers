<template>
  <div class="container mx-auto">
    <div class="flex flex-wrap py-2">
      <div class="w-full mx-auto border-8 border-white md:w-1/2">
        <img
          :id="logo.title"
          class="w-1/2 mx-auto my-10"
          width="100%"
          height="100%"
          :src="logo.source"
          :alt="logo.title"
          :aria-label="logo.title"
        />
        <h1 class="py-2 pl-2 m-0 text-3xl text-center text-white font-indie">
          Tu SEMBLES ÊTRE PERDU!
        </h1>
        <p class="px-5 text-white">
          La page que vous recherchez n'est pas disponible. Essayez à nouveau ou
          utilise le bouton ci-dessous.
        </p>
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
            @click="goHome()"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
export default defineComponent({
  layout: 'error',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const router = useRouter()
    const logo = {
      title: '404 LOGO',
      source:
        'https://res.cloudinary.com/forgr/image/upload/v1621019061/indiemakers/404_xivjox.svg',
    }
    const goHome = () => {
      router.push('/')
    }
    return { logo, goHome }
  },
})
</script>
