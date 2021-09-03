<template>
  <div class="w-full px-5 pt-5">
    <div
      class="
        px-5
        py-5
        mx-auto
        overflow-y-auto
        text-white
        border-4 border-orchid-300
        md:w-full
      "
    >
      <p>
        Bienvenue ! Notre communauté s'entre aider pour crée des business en
        ligne profitable.
      </p>
      <div class="flex flex-wrap pt-3 overflow-hidden">
        <button
          type="button"
          class="
            px-5
            py-2
            mx-auto
            text-white
            border-4 border-white
            font-indie
            hover:text-white hover:bg-white
          "
          @click="joinUs()"
        >
          👉 Rejoins nous
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const joinUs = () => {
      window.open('https://discord.gg/GctKEcDpxk', '_blank')
    }
    return { joinUs }
  },
})
</script>
