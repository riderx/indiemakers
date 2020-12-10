<template>
  <div class="flex">
    <div class="w-1/3">
      <img
        v-lazy="getImgObj"
        width="100%"
        height="100%"
        :src="loadingImg"
        class="w-full h-auto border-5 border-white"
        :alt="'Picture ' + title"
      >
    </div>
    <div class="w-2/3 p-2">
      <h3 class="font-indie text-xl mb-1">
        {{ title }}
      </h3>
      <p v-if="name" class="text-indiePink text-sm">
        {{ name }}
      </p>
      <p class="text-sm" v-html="preview" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    title: { type: String, default: null },
    name: { type: String, default: null },
    image: { type: String, default: null },
    votes: { type: String, default: null },
    loadingImage: { type: String, default: null },
    preview: { type: String, default: null }
  },
  data () {
    return {
      loadingImg: require('~/assets/cover-im_empty.png')
    }
  },
  computed: {
    getImgObj () {
      return {
        src: this.image,
        error: require('~/assets/cover-im_user.png'),
        loading: this.loadingImage || require('~/assets/cover-im_empty.png')
      }
    }
  },
  methods: {}
}
</script>

<style>
</style>
