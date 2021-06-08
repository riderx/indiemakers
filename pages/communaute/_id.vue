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
          <div
            v-for="project in maker.projectsData"
            :key="project.hashtag"
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
          </div>
        </div>
      </div>
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
import Vue from 'vue'
import { discordMakerId, discordHashtag } from '~/services/rss'
import { Project } from '~/services/discord/bot/project'
import { User } from '~/services/discord/bot/user'

export default Vue.extend({
  components: {
    ListTasks: () => import('~/components/ListTasks.vue'),
    ListIncomes: () => import('~/components/ListIncomes.vue'),
  },
  async asyncData({ params, $config }) {
    const maker = await discordMakerId($config, params.id)
    if (maker && maker.projectsData && maker.projectsData.length > 0) {
      return { maker, hashtag: maker.projectsData[0].hashtag }
    }
    return { maker, hashtag: null }
  },
  data() {
    return {
      noCover:
        'https://res.cloudinary.com/forgr/image/upload/v1621191060/indiemakers/new_cover_fu6fcs.png',
      noImge:
        'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg',
      maker: null as unknown as User,
      projectData: null as unknown as Project,
      hashtag: '',
      loaded: false,
      loadedProject: false,
    }
  },
  head() {
    return {
      title: (this as any).maker.name || (this as any).maker.username,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        {
          hid: 'title',
          name: 'title',
          content: (this as any).maker.name || (this as any).maker.username,
        },
        {
          hid: 'description',
          name: 'description',
          content: (this as any).maker.bio || 'Indie Maker en devenir !',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: (this as any).maker.name || (this as any).maker.username,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: (this as any).maker.bio || 'Indie Maker en devenir !',
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: (this as any).maker.name || (this as any).maker.username,
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpg',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: (this as any).maker.avatarUrl,
        },
        { hid: 'og:image:width', property: 'og:image:width', content: '300' },
        { hid: 'og:image:height', property: 'og:image:height', content: '300' },
      ],
    }
  },
  watch: {
    // whenever question changes, this function will run
    hashtag(newId) {
      this.getProject(newId)
    },
  },
  mounted() {
    this.getProject(this.hashtag)
    this.loaded = true
  },
  methods: {
    getBorderColor(color: string | undefined) {
      if (color) {
        return { 'border-color': `#${color}` }
      }
      return {}
    },
    getTextColor(color: string | undefined) {
      if (color) {
        return { color: `#${color}` }
      }
      return {}
    },
    async getProject(hashtag: string): Promise<void> {
      this.loadedProject = false
      this.projectData = await discordHashtag(
        this.$config,
        this.maker.userId,
        hashtag
      )
      this.loadedProject = true
    },
    goHome() {
      this.$router.push('/communaute')
    },
  },
})
</script>
