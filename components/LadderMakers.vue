<template>
  <div class="w-full pt-5">
    <div class="w-11/12 w-full mx-auto mb-3 text-right text-white">
      <label for="sort-select">Top maker par:</label>
      <select id="sort-select" v-model="sort" name="sort" class="border rounded bg-royalblue-700 border-orchid-300">
        <option value="karma">🕉 Karma</option>
        <option value="streak">🔥 Flammes</option>
        <option value="projects">🪴 Projets</option>
        <option value="tasks">💗 Taches</option>
        <option value="incomes">💰 Revenue</option>
      </select>
    </div>
    <div class="w-11/12 w-full px-5 py-5 mx-auto overflow-y-auto border-4 bg-gray-50 text-royalblue-700 border-orchid-300 h-60">
      <NuxtLink
        v-for="maker in sorted()"
        :key="maker.userId"
        :to="`/makers/${encodeURIComponent(maker.username || '')}`"
        class="flex py-3 border-b-2 cursor-pointer border-orchid-300"
      >
        <img class="object-cover w-12 h-12 border-2 rounded-full border-orchid-300" :src="maker.avatarUrl" alt="cover profil" />
        <div class="flex flex-col mx-3">
          <h4 class="text-lg font-medium" :style="getTextColor(maker.color)">{{ maker.emoji || '' }} {{ maker.name || maker.username }}</h4>
          <div class="flex text-sm">
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">🕉 {{ maker.karma }}</p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">🔥{{ maker.streak }}</p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">🪴 {{ maker.projects }}</p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">💗 {{ maker.tasks }}</p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">💰 {{ maker.incomes }} €</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter } from '@nuxtjs/composition-api'
import { User } from '~/services/types'

export default defineComponent({
  props: {
    users: { type: Array as () => User[], default: () => [] },
  },
  setup({ users }) {
    const router = useRouter()
    const noImge = 'https://res.cloudinary.com/forgr/image/upload/v1621441258/indiemakers/cover-im_unknow_ukenjd.jpg'
    const sort = ref('karma')
    const sorted = () => (users ? users.slice().sort((a, b) => (b as any)[sort.value] - (a as any)[sort.value]) : [])
    const getTextColor = (color: string | undefined) => {
      if (color) {
        return { color: `#${color}` }
      }
      return {}
    }
    const openProfil = (id: string) => {
      router.push(`/makers/${encodeURIComponent(id)}`)
    }
    return { sort, sorted, getTextColor, openProfil, noImge }
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
  width: 120px;
}
</style>
