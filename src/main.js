import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import Home from './components/home.vue'
import Login from './components/login.vue'
import Episodes from './components/episodes.vue'
import { firestorePlugin } from "vuefire";
import VModal from "vue-js-modal";
import BootstrapVue from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style/custom.boostrap.css';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(firestorePlugin);
Vue.use(VModal);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/episodes',
    name: 'Episodes',
    component: Episodes,
  },
];


const router = new VueRouter({
    routes
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
