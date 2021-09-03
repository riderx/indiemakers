import VueCompositionAPI from '@vue/composition-api'
import type MarkdownIt from 'markdown-it'
import Vue from 'vue'

Vue.use(VueCompositionAPI)

declare module '@nuxt/types' {
  interface Context {
    $md: MarkdownIt
  }
}
