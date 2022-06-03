<template>
  <div>
    <ClientOnly>
      <div v-if="!projectData" class="flex w-full px-2 py-2 mx-auto text-white md:px-10 md:py-5">
        <button
          type="button"
          class="px-5 py-2 mx-auto text-white border-4 border-white font-indie hover:text-royalblue-700 hover:bg-white"
          @click="goHome()"
        >
          Ce Project n'existe pas
        </button>
      </div>
      <div v-if="projectData" class="flex w-full px-2 py-2 mx-auto text-white md:px-10 md:py-5">
        <div class="md:w-full md:mx-2">
          <img
            class="object-cover object-center w-full bg-white h-80"
            :src="projectData.cover || noCover"
            :alt="'cover project ' + projectData.hashtag"
          />
          <div class="flex flex-col items-center p-2 mb-2 bg-white md:p-10 text-royalblue-700 lg:flex-row">
            <div class="relative flex items-end">
              <img
                class="object-cover object-top w-40 h-40 border-2 rounded-lg border-royalblue-700"
                :alt="`logo ${projectData.hashtag}`"
                :src="projectData.logo || noImge"
              />
              <span class="absolute bottom-0 text-sm text-white bg-opacity-75 rounded-tr-lg rounded-bl-lg bg-royalblue-700"
                >🔥{{ projectData.streak }}</span
              >
              <div class="mx-3 text-center lg:text-left">
                <h1 class="text-2xl truncate font-indie" :style="getTextColor(projectData.color)">
                  {{ projectData.emoji || '' }}
                  {{ projectData.name || projectData.hashtag }}
                </h1>
                <h3 class="my-2 text-xl">{{ projectData.description }}</h3>
                <a :href="projectData.website" target="_blank" class="text-lg">{{ projectData.website }}</a>
                <p class="my-2 text-xl">
                  Par:
                  <NuxtLink :to="`/makers/${encodeURIComponent(projectData.userName || '')}`"> {{ projectData.userName || '' }} </NuxtLink>
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full md:flex-row">
            <div v-if="projectData.postsData && projectData.postsData.total > 0" class="w-full p-3 mb-3 bg-white md:p-10 md:w-1/2 md:mb-0">
              <ListPosts :posts="projectData.postsData.posts" :users="users" />
            </div>
            <div v-if="projectData.tasksData && projectData.tasksData.total > 0" class="w-full p-3 mb-3 bg-white md:p-10 md:w-1/2 md:mb-0">
              <ListTasks :all="projectData.tasksData" />
            </div>
            <div
              v-if="projectData.incomesData && projectData.incomesData.total > 0"
              class="w-full p-3 mb-3 bg-white md:p-10 md:w-1/2 md:mb-0"
            >
              <ListIncomes :all="projectData.incomesData" />
            </div>
            <div
              v-if="
                projectData.tasksData &&
                projectData.tasksData.total == 0 &&
                projectData.postsData &&
                projectData.postsData.total == 0 &&
                projectData.incomesData &&
                projectData.incomesData.total == 0
              "
              class="w-full p-3 mb-3 bg-white md:p-10 md:mb-0"
            >
              Ce projet n'as pas encore de revenus, de tache ou de post
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
  import { Project, User } from '~/services/types'
  import ListTasks from '~/components/ListTasks.vue'
  import PageLoader from '~/components/PageLoader.vue'
  import ListPosts from '~/components/ListPosts.vue'
  import ListIncomes from '~/components/ListIncomes.vue'

  const noCover = 'https://res.cloudinary.com/forgr/image/upload/v1621191060/indiemakers/new_cover_fu6fcs.png'
  const router = useRouter()
  const route = useRoute()
  const noImge = 'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'
  const { data: projectData } = await useFetch<Project>(`/api/project?id=${route.params.maker}&hashtag=${route.params.hashtag}`)
  const { data: users } = await useFetch<User[]>('/api/makers')
  useHead(() => ({
    titleTemplate: projectData.value?.name || projectData.value?.hashtag || 'Pas de titre',
    meta: createMeta(
      projectData.value?.name || projectData.value?.hashtag || 'Pas de titre',
      projectData.value?.description || 'Un jour je serais grand 👶!',
      projectData.value?.logo || noImge,
      projectData.value?.userName || ''
    ),
  }))
  const getTextColor = (color: string | undefined) => {
    if (color) {
      return { color: `#${color}` }
    }
    return {}
  }
  const goHome = () => {
    router.push('/makers')
  }
</script>
