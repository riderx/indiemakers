<template>
  <div id="emissions">
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5 order-2 order-md-1">
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
            <div class="col-3 pt-1 px-1 px-md-3">
              <img
                :src="person.pic"
                class="w-100 w-md-75 img-fluid rounded-circle"
                alt="Logo person"
              />
            </div>
            <div class="col pt-3 px-0 text-white">
              <h1>#{{person.number}} {{person.name}}</h1>
              <div>
                <p
                  @click="openAccount(person.login)"
                  v-b-tooltip.hover
                  title="Ouvrir son profils Twitter"
                  class="text-white cursor-pointer fit-content"
                >
                  <i class="fab fa-twitter"></i>
                  @{{person.login}}
                </p>
              </div>
            </div>
          </div>
          <div class="row" v-if="!loading">
            <div class="col-12 bg-white px-md-5 pt-3">
              <p class v-html="linkDescription"></p>
            </div>
          </div>
          <div class="row bg-success py-4">
            <div class="col-12 pt-1 px-1 px-md-3 text-center">
              <button
                type="button"
                class="btn btn-primary btn-lg bnt-block text-white px-4"
                @click.passive="goEpisodes"
              >🎧 Les autres Episodes</button>
            </div>
            <div class="col-12 pt-3 px-1 px-md-3 text-center d-block d-md-none">
              <button
                type="button"
                class="btn btn-primary btn-lg bnt-block text-white px-4"
                v-b-tooltip.hover
                title="Partager via twitter"
                @click="tweetIt()"
              >🦚Partager</button>
            </div>
            <div class="col-12 pt-3 px-1 px-md-3 text-center d-block d-md-none">
              <button
                type="button"
                class="btn btn-primary btn-lg bnt-block text-white px-4"
                v-b-tooltip.hover
                title="buymeacoffee"
                @click="bmc()"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  alt="Buy me a coffee"
                /> Paye moi un café
              </button>
            </div>
          </div>
        </div>
        <div
          class="col-12 col-md-6 py-md-4 px-md-5 order-1 order-md-2 text-center d-none d-md-block"
          v-if="!loading"
        >
          <div class="row py-0 py-md-3 align-items-center position-fixed">
            <div class="col-12 px-md-5 pt-3">
              <iframe :src="person.embed" width="100%" frameborder="0" scrolling="no"></iframe>
            </div>
            <div class="col-12 px-md-5 pt-1 pt-md-3">
              <h3 class="pt-2 text-white d-none d-md-block">Aussi sur tes plateformes préférées !</h3>
              <div class>
                <button
                  type="button"
                  v-if="person.episodeSpotify"
                  @click="listenExternal(person.episodeSpotify)"
                  class="btn btn-primary btn-lg text-light m-3 py-0 py-md-3 px-0 px-md-4 h1"
                  v-b-tooltip.hover
                  title="Ecouter l'épisode sur spotify"
                >Spotify</button>
                <button
                  type="button"
                  v-if="person.episodePocketCast"
                  @click="listenExternal(person.episodePocketCast)"
                  class="btn btn-primary btn-lg text-light m-3 py-0 py-md-3 px-0 px-md-4 h1"
                  v-b-tooltip.hover
                  title="Ecouter l'épisode sur PocketCast"
                >Pocket cast</button>
                <button
                  v-if="person.episodeApple"
                  type="button"
                  @click="listenExternal(person.episodeApple)"
                  class="btn btn-transparent btn-lg text-light m-3 py-0 py-md-3 px-0 px-md-4 h1"
                  v-b-tooltip.hover
                  title="Ecouter l'épisode sur Apple podcast"
                >
                  <i class="fas fa-podcast fa-2x"></i>
                </button>
              </div>
              <h3 class="pt-2 text-white">Si tu aimes ❤️</h3>
              <button
                type="button"
                class="btn btn-primary btn-lg text-light m-3 py-0 py-md-3 px-0 px-md-4 h1"
                v-b-tooltip.hover
                title="Partager via twitter"
                @click="tweetIt()"
              >🦚Partage</button>
              <button
                type="button"
                class="btn btn-primary btn-lg text-light m-3 py-0 py-md-3 px-0 px-md-4 h1"
                v-b-tooltip.hover
                title="buymeacoffee"
                @click="bmc()"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  alt="Buy me a coffee"
                  class="bmc"
                /> Paye moi un café
              </button>
            </div>
          </div>
        </div>
        <div
          class="col-12 col-md-6 py-md-4 px-md-5 order-1 order-md-2 text-center d-block d-md-none"
          v-if="!loading"
        >
          <div class="row py-0 py-md-3 align-items-center">
            <div class="col-12 px-md-5 pt-1 pt-md-3">
              <h5 class="text-white">Ecoute sur tes plateformes préférés !</h5>
              <div class v-if="person.episodeSpotify">
                <button
                  type="button"
                  @click="listenSpotify()"
                  class="btn btn-transparent btn-lg text-light py-0 py-md-3 px-0 px-md-4 h1"
                  v-b-tooltip.hover
                  title="Ecouter l'épisode sur spotify"
                >
                  <i class="fab fa-spotify fa-2x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { db, firebaseLib } from "../utils/db";
import linkifyHtml from "linkifyjs/html";

export default {
  components: {},
  props: ["id"],
  methods: {
    getTextLink(text) {
      return linkifyHtml(text, {
        defaultProtocol: "https",
        attributes: null,
        className: "linkified d-block",
        events: null,
        ignoreTags: [],
        nl2br: false,
        tagName: "a",
        target: {
          url: "_blank"
        },
        validate: true
      });
    },
    listenExternal(url) {
      window.open(url, "_blank");
    },
    openAccount(name) {
      window.open(`https://twitter.com/${name}`, "_blank");
    },
    goEpisodes() {
      this.$router.push("/episodes");
    },
    setSizeHead() {
      if (document.getElementById("app")) {
        this.sizeHead = document.getElementById("app").offsetHeight;
      }
    },
    bmc() {
      window.open("https://www.buymeacoffee.com/indiemakerfr", "_blank");
    },
    tweetIt() {
      const linkEp = `https://indiemaker.fr/#/episode/${this.id}`;
      const tweet = `J'écoute le podcast @indiemakerfr avec @${this.person.login} 🚀 ${linkEp}`;
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
      loggin: false,
      loading: true,
      sizeHead: 0,
      person: null
    };
  },
  computed: {
    linkDescription() {
      if (this.person && this.person.description) {
        const aeratedText = this.person.description
          .split(". ")
          .join(".<br/><br/>")
          .split("!")
          .join("!<br/><br/>")
          .split(": ")
          .join(":<br/>")
          .split(":)")
          .join(":) <br/>")
          .split("Quelques références")
          .join("<br/><br/><br/>Quelques références");
        return this.getTextLink(aeratedText);
      }
      return "";
    },
    heightDiv() {
      if (this.sizeHead === 0) {
        return 0;
      }
      return `calc(100vh - ${this.sizeHead}px)`;
    }
  },
  mounted() {
    this.loggin = firebaseLib.auth().currentUser;
    this.email = window.localStorage.getItem("emailForSignIn");
    this.$bind("person", db.collection("people").doc(this.id))
      .then(() => {
        this.loading = false;
        setTimeout(() => {
          this.setSizeHead();
        }, 1000);
      })
      .catch(error => {
        console.error("error in loading: ", error);
      });
    firebaseLib.auth().onAuthStateChanged(user => {
      this.loggin = user;
    });
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
