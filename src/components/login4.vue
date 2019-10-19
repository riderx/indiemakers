
<template>
  <div>
    <section id="emissions">
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
  </div>
</template>
<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { firebaseLib } from "../utils/db";

export default {
  created() {
    if (firebaseLib.auth().isSignInWithEmailLink(window.location.href)) {
      this.email = window.localStorage.getItem("emailForSignIn");
      if (this.email) {
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
    // showConfirm() {
    //   this.$modal.show("confirm");
    // },
    sendConfirm() {
      if (this.email) {
        firebaseLib
          .auth()
          .signInWithEmailLink(this.email, window.location.href)
          .then(() => {
            window.localStorage.removeItem("emailForSignIn");
            this.$router.push("/Votes");
          })
          .catch(error => {
            console.error(error);
            this.$router.push("/");
          });
      } else {
        this.$router.push("/");
      }
    }
  }
};
</script>

<style scoped>
#emissions {
  padding-top: 20px;
  width: 47vw;
  height: 48vh;
  min-height: 48vh;
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
  border: none;
  margin-top: 40px;
}

button {
  width: 57.5%;
  padding: 1%;
  font-size: inherit;
  background-color: #6a477d1f;
  color: #6a477d;
  cursor: pointer;
}

button:active {
  background-color: #6a477d;
  color: #8c6c9e;
}
</style>
