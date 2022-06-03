<template>
  <div>
    <ClientOnly>
      <div class="flex flex-row-reverse overflow-hidden sm:flex-row">
        <div class="w-full px-1 pt-2 overflow-hidden sm:pt-5 sm:px-5 sm:w-3/4">
          <list-posts :posts="posts" :users="users" />
        </div>
        <div class="w-full pb-2 overflow-hidden sm:w-1/4">
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
      <template #fallback>
        <PageLoader show />
      </template>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
  import { createMeta } from '~/services/meta'
  import { Post, Project, User } from '~/services/types'

  const title = 'La communauté plus grande INDIE MAKERS Française'

  const { data: users } = await useFetch<User[]>('/api/makers')
  const { data: posts } = await useFetch<Post[]>('/api/posts')
  const { data: projects } = await useFetch<Project[]>('/api/project')

  useHead(() => ({
    titleTemplate: title,
    meta: createMeta(title, "Découvre les Makers et leurs projets, ensemble on s'aider et se pousser a etre regulier sur nos projets !"),
  }))
</script>
