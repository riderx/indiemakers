<template>
  <div class="w-full pt-5">
    <div class="w-11/12 mx-auto mb-3 text-right text-white md:w-full lg:w-1/2">
      <label for="sort-select">Top maker par:</label>
      <select
        id="sort-select"
        v-model="sort"
        name="sort"
        class="border rounded bg-royalblue-700 border-orchid-300"
      >
        <option value="streak">🔥</option>
        <option value="karma">🕉</option>
        <option value="incomes">💰</option>
        <option value="projects">🪴</option>
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
        v-for="maker in sorted"
        :key="maker.username"
        class="flex py-3 border-b-2 cursor-pointer border-orchid-300"
        @click="openProfil(maker.username)"
      >
        <img
          class="object-cover w-12 h-12 border-2 rounded-full border-orchid-300"
          :src="maker.avatarUrl"
          alt="cover profil"
        />
        <div class="flex flex-col mx-3">
          <h1 class="text-lg font-medium" :style="getTextColor(maker.color)">
            {{ maker.emoji || '' }} {{ maker.name || maker.username }}
          </h1>
          <div class="flex text-sm">
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              🔥{{ maker.streak }}
            </p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              🕉 {{ maker.karma }}
            </p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              🪴 {{ maker.projects }}
            </p>
            <p class="px-2 mx-2 bg-white rounded text-royalblue-700">
              💰 {{ maker.incomes }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '~/services/types'
export default Vue.extend({
  name: 'LaderMakers',
  props: {
    users: { type: Array, default: () => [] },
  },
  data() {
    return {
      sort: 'streak',
      sorted: [] as User[],
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
    this.sorted = [...(this.users as User[])]
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
    openProfil(id: string) {
      this.$router.push(`/communaute/${id}`)
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
