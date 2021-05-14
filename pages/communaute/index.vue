<template>
  <div>
    <div class="my-10 text-3xl text-center font-indie text-orchid-300">
      Les makers de la communauté :
    </div>
    <div
      class="
        w-11/12
        mx-auto
        mb-3
        text-right text-white
        md:w-1/2
        lg:w-1/3
        xl:w-1/4
      "
    >
      <label for="sort-select">Top maker par:</label>
      <select
        id="sort-select"
        v-model="sort"
        name="sort"
        class="bg-royalblue-700"
      >
        <option value="streak">🔥</option>
        <option value="karma">🕉</option>
      </select>
    </div>
    <LadderMakers v-if="loaded" :users="users" />
  </div>
</template>
<script>
import { discordMakers } from '~/services/rss'
export default {
  components: {
    LadderMakers: () => import('~/components/LadderMakers.vue'),
    // LazyHydrate
  },
  async asyncData({ $config }) {
    const data = await discordMakers($config)
    return await data
  },
  data() {
    return {
      sort: 'streak',
      loaded: false,
    }
  },
  watch: {
    // whenever question changes, this function will run
    sort(newSort) {
      this.users.sort((a, b) => b[newSort] - a[newSort])
    },
  },
  mounted() {
    this.users.sort((a, b) => b[this.sort] - a[this.sort])
    this.loaded = true
  },
}
</script>
