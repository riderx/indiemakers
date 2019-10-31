<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/nav.vue";
import { firestorePlugin } from "vuefire";
import Vue from "vue";
import VModal from "vue-js-modal";

Vue.use(firestorePlugin);
Vue.use(VModal);

export default {
  name: "app",
  components: {
    NavBar
  },
  methods: {
    beforeLoad() {
      this.$router.push("/");
    },
    mounted() {
      this.$nextTick(this.beforeLoad);
    }
  }
};
</script>

<style>
@font-face {
  font-family: "Rex Bold";
  src: url("/assets/fonts/Rex-Bold.woff2") format("woff2"),
    url("/assets/fonts/Rex-Bold.woff") format("woff");
}
body {
  background-repeat: inherit;
  overscroll-behavior: none;
  overflow-x: hidden;
  background: linear-gradient(
    90deg,
    rgba(75, 39, 155, 1) 0%,
    rgba(223, 153, 216, 1) 100%
  );
}
</style>
