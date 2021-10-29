<template>
  <div>
    <NavBar />
    <Modals />
    <Nuxt keep-alive :keep-alive-props="{ max: 10 }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRoute, useMeta } from '@nuxtjs/composition-api'
import Modals from '~/components/Modals.vue'
import NavBar from '~/components/NavBar.vue'

export default defineComponent({
  components: {
    Modals,
    NavBar,
  },
  setup() {
    const { $config } = useContext()
    const route = useRoute()
    useMeta(() => ({
      link: [
        {
          rel: 'alternate',
          hreflang: 'x-default',
          title: 'INDIE MAKERS',
          href: `${$config.DOMAIN}${route.value.fullPath}`,
        },
        {
          rel: 'canonical',
          title: 'INDIE MAKERS',
          href: `${$config.DOMAIN}${route.value.fullPath}`,
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: 'indiemakers.fr',
        },
        { hid: 'theme-color', name: 'theme-color', content: '#4b279b' },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'indiemakers.fr',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${$config.DOMAIN}${route.value.fullPath}`,
        },
        { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' },
      ],
    }))
  },
  head: {},
})
</script>

<style>
body {
  overscroll-behavior: none;
  overflow-x: hidden;
  background-color: rgba(75, 39, 155, 1);
}

img:not([src]) {
  display: none;
}

.square::after {
  content: '';
  display: block;
  padding-bottom: 100%;
}

.h-w-screen {
  height: 100vw;
}

.square_content {
  position: absolute;
  width: 100%;
  height: 100%;
}

.custom-scroll {
  scrollbar-color: #f1f1f1 #df99d8;
}

.custom-scroll::-webkit-scrollbar {
  width: 10px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #df99d8;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 39, 155, 1) !important;
}
</style>
