<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="relative">
    <div class="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
      <div>
        <a href="/" class="flex">
          <span class="sr-only">Logo INDIE MAKERS</span>
          <img
            :id="logo.title"
            width="100%"
            height="100%"
            :src="logo.source"
            class="w-auto h-8 sm:h-10"
            :alt="logo.title"
            :aria-label="logo.title"
          />
        </a>
      </div>
      <div class="-my-2 -mr-2 md:hidden">
        <button
          type="button"
          class="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md  hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-expanded="false"
          @click="menuMobile = true"
        >
          <span class="sr-only">Ouvrir menu</span>
          <!-- Heroicon name: outline/menu -->
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div class="hidden md:flex-1 md:flex md:items-center md:justify-between">
        <nav class="flex space-x-10">
          <a
            v-for="item in solutions"
            :key="item.name"
            :href="item.href"
            class="p-1 text-base font-medium text-orchid-300 hover:text-orchid-600"
          >
            {{ item.name }}
          </a>
          <div class="relative">
            <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" -->
            <button
              type="button"
              class="inline-flex items-center p-1 text-base font-medium text-gray-500 bg-white rounded-md  group hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-expanded="false"
              @click="menu = !menu"
            >
              <span>Plus</span>
              <!--
              Heroicon name: solid/chevron-down

              Item active: "text-gray-600", Item inactive: "text-gray-400"
            -->
              <svg
                :class="[menu ? 'text-gray-600' : 'text-gray-400', 'ml-2 h-5 w-5 group-hover:text-gray-500']"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!--
            'More' flyout menu, show/hide based on flyout menu state.

            Entering: "transition ease-out duration-200"
              From: "opacity-0 translate-y-1"
              To: "opacity-100 translate-y-0"
            Leaving: "transition ease-in duration-150"
              From: "opacity-100 translate-y-0"
              To: "opacity-0 translate-y-1"
          -->
            <div v-if="menu" class="absolute z-10 w-screen max-w-xs px-2 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0">
              <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div class="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8">
                  <a href="#" class="block p-3 -m-3 rounded-md hover:bg-gray-50">
                    <a
                      v-for="item in resources"
                      :key="item.name"
                      :target="item.target"
                      :href="item.href"
                      class="block p-3 -m-3 rounded-md hover:bg-gray-50"
                    >
                      <p class="text-base font-medium text-gray-900">
                        {{ item.name }}
                      </p>
                      <p class="mt-1 text-sm text-gray-500">
                        {{ item.description }}
                      </p>
                    </a>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div class="flex items-center md:ml-12">
          <a
            href="/makers"
            class="inline-flex items-center justify-center px-4 py-2 ml-8 text-base font-medium text-white border border-transparent rounded-md shadow-sm  bg-orchid-300 hover:bg-orchid-600"
          >
            Communauté
          </a>
        </div>
      </div>
    </div>

    <!--
    Mobile menu, show/hide based on mobile menu state.

    Entering: "duration-200 ease-out"
      From: "opacity-0 scale-95"
      To: "opacity-100 scale-100"
    Leaving: "duration-100 ease-in"
      From: "opacity-100 scale-100"
      To: "opacity-0 scale-95"
  -->
    <div v-if="menuMobile" class="absolute inset-x-0 top-0 z-10 p-2 transition origin-top-right transform md:hidden">
      <div class="bg-white divide-y-2 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-gray-50">
        <div class="px-5 pt-5 pb-6">
          <div class="flex items-center justify-between">
            <div>
              <img
                :id="logo.title"
                width="100%"
                height="100%"
                :src="logo.source"
                class="w-auto h-8"
                :alt="logo.title"
                :aria-label="logo.title"
              />
            </div>
            <div class="-mr-2">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md  hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                @click="menuMobile = false"
              >
                <span class="sr-only">Close menu</span>
                <svg
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6">
            <nav class="grid gap-6">
              <a
                v-for="item in solutions"
                :key="item.name"
                :href="item.href"
                class="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white bg-indigo-500 rounded-md">
                  <div class="w-6 h-6" aria-hidden="true" v-html="item.icon" />
                </div>
                <div class="ml-4 text-base font-medium text-gray-900">
                  {{ item.name }}
                </div>
              </a>
            </nav>
          </div>
        </div>
        <div class="px-5 py-6">
          <div class="grid grid-cols-2 gap-4">
            <a
              v-for="item in resources"
              :key="item.name"
              :target="item.target"
              :href="item.href"
              class="text-base font-medium text-gray-900 hover:text-gray-700"
            >
              {{ item.name }}
            </a>
          </div>
          <div class="mt-6">
            <a
              href="/makers"
              class="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm  bg-orchid-300 hover:bg-orchid-600"
            >
              Communauté
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const solutions = [
  {
    name: 'Podcast',
    description: 'les dernier épisodes du podcast',
    href: '/',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>',
  },
  {
    name: 'Articles',
    description: 'Les derniers articles indie de la communauté',
    href: '/articles',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
  },
  {
    name: 'Makers Hunt',
    description: 'Le classement des Makers les plus demandé dans le podcast',
    href: '/makershunt',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
  },
]
const resources = [
  {
    name: 'Écouter le podcast',
    description: "Choisi ta plateforme préféré d'écoute",
    href: '/',
  },
  {
    name: 'Outils Makers',
    description: 'Découvre les meilleurs outils pour faire tes projets',
    href: '/tools',
  },
  {
    name: 'Le livre',
    description: 'Lancer sa startup en indépendant, publié aux éditions Broché',
    href: 'https://amzn.to/3lXjALg',
    target: '_blank',
  },
  {
    name: 'La Newletter',
    description: 'Suis mon evolution vers les 1k de MRR',
    href: '/newsletter',
  }
]

  const menu = ref(false)
  const menuMobile = ref(false)
  const logo = {
    title: 'INDIE MAKERS LOGO',
    source: 'https://res.cloudinary.com/forgr/image/upload/v1621019061/indiemakers/isolated-monochrome-white_lzhdfh.svg',
    link: '/',
  }
</script>
