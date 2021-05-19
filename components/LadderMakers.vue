<template>
  <div
    class="
      w-11/12
      px-10
      py-5
      mx-auto
      overflow-y-auto
      text-white
      border-4
      bg-royalblue-700
      border-orchid-300
      md:w-1/2
      lg:w-1/3
      xl:w-1/4
      h-60
    "
  >
    <div
      v-for="maker in users"
      :key="maker.username"
      class="flex py-3 border-b-2 cursor-pointer border-orchid-300"
      @click="openProfil(maker.userId)"
    >
      <img
        class="object-cover w-12 h-12 border-2 rounded-full border-orchid-300"
        :src="maker.avatarUrl"
        alt="cover profil"
      />
      <div class="flex flex-col mx-3">
        <h1 class="text-lg font-medium">
          {{ maker.emoji || '' }} {{ maker.name || maker.username }}
        </h1>
        <div class="flex text-sm">
          <p class="mr-2">🔥{{ maker.streak }}</p>
          <p class="mr-2">🕉 {{ maker.karma }}</p>
          <p class="mr-2">🪴 {{ maker.projects }} €</p>
          <p class="mr-2">💰 {{ maker.incomes }} €</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'LaderMakers',
  props: {
    users: { type: Array, default: () => [] },
  },
  methods: {
    openProfil(id: string) {
      this.$router.push(`/communaute/${id}`)
    },
  },
})
</script>
