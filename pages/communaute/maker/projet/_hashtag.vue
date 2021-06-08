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
      ></div>
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
import { discordHashtag } from '~/services/rss'
import { Project } from '~/services/discord/bot/project'

export default Vue.extend({
  components: {
    ListTasks: () => import('~/components/ListTasks.vue'),
    ListIncomes: () => import('~/components/ListIncomes.vue'),
  },
  async asyncData({ params, $config }) {
    const projectData = await discordHashtag(
      $config,
      params.maker,
      params.hashtag
    )
    return { projectData }
  },
  data() {
    return {
      noCover:
        'https://res.cloudinary.com/forgr/image/upload/v1621191060/indiemakers/new_cover_fu6fcs.png',
      noImge:
        'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg',
      projectData: null as unknown as Project,
      loaded: false,
    }
  },
  head() {
    return {
      title:
        (this as any).projectData.name || (this as any).projectData.hashtag,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.DOMAIN}${this.$route.fullPath}`,
        },
        {
          hid: 'title',
          name: 'title',
          content:
            (this as any).projectData.name || (this as any).projectData.hashtag,
        },
        {
          hid: 'description',
          name: 'description',
          content:
            (this as any).projectData.description ||
            'Un jour je serais grand 👶!',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            (this as any).projectData.name || (this as any).projectData.hashtag,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            (this as any).projectData.description ||
            'Un jour je serais grand 👶!',
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content:
            (this as any).projectData.name || (this as any).projectData.hashtag,
        },
        {
          hid: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpg',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: (this as any).projectData.logo || (this as any).noImge,
        },
        { hid: 'og:image:width', property: 'og:image:width', content: '300' },
        { hid: 'og:image:height', property: 'og:image:height', content: '300' },
      ],
    }
  },
  mounted() {
    this.loaded = true
  },
  methods: {
    getTextColor(color: string | undefined) {
      if (color) {
        return { color: `#${color}` }
      }
      return {}
    },
    goHome() {
      this.$router.push('/communaute')
    },
  },
})
</script>
