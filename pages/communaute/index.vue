<template>
  <div>
    <div class="mt-5 text-3xl text-center text-white font-indie">
      La communauté :
    </div>
    <div class="flex flex-col w-full md:flex-row">
      <LadderMakers v-if="loaded" :users="users" />
      <LadderProject v-if="loaded" :projects="projects" />
    </div>

    <div class="flex w-1/4 px-10 py-5 mx-auto text-white">
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
    const dataUser = await discordMakers($config)
    const dataProj = await discordProjects($config)
    return await { ...dataUser, ...dataProj }
  },
  data() {
    return {
      loaded: false,
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
