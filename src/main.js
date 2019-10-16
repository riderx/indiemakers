import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Accueil2 from './components/Accueil2.vue'
import Emissions from './components/Emissions.vue'
import './style/all.css'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Accueil2',
    component: Accueil2,
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
