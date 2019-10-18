<template>
  <div id="emissions">
    <modal :height="300" name="Added">
      <section id="div-modal">
        Ajout pris en compte
        <div id="sign-in-vote">
          <div id="explain">N'esite pas a twitter pour motiver ce Maker a venir sur le podcast!</div>
          <div>
            <button @click="tweetIt()">Tweet</button>
          </div>
        </div>
      </section>
    </modal>
    <modal :height="300" name="Voted">
      <section id="div-modal">
        Vote pris en compte
        <div id="sign-in-vote">
          <div id="explain">N'esite pas a twitter pour motiver ce Maker a venir sur le podcast!</div>
          <div>
            <button @click="tweetIt()">Tweet</button>
          </div>
        </div>
      </section>
    </modal>
    <modal :height="300" name="checkEmail">
      <section id="div-modal">
        Check ta boite email
        <div id="sign-in-vote">
          <div id="explain">recupere ton lien de login et click dessus, c'est tout❤️</div>
          <div>
            <button @click="$modal.hide('checkEmail')">Cool</button>
          </div>
        </div>
      </section>
    </modal>
    <modal :height="470" name="inscription">
      <section id="div-modal">
        Inscription
        <div id="sign-in-vote">
          <div
            id="explain"
          >Pour pouvoir voter ou ajouter un·e potentiel·le invité·e, j’ai besoin que tu valides ton email pour deux raisons:</div>
          <div id="explain">- éviter les faux votes</div>
          <div
            id="explain"
          >- pouvoir te tenir au courant s'il y a des news sur le podcast ou dans mes projets ( je n'aime pas le spam, attends-toi à pas plus de 3 par an ).</div>
          <div id="explain">Et bien entendu, je refile ton e-mail à personne, je déteste ça !</div>
          <div class="person-email">
            <input v-model="email" type="email" placeholder="elon@musk.com" />
          </div>
          <div>
            <button @click="sendLogin()">valider</button>
          </div>
        </div>
      </section>
    </modal>
    <div id="episodes">
      <h2 id="titreEpisodes">Most wanted</h2>
      <div id="addPerson" @click="showAdd()">
        +
        <span class="tooltiptext">Ajouter un·e invité·e</span>
      </div>
      <div id="person-info" v-bind:key="person.id" v-for="person in people">
        <div>
          <img :src="person.pic" alt="Logo person" />
        </div>
        <h2>{{person.name}}</h2>
        <h3>@{{person.login}}</h3>
        <p>{{person.bio}}</p>
        <div id="bouton-vote" @click="vote(person.id_str)">
          <div>&#9650;</div>
          {{person.votes}}
        </div>
      </div>
    </div>
    <illu />
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import illu from "./illu.vue";
import { db } from "../utils/db";
import firebase from "firebase/app";

const voteTwiterUser = firebase.functions().httpsCallable("voteTwiterUser");
const addTwiterUser = firebase.functions().httpsCallable("addTwiterUser");
const findTwiterUser = firebase.functions().httpsCallable("findTwiterUser");

export default {
  components: {
    illu
  },
  methods: {
    sendLogin() {
      if (this.email) {
        window.localStorage.setItem("emailForSignIn", this.email);
        const actionCodeSettings = {
          url: "https://indiemaker.fr/#/login",
          handleCodeInApp: true
        };
        firebase
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
    vote(id_str) {
      if (!this.loggin) {
        this.$modal.show("inscription");
      } else {
        // console.log("vote", id_str);
        voteTwiterUser({ id_str }).then(result => {
          if (result.error) {
            console.error(result);
            this.$modal.show("add");
          } else {
            this.$modal.show("Voted");
          }
        });
      }
    },
    add(id_str) {
      findTwiterUser({ id_str }).then(result => {
        if (result.error) {
          console.error(result);
        } else {
          addTwiterUser({ id_str }).then(result => {
            if (result.error) {
              console.error(result);
            } else {
              this.$modal.show("Added");
            }
            this.hideAdd();
          });
        }
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
      people: []
    };
  },
  created() {
    this.loggin = firebase.auth().currentUser;
    this.email = window.localStorage.getItem("emailForSignIn");
  },
  firestore: {
    people: db.collection("people")
  }
};
</script>

<style>
#emissions {
  width: 47vw;
  height: 68vh;
  background-color: #df99d8;
  position: absolute;
  top: 20%;
  left: 5%;
  color: rgb(35, 35, 85);
  font-size: 2em;
  text-align: center;
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  transition: box-shadow 0.3s;
  z-index: 0;
  border-radius: 10px;
  display: flex;
  flex-flow: column nowrap;
}

#emissions:hover {
  box-shadow: 0 0 11px rgba(3, 53, 148, 0.2);
}

h2 {
  font-size: 39px;
  color: white;
  font-family: "Rex Bold", "Open Sans";
  margin: 10 auto 45px auto;
}
@media only screen and (max-width: 800px) {
  #emissions {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    margin: -90px -17px;
    background-color: #df99d8;
    box-shadow: none;
    height: fit-content;
    overflow-y: auto;
  }
  #episodes {
    width: 80%;
    margin: auto;
  }
  h2 {
    color: white;
  }
}
@media only screen and (max-width: 420px) {
  #episodes {
    margin: 50px auto;
    width: 100%;
  }
}
#person-info {
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  text-align: left;
  padding-top: 0.5em;
  height: 4.5em;
  border-bottom: solid lightgray;
}
#person-info h2 {
  color: black;
  margin-bottom: 0em;
  margin-top: 0.5em;
  font-size: 0.9em;
  width: 36em;
}
#person-info h3 {
  color: lightgrey;
  font-weight: normal;
  font-size: 0.5em;
  margin-top: 0em;
  width: 36em;
}
#person-info p {
  color: black;
  font-weight: normal;
  font-size: 0.5em;
  width: 80%;
}
#person-info img {
  width: 3.5em;
  float: left;
  border: 1px solid white;
  border-radius: 3em;
  margin: 0.4em;
}
#bouton-vote {
  border: solid 1px lightgray;
  width: 2em;
  text-align: center;
  font-size: 57%;
  border-radius: 1em;
  color: black;
  float: right;
  position: relative;
  top: -6em;
  padding: 0.5em;
  margin-right: 1em;
}
#addPerson {
  position: absolute;
  top: 1.5em;
  right: 1em;
  font-size: medium;
  color: white;
  background-color: #9456b7;
  border: 1px solid #9456b7;
  border-radius: 0.5em;
  padding: 2%;
  margin: 0% 1%;
}
.v--modal-box {
  border-radius: 1em;
}
#div-modal {
  width: 100%;
  height: 100%;
  background-color: #f3d7f0;
  text-align: center;
  color: #6a477d;
  padding: 1%;
}
#sign-in-vote {
  border-radius: 0.5em;
  text-align: center;
  font-size: 72%;
  margin-top: 20px;
}
#explain {
  font-size: 86%;
  text-align: left;
  padding: 2% 5%;
}
input {
  width: 55.5%;
  font-size: 1em;
  padding: 1%;
  border-radius: 1em 1em 0em 0em;
  border: none;
  margin-top: 40px;
}
input:focus {
  border-radius: 1em 1em 0em 0em;
}

button {
  width: 57.5%;
  padding: 1%;
  font-size: inherit;
  background-color: #6a477d1f;
  color: #6a477d;
  cursor: pointer;
  border-radius: 0em 0em 1em 1em;
}

button:active {
  background-color: #6a477d;
  color: #8c6c9e;
}

#addPerson .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}
#addPerson .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
}
#addPerson:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
  background-color: #9456b7;
}
</style>
