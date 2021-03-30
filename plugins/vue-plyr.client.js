import Vue from 'vue'
import VuePlyr from '@skjnldsv/vue-plyr/dist/vue-plyr.ssr.js'
import '@skjnldsv/vue-plyr/dist/vue-plyr.css'

Vue.use(VuePlyr, {
  plyr: {
    fullscreen: { enabled: false }
  }
})
