<template>
  <div class="flex">
    <div class="w-1/3">
      <img
        v-lazy="getImgObj"
        width="100%"
        height="100%"
        :src="loadingImg"
        class="w-full h-auto border-5 border-white"
        :alt="'Picture ' + episode.title"
      >
    </div>
    <div class="w-2/3 p-2">
      <h3 class="font-indie text-xl mb-1">
        {{ episode.title }}
      </h3>
      <p v-if="episode.social" class="text-indiePink text-sm">
        {{ episode.social.name }}
      </p>
      <p class="text-sm">
        {{ episode.preview }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Episode',
  props: { episode: { type: Object, default: null } },
  data () {
    return {
      loadingImg: require('~/assets/cover-im_empty.png')
    }
  },
  computed: {
    getImgObj () {
      return {
        src: this.episode.image_optimized,
        error: require('~/assets/cover-im_user.png'),
        loading: this.episode.image_loading
      }
    }
  },
  methods: {}
}
</script>

<style>
</style>
