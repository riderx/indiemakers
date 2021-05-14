<template>
  <div
    class="
      w-11/12
      px-10
      py-5
      mx-auto
      overflow-y-auto
      text-white
      border-2
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
      :key="maker.id"
      class="flex py-3 border-b-2 border-orchid-300"
      @click="openProfil(maker.id)"
    >
      <img
        class="object-cover w-12 h-12 border-2 rounded-full border-orchid-300"
        :src="maker.avatarUrl"
        alt="cover profil"
      />
      <div class="flex flex-col mx-3">
        <h1 class="text-lg font-medium">
          {{ maker.name || maker.username }}
        </h1>
        <div class="flex text-sm">
          <p class="mr-2">🔥{{ maker.streak }}</p>
          <p>🕉 {{ maker.karma }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LaderMakers',
  props: {
    users: { type: Array, default: () => [] },
  },
  methods: {
    openProfil(id) {
      console.log('click', id)
      this.$router.push(id)
    },
  },
}
</script>
