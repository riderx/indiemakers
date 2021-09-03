import Vue from 'vue'
// @ts-ignore
import VModal from 'vue-js-modal/dist/ssr.nocss'
import 'vue-js-modal/dist/styles.css'

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
  }
}
