<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="relative">
    <div class="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
      <div>
        <a href="/" class="flex">
          <span class="sr-only">Logo Site</span>
          <img
            :id="logo.title"
            width="100%"
            height="100%"
            :src="logo.source"
            class="w-auto h-8 sm:h-10"
            :alt="logo.title"
            :aria-label="logo.title"
          >
        </a>
      </div>
      <div class="-my-2 -mr-2 md:hidden">
        <button type="button" class="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false" @click="menuMobile = true">
          <span class="sr-only">Ouvrir menu</span>
          <!-- Heroicon name: outline/menu -->
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div class="hidden md:flex-1 md:flex md:items-center md:justify-between">
        <nav class="flex space-x-10">
          <a v-for="item in solutions" :key="item.name" :href="item.href" class="p-1 text-base font-medium text-orchid-200 hover:text-gray-900">
            {{ item.name }}
          </a>
          <div class="relative">
            <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" -->
            <button type="button" class="inline-flex items-center p-1 text-base font-medium text-gray-500 bg-white rounded-md group hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-expanded="false" @click="menu = !menu">
              <span>Plus</span>
              <!--
              Heroicon name: solid/chevron-down

              Item active: "text-gray-600", Item inactive: "text-gray-400"
            -->
              <svg :class="[menu ? 'text-gray-600' : 'text-gray-400', 'ml-2 h-5 w-5 group-hover:text-gray-500']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
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
                    <a v-for="item in resources" :key="item.name" :target="item.target" :href="item.href" class="block p-3 -m-3 rounded-md hover:bg-gray-50">
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
          <a href="/login" class="inline-flex items-center justify-center px-4 py-2 ml-8 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-orchid-300 hover:bg-orchid-600">
            Se connecter
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
                :src="logo.sourceMobile"
                class="w-auto h-8"
                :alt="logo.title"
                :aria-label="logo.title"
              >
            </div>
            <div class="-mr-2">
              <button type="button" class="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" @click="menuMobile = false">
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
              <a v-for="item in solutions" :key="item.name" :href="item.href" class="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-50">
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
            <a v-for="item in resources" :key="item.name" :target="item.target" :href="item.href" class="text-base font-medium text-gray-900 hover:text-gray-700">
              {{ item.name }}
            </a>
          </div>
          <div class="mt-6">
            <a href="/login" class="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-orchid-300 hover:bg-orchid-600">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const solutions = [
  {
    name: 'Podcast',
    description: 'les dernier épisodes du podcast',
    href: '/',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>'
  },
  {
    name: 'Articles',
    description: 'Les derniers articles indie de la communauté',
    href: '/articles',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>'
  },
  // {
  //   name: 'Projets',
  //   description: 'Tous les projets fait par la communauté',
  //   href: '/projects',
  //   icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>'
  // },
  {
    name: 'Makers',
    description: 'Le classement des Makers les plus demandé dans le podcast',
    href: '/makers',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>'
  },
  {
    name: 'Communauté',
    description: 'Rejoin la communauté sur discord',
    href: '/discord',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>'
  }
]
const resources = [
  { name: 'Écouter le podcast', description: 'Choisi ta plateforme préféré où l\'écouter.', href: '/' },
  { name: 'Outils Makers', description: 'Découvre les meilleurs outils pour faire ses projets', href: '/tools' },
  { name: 'Tableau Public', description: 'Participe a l\'amélioration de la communauté en votant et proposant de nouvelles fonctionnalitée', href: '/canny' },
  {
    name: 'Le livre',
    description: 'Lancer sa startup en indépendant, publié aux éditions Broché',
    href: 'https://amzn.to/3lXjALg',
    target: '_blank'
  },
  { name: 'Captime | Crossfit timer', description: 'Ton timer comme a la salle', href: 'https://captime.app' },
  { name: 'Bewise | Citation simple', description: 'Une citation par jours pour se sentir mieux, sans pub', href: 'https://bewise.love' },
  { name: 'Mimesis | Jeu de mime', description: 'Fait deviner des expressions a ton équipe en les mimants', href: 'https://mimesis.fun' }
]

export default {
  name: 'NavBar',
  data () {
    return {
      solutions,
      resources,
      menu: false,
      menuMobile: false,
      logo: {
        title: 'INDIE MAKERS LOGO',
        sourceMobile: require('~/assets/images/isolated-monochrome-indigo.svg'),
        source: require('~/assets/images/isolated-monochrome-white.svg'),
        link: '/'
      },
      icones: [
        {
          title: 'Ecoute',
          link: 'modal_listen',
          icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="headphones" class="w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 32C114.52 32 0 146.496 0 288v48a32 32 0 0 0 17.689 28.622l14.383 7.191C34.083 431.903 83.421 480 144 480h24c13.255 0 24-10.745 24-24V280c0-13.255-10.745-24-24-24h-24c-31.342 0-59.671 12.879-80 33.627V288c0-105.869 86.131-192 192-192s192 86.131 192 192v1.627C427.671 268.879 399.342 256 368 256h-24c-13.255 0-24 10.745-24 24v176c0 13.255 10.745 24 24 24h24c60.579 0 109.917-48.098 111.928-108.187l14.382-7.191A32 32 0 0 0 512 336v-48c0-141.479-114.496-256-256-256z"></path></svg>'
        },
        {
          title: 'Communauté le chantier',
          link: '/discord',
          icon: '<svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="discord" class="hidden w-8 sm:block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"></path></svg>'
        },
        {
          title: 'twitter',
          link: 'https://twitter.com/martindonadieu',
          icon: '<svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" class="w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>'
        }
      ],
      bar: true
    }
  },
  methods: {
    openPage (name) {
      if (name.includes('https')) {
        return window.open(name, '_blank')
      } else if (name.includes('modal_')) {
        const nameModal = name.split('modal_')[1]
        if (nameModal) {
          this.$modal.show(nameModal)
        }
      } else {
        this.$router.push(name)
      }
    }
  }
}
</script>
