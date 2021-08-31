<template>
  <div>
    <div class="flex flex-wrap overflow-hidden">
      <div class="w-full px-1 pt-1 overflow-hidden sm:pt-5 sm:px-5 sm:w-3/4">
        <Posts v-if="loaded" class="bg-white" :posts="posts" />
      </div>
      <div class="w-full overflow-hidden sm:w-1/4">
        <div class="flex flex-wrap overflow-hidden">
          <div class="w-full overflow-hidden">
            <JoinUs />
          </div>
          <div class="w-full overflow-hidden">
            <LadderMakers v-if="loaded" :users="users" />
          </div>
          <div class="w-full overflow-hidden">
            <LadderProject v-if="loaded" :projects="projects" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { discordMakers, discordProjects, discordPosts } from '~/services/rss'

export default {
  components: {
    JoinUs: () => import('~/components/JoinUs.vue'),
    Posts: () => import('~/components/Posts.vue'),
    LadderMakers: () => import('~/components/LadderMakers.vue'),
    LadderProject: () => import('~/components/LadderProject.vue'),
  },
  async asyncData({ $config }) {
    const users = await discordMakers($config)
    const posts = await discordPosts($config)
    const dataProj = await discordProjects($config)
    return await { users, posts, ...dataProj }
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
