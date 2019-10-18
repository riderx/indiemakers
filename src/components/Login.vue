
<template>
  <div>
    <modal :height="300" name="confirm">
      <section id="div-modal">
        Email Verification
        <div id="sign-in-vote">
          <div id="explain">Pour etre sur que tu n'essais pas un etre malicieux confirme ton email</div>
          <div class="person-email">
            <input v-model="email" type="email" placeholder="elon@musk.com" />
          </div>
          <div>
            <button @click="sendConfirm()">valider</button>
          </div>
        </div>
      </section>
    </modal>
  </div>
</template>
<script>
import { db } from "../utils/db";
import firebase from "firebase/app";

export default {
  created() {
    this.showConfirm();

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      this.email = window.localStorage.getItem("emailForSignIn");
      if (this.email) {
        this.showConfirm();
      } else {
        this.sendConfirm();
      }
    }
  },
  data() {
    return {
      email: null
    };
  },
  methods: {
    showConfirm() {
      this.$modal.show("confirm");
    },
    sendConfirm() {
      if (this.email) {
        firebase
          .auth()
          .signInWithEmailLink(email, window.location.href)
          .then(result => {
            window.localStorage.removeItem("emailForSignIn");
            this.$router.push("/Votes");
          })
          .catch(error => {
            this.$router.push("/");
          });
      } else {
        this.$router.push("/");
      }
    }
  }
};
</script>

<style>
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
</style>
