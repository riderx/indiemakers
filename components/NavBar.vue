<template>
  <div id="header" class="pb-md-5">
    <nav class="navbar navbar-light bg-transparent">
      <a class="navbar-brand w-50 mr-0" href="/" @click="openPage('/')">
        <img :id="logo.title" :src="logo.source" class="d-none d-md-inline-block align-top w-50" :alt="logo.title">
        <img id="IM" :src="logo.source" class="d-inline-block d-md-none align-top w-100" :alt="logo.title">
      </a>
      <ul class="list-group list-group-horizontal">
        <li
          v-for="(icon, index) in icones"
          :key="index"
          v-tooltip="'Commence à gagner ta vie sur internet'"
          class="list-group-item bg-transparent text-white p-2 p-md-3 cursor-pointer"
          @click="openPage(icon.lien)"
        >
          <fa :icon="icon.class" class="fa-2x" />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      logo: {
        title: 'INDIE MAKERS LOGO',
        source: require('~/assets/isolated-monochrome-white.svg'),
        lien: '/'
      },
      icones: [
        {
          title: 'Ecoute',
          lien: 'modal_listen',
          class: ['fas', 'headphones']
        },
        {
          title: 'Communauté le chantier',
          lien: 'https://discord.gg/2XyUn3A',
          class: ['fas', 'fa-discord']
        },
        {
          title: 'twitter',
          lien: `https://twitter.com/${process.env.handler}`,
          class: ['fab', 'twitter']
        }
      ],
      bar: true
    }
  },
  methods: {
    openPage (name) {
      if (name.includes('https')) {
        window.open(name, '_blank')
      } if (name.includes('modal_')) {
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

<style scoped>
.fab,
.fas {
  color: white;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.fab:hover,
.fas:hover {
  color: #4b279b;
  transform: scale(1.6);
}
</style>
