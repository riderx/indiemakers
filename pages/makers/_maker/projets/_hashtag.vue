<template>
  <div v-if="loaded">
    <div
      v-if="!projectData"
      class="flex w-full px-2 py-2 mx-auto text-white md:px-10 md:py-5"
    >
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
        Ce Project n'existe pas
      </button>
    </div>
    <div
      v-if="projectData"
      class="flex w-full px-2 py-2 mx-auto text-white md:px-10 md:py-5"
    >
      <div class="md:w-full md:mx-2">
        <img
          class="object-cover object-center w-full h-80"
          :src="projectData.cover || noCover"
          :alt="'cover project ' + projectData.hashtag"
        />
        <div
          class="
            flex flex-col
            items-center
            p-2
            mb-2
            bg-white
            md:p-10
            text-royalblue-700
            lg:flex-row
          "
        >
          <div class="relative flex items-end">
            <img
              class="
                object-cover object-top
                w-32
                h-32
                border-2
                rounded-lg
                border-royalblue-700
              "
              :src="projectData.logo || noImge"
            />
            <span
              class="
                absolute
                bottom-0
                text-sm text-white
                bg-opacity-75
                rounded-tr-lg rounded-bl-lg
                bg-royalblue-700
              "
              >🔥{{ projectData.streak }}</span
            >
            <div class="mx-3 text-center lg:text-left">
              <h2
                class="text-2xl truncate font-indie"
                :style="getTextColor(projectData.color)"
              >
                {{ projectData.emoji || '' }}
                {{ projectData.name || projectData.hashtag }}
              </h2>
              <p class="my-2 text-xl">{{ projectData.description }}</p>
              <a :href="projectData.website" target="_blank" class="text-lg">{{
                projectData.website
              }}</a>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full md:flex-row">
          <div
            v-if="projectData.postsData && projectData.postsData.total > 0"
            class="w-full p-3 mb-3 bg-white md:p-10 md:w-1/2 md:mb-0"
          >
            <ListPosts :posts="projectData.postsData.posts" :users="users" />
          </div>
          <div
            v-if="projectData.tasksData && projectData.tasksData.total > 0"
            class="w-full p-3 mb-3 bg-white md:p-10 md:w-1/2 md:mb-0"
          >
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
    <PageLoader :show="!loaded" />
  </div>
</template>
<script lang="ts">
import { ref } from '@vue/composition-api'
import {
  defineComponent,
  useFetch,
  useContext,
  useRouter,
  useMeta,
} from '@nuxtjs/composition-api'
import { discordHashtag, discordMakers } from '~/services/rss'
import { createMeta } from '~/services/meta'
import { Project, User } from '~/services/types'

export default defineComponent({
  components: {
    ListPosts: () => import('~/components/ListPosts.vue'),
    ListTasks: () => import('~/components/ListTasks.vue'),
    ListIncomes: () => import('~/components/ListIncomes.vue'),
    PageLoader: () => import('~/components/PageLoader.vue'),
  },
  setup() {
    const noCover =
      'https://res.cloudinary.com/forgr/image/upload/v1621191060/indiemakers/new_cover_fu6fcs.png'
    const { $config, params } = useContext()
    const router = useRouter()
    const loaded = ref(false)
    const users = ref<User[]>([])
    const projectData = ref<Project>()
    const noImge =
      'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'
    const { fetch } = useFetch(async () => {
      const [makerData, pData] = await Promise.all([
        discordMakers($config),
        discordHashtag($config, params.value.maker, params.value.hashtag),
      ])
      users.value = makerData
      if (pData) {
        projectData.value = pData
        loaded.value = true
      }
    })
    fetch()
    useMeta(() => ({
      title:
        projectData.value?.name || projectData.value?.hashtag || 'Pas de titre',
      meta: createMeta(
        projectData.value?.name || projectData.value?.hashtag || 'Pas de titre',
        projectData.value?.description || 'Un jour je serais grand 👶!',
        projectData.value?.logo || noImge
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
    return {
      noImge,
      noCover,
      users,
      projectData,
      loaded,
      getTextColor,
      goHome,
    }
  },
  head: {},
})
</script>
