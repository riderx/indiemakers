<template>
  <div id="episodes">
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5">
          <div class="row bg-success py-1 py-md-4">
            <div class="col col-md-10 pt-3 px-0 text-white text-center">
              <h1>🎙Episodes</h1>
            </div>
            <div class="col-3 col-md-2 pt-3 text-white">
              <button
                type="button"
                class="btn btn-primary btn-lg text-light px-3 px-md-4 display-1"
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
            class="custom-scroll bg-white px-3"
            v-if="!loading"
            v-bind:style="{ height: heightDiv }"
          >
            <div
              v-bind:key="episode.guid"
              v-for="episode in episodes"
              :class="'row bg-white py-3 border-bottom align-items-center ' + episode.guid"
            >
              <div class="col-12 d-block d-sm-none">
                <h3 >{{episode.title}}</h3>
              </div>
              <div class="col-4 pr-0 pr-md-5">
                <img
                  :src="episode.itunes.image"
                  class="w-100 w-md-75 img-fluid rounded-circle"
                  alt="Logo person"
                />
              </div>
              <div class="col-5 col-md-6">
                <h3 class="d-none d-sm-block" >{{episode.title}}</h3>
              </div>
              <div class="col-3 col-md-2" @click="openEp(episode.guid)">
                <button
                  type="button"
                  class="btn btn-success btn-lg text-white px-3 px-md-4 py-3 h1"
                  v-tooltip="'Ecouter l\'épisode'"
                >
                  <i class="fas fa-caret-circle-right fa-2x"></i>
                </button>
              </div>
              <div class="col-12 px-md-5 pt-3">
                <p class >{{episode.contentSnippet.split('.')[0]}}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="image" class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2 d-none d-xl-block">
          <img class="img-fluid" :alt="image.title" :src="image.url" />
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

Vue.use(Tooltip);

export default {
  methods: {
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
 
    parser.parseURL('https://anchor.fm/s/414d1d4/podcast/rss')
    .then((feed) => {
        if (feed && feed.items) {
          this.episodes = feed.items;
          this.image = feed.image;
          this.loading = false;
          setTimeout(() => {
            this.setSizeHead();
          }, 500);
        }
    }).catch((error) => {
        console.error(error)
    })
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
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
  background: #9456b7;
}

.fit-content {
  width: fit-content;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #df99d8 !important;
}
</style>
