<template>
  <div>
    <nav class="navbar navbar-light bg-transparent">
      <a class="navbar-brand" href="#" @click="openPage('/')">
        <img :src="logo.source" :id="logo.title" class="d-inline-block align-top" :alt="logo.title" />
      </a>
      <ul class="list-group list-group-horizontal">
        <li
          v-for="(icon, index) in icones"
          :key="index"
          class="list-group-item bg-transparent text-white p-2 p-md-3"
          @click="openPage(icon.lien)"
        >
          <i :class="icon.class"></i>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      logo: {
        title: "indiemakersfr",
        source: "/assets/default-monochrome-white.svg",
        lien: "/"
      },
      icones: [
        {
          title: "Spotify",
          lien: "https://open.spotify.com/show/6Agf3YmcAdNx4tQMJVoRQg",
          class: "fab fa-spotify fa-2x"
        },
        {
          title: "Instagram",
          lien: "https://instagram.com/indiemakersfr",
          class: "fab fa-instagram fa-2x"
        },
        {
          title: "twitter",
          lien: "https://twitter.com/indiemakersfr",
          class: "fab fa-twitter fa-2x"
        }
      ],
      bar: true
    };
  },
  methods: {
    openPage(name) {
      if (name.indexOf("https") > -1) {
        window.open(name, "_blank");
      } else {
        this.$router.push(name);
      }
    }
  }
};
</script>

<style scoped>
#indiemakersfr {
  width: 12vw;
  min-width: 90px;
  margin-left: 2vw;
  margin-top: 7px;
}
.fab,
.fas {
  color: white;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.fab:hover,
.fas:hover {
  color: #4b279b;
  transform: scale(1.6);
}
</style>
