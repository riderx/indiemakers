<template>
  <div>
    <client-only>
      <div v-if="loaded" class="flex flex-wrap overflow-hidden">
        <div class="w-full px-1 pt-1 overflow-hidden sm:pt-5 sm:px-5 sm:w-3/4">
          <list-posts :posts="posts" :users="users" />
        </div>
        <div class="w-full overflow-hidden sm:w-1/4">
          <div class="flex flex-wrap overflow-hidden">
            <div class="w-full overflow-hidden">
              <join-us />
            </div>
            <div class="w-full overflow-hidden">
              <ladder-makers :users="users" />
            </div>
            <div class="w-full overflow-hidden">
              <ladder-project :projects="projects" />
            </div>
          </div>
        </div>
      </div>
      <PageLoader :show="!loaded" />
    </client-only>
  </div>
</template>
<script lang="ts">
import { ref } from '@vue/composition-api'
import { defineComponent, useFetch, useContext, useMeta } from '@nuxtjs/composition-api'
import { discordMakers, discordProjects, discordPosts } from '~/services/rss'
import { createMeta } from '~/services/meta'
import { Post, Project, User } from '~/services/types'

export default defineComponent({
  setup() {
    const { $config } = useContext()
    const users = ref<User[]>()
    const posts = ref<Post[]>()
    const projects = ref<Project[]>()
    const loaded = ref(false)
    const title = 'La communauté plus grande INDIE MAKERS Française'

    const { fetch } = useFetch(async () => {
      try {
        const [usersData, postsData, projectsData] = await Promise.all([
          discordMakers($config),
          discordPosts($config),
          discordProjects($config),
        ])
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
      } catch (err) {
        console.error(err)
        loaded.value = false
      }
    })
    fetch()
    useMeta(() => ({
      title,
      meta: createMeta(title, "Découvre les Makers et leurs projets, ensemble on s'aider et se pousser a etre regulier sur nos projets !"),
    }))

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
