<template>
  <div id="emissions">
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
                <p>N'esite pas a twitter pour motiver ce Maker a venir sur le podcast!</p>
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
                <p>N'esite pas a twitter pour motiver ce Maker a venir sur le podcast!</p>
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
                <p>recupere ton lien de login et click dessus, c'est tout❤️</p>
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
                <p>Pour pouvoir voter ou ajouter un·e potentiel·le invité·e, j’ai besoin que tu valides ton email pour deux raisons:</p>
                <ul>
                  <li>éviter les faux votes</li>
                  <li>pouvoir te tenir au courant des news</li>
                </ul>
                <p>je n'aime pas le spam, attends-toi à pas plus de 3 par an.</p>
                <p>Et bien entendu, je refile ton e-mail à personne, je déteste ça !</p>
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
        <div class="col-12 offset-md-1 col-md-5">
          <div class="row bg-success py-4">
            <div class="col col-md-10 pt-3 px-0 text-white text-center">
              <h1>🔥Most wanted</h1>
            </div>
            <div class="col-3 col-md-2 pt-3 text-white">
              <button
                type="button"
                class="btn btn-primary btn-lg text-light px-4 display-1"
                @click="showAdd()"
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
            <div class="col-3">
              <img :src="person.pic" class="w-75 img-fluid rounded-circle" alt="Logo person" />
            </div>
            <div class="col-6 col-md-7">
              <h2>{{person.name}}</h2>
              <p class="text-secondary">@{{person.login}}</p>
              <p>{{person.bio}}</p>
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
          </div>
        </div>
        <div class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2">
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

const voteTwiterUser = firebaseLib.functions().httpsCallable("voteTwiterUser");
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
        firebaseLib
          .auth()
          .sendSignInLinkToEmail(this.email, actionCodeSettings)
          .then(() => {
            this.hideLogin();
            this.$modal.show("checkEmail");
            window.localStorage.setItem("emailForSignIn", this.email);
          })
          .catch(error => {
            this.hideLogin();
            console.error(error);
          });
      }
    },
    vote(person) {
      if (!this.loggin) {
        this.$modal.show("inscription");
      } else if (person.episode) {
        window.open(person.episode, "_blank");
      } else {
        voteTwiterUser({ id_str: person.id_str }).then(resultJson => {
          console.log("resultJson", resultJson);
          const data = resultJson.data;
          if (data.error) {
            console.error(data);
            this.currentName = person.login;
            this.$modal.show("fail-vote");
          } else {
            this.currentName = person.login;
            person.votes += 1;
            this.$modal.show("Voted");
          }
        });
      }
    },
    add() {
      addTwiterUser({ name: this.addName }).then(addJson => {
        console.log("addJson", addJson);
        const added = addJson.data;
        if (added.error) {
          console.error(added);
          this.$modal.show("fail-add");
        } else {
          this.currentName = "" + this.addName;
          this.$modal.show("Added");
        }
        this.addName = "";
        this.hideAdd();
      });
    },
    showAdd() {
      if (!this.loggin) {
        this.$modal.show("inscription");
      } else {
        this.$modal.show("add");
      }
    },
    hideAdd() {
      this.$modal.hide("add");
    },
    hideLogin() {
      this.$modal.hide("inscription");
    }
  },
  data() {
    return {
      email: "",
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
    people: db.collection("people")
  }
};
</script>

<style scoped>
</style>
