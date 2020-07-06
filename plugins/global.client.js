import Vue from 'vue'
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css'
import VModal from 'vue-js-modal'
import 'vue-js-modal/dist/styles.css'
import VuePlyr from 'vue-plyr'
import Tooltip from 'vue-directive-tooltip'
import { firestorePlugin } from 'vuefire'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)
Vue.use(firestorePlugin)
Vue.use(VuePlyr)
Vue.use(Tooltip)
Vue.use(VModal)
