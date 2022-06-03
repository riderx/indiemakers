<template>
  <div class="flex w-full">
    <div class="w-2/5 md:w-1/4">
      <div class="relative square">
        <img
          v-if="image"
          width="100%"
          height="100%"
          :src="image"
          class="absolute w-full h-full border-4 border-white cursor-pointer w-100 h-100"
          :alt="'Picture ' + title"
          @click="$emit('image')"
        />
        <div v-else class="absolute w-full h-full border-4 border-white cursor-pointer animate-pulse bg-orchid-300 w-100 h-100"></div>
        <div
          v-if="votes"
          class="absolute bottom-0 right-0 px-3 text-center border-4 border-white cursor-pointer tumb_up bg-royalblue-700"
          @click="$emit('voted')"
        >
          👍<br />
          {{ votes }}
        </div>
      </div>
    </div>
    <div class="w-3/5 p-2 overflow-hidden md:w-3/4">
      <h3 v-if="title" class="font-indie md:text-xl md:mb-1">
        {{ title }}
      </h3>
      <h3 v-else class="h-4 animate-pulse bg-orchid-300 md:text-xl md:mb-1"></h3>
      <p v-if="name" class="z-10 text-sm cursor-pointer text-orchid-300 md:mb-1" @click="$emit('name')">@{{ name }}</p>
      <p v-if="date" class="text-sm text-gray-300 md:mb-1">
        {{ date }}
      </p>
      <p v-if="preview" class="text-sm md:leading-7 line-clamp-3" v-html="preview" />
      <div v-else>
        <p class="w-4/5 h-4 mt-3 animate-pulse bg-orchid-300" />
        <p class="w-3/5 h-4 mt-3 animate-pulse bg-orchid-300" />
        <p class="w-2/5 h-4 mt-3 animate-pulse bg-orchid-300" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    title: { type: String, default: null },
    name: { type: String, default: null },
    image: { type: String, default: null },
    date: { type: String, default: null },
    votes: { type: Number, default: null },
    preview: { type: String, default: null },
  })
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .tumb_up {
    /* bottom: -10px; */
    font-size: 20px;
  }
}
</style>
