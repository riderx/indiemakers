import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Accueil from './components/Accueil.vue'
import Emissions from './components/Emissions.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil,
  },
  {
    path: '/Emissions',
    name: 'Emissions',
    component: Emissions,
  },
];


const router = new VueRouter({
    routes
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
