<template>
  <div v-if="user && loaded">
    <div class="relative">
      <img
        class="object-cover w-full h-72"
        src="https://cdn.hovia.com/app/uploads/Red-Illustrated-Landscape-Sunset-Wallpaper-Mural-plain.jpg"
        alt="cover profil"
      />
      <img
        class="
          absolute
          inset-x-0
          object-cover
          mx-auto
          border-2
          rounded-full
          -bottom-1/4
          h-36
          w-36
          border-orchid-300
        "
        :src="user.avatarUrl"
        alt="cover profil"
      />
    </div>
    <div class="flex flex-col items-center justify-center">
      <h1 class="mt-20 text-3xl font-medium text-orchid-300 font-indie">
        {{ user.name || user.username }}
      </h1>
      <p class="px-4 py-1 text-lg bg-white rounded-lg text-royalblue-700">
        🕉 {{ user.karma }}
      </p>
      <p class="px-4 py-1 text-lg bg-white rounded-lg text-royalblue-700">
        🔥 {{ user.streak }}
      </p>
    </div>
    <div class="flex flex-col m-5 md:flex-row md:m-10">
      <div
        class="
          p-5
          mb-2
          text-lg
          bg-white
          text-royalblue-700
          md:p-10
          md:mb-0
          md:w-2/5
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
          Projets {{ user.projects }}
        </h1>
        <div class="flex w-full overflow-x-scroll md:flex-col">
          <div
            v-for="project in user.projectsData"
            :key="project.hashtag"
            class="flex-none my-4 ml-3 md:my-2 lg:my-4 md:ml-0"
            @click="projectId = project.hashtag"
          >
            <div class="relative flex items-end">
              <img
                class="
                  object-cover
                  w-10
                  h-10
                  border
                  rounded-lg
                  border-royalblue-700
                "
                :src="project.logo"
              />
              <h2 class="mx-1 truncate">
                {{ project.name }}
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
          </div>
        </div>
      </div>
      <div v-if="user.projectsData && loadedProject" class="md:w-4/5 md:mx-2">
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
              border
              rounded-lg
              border-royalblue-700
              lg:mb-0
              lg:mr-3
            "
            :src="projectData.logo"
          />
          <div class="text-center lg:text-left">
            <h1 class="text-3xl font-indie">
              {{ projectData.name }}
              <span class="text-base">🔥{{ projectData.streak }}</span>
            </h1>
            <p class="my-2 text-xl">{{ projectData.description }}</p>
            <a :href="projectData.website" target="_blank" class="text-lg">{{
              projectData.website
            }}</a>
          </div>
        </div>
        <ListTasks
          v-if="loaded && projectData.tasksData"
          :tasks="projectData.tasksData.tasks"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { discordMakerId, discordProjectId } from '~/services/rss'
import { Project } from '~/services/discord/bot/project'
import { User } from '~/services/discord/bot/user'

export default {
  components: {
    ListTasks: () => import('~/components/ListTasks.vue'),
  },
  async asyncData({ params, $config }) {
    const user = await discordMakerId($config, params.id)
    if (user && user.projectsData && user.projectsData.length > 0) {
      return { user, projectId: user.projectsData[0].hashtag }
    }
    return { user, projectId: null }
  },
  data() {
    return {
      user: null as User,
      projectData: null as Project,
      projectId: '',
      loaded: false,
      loadedProject: false,
    }
  },
  watch: {
    // whenever question changes, this function will run
    projectId(newId) {
      console.log('watch', newId)
      this.getProject(newId)
    },
  },
  mounted() {
    // this.projectId = this.user.projectsData[0].hashtag
    console.log('this.projectId', this.projectId)
    this.getProject(this.projectId)
    this.loaded = true
  },
  methods: {
    async getProject(id: string) {
      this.loadedProject = false
      this.projectData = await discordProjectId(
        this.$config,
        this.user.userId,
        id
      )
      this.loadedProject = true
    },
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>
