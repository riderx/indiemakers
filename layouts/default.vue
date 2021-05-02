<template>
  <div>
    <LazyHydrate when-idle>
      <NavBar />
    </LazyHydrate>
    <Modals />
    <Nuxt keep-alive :keep-alive-props="{ max: 10 }" />
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'

export default {
  components: {
    LazyHydrate,
    NavBar: () => import('~/components/NavBar.vue')
  },
  head () {
    return {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'indiemakers.fr'
        },
        { hid: 'og:locale', property: 'og:locale', content: 'fr_FR' }
        // { hid: 'og:article:author', property: 'og:article:author', content: 'Martin DONADIEU' },
      ]
    }
  }
}
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
