<template>
  <div>
    <div class="flex flex-wrap overflow-hidden">
      <div class="w-full px-1 pt-1 overflow-hidden sm:pt-5 sm:px-5 sm:w-3/4">
        <ListPosts v-if="loaded" :posts="posts" />
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
    <PageLoader :show="!loaded" />
  </div>
</template>
<script lang="ts">
import { ref } from '@vue/composition-api'
import {
  defineComponent,
  useFetch,
  useContext,
  useRoute,
  useMeta,
} from '@nuxtjs/composition-api'
import { discordMakers, discordProjects, discordPosts } from '~/services/rss'
import { createMeta } from '~/services/meta'
import { Post, Project, User } from '~/services/types'

export default defineComponent({
  components: {
    JoinUs: () => import('~/components/JoinUs.vue'),
    ListPosts: () => import('~/components/ListPosts.vue'),
    PageLoader: () => import('~/components/PageLoader.vue'),
    LadderMakers: () => import('~/components/LadderMakers.vue'),
    LadderProject: () => import('~/components/LadderProject.vue'),
  },
  setup() {
    const { title, meta } = useMeta()
    const { $config } = useContext()
    const route = useRoute()
    const users = ref([] as User[])
    const posts = ref([] as Post[])
    const projects = ref([] as Project[])
    const loaded = ref(false)

    const { fetch } = useFetch(async () => {
      const usersData = await discordMakers($config)
      const postsData = await discordPosts($config)
      const projectsData = await discordProjects($config)
      if (usersData) {
        users.value = usersData
      }
      if (postsData) {
        posts.value = postsData
      }
      if (projectsData) {
        projects.value = projectsData
      }
      loaded.value = true
    })
    fetch()
    title.value = 'La communauté INDIE MAKERS'
    meta.value = createMeta(
      `${$config.DOMAIN}${route.value.fullPath}`,
      title.value,
      "Découvre les Makers et leurs projets, ensemble on s'aider et se pousser a etre regulier sur nos projets !"
    )
    return {
      loaded,
      users,
      posts,
      projects,
    }
  },
  head: {},
})
</script>
