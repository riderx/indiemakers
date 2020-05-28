import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
const Home = () => import('./components/home.vue')
const Login = () => import('./components/login.vue')
const Episodes = () => import('./components/episodes.vue')
const Makers = () => import('./components/makers.vue')
const Episode = () => import('./components/episode.vue')
import './registerServiceWorker'

Vue.use(VueRouter);
// Vue.use(firestorePlugin);
// Vue.use(VModal);

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
  {
    path: '/makers',
    name: 'Makers',
    component: Makers,
  },
  {
    path: '/episode/:id', props: true ,
    name: 'Episode',
    component: Episode,
  },
];


const router = new VueRouter({
    routes
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
