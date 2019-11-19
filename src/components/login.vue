
<template>
  <div>
    <modal height="auto" adaptive name="loading">
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
    <modal height="auto" adaptive :clickToClose="isFalse" name="confirmName">
      <div class="container-fluid">
        <div class="row bg-primary py-2">
          <div class="col-12 pt-2 text-white text-center">
            <h1>😨 Spam ou pas Spam ?</h1>
          </div>
        </div>
        <div class="row bg-success pt-4">
          <div class="col-12 pt-2 text-white text-center">
            <p>Ajoute ton nom pour recevoir par email les épisodes pour lesquels tu as voté.</p>
          </div>
          <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
            <div class="form-group mb-0">
              <input
                ref="myName"
                type="text"
                v-model="myName"
                class="form-control pb-0"
                aria-describedby="TweetnameHelp"
                placeholder="Elon Musk"
                v-on:keyup.enter="addName()"
              />
            </div>
            <p>Si tu choisie un faux nom ca seras a jamais dans les spams 😢</p>
          </div>
          <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
            <button
              type="button"
              class="btn btn-primary btn-lg btn-block text-light px-4 h1"
              @click="addName()"
            >Valider mon Nom</button>
          </div>
        </div>
      </div>
    </modal>
    <div class="container-fluid">
      <div class="row pt-md-5">
        <div class="col-12 offset-md-1 col-md-5">
          <div class="row bg-primary py-4">
            <div class="col pt-3 px-0 text-white text-center">
              <h1>🔑Email Verification</h1>
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
                @click="sendConfirm()"
              >🚀valider</button>
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
import { firebaseLib } from "../utils/db";
import illu from "./illu.vue";

export default {
  components: {
    illu
  },
  mounted() {
    firebaseLib.auth().onAuthStateChanged(user => {
      this.user = user;
      if (this.user.displayName === null) {
        this.$modal.show("confirmName");
      } else {
        this.$router.push("/episodes");
      }
    });
    if (firebaseLib.auth().isSignInWithEmailLink(window.location.href)) {
      this.email = window.localStorage.getItem("emailForSignIn");
      if (this.email) {
        this.sendConfirm();
      }
    }
  },
  data() {
    return {
      email: null,
      myName: null,
      isFalse: false,
      user: null
    };
  },
  methods: {
    addName() {
      this.$modal.hide("confirmName");
      this.$modal.show("loading");
      this.user
        .updateProfile({
          displayName: this.myName
        })
        .then(() => {
          this.$modal.hide("loading");
          this.$router.push("/episodes");
        })
        .catch(() => {
          this.$modal.hide("loading");
        });
    },
    sendConfirm() {
      if (this.email) {
        this.$modal.show("loading");
        firebaseLib
          .auth()
          .signInWithEmailLink(this.email, window.location.href)
          .then(user => {
            window.localStorage.removeItem("emailForSignIn");
            this.$modal.hide("loading");
          })
          .catch(error => {
            console.error(error);
            this.$modal.hide("loading");
            this.$router.push("/");
          });
      }
    }
  }
};
</script>

<style scoped>
</style>
