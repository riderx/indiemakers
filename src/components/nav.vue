<template>
  <div>
    <nav class="navbar navbar-light bg-transparent">
      <a class="navbar-brand" href="#" @click="openPage('/')">
        <img :src="logo.source" :id="logo.title" class="d-inline-block align-top" alt />
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
        title: "indiemakerfr",
        source: "./assets/default-monochrome-white.svg",
        lien: "#"
      },
      icones: [
        {
          title: "Spotify",
          lien: "https://soundcloud.com/indiemakerfr",
          class: "fab fa-spotify fa-2x"
        },
        {
          title: "Instagram",
          lien: "https://instagram.com/indiemakerfr",
          class: "fab fa-instagram fa-2x"
        },
        {
          title: "twitter",
          lien: "https://twitter.com/indiemakerfr",
          class: "fab fa-twitter fa-2x"
        },
        {
          title: "vote",
          lien: "/votes",
          class: "fas fa-vote-yea fa-2x"
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
#indiemakerfr {
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
  font-size: 1.5em;
}
</style>
