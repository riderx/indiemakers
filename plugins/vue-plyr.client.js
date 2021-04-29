import Vue from 'vue'
import VuePlyr from '@skjnldsv/vue-plyr/dist/vue-plyr.ssr.js'

Vue.use(VuePlyr, {
  plyr: {
    fullscreen: { enabled: false }
  }
})
