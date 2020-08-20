<template>
  <LazyHydrate when-idle>
    <div id="register">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 offset-xl-3 col-xl-6 form-size">
            <div class="bg-primary h-100 text-white border-10 border-light">
              <h1 class="pl-2 py-2 m-0 text-center">
                Mes Emails Privés !
              </h1>
              <p class="px-5">
                Un email chaque semaine avec mes conseils actionables pour lancer son side-projet, et gagner sa liberté ...
              </p>
              <p class="px-5">
                Tu seras également informé de la sortie des épisodes !
              </p>
              <iframe frameborder="0" width="100%" height="100%" src="https://cdn.forms-content.sg-form.com/7b46df84-c9ba-11ea-8d2c-9aae4ee15967" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </LazyHydrate>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'

export default {
  components: {
    LazyHydrate
  },
  data () {
    return {
      title: 'Mes Emails privée',
      desc: 'Un email chaque semaine avec mes conseils actionables pour lancer son side-projet, et gagner sa liberté ...'
    }
  },
  mounted () {
  },
  methods: {
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${process.env.domain}${this.$route.fullPath}` },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'description', name: 'description', content: this.desc },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: this.desc },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.title },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:image', property: 'og:image', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${process.env.domain}${require('~/assets/cover-im@0.5x.png')}` },
        { hid: 'og:image:width', property: 'og:image:width', content: 400 },
        { hid: 'og:image:height', property: 'og:image:height', content: 400 }
      ]
    }
  }
}
</script>

<style scoped>

.form-size {
  height: 550px;
}
@media (max-width: 400px) {
  .form-size {
    height: 650px;
  }
}
</style>
