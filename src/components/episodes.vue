<template>
  <div id="emissions">
    <modal height="auto" adaptive :clickToClose="isFalse" name="loading">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 p-5 text-center">
            <div class="spinner-grow text-primary" style="width: 6rem; height: 6rem;" role="status">
              <span class="sr-only">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="error">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>😨 Quelque chose n'as pas marché</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 pb-3 text-white text-center">
                <p>Essais plus tard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="added">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>🏄‍♂️ Ajout pris en compte</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 text-white text-center">
                <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                <p>J'ai supposé que tu voulais aussi voter pour lui/elle, alors c'est fait .✅</p>
                <p class="font-weight-bold">Voici un message tout pret pour l'inviter 😎</p>
                <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt()"
                >🦚Voir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal adaptive height="auto" name="fail-add">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>👀Je ne trouve pas ce·tte Maker</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 text-white text-center">
                <p>Je ne peut pas ajouter de Maker qui n'est pas sur Twitter pour le moment.</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="$modal.hide('fail-add')"
                >Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal adaptive height="auto" name="fail-vote">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>😨 Hoho</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 text-white text-center">
                <p>tu as deja voté pour ce·tte Maker</p>
                <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                <p class="font-weight-bold">Voici un message tout pret pour l'inviter 😎</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt(name)"
                >🦚Voir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal adaptive height="auto" name="fail-exist">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>😝 OUPS</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 text-white text-center">
                <p>Ce·tte maker est déjà présent dans la liste, J'ai ajouté ton vote pour lui/elle.</p>
                <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                <p class="font-weight-bold">Voici un message tout pret pour l'inviter 😎</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt()"
                >🦚Voir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal adaptive height="auto" name="fail-exist-vote">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>😝 OUPS</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 text-white text-center">
                <p>Ce·tte maker est déjà présent dans la liste, et tu as déjà voté pour lui/elle 😇.</p>
                <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                <p class="font-weight-bold">Voici un message tout pret pour l'inviter 😎</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt()"
                >🦚Voir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="add">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>➕Ajouter un·e Maker</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-2 text-white text-center">
                <p>Saisie le nom de son compte Twitter</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="addMaker"
                    type="text"
                    v-model="addName"
                    class="form-control pb-0"
                    aria-describedby="TweetnameHelp"
                    placeholder="elonmusk"
                    v-on:keyup.enter="add()"
                  />
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="add()"
                >Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="voted">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>💪Vote pris en compte</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-2 text-white">
                <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                <p class="font-weight-bold">Voici un message tout pret pour l'inviter 😎</p>
                <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt()"
                >🦚Voir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="checkEmail">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>✅Check ta boite email</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-2 text-white text-center">
                <p>Récupère ton lien de login reçût par email et click dessus, c'est tout❤️</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="$modal.hide('checkEmail')"
                >😎Cool</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="register">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 h-100">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>🔐Pas tout de suite !</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-2 text-white">
                <p>Pour pouvoir te tenir au courant de la sortie de l'épisode et éviter les faux votes</p>
                <h5 class="text-center">j’ai besoin que tu valides ton email</h5>
                <p>Tu ne recevras des emails seulement pour les makers pour qui tu as voté, et si j'ai une grande nouvelle a te partager (max 3 par ans).</p>
                <p>Et bien entendu, je ne refile ton e-mail à personne, je déteste ceux qui font ça !</p>
              </div>
            </div>
            <div class="row bg-success">
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="register"
                    type="email"
                    v-model="email"
                    class="form-control pb-0"
                    aria-describedby="emailHelp"
                    placeholder="elon@musk.com"
                    v-on:keyup.enter="sendLogin()"
                  />
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="sendLogin()"
                >🚀VALIDER</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-xl-1 col-xl-5">
          <div class="row bg-success py-1 py-md-4">
            <div class="col col-md-10 pt-3 px-0 text-white text-center">
              <h1>🔥Episodes</h1>
            </div>
            <div class="col-3 col-md-2 pt-3 text-white">
              <button
                type="button"
                class="btn btn-primary btn-lg text-light px-3 px-md-4 display-1"
                v-b-tooltip.hover
                title="Ajouter un·e maker"
                @click="showAddForm()"
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
              class="row bg-white py-3 border-bottom align-items-center"
              v-bind:key="person.id"
              v-for="person in people"
            >
              <div class="col-4 pr-0 pr-md-5">
                <img
                  :src="person.pic"
                  class="w-100 w-md-75 img-fluid rounded-circle"
                  alt="Logo person"
                />
              </div>
              <div class="col-5 col-md-6">
                <h3>{{person.name}}</h3>
                <div>
                  <p
                    @click="openAccount(person.login)"
                    v-b-tooltip.hover
                    title="Ouvrir son profils Twitter"
                    class="text-secondary fit-content"
                  >
                    <i class="fab fa-twitter"></i>
                    @{{person.login}}
                  </p>
                </div>
              </div>
              <div class="col-3 col-md-2" @click="vote(person)">
                <button
                  type="button"
                  v-if="!person.episodeSpotify"
                  class="btn btn-primary btn-lg text-light py-0 py-md-2 px-2 px-md-4 h1"
                  v-b-tooltip.hover
                  :title="tooltipVote(person)"
                >
                  <!-- <div>&#9650;</div> -->
                  <i class="fas fa-caret-up fa-2x px-1"></i>
                  {{person.votes}}
                </button>
                <button
                  type="button"
                  v-if="person.episodeSpotify"
                  class="btn btn-primary btn-lg text-light py-1 px-2 py-md-3 px-md-4 h1"
                  v-b-tooltip.hover
                  title="Ecouter l'épisode"
                >
                  <i class="fas fa-caret-right fa-2x px-2"></i>
                </button>
              </div>
              <div class="col-12 px-md-5 pt-3">
                <p class v-html="getTextLink(person.bio)"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2 d-none d-xl-block">
          <illu />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import illu from "./illu.vue";
import { db, firebaseLib } from "../utils/db";
import linkifyHtml from "linkifyjs/html";

const addTwiterUser = firebaseLib.functions().httpsCallable("addTwiterUser");

export default {
  components: {
    illu
  },
  methods: {
    tooltipVote(person) {
      return `Voter pour avoir ${person.name} dans le podcast`;
    },
    tweetIt() {
      const text = `@${this.currentName}, j'aimerais beaucoup que tu sois le·a prochain invité·e du podcast @indiemakerfr 🚀.`;
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
      this.$modal.hide("added");
      this.$modal.hide("voted");
    },
    getTextLink(text) {
      return linkifyHtml(text, {
        defaultProtocol: "https",
        attributes: null,
        className: "linkified",
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
    sendLogin() {
      if (this.email) {
        window.localStorage.setItem("emailForSignIn", this.email);
        const actionCodeSettings = {
          url: "https://indiemaker.fr/#/login",
          handleCodeInApp: true
        };
        this.$modal.hide("register");
        this.$modal.show("loading");
        firebaseLib
          .auth()
          .sendSignInLinkToEmail(this.email, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem("emailForSignIn", this.email);
            this.$modal.hide("loading");
            this.$modal.show("checkEmail");
          })
          .catch(error => {
            this.$modal.hide("loading");
            console.error(error);
          });
      }
    },
    vote(person) {
      if (person.episodeSpotify) {
        this.$router.push(`/episode/${person.id}`);
      } else if (!this.loggin) {
        this.openRegister();
      } else {
        this.$modal.show("loading");
        db.collection(`people/${person.id}/votes`)
          .doc(this.loggin.uid)
          .set({
            date: Date()
          })
          .then(() => {
            this.$modal.hide("loading");
            person.votes += 1;
            this.currentName = "" + person.login;
            this.$modal.show("voted");
          })
          .catch(error => {
            this.$modal.hide("loading");
            console.error("Error writing document: ", error);
            this.currentName = "" + person.login;
            this.$modal.show("fail-vote");
          });
      }
    },
    openRegister() {
      this.$modal.show("register");
      setTimeout(() => {
        this.$refs.register.focus();
      }, 50);
    },
    openAdd() {
      this.$modal.show("add");
      setTimeout(() => {
        this.$refs.addMaker.focus();
      }, 50);
    },
    showAddForm() {
      if (!this.loggin) {
        this.openRegister();
      } else {
        this.openAdd();
      }
    },
    openAccount(name) {
      window.open(`https://twitter.com/${name}`, "_blank");
    },
    add() {
      this.$modal.hide("add");
      this.$modal.show("loading");
      if (!this.loggin) {
        this.$modal.hide("loading");
        this.openRegister();
      } else {
        addTwiterUser({ name: this.addName })
          .then(addJson => {
            const added = addJson.data;
            this.$modal.hide("loading");
            if (added.error && added.error === "Already voted") {
              this.currentName = "" + this.addName;
              this.$modal.show("fail-exist-vote");
            } else if (added.error) {
              console.error(added);
              this.$modal.show("fail-add");
            } else if (added.done && added.done === "Voted") {
              this.currentName = "" + this.addName;
              this.$modal.show("fail-exist");
            } else {
              this.currentName = "" + this.addName;
              this.$modal.show("added");
            }
            this.addName = "";
          })
          .catch(err => {
            this.$modal.hide("loading");
            this.$modal.show("error");
            console.error(err);
          });
      }
    },
    setSizeHead() {
      if (document.getElementById("app")) {
        this.sizeHead = document.getElementById("app").offsetHeight;
      }
    }
  },
  data() {
    return {
      email: "",
      isFalse: false,
      loggin: false,
      loading: true,
      sizeHead: 0,
      addName: "",
      currentName: "",
      people: []
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
    this.loggin = firebaseLib.auth().currentUser;
    this.email = window.localStorage.getItem("emailForSignIn");
    this.$bind(
      "people",
      db
        .collection("people")
        .orderBy("votes", "desc")
        .orderBy("addDate", "asc")
    )
      .then(() => {
        this.loading = false;
        setTimeout(() => {
          this.setSizeHead();
        }, 50);
      })
      .catch(error => {
        console.error("error in loading: ", error);
      });
    // this.$modal.show("voted");
    // this.$modal.show("loading");
    // this.$modal.show("error");
    // this.$modal.show("added");
    // this.$modal.show("checkEmail");
    // this.openRegister();
    // this.openAdd();
    // this.$modal.show("fail-add");
    // this.$modal.show("fail-vote");
    firebaseLib.auth().onAuthStateChanged(user => {
      this.loggin = user;
      if (this.loggin && this.loggin.displayName === null) {
        this.$router.push("/login");
      }
    });
  },
  firestore: {
    // people: db.collection("people").orderBy("votes", "desc")
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

.fit-content {
  width: fit-content;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #df99d8 !important;
}
</style>
