<template>
  <div id="emissions">
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5 order-2 order-md-1">
          <div v-if="!loading" class="row bg-success py-1 py-md-4">
            <div class="col-4 pr-0 pr-md-5 cursor-pointer">
              <img
                :src="person.pic"
                class="w-100 w-md-75 img-fluid rounded-circle"
                alt="Logo person"
              />
            </div>
            <div class="col pt-3 px-0 text-white">
              <h1>#{{person.number}} {{person.name}}</h1>
              <p
                @click="openAccount(person.login)"
                v-b-tooltip.hover
                title="Voir le profils Twitter"
                class="text-white"
              >@{{person.login}}</p>
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
          <div class="row" v-if="!loading">
            <div class="col-12 bg-white px-md-5 pt-3">
              <p class v-html="linkDescription"></p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 py-md-4 px-md-5 order-1 order-md-2 text-center" v-if="!loading">
          <div class="row py-3 align-items-center">
            <div class="col-12 px-md-5 pt-3 d-none d-md-block">
              <iframe :src="person.embed" width="100%" frameborder="0" scrolling="no"></iframe>
            </div>
            <div class="col-12 px-md-5 pt-3">
              <h3 class="text-white">Dispo aussi sur tes plateformes préférés !</h3>
              <p class v-if="person.episodeSpotify">
                <button
                  type="button"
                  @click="listenSpotify()"
                  class="btn btn-primary btn-lg text-light py-3 px-4 h1"
                  v-b-tooltip.hover
                  title="Ecouter l'épisode sur spotify"
                >
                  <i class="fab fa-spotify fa-2x"></i>
                </button>
              </p>
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
    listenSpotify() {
      window.open(
        `https://open.spotify.com/episode/${this.person.episodeSpotify}`,
        "_blank"
      );
    },
    openAccount(name) {
      window.open(`https://twitter.com/${name}`, "_blank");
    },
    setSizeHead() {
      if (document.getElementById("app")) {
        this.sizeHead = document.getElementById("app").offsetHeight;
      }
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

/* Handle */
::-webkit-scrollbar-thumb {
  background: #9456b7;
}

.linkified {
  display: block;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #df99d8 !important;
}
</style>
