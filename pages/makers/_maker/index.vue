<template>
  <div v-if="maker && loaded">
    <div class="relative">
      <img class="object-cover object-top w-full bg-white h-72" :src="maker.cover || noCover" :alt="'cover profil ' + maker.username" />
      <img
        class="absolute inset-x-0 object-cover mx-auto border-8 rounded-full -bottom-1/4 h-36 w-36 border-orchid-300"
        :src="maker.avatarUrl"
        :alt="'image profil ' + maker.username"
      />
    </div>
    <div class="flex flex-col items-center justify-center mx-3 md:mx-0">
      <h1 class="mt-20 text-3xl font-medium text-white font-indie" :style="getTextColor(maker.color)">
        {{ maker.emoji || '' }} {{ maker.name || maker.username }}
      </h1>
      <h3 v-if="maker.bio" class="mb-3 text-2xl text-orchid-300">
        {{ maker.bio }}
      </h3>
      <div class="flex items-center justify-center">
        <p class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700">🕉 {{ maker.karma }}</p>
        <p class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700">🔥 {{ maker.streak }}</p>
        <p class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700">🪴 {{ maker.projects }}</p>
        <p class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700">💗 {{ maker.streak }}</p>
        <p class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700">💰 {{ maker.incomes }} €</p>
      </div>
    </div>
    <div v-if="!hashtag" class="flex w-1/4 px-10 py-5 mx-auto text-white">
      <button
        type="button"
        class="px-5 py-2 mx-auto text-white border-4 border-white font-indie hover:text-royalblue-700 hover:bg-white"
        @click="goHome()"
      >
        Ce maker n'as pas encore de projets
      </button>
    </div>
    <div v-if="hashtag" class="flex flex-col m-5 md:flex-row md:m-10">
      <div class="mb-2 text-lg bg-white md:p-5 text-royalblue-700 md:mb-0 md:w-2/5 lg:w-1/5">
        <h1
          class="hidden text-3xl cursor-pointer md:block text-royalblue-700 lg:mb-5 font-indie"
          :class="{
            'border-b-4 border-orchid-300 pb-3': hashtag === 'feed',
          }"
          @click="setHastag('feed')"
        >
          📰 Journal
        </h1>
        <div class="flex w-full overflow-x-scroll md:flex-col">
          <a
            v-for="project in maker.projectsData"
            :key="project.hashtag"
            :class="{
              'border-b-4 border-orchid-300 pb-3': hashtag === project.hashtag,
            }"
            class="flex-none my-4 ml-3 cursor-pointer hover:text-orchid-600 md:my-2 lg:my-4 md:ml-0"
            @click="setHastag(project.hashtag)"
          >
            <div class="relative flex items-center">
              <img class="object-cover object-top w-16 h-16 border-2 rounded-lg border-royalblue-700" :src="project.logo || noImge" />
              <span class="absolute bottom-0 text-sm text-white bg-opacity-75 rounded-tr-lg rounded-bl-lg bg-royalblue-700"
                >🔥{{ project.streak }}</span
              >
              <h2 class="mx-1 text-2xl truncate font-indie" :style="getTextColor(project.color)">
                {{ project.emoji || '' }} {{ project.name || project.hashtag }}
              </h2>
              <NuxtLink
                class="hidden"
                :to="`/makers/${encodeURIComponent(maker.username || '')}/projets/${encodeURIComponent(project.hashtag)}`"
                >{{ project.hashtag }}</NuxtLink
              >
            </div>
          </a>
        </div>
      </div>
      <NuxtChild />
      <div v-if="!projectData && maker.postsData && loadedProject" class="w-full mx-0 md:w-4/5 md:mx-2">
        <ListPosts :posts="maker.postsData" :users="users" />
      </div>
      <div v-else-if="projectData && loadedProject" class="md:w-4/5 md:mx-2">
        <div class="flex flex-col items-center p-2 mb-2 bg-white md:p-5 text-royalblue-700 lg:flex-row">
          <div class="relative flex items-end">
            <img class="object-cover object-top w-32 h-32 border-2 rounded-lg border-royalblue-700" :src="projectData.logo || noImge" />
            <span class="absolute bottom-0 text-sm text-white bg-opacity-75 rounded-tr-lg rounded-bl-lg bg-royalblue-700"
              >🔥{{ projectData.streak }}</span
            >
            <div class="mx-3 text-center lg:text-left">
              <h2 class="text-2xl truncate cursor-pointer font-indie" :style="getTextColor(projectData.color)" @click="openProject()">
                <NuxtLink :to="`/makers/${encodeURIComponent(maker.username || '')}/projets/${encodeURIComponent(projectData.hashtag)}`">
                  {{ projectData.emoji || '' }}
                  {{ projectData.name || projectData.hashtag }}
                </NuxtLink>
              </h2>
              <p class="my-2 text-xl">{{ projectData.description }}</p>
              <a :href="projectData.website" target="_blank" class="text-lg">{{ projectData.website }}</a>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full md:flex-row">
          <div v-if="projectData.postsData && projectData.postsData.total > 0" class="w-full p-3 mb-3 bg-white md:p-5 md:w-1/2 md:mb-0">
            <ListPosts :posts="projectData.postsData.posts" :users="users" />
          </div>
          <div v-if="projectData.tasksData && projectData.tasksData.total > 0" class="w-full p-3 mb-3 bg-white md:p-5 md:w-1/2 md:mb-0">
            <ListTasks :all="projectData.tasksData" />
          </div>
          <div v-if="projectData.incomesData && projectData.incomesData.total > 0" class="w-full p-3 mb-3 bg-white md:p-5 md:w-1/2 md:mb-0">
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
    <PageLoader :show="!loaded || !loadedProject" />
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, useFetch, useContext, useRouter, useMeta } from '@nuxtjs/composition-api'
import { User, Project } from '~/services/types'
import { discordMakerId, discordHashtag, discordMakers } from '~/services/rss'
import { createMeta } from '~/services/meta'

export default defineComponent({
  components: {
    ListTasks: () => import('~/components/ListTasks.vue'),
    PageLoader: () => import('~/components/PageLoader.vue'),
    ListPosts: () => import('~/components/ListPosts.vue'),
    ListIncomes: () => import('~/components/ListIncomes.vue'),
  },
  setup() {
    const { $config, params } = useContext()
    const router = useRouter()
    const loaded = ref(false)
    const loadedProject = ref(false)
    const projectData = ref<Project>()
    const maker = ref<User>()
    const users = ref<User[]>()
    const hashtag = ref<string>()
    const noCover = 'https://res.cloudinary.com/forgr/image/upload/v1621191060/indiemakers/new_cover_fu6fcs.png'
    const noImge = 'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'
    const { fetch } = useFetch(async () => {
      const [makerData, usersData] = await Promise.all([discordMakerId($config, params.value.maker), discordMakers($config)])
      users.value = usersData
      if (makerData) {
        maker.value = makerData
        if (makerData.postsData && makerData.postsData?.length > 0) {
          hashtag.value = 'feed'
          loadedProject.value = true
        } else if (makerData.projectsData && makerData.projectsData.length > 0) {
          hashtag.value = makerData.projectsData[0].hashtag
          getProject(hashtag.value)
        } else {
          loadedProject.value = true
        }
        loaded.value = true
      }
    })
    fetch()
    useMeta(() => ({
      title: maker.value?.name || maker.value?.username || '',
      meta: createMeta(
        maker.value?.name || maker.value?.username || 'inconue',
        maker.value?.bio || 'Un jour je serais grand 👶!',
        maker.value?.avatarUrl || noImge
      ),
    }))

    const setHastag = (ht: string) => {
      hashtag.value = ht
      if (ht !== 'feed') {
        getProject(hashtag.value)
      } else {
        projectData.value = undefined
      }
    }
    const openProject = () => {
      if (maker.value && hashtag.value)
        router.push(`/makers/${encodeURIComponent(maker.value?.username)}/projets/${encodeURIComponent(hashtag.value)}`)
    }
    const getTextColor = (color: string | undefined) => {
      if (color) {
        return { color: `#${color}` }
      }
      return {}
    }
    const getProject = async (hashtag: string): Promise<void> => {
      if (maker.value) {
        loadedProject.value = false
        const proj = await discordHashtag($config, maker.value.username, hashtag)
        if (proj) {
          projectData.value = proj
          loadedProject.value = true
        }
      }
    }
    const goHome = () => {
      router.push('/makers')
    }
    return {
      maker,
      users,
      projectData,
      loadedProject,
      setHastag,
      hashtag,
      loaded,
      noCover,
      noImge,
      goHome,
      openProject,
      getTextColor,
    }
  },
  head: {},
})
</script>
