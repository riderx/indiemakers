import { contentFunc } from '@nuxt/content/types/content'
import Vue from 'vue'
// @ts-ignore
import VModal from 'vue-js-modal/dist/ssr.nocss'
import 'vue-js-modal/dist/styles.css'

import { Plugin } from '@nuxt/types'

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true,
  scrollable: false,
})

interface CustomModal {
  // eslint-disable-next-line no-unused-vars
  hide(key: string): void
  // eslint-disable-next-line no-unused-vars
  show(key: string): void
}
declare module 'vue/types/vue' {
  interface Vue {
    $modal: {
      // eslint-disable-next-line no-unused-vars
      hide(key: string): void
      // eslint-disable-next-line no-unused-vars
      show(key: string): void
    }
  }
}
declare module '@nuxt/types' {
  interface Context {
    $modal: CustomModal
    $content: contentFunc
  }
}

const myPlugin: Plugin = (context) => {
  context.$modal = Vue.prototype.$modal
}

export default myPlugin
