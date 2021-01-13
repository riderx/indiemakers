<template>
  <LazyHydrate when-visible>
    <div class="flex w-full">
      <div class="relative w-2/5 md:w-1/3">
        <img
          v-lazy="getImgObj"
          width="100%"
          height="100%"
          :src="loadingImg"
          class="w-full h-full border-4 border-white cursor-pointer"
          :alt="'Picture ' + title"
          @click="$emit('image')"
        >
        <div v-if="votes" class="absolute px-3 text-center border-4 cursor-pointer tumb_up border-light bg-indiePurple" @click="$emit('voted')">
          👍<br>
          {{ votes }}
        </div>
      </div>
      <div class="w-3/5 p-2 md:w-2/3">
        <h3 class="font-indie md:text-xl md:mb-1">
          {{ title }}
        </h3>
        <p v-if="name" class="z-10 text-sm cursor-pointer text-indiePink md:mb-1" @click="$emit('name')">
          @{{ name }}
        </p>
        <p v-if="date" class="text-sm text-gray-300 md:mb-1">
          {{ date }}
        </p>
        <p class="text-sm line-clamp" v-html="preview" />
      </div>
    </div>
  </LazyHydrate>
</template>

<script>
export default {
  name: 'ListItem',
  components: {
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    title: { type: String, default: null },
    name: { type: String, default: null },
    image: { type: String, default: null },
    date: { type: String, default: null },
    imageFallback: { type: String, default: null },
    votes: { type: Number, default: null },
    loadingImage: { type: String, default: null },
    preview: { type: String, default: null }
  },
  data () {
    return {
      loadingImg: this.loadingImage || require('~/assets/cover-im_empty.png')
    }
  },
  computed: {
    getImgObj () {
      return {
        src: this.image,
        error: this.imageFallback || require('~/assets/cover-im_user.png'),
        loading: this.loadingImage || require('~/assets/cover-im_empty.png')
      }
    }
  },
  methods: {
  }
}
</script>

<style>
.tumb_up {
  position: absolute;
  bottom: 0px;
  right: 0px;
}
@media screen and (min-width: 768px) {
.tumb_up {
  /* bottom: -10px; */
  font-size: 20px;
  }
}
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
