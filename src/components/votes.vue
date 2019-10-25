<template>
  <div id="emissions">
    <modal height="auto" adaptive :clickToClose="isFalse" name="loading">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 p-5 text-center">
            <div class="spinner-grow text-primary" style="width: 6rem; height: 6rem;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal adaptive name="Added">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>🏄‍♂️ Ajout pris en compte</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-3 text-white text-center">
                <p>N'esite pas a twitter pour motiver ce Maker a venir sur le podcast !</p>
                <p>J'ai supposé que tu voulais aussi voter pour lui, alors c'est fait .✅</p>
                <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt()"
                >🦚Tweet</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal adaptive name="fail-add">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>👀Je ne trouve pas ce Maker</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-3 text-white text-center">
                <p>Je ne peut pas ajouter de Maker qui n'est pas sur Twitter pour le moment.</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
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
    <modal adaptive name="fail-vote">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>😨 Hoho</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-3 text-white text-center">
                <p>tu as deja voté pour ce Maker</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="$modal.hide('fail-vote')"
                >Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="add">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>➕Ajouter un Maker</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-3 text-white text-center">
                <p>Saisie le nom de son compte Twitter</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    type="text"
                    v-model="addName"
                    class="form-control pb-0"
                    aria-describedby="TweetnameHelp"
                    placeholder="elonmusk"
                  />
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
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
    <modal adaptive name="Voted">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>💪Vote pris en compte</h1>
              </div>
            </div>
            <div class="row bg-success pt-4 h-100">
              <div class="col-12 pt-3 text-white">
                <p>N'esite pas a twitter pour motiver ce Maker a venir sur le podcast !</p>
                <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="tweetIt()"
                >🦚Tweet</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal height="auto" adaptive name="checkEmail">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>✅Check ta boite email</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-3 text-white text-center">
                <p>Récupère ton lien de login reçût par email et click dessus, c'est tout❤️</p>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
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
    <modal height="auto" adaptive name="inscription">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="row bg-primary py-2">
              <div class="col-12 pt-2 text-white text-center">
                <h1>🔐Pas tout de suite !</h1>
              </div>
            </div>
            <div class="row bg-success pt-4">
              <div class="col-12 pt-3 text-white">
                <p>Pour pouvoir te tenir au courant de la sortie de l'épisode et éviter les faux votes</p>
                <h5 class="text-center">j’ai besoin que tu valides ton email</h5>
                <p>Tu ne recevras des emails seulement pour les makers pour qui tu as voté, et si j'ai une grande nouvelle a te partager (max 3 par ans).</p>
                <p>Et bien entendu, je ne refile ton e-mail à personne, je déteste ceux qui font ça !</p>
              </div>
            </div>
            <div class="row bg-success pb-4">
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    type="email"
                    v-model="email"
                    class="form-control pb-0"
                    aria-describedby="emailHelp"
                    placeholder="elon@musk.com"
                  />
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-0 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block text-light px-4 h1"
                  @click="sendLogin()"
                >🚀valider</button>
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
              <h1>🔥Most wanted</h1>
            </div>
            <div class="col-3 col-md-2 pt-3 text-white">
              <button
                type="button"
                class="btn btn-primary btn-lg text-light px-4 display-1"
                @click="showAddForm()"
              >
                <strong>+</strong>
              </button>
            </div>
          </div>
          <div
            class="row bg-white py-3 border-bottom align-items-center"
            v-bind:key="person.id"
            v-for="person in people"
          >
            <div class="col-4 pr-0 pr-md-5 cursor-pointer" @click="openAccount(person.login)">
              <img
                :src="person.pic"
                class="w-100 w-md-75 img-fluid rounded-circle"
                alt="Logo person"
              />
            </div>
            <div class="col-5 col-md-6">
              <h3>{{person.name}}</h3>
              <p class="text-secondary">@{{person.login}}</p>
            </div>
            <div class="col-3 col-md-2" @click="vote(person)">
              <button
                type="button"
                v-if="!person.episode"
                class="btn btn-primary btn-lg text-light px-4 h1"
              >
                <div>&#9650;</div>
                {{person.votes}}
              </button>
              <button
                type="button"
                v-if="person.episode"
                class="btn btn-primary btn-lg text-light px-4 h1"
              >
                <i class="fab fa-spotify fa-2x"></i>
              </button>
            </div>
            <div class="col-12 px-md-5 pt-3">
              <p class>{{person.bio}}</p>
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

const addTwiterUser = firebaseLib.functions().httpsCallable("addTwiterUser");

export default {
  components: {
    illu
  },
  methods: {
    tweetIt() {
      const text = `@${this.currentName}, j'aimerais beaucoup que tu sois le·a prochain invité·e du podcast @indiemakerfr 🚀.`;
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
      this.currentName = "";
      this.$modal.hide("Added");
      this.$modal.hide("Voted");
    },
    sendLogin() {
      if (this.email) {
        window.localStorage.setItem("emailForSignIn", this.email);
        const actionCodeSettings = {
          url: "https://indiemaker.fr/#/login",
          handleCodeInApp: true
        };
        this.$modal.show("loading");
        firebaseLib
          .auth()
          .sendSignInLinkToEmail(this.email, actionCodeSettings)
          .then(() => {
            this.$modal.hide("inscription");
            this.$modal.show("checkEmail");
            this.$modal.hide("loading");
            window.localStorage.setItem("emailForSignIn", this.email);
          })
          .catch(error => {
            this.$modal.hide("inscription");
            this.$modal.hide("loading");
            console.error(error);
          });
      }
    },
    vote(person) {
      console.log(person);
      if (!this.loggin) {
        this.$modal.show("inscription");
      } else if (person.episode) {
        window.open(person.episode, "_blank");
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
            this.currentName = person.login;
            this.$modal.show("Voted");
          })
          .catch(error => {
            this.$modal.hide("loading");
            console.error("Error writing document: ", error);
            this.currentName = person.login;
            this.$modal.show("fail-vote");
          });
      }
    },
    showAddForm() {
      if (!this.loggin) {
        this.$modal.show("inscription");
      } else {
        this.$modal.show("add");
      }
    },
    openAccount(name) {
      window.open(`https://twitter.com/${name}`, "_blank");
    },
    add() {
      this.$modal.show("loading");
      if (!this.loggin) {
        this.$modal.hide("loading");
        this.$modal.show("inscription");
      } else {
        addTwiterUser({ name: this.addName }).then(addJson => {
          const added = addJson.data;
          this.$modal.hide("loading");
          if (added.error) {
            console.error(added);
            this.$modal.show("fail-add");
          } else {
            this.currentName = "" + this.addName;
            this.$modal.show("Added");
          }
          this.addName = "";
          this.$modal.hide("add");
        });
      }
    }
  },
  data() {
    return {
      email: "",
      isFalse: false,
      loggin: false,
      addName: "",
      currentName: "",
      people: []
    };
  },
  mounted() {
    this.loggin = firebaseLib.auth().currentUser;
    this.email = window.localStorage.getItem("emailForSignIn");
    firebaseLib.auth().onAuthStateChanged(user => {
      this.loggin = user;
    });
  },
  firestore: {
    people: db.collection("people").orderBy("votes", "desc")
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
