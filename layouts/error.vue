<template>
  <div class="container mx-auto">
    <div class="flex flex-wrap py-2">
      <div class="w-full mx-auto border-8 md:w-1/2 border-light">
        <img class="w-1/2 mx-auto my-10" src="/404.svg">
        <h1 class="py-2 pl-2 m-0 text-3xl text-center text-white font-indie">
          Tu SEMBLES ÊTRE PERDU!
        </h1>
        <p class="px-5 text-white">
          La page que vous recherchez n'est pas disponible.

          Essayez à nouveau ou utilise le bouton ci-dessous.
        </p>
        <div class="pt-3 pb-3 pl-4 pr-4 mx-auto text-center text-white md:w-1/2">
          <button
            type="button"
            class="px-4 py-1 border-4 rounded-none border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light h1"
            @click="goHome()"
          >
            Acceuil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: String,
      required: true
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
