<template>
  <div v-if="loaded">
    <div v-if="!projectData" class="flex w-1/4 px-10 py-5 mx-auto text-white">
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
    <div v-if="projectData" class="flex flex-col m-5 md:flex-row md:m-10">
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
        <Posts
          v-if="projectData.postsData"
          class="bg-white"
          :posts="projectData.postsData.posts"
        />
      </div>
      <div v-if="projectData && loaded" class="md:w-4/5 md:mx-2">
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
import { discordHashtag } from '~/services/rss'
import { createMeta } from '~/services/meta'
import { Project } from '~/services/types'

export default defineComponent({
  components: {
    ListTasks: () => import('~/components/ListTasks.vue'),
    ListIncomes: () => import('~/components/ListIncomes.vue'),
  },
  setup() {
    const { $config, params } = useContext()
    const router = useRouter()
    const route = useRoute()
    const { title, meta } = useMeta()
    const loaded = ref(false)
    const projectData = ref<Project>()
    const noImge =
      'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'
    const { fetch } = useFetch(async () => {
      const data = await discordHashtag(
        $config,
        params.value.maker,
        params.value.hashtag
      )
      if (data) {
        projectData.value = data
        loaded.value = true
      }
    })
    fetch()
    if (projectData.value) {
      title.value = projectData.value.name || projectData.value.hashtag
      meta.value = createMeta(
        `${$config.DOMAIN}${route.value.fullPath}`,
        title.value,
        projectData.value.description || 'Un jour je serais grand 👶!',
        projectData.value.logo || noImge
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
    const goHome = () => {
      router.push('/communaute')
    }
    return {
      noImge,
      projectData,
      loaded,
      getTextColor,
      goHome,
    }
  },
  head: {},
})
</script>
