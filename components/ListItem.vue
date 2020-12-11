<template>
  <div class="flex w-full">
    <div class="relative w-1/3">
      <img
        v-lazy="getImgObj"
        width="100%"
        height="100%"
        :src="loadingImg"
        class="w-full h-auto border-5 border-white cursor-pointer"
        :alt="'Picture ' + title"
        @click="openImage()"
      >
      <div v-if="votes" class="absolute cursor-pointer tumb_up px-3 my-3 my-md-2 border-5 border-light text-center bg-indiePurple" @click="vote()">
        👍<br>
        {{ votes }}
      </div>
    </div>
    <div class="w-2/3 p-2">
      <h3 class="font-indie text-xl mb-1">
        {{ title }}
      </h3>
      <p v-if="name" class="text-indiePink text-sm mb-1 z-10 cursor-pointer" @click="openLink()">
        @{{ name }}
      </p>
      <p class="text-sm line-clamp" v-html="preview" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    title: { type: String, default: null },
    name: { type: String, default: null },
    linkName: { type: String, default: null },
    linkImage: { type: String, default: null },
    image: { type: String, default: null },
    imageFallback: { type: String, default: null },
    votes: { type: Number, default: null },
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
        error: this.imageFallback || require('~/assets/cover-im_user.png'),
        loading: this.loadingImage || require('~/assets/cover-im_empty.png')
      }
    }
  },
  methods: {
    vote () {
      console.log('voted')
      this.$emit('voted')
    },
    openLink () {
      if (this.linkName) {
        window.open(this.linkName, '_blank')
      }
    },
    openImage () {
      if (this.linkImage) {
        this.$router.push(this.linkImage)
      }
    }
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
  bottom: -10px;
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
