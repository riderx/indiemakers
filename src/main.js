import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import Home from './components/home.vue'
import Login from './components/login.vue'
import Votes from './components/votes.vue'
require('./style/custom.boostrap.css')

Vue.use(VueRouter);

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
    path: '/Votes',
    name: 'Votes',
    component: Votes,
  },
];


const router = new VueRouter({
    routes
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
