<template>
  <div>
    <NavBar />
    <Nuxt keep-alive :keep-alive-props="{ max: 10 }" />
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
      { hid: 'og:url', property: 'og:url', content: process.env.domain },
      { hid: 'og:image:alt', property: 'og:image:alt', content: 'Des idées profitables' },
      { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
      { hid: 'og:image', property: 'og:image', content: require('~/assets/cover-im@0.5x.png') },
      { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: require('~/assets/cover-im@0.5x.png') },
      { hid: 'og:image:width', property: 'og:image:width', content: 400 },
      { hid: 'og:image:height', property: 'og:image:height', content: 400 }
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
/* @media screen and (max-width: 768px) {
  body {
      overflow-y: auto;
  }
} */
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
@-moz-document url-prefix() {
  .fix-marging {
    border-right: 5px solid white !important;
  }
}
.custom-scroll {
  scrollbar-color: #f1f1f1 #df99d8;
  overflow-y: scroll;
  position: absolute;
  overflow-x: hidden;
}
@media screen and (max-width: 768px) {
.custom-scroll {
    position: inherit;
    /* overflow: hidden; */
  }
}

.custom-scroll::-webkit-scrollbar {
  width: 10px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #df99d8;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 39, 155, 1) !important;
}
</style>
