<template>
  <div v-if="maker && loaded">
    <div class="relative">
      <img
        class="object-cover object-top w-full h-72"
        :src="maker.cover || noCover"
        :alt="'cover profil ' + maker.username"
      />
      <img
        class="
          absolute
          inset-x-0
          object-cover
          mx-auto
          border-8
          rounded-full
          -bottom-1/4
          h-36
          w-36
          border-orchid-300
        "
        :src="maker.avatarUrl"
        :alt="'image profil ' + maker.username"
      />
    </div>
    <div class="flex flex-col items-center justify-center">
      <h1
        class="mt-20 text-3xl font-medium text-white font-indie"
        :style="getTextColor(maker.color)"
      >
        {{ maker.emoji || '' }} {{ maker.name || maker.username }}
      </h1>
      <h3 v-if="maker.bio" class="mb-3 text-2xl text-orchid-300">
        {{ maker.bio }}
      </h3>
      <div class="flex items-center justify-center">
        <p
          class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700"
        >
          🕉 {{ maker.karma }}
        </p>
        <p
          class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700"
        >
          🔥 {{ maker.streak }}
        </p>
        <p
          class="px-4 py-1 mx-3 text-lg bg-white rounded-lg text-royalblue-700"
        >
          💰 {{ maker.incomes }} €
        </p>
      </div>
    </div>
    <div v-if="!hashtag" class="flex w-1/4 px-10 py-5 mx-auto text-white">
      <button
        type="button"
        class="
          px-5
          py-2
          mx-auto
          text-white
          border-4 border-white
          font-indie
          hover:text-royalblue-700 hover:bg-white
        "
        @click="goHome()"
      >
        Ce maker n'as pas encore de projets
      </button>
    </div>
    <div v-if="hashtag" class="flex flex-col m-5 md:flex-row md:m-10">
      <div
        class="
          p-5
          mb-2
          text-lg
          bg-white
          text-royalblue-700
          md:p-10 md:mb-0 md:w-2/5
          lg:w-1/5
        "
      >
        <h1
          class="
            hidden
            mb-5
            text-3xl
            md:block
            text-royalblue-700
            lg:mb-10
            font-indie
          "
        >
          🪴 {{ maker.projects }} Projets
        </h1>
        <div class="flex w-full overflow-x-scroll md:flex-col">
          <NuxtLink
            v-for="project in maker.projectsData"
            :key="project.hashtag"
            :to="`/communaute/maker/${encodeURI(maker.username)}/projet/${
              project.hashtag
            }`"
            class="flex-none my-4 ml-3 cursor-pointer md:my-2 lg:my-4 md:ml-0"
            @click="hashtag = project.hashtag"
          >
            <div class="relative flex items-end">
              <img
                class="
                  object-cover object-top
                  w-16
                  h-16
                  border-2
                  rounded-lg
                  border-royalblue-700
                "
                :src="project.logo || noImge"
              />
              <h2
                class="mx-1 text-2xl truncate font-indie"
                :style="getTextColor(project.color)"
              >
                {{ project.emoji || '' }} {{ project.name || project.hashtag }}
              </h2>
              <span
                class="
                  absolute
                  bottom-0
                  text-sm text-white
                  bg-opacity-75
                  rounded-tr-lg rounded-bl-lg
                  bg-royalblue-700
                "
                >🔥{{ project.streak }}</span
              >
            </div>
          </NuxtLink>
        </div>
      </div>
      <NuxtChild />
      <div v-if="projectData && loadedProject" class="md:w-4/5 md:mx-2">
        <div
          class="
            flex flex-col
            items-center
            p-10
            mb-2
            bg-white
            text-royalblue-700
            lg:flex-row
          "
        >
          <img
            class="
              object-cover
              w-32
              h-32
              mb-5
              border-2
              rounded-lg
              border-royalblue-700
              lg:mb-0 lg:mr-3
            "
            :src="projectData.logo || noImge"
          />
          <div class="text-center lg:text-left">
            <h1
              class="text-3xl font-indie"
              :style="getTextColor(projectData.color)"
            >
              {{ projectData.emoji || '' }}
              {{ projectData.name || projectData.hashtag }}
              <span class="text-base">🔥{{ projectData.streak }}</span>
            </h1>
            <p class="my-2 text-xl">{{ projectData.description }}</p>
            <a :href="projectData.website" target="_blank" class="text-lg">{{
              projectData.website
            }}</a>
          </div>
        </div>
        <div class="flex w-full">
          <ListTasks
            v-if="projectData.tasksData"
            :all="projectData.tasksData"
          />
          <ListIncomes
            v-if="projectData.incomesData"
            :all="projectData.incomesData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
import {
  defineComponent,
  useFetch,
  useContext,
  useRouter,
  useRoute,
  useMeta,
} from '@nuxtjs/composition-api'
import { User, Project } from '~/services/types'
import { discordMakerId, discordHashtag } from '~/services/rss'
import { createMeta } from '~/services/meta'

export default defineComponent({
  setup() {
    const { $config, params } = useContext()
    const router = useRouter()
    const route = useRoute()
    const { title, meta } = useMeta()
    const loaded = ref(false)
    const loadedProject = ref(false)
    const projectData = ref<Project>()
    const maker = ref<User>()
    const hashtag = ref<string>()
    const noCover =
      'https://res.cloudinary.com/forgr/image/upload/v1621191060/indiemakers/new_cover_fu6fcs.png'
    const noImge =
      'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'
    const { fetch } = useFetch(async () => {
      const data = await discordMakerId($config, params.value.maker)
      if (data && data.projectsData && data.projectsData.length > 0) {
        maker.value = data
        hashtag.value = data.projectsData[0].hashtag
        getProject(hashtag.value)
        loaded.value = true
      }
    })
    fetch()
    if (maker.value) {
      title.value = maker.value.name || maker.value.username
      meta.value = createMeta(
        `${$config.DOMAIN}${route.value.fullPath}`,
        maker.value.name || maker.value.username,
        maker.value.bio || 'Un jour je serais grand 👶!',
        maker.value.cover || noImge
      )
    }
    onMounted(() => {
      loaded.value = true
    })
    const getTextColor = (color: string | undefined) => {
      if (color) {
        return { color: `#${color}` }
      }
      return {}
    }
    const getProject = async (hashtag: string): Promise<void> => {
      if (maker.value) {
        loadedProject.value = false
        const proj = await discordHashtag($config, maker.value.userId, hashtag)
        if (proj) {
          projectData.value = proj
          loadedProject.value = true
        }
      }
    }
    const goHome = () => {
      router.push('/communaute')
    }
    return {
      maker,
      projectData,
      loadedProject,
      hashtag,
      loaded,
      noCover,
      noImge,
      goHome,
      getTextColor,
    }
  },
  head: {},
})
</script>
