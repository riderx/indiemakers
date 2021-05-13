import Vue from 'vue'
// @ts-ignore
import VuePlyr from '@skjnldsv/vue-plyr/dist/vue-plyr.ssr.js'

Vue.use(VuePlyr, {
  plyr: {
    fullscreen: { enabled: false },
  },
})
