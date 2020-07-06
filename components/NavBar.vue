<template>
  <div id="header" class="pb-md-5">
    <nav class="navbar navbar-light bg-transparent">
      <a class="navbar-brand w-50 mr-0" href="#" @click="openPage('/')">
        <img :id="logo.title" :src="logo.source" class="d-none d-md-inline-block align-top w-50" :alt="logo.title">
        <img id="IM" :src="logo.source" class="d-inline-block d-md-none align-top w-100" :alt="logo.title">
      </a>
      <ul class="list-group list-group-horizontal">
        <li
          v-for="(icon, index) in icones"
          :key="index"
          class="list-group-item bg-transparent text-white p-2 p-md-3 cursor-pointer"
          @click="openPage(icon.lien)"
        >
          <!-- <i :class="icon.class" /> -->
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
          title: 'Spotify',
          lien: 'https://open.spotify.com/show/6Agf3YmcAdNx4tQMJVoRQg',
          class: ['fab', 'spotify']
        },
        {
          title: 'Instagram',
          lien: `https://instagram.com/${process.env.handler}`,
          class: ['fab', 'instagram']
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
