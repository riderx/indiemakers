<template>
  <LazyHydrate when-idle>
    <div id="emission">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 offset-xl-1 col-xl-5">
            <div v-if="loading" class="row bg-white px-3">
              <div class="col-12 p-5 text-center">
                <div
                  class="spinner-grow text-primary"
                  style="width: 6rem; height: 6rem;"
                  role="status"
                >
                  <span class="sr-only">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modals />
    </div>
  </LazyHydrate>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { feed } from '~/plugins/rss'

export default {
  components: {
    LazyHydrate
  },
  async fetch () {
    const res = await feed()
    if (res && res.items) {
      const element = res.items[0]
      this.guid = element.guid
    }
  },
  data () {
    return {
      guid: null,
      loading: true
    }
  },
  mounted () {
    if (this.guid) {
      this.$router.push(`/episode/${this.guid}`)
    } else {
      this.$router.push('/')
    }
    this.loading = false
  },
  head () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
