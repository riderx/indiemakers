<template>
  <div class="w-full pt-5">
    <div class="w-11/12 mx-auto mb-3 text-right text-white md:w-full lg:w-1/2">
      <label for="sort-select">Top Projets par:</label>
      <select
        id="sort-select"
        v-model="sort"
        name="sort"
        class="border rounded bg-royalblue-700 border-orchid-300"
      >
        <option value="streak">🔥</option>
        <option value="tasks">💗</option>
        <option value="incomes">💰</option>
      </select>
    </div>
    <div
      class="
        w-11/12
        px-5
        py-5
        mx-auto
        overflow-y-auto
        border-4
        bg-gray-50
        text-royalblue-700
        border-orchid-300
        md:w-full
        lg:w-1/2
        h-60
      "
    >
      <div
        v-for="project in sorted"
        :key="project.hashtag"
        class="flex py-3 border-b-2 border-orchid-300"
        @click="openProject(project.userId, project.hashtag)"
      >
        <img
          class="object-cover w-12 h-12 border-2 rounded-full border-orchid-300"
          :src="project.logo || noImge"
          alt="cover profil"
        />
        <div class="flex flex-col mx-3">
          <h1 class="text-lg font-medium" :style="getTextColor(project.color)">
            {{ project.emoji || '' }} {{ project.name || project.hashtag }}
          </h1>
          <div class="flex text-sm">
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              🔥{{ project.streak }}
            </p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              💗 {{ project.tasks }}
            </p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              💰 {{ project.incomes }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Project } from '~/services/discord/bot/project'
export default Vue.extend({
  name: 'LaderProject',
  props: {
    projects: { type: Array, default: () => [] },
  },
  data() {
    return {
      sort: 'streak',
      sorted: [] as Project[],
      noImge:
        'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg',
    }
  },
  watch: {
    sort(newSort) {
      this.sortAll(newSort)
    },
  },
  mounted() {
    this.sorted = [...(this.projects as Project[])]
    this.sortAll(this.sort)
  },
  methods: {
    sortAll(sort: string) {
      this.sorted.sort((a, b) => (b as any)[sort] - (a as any)[sort])
    },
    getTextColor(color: string | undefined) {
      if (color) {
        return { color: `#${color}` }
      }
      return {}
    },
    openProject(id: string, hashtag: string) {
      console.error(id, hashtag)
      // this.$router.push(`/communaute/maker/${encodeURI(id)}/projet/${hashtag}`)
    },
  },
})
</script>
<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23df99d8'><polygon points='0,0 100,0 50,50'/></svg>")
    no-repeat;
  background-size: 12px;
  background-position: calc(100% - 10px) center;
  background-repeat: no-repeat;
  width: 50px;
}
</style>
