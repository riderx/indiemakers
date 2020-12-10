<template>
  <div>
    <div class="offset-2 offset-md-0 w-2/3 md:w-1/3 pr-4 pl-4 order-1 order-md-2 px-0 py-3 py-md-0">
      <img
        v-lazy="getImgObj"
        width="100%"
        height="100%"
        :src="loadingImg"
        class="w-full w-md-75 max-w-full h-auto border-5 border-light"
        :alt="'Picture ' + episode.title"
      >
    </div>
    <div class="w-1/62 md:w-2/3 pr-4 pl-4 order-2 p-2 order-md-2 text-center text-md-left">
      <h3>{{ episode.title }}</h3>
      <p
        v-if="episode.social"
        class="text-green fit-content cursor-pointer mb-0 hidden md:block"
      >
        @{{ episode.social.name }}
      </p>
      <div class="text-center text-md-left px-3 px-md-0 hidden md:block">
        <p>
          {{ episode.preview }}
        </p>
      </div>
    </div>
    <div class="w-1/62 px-0 px-md-5 pt-1 pt-md-3 order-3 block d-mhidden">
      <p
        v-if="episode.social"
        class="text-green text-center text-md-left mb-0"
      >
        {{ episode.social.name }}
      </p>
      <p class="text-center text-md-left px-3 px-md-0">
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
  methods: {

  }
}
</script>

<style>

</style>
