<template>
  <div id="app">
    <NavBar />
    <router-view />
    <pied />
  </div>
</template>

<script>
import NavBar from "./components/Nav.vue";
import pied from "./components/Footer.vue";
import { firestorePlugin } from "vuefire";
import Vue from "vue";

Vue.use(firestorePlugin);

export default {
  name: "app",
  components: {
    NavBar,
    pied
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
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: rgb(75, 39, 155);
  background: linear-gradient(
    90deg,
    rgba(75, 39, 155, 1) 0%,
    rgba(223, 153, 216, 1) 100%
  );
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
}
</style>
