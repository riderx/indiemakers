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
    >
      <img
        class="object-cover w-12 h-12 border-2 rounded-full border-orchid-300"
        src="https://cdn.hovia.com/app/uploads/Red-Illustrated-Landscape-Sunset-Wallpaper-Mural-plain.jpg"
        alt="cover profil"
      />
      <div class="flex flex-col mx-3">
        <h1 class="text-lg font-medium">
          {{ maker.name }}
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
import { domain } from '~/services/rss'

export default {
  name: 'LaderMakers',
  async asyncData({ $http, $config }) {
    // const data = await discordMakers($config)
    const url = `${domain($config.VERCEL_URL, $config.DOMAIN)}/${
      $config.BASEAPI
    }/ladder`
    return await $http
      .$get(url)
      .then((response) => {
        console.error('makers', response.data)
        return response.data
      })
      .catch((err) => {
        console.error('makers err', err)
        return { users: [], total: 0 }
      })
  },
  data() {
    return {
      users: [],
      total: 0,
    }
  },
  mounted() {
    console.error(this.users)
  },
}
</script>
