<template>
  <div>
    <NavBar />
    <Nuxt />
  </div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
import '~/static/custom.boostrap.css'
// import '~/plugins/global.js'

export default {
  components: {
    NavBar
  },
  head: {
    meta: [
      { hid: 'og:image:alt', name: 'og:image:alt', content: 'Des idées profitables' },
      { hid: 'og:image:type', name: 'og:image:type', content: 'image/png' },
      { hid: 'og:image', name: 'og:image', content: require('~/assets/cover-imf@0.5x.png') },
      { hid: 'og:image:secure_url', name: 'og:image:secure_url', content: require('~/assets/cover-imf@0.5x.png') },
      { hid: 'og:image:width', name: 'og:image:width', content: 400 },
      { hid: 'og:image:height', name: 'og:image:height', content: 400 }
    ]
  }
}
</script>

<style>
@font-face {
  font-family: "Rex Bold";
  font-display: swap;
  src: url("../assets/Rex-Bold.woff2") format("woff2"),
    url("../assets/Rex-Bold.woff") format("woff");
}
body {
  overscroll-behavior: none;
  overflow-x: hidden;
  background-color: rgba(75, 39, 155, 1);
}
.border-10{
    border-style:solid;
    border-width: 10px;
}
.border-5{
  border-style:solid;
  border-width: 5px;
}
.cursor-pointer {
  cursor: pointer;
}

.top {
  top: 0;
}
.fit-content {
  width: fit-content;
}
.linkified {
  display: block;
}
.bmc {
  height: 20px;
}

.fix-marging {
  margin-left: -15px;
  margin-right: 0px;
}
@media screen and (max-width: 768px) {
.fix-marging {
    margin-right: -15px;
  }
}
.custom-scroll {
  overflow-y: scroll;
  position: absolute;
  overflow-x: hidden;
}
@media screen and (max-width: 768px) {
.custom-scroll {
    position: inherit;
  }
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #df99d8;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 39, 155, 1) !important;
}
</style>
