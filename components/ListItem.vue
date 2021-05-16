<template>
  <div class="flex w-full">
    <div class="w-2/5 md:w-1/4">
      <div class="relative square">
        <client-only>
          <img
            width="100%"
            height="100%"
            :src="image"
            class="
              absolute
              w-full
              h-full
              border-4 border-white
              cursor-pointer
              w-100
              h-100
            "
            :alt="'Picture ' + title"
            @click="$emit('image')"
          />
        </client-only>
        <div
          v-if="votes"
          class="
            absolute
            bottom-0
            right-0
            px-3
            text-center
            border-4 border-white
            cursor-pointer
            tumb_up
            bg-royalblue-700
          "
          @click="$emit('voted')"
        >
          👍<br />
          {{ votes }}
        </div>
      </div>
    </div>
    <div class="w-3/5 p-2 overflow-hidden md:w-3/4">
      <h3 class="font-indie md:text-xl md:mb-1">
        {{ title }}
      </h3>
      <p
        v-if="name"
        class="z-10 text-sm cursor-pointer text-orchid-300 md:mb-1"
        @click="$emit('name')"
      >
        @{{ name }}
      </p>
      <p v-if="date" class="text-sm text-gray-300 md:mb-1">
        {{ date }}
      </p>
      <p class="text-sm md:leading-7 line-clamp-3" v-html="preview" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListItem',
  props: {
    title: { type: String, default: null },
    name: { type: String, default: null },
    image: { type: String, default: '' },
    date: { type: String, default: null },
    votes: { type: Number, default: null },
    preview: { type: String, default: null },
  },
  methods: {},
}
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .tumb_up {
    /* bottom: -10px; */
    font-size: 20px;
  }
}
</style>
