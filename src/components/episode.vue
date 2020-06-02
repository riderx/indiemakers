<template>
  <div id="emission">
    <modal height="auto" adaptive name="copied">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 pb-3 text-white text-center">
                <p>Lien Copié</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="listen">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
          <div class="row bg-success py-4" v-if="!loading">
            <div class="col-12 pt-1 px-1 px-md-3 text-center">
              <h3>Disponible sur :</h3>
            </div>
            <div class="col-12 pt-1 px-1 px-md-3 text-center">
              <button
                type="button"
                @click="listenExternal('https://open.spotify.com/show/6Agf3YmcAdNx4tQMJVoRQg')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur spotify'"
              >Spotify</button>
              <button
                type="button"
                @click="listenExternal('https://anchor.fm/indiemakers')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Anchor'"
              >Anchor</button>
              <button
                type="button"
                @click="listenExternal('https://deezer.com/show/689072')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Deezer'"
              >Deezer</button>
              <button
                type="button"
                @click="listenExternal('https://pca.st/yjcdxg09')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur PocketCast'"
              >Pocket cast</button>
              <button
                type="button"
                @click="copyTextToClipboard('https://anchor.fm/s/414d1d4/podcast/rss')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Copier le flux RSS'"
              >RSS</button>
              <button
                type="button"
                @click="listenExternal('https://podcasts.apple.com/fr/podcast/indie-maker-fr/id1488437972')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Apple podcast'"
              >Apple</button>
              <button
                type="button"
                @click="listenExternal('https://www.breaker.audio/indie-maker-france')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Breaker podcast'"
              >Breaker</button>
              <button
                type="button"
                @click="listenExternal('https://podcasts.google.com/?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy80MTRkMWQ0L3BvZGNhc3QvcnNz')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Google podcast'"
              >Google</button>
              <button
                type="button"
                @click="listenExternal('https://radiopublic.com/indie-maker-france-60NJEy')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Radio Public'"
              >Radio Public</button>
              <button
                type="button"
                @click="listenExternal('https://overcast.fm/itunes1488437972/indie-maker-france')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Overcast'"
              >Overcast</button>
              <button
                type="button"
                @click="listenExternal('https://castro.fm/podcast/e3350808-2fc9-481e-a449-a7abe035002e')"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-3 h1"
                v-tooltip="'Ecouter l\'épisode sur Castro'"
              >Castro</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="copied">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>✅C'est fait !</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-2 text-white text-center">
                <p>Lien Copié, je sais pas trop ce que tu compte en faire mais enjoy, c'est tout❤️</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-white px-4 h1"
                  @click="$modal.hide('copied')"
                >😎Cool</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5">
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
          <div v-if="!loading" class="row bg-success py-1 py-md-4">
            <div class="col-4 offset-4 offset-md-0 col-md-3 pt-1 px-1 px-md-3">
              <img
                :src="person.itunes.image"
                class="w-100 w-md-75 img-fluid"
                alt="Logo person"
              />
            </div>
            <div class="col-6 col-md-8 offset-3 offset-md-0 pt-3 px-0 text-white text-center text-md-left">
              <h1 class="d-none d-sm-block">{{person.title}}</h1>
            </div>
            <div class="col-12 d-block d-sm-none text-white">
              <h3>{{person.title}}</h3>
            </div>
            <div class="col-12 d-block d-sm-none text-white">
              <vue-plyr>
                  <audio>
                    <source :src="person.enclosure.url" type="audio/mp3"/>
                  </audio>
              </vue-plyr>
            </div>
          </div>
          <div class="row" v-if="!loading">
            <div class="col-12 bg-white px-md-5 pt-3">
              <p class v-html="person.content"></p>
            </div>
          </div>
          <div class="row bg-primary py-4 d-block d-md-none" v-if="!loading">
            <div class="col-12 px-1 px-md-3 text-center">
              <button
                type="button"
                @click="listen()"
                class="btn btn-success btn-lg bnt-block text-white m-1 m-md-3 px-4"
                v-tooltip="'Ecouter'"
              >
                <i class="fas fa-headphones"></i> Ecouter
              </button>
              <button
                type="button"
                class="btn btn-success btn-lg bnt-block text-white m-1 m-md-3 px-4"
                v-tooltip="'Noter l\'épisode'"
                @click="rate()"
              >
                <i class="fas fa-heart"></i>
                Noter
              </button>
              <button
                type="button"
                class="btn btn-success btn-lg bnt-block text-white m-1 m-md-3 px-4"
                v-tooltip="'Partager via twitter'"
                @click="tweetIt()"
              >
                <i class="fas fa-pizza-slice"></i> Partager
              </button>
              <button
                type="button"
                class="btn btn-success btn-lg bnt-block text-white m-1 m-md-3 px-4"
                v-tooltip="'buymeacoffee'"
                @click="bmc()"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  class="bmc"
                  alt="Buy me a coffee"
                /> Soutenir
              </button>
            </div>
          </div>
          <div class="row bg-success py-4" v-if="!loading">
            <div class="col-12 pt-1 px-1 px-md-3 text-center">
              <button
                type="button"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 px-4"
                @click.passive="goEpisodes"
              >
                <i class="fas fa-arrow-left"></i> Tous les Episodes
              </button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 py-md-4 px-md-5 text-center d-none d-md-block" v-if="!loading">
          <div class="row py-0 py-md-3 align-items-center position-fixed">
            <div class="col-12 offset-md-1 col-md-10 px-md-3 pt-1 pt-md-3">
              <vue-plyr>
                <audio>
                  <source :src="person.enclosure.url" type="audio/mp3"/>
                </audio>
              </vue-plyr>
            </div>
            <div class="col-12 px-md-5 pt-1 pt-md-3">
              <button
                type="button"
                @click="listen()"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-4 h1"
                v-tooltip="'Ecouter'"
              >
                <i class="fas fa-headphones"></i> Ecouter
              </button>
              <button
                type="button"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-4 h1"
                v-tooltip="'Noter l\'épisode'"
                @click="rate()"
              >
                <i class="fas fa-heart"></i>
                Noter
              </button>
              <button
                type="button"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-4 h1"
                v-tooltip="'Partager via twitter'"
                @click="tweetIt()"
              >
                <i class="fas fa-pizza-slice"></i> Partager
              </button>
              <button
                type="button"
                class="btn btn-primary btn-lg text-white m-1 m-md-3 py-0 py-md-3 px-0 px-md-4 h1"
                v-tooltip="'buymeacoffee'"
                @click="bmc()"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  alt="Buy me a coffee"
                  class="bmc"
                /> Soutenir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
// import { db, firebaseLib } from "../utils/db";
import Tooltip from "vue-directive-tooltip";
import "vue-directive-tooltip/dist/vueDirectiveTooltip.css";
import Vue from "vue";
import VModal from "vue-js-modal";
import VuePlyr from 'vue-plyr';
const Parser = require('rss-parser');
const parser = new Parser();
const RSSURL = 'https://cors-anywhere.herokuapp.com/https://anchor.fm/s/414d1d4/podcast/rss';
 
// The second argument is optional and sets the default config values for every player.
Vue.use(VuePlyr);
Vue.use(Tooltip);
Vue.use(VModal);
export default {
  components: {
  },
  props: ["id"],
  methods: {
    toEmbed(url) {
      return url.replace('/episodes/', '/embed/episodes/')
    },
    rate() {
      window.open(`https://ratethispodcast.com/imf`, "_blank");
    },
    listenExternal(url) {
      window.open(url, "_blank");
    },
    goEpisodes() {
      this.$router.push("/episodes");
    },
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; //avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        if (!document.execCommand("copy")) {
          console.error("unsuccessful");
        } else {
          this.$modal.show("copied");
        }
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    },
    listen() {
      this.$modal.show("listen");
    },
    copyTextToClipboard(text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {
          // console.log("Async: Copying to clipboard was successful!");
          this.$modal.show("copied");
        },
        err => {
          console.error("Async: Could not copy text: ", err);
        }
      );
    },
    setSizeHead() {
      if (document.getElementById("app")) {
        this.sizeHead = document.getElementById("app").offsetHeight;
      }
    },
    bmc() {
      window.open("https://www.buymeacoffee.com/indiemakersfr", "_blank");
    },
    tweetIt() {
      const linkEp = `https://indiemakers.fr/#/episode/${this.id}`;
      const tweet = `J'écoute le podcast ${this.person.title} le podcast @indiemakersfr 🚀 ${linkEp}`;
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`;
      window.open(tweetLink, "_blank");
      this.$modal.hide("added");
      this.$modal.hide("voted");
    }
  },
  data() {
    return {
      loading: true,
      sizeHead: 0,
      person: null
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
            this.loading = false;
            feed.items.forEach((element) => {
              if (element.guid === this.id) {
                this.person = element
                // eslint-disable-next-line no-console
                console.log('found item', element)
              }
            });
        setTimeout(() => {
          this.setSizeHead();
        }, 50);
        }
    // eslint-disable-next-line no-console
        // console.log(feed)
    }).catch((error) => {
        // this.loading = false;
        console.error(error)
    })
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
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

.fit-content {
  width: fit-content;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #9456b7;
}

.linkified {
  display: block;
}
.bmc {
  height: 20px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #df99d8 !important;
}
</style>
