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
  import { createMetaImage } from '~~/services/meta';

  const config = useRuntimeConfig()
  const route = useRoute()
  const image = `${config.baseUrl}/im_shared.webp`
  useHead(() => ({
    link: [
      {
        rel: 'alternate',
        title: 'INDIE MAKERS',
        href: `${config.baseUrl}${route.fullPath}`,
      },
      {
        rel: 'canonical',
        title: 'INDIE MAKERS',
        href: `${config.baseUrl}${route.fullPath}`,
      },
    ],
    meta: [
      {
        hid: 'og:url',
        property: 'og:url',
        content: `${config.baseUrl}${route.fullPath}`,
      },
      ...createMetaImage(image),
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
