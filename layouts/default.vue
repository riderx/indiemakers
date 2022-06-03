<template>
  <div>
    <NavBar />
    <Modals />
    <slot />
  </div>
</template>

<script setup lang="ts">
  import Modals from '~/components/Modals.vue'
  import NavBar from '~/components/NavBar.vue'

  const config = useRuntimeConfig()
  const route = useRoute()
  useHead(() => ({
    link: [
      {
        rel: 'alternate',
        title: 'INDIE MAKERS',
        href: `${config.baseUrl}/${route.fullPath}`,
      },
      {
        rel: 'canonical',
        title: 'INDIE MAKERS',
        href: `${config.baseUrl}/${route.fullPath}`,
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'keywords',
        property: 'keywordse',
        content: 'podcast, indie makers, indie hackers, bootsstrappers, independants, entrepreneurs, Makers, business',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: config.domain,
      },
      { hid: 'theme-color', name: 'theme-color', content: '#4b279b' },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: config.domain,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: `${config.baseUrl}/${route.fullPath}`,
      },
      { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' },
    ],
  }))
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
