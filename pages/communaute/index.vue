<template>
  <div>
    <div class="mt-5 text-3xl text-center text-white font-indie">
      La communauté :
    </div>
    <div class="flex flex-col justify-center w-full md:flex-row">
      <LadderMakers v-if="loaded" :users="users" />
      <LadderProject v-if="loaded" :projects="projects" />
    </div>

    <div class="flex w-full px-10 py-5 mx-auto text-white md:w-1/4">
      <button
        type="button"
        class="
          px-5
          py-2
          mx-auto
          text-white
          border-4 border-white
          font-indie
          hover:text-royalblue-700
          hover:bg-white
        "
        @click="joinUs()"
      >
        👉 Rejoins nous
      </button>
    </div>
  </div>
</template>
<script>
import { discordMakers, discordProjects } from '~/services/rss'
export default {
  components: {
    LadderMakers: () => import('~/components/LadderMakers.vue'),
    LadderProject: () => import('~/components/LadderProject.vue'),
  },
  async asyncData({ $config }) {
    const users = await discordMakers($config)
    const dataProj = await discordProjects($config)
    return await { users, ...dataProj }
  },
  data() {
    return {
      loaded: false,
    }
  },
  head() {
    return {
      title: 'La communauté INDIE MAKERS',
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        {
          hid: 'title',
          name: 'title',
          content: 'La communauté INDIE MAKERS',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            "Découvre les Makers et leurs projets, ensemble on s'aider et se pousser a etre regulier sur nos projets !",
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'La communauté INDIE MAKERS',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            "Découvre les Makers et leurs projets, ensemble on s'aider et se pousser a etre regulier sur nos projets !",
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: 'La communauté INDIE MAKERS',
        },
      ],
    }
  },
  mounted() {
    this.loaded = true
  },
  methods: {
    joinUs() {
      window.open('https://discord.gg/GctKEcDpxk', '_blank')
    },
  },
}
</script>
