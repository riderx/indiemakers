<template>
  <div id="episodes">
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5">
          <div class="row bg-primary border-10 border-light py-1 py-md-4">
            <div class="col col-md-10 pt-3 px-0 text-white text-center">
              <h1>🎙Episodes</h1>
            </div>
            <div class="col-3 col-md-2 pt-2 text-white">
              <button
                type="button"
                class="btn btn-primary border-5 border-light btn-lg text-light px-3 px-md-4 display-1"
                v-tooltip="'Ajouter un·e maker'"
                @click="openAdd()"
              >
                <strong>+</strong>
              </button>
            </div>
          </div>
          <div class="row bg-white px-3" v-if="loading">
            <div class="col-12 p-5 text-center">
              <div
                class="spinner-grow text-primary"
                style="width: 6rem; height: 6rem;"
                role="status"
              >
                <span class="sr-only">Chargement...</span>
              </div>
            </div>
          </div>
          <div
            class="custom-scroll border-5 px-2 border-light border-right-0"
            v-if="!loading"
            v-bind:style="{ height: heightDiv }"
          >
            <div
              v-bind:key="episode.guid"
              v-for="episode in episodes"
              @click="openEp(episode.guid)"
              :class="'row bg-primary text-white py-3 border-bottom align-items-center ' + episode.guid"
            >
              <div class="offset-4 offset-md-0 col-4 order-1 order-md-2 pr-0 pr-md-5 pb-3 pb-md-0">
                <img
                  :src="episode.itunes.image"
                  class="w-100 w-md-75 img-fluid border-5 border-light"
                  alt="Logo person"
                />
              </div>
              <div class="col-12 col-md-6 order-2 pl-2 pl-md-0 order-md-2 text-center text-md-left">
                <h3 >{{episode.title}}</h3>
              </div>
              <div class="col-3 col-md-2 order-3 pl-0 d-none d-md-block">
                <button
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg text-white px-3 px-md-4 py-3 h1"
                  v-tooltip="'Ecouter l\'épisode'"
                >
                  <i class="fas fa-caret-circle-right fa-2x"></i>
                </button>
              </div>
              <div class="col-12 px-0 px-md-5 pt-1 pt-md-3 order-3">
                <p class="text-center text-md-left px-3 px-md-0" >{{previewText(episode.contentSnippet)}}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="image" class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2 d-none d-xl-block">
          <img class="img-fluid border-10 border-light" :alt="image.title" :src="image.url" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Vue from "vue";
import Tooltip from "vue-directive-tooltip";
import "vue-directive-tooltip/dist/vueDirectiveTooltip.css";
const Parser = require('rss-parser');
const parser = new Parser();
const RSSURL = 'https://cors-anywhere.herokuapp.com/https://anchor.fm/s/414d1d4/podcast/rss';

Vue.use(Tooltip);

export default {
  methods: {
    previewText(text) {
      let first = text.split(/[.!]+/)[0];
      if (first.split(' ').length > 20) {
        first = `${first.split(' ').splice(0, 17).join(' ')} ...`;
      } 
      return first;
    },
    openEp(guid) {
        this.$router.push(`/episode/${guid}`);
    },
    openAdd() {
        this.$router.push(`/makers`);
    },
    setSizeHead() {
      if (document.getElementById("app")) {
        this.sizeHead = document.getElementById("app").offsetHeight;
      }
    }
  },
  data() {
    return {
      loading: true,
      sizeHead: 0,
      image: null,
      episodes: []
    };
  },
  computed: {
    heightDiv() {
      if (this.sizeHead === 0) {
        return 0;
      }
      return `calc(100vh - ${this.sizeHead}px)`;
    }
  },
mounted() {
    parser.parseURL(RSSURL)
    .then((feed) => {
        if (feed && feed.items) {
          this.episodes = feed.items;
          this.loading = false;
          setTimeout(() => {
            this.setSizeHead();
            this.image = feed.image;
          }, 50);
        }
    }).catch((error) => {
        console.error(error)
    })
  },
};
</script>

<style scoped>

.top {
  top: 0;
}
::-webkit-scrollbar {
  width: 10px;
}

.custom-scroll {
  overflow-y: scroll;
  position: absolute;
  overflow-x: hidden;
  /* height: 600px; */
  margin-left: -15px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(75, 39, 155, 1);
}

.fit-content {
  width: fit-content;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #df99d8 !important;
}
</style>
