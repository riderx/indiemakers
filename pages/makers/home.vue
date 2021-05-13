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
      <select id="sort-select" name="sort" class="bg-royalblue-700">
        <option value="flamme">🔥</option>
        <option value="karma">🕉</option>
      </select>
    </div>
    <LaderMakers />
  </div>
</template>
<script>
export default {
  components: {
    LaderMakers: () => import('~/components/LaderMakers.vue'),
    // LazyHydrate
  },
}
</script>
