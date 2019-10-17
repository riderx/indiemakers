<template>
  <div id="emissions">
    <modal :height="320" name="hello-world" >
      <section id="div-modal">
      Inscription 
      <div id="sign-in-vote">
        <div id="explain"> Pour pouvoir voter ou ajouter un·e potentiel·le invité·e, j’ai besoin que tu valides ton email pour deux raisons: éviter les faux votes et pouvoir te tenir au courant s'il y a des news sur le podcast ou dans mes projets ( je n'aime pas le spam, attends-toi à pas plus de 3 par an ). 
Et bien entendu, je refile ton e-mail à personne, je déteste ça ! </div>
         <div class="person-email">Tu peux ecrire ton e-mail juste là :<input type="text"></div>
         <div><button>valider</button></div>
      </div>
      </section>
    </modal>
    <div id="episodes">
      <h2 id="titreEpisodes">Most wanted</h2>
      <div id="addPerson"> + <span class="tooltiptext">Ajouter un·e invité·e</span></div>
    
    <div id="person-info" v-bind:key="person.id" v-for="person in people">

      <div> <img :src="person.pic" alt="Logo person"> </div>
      <h2>{{person.name}}</h2>
      <h3>@{{person.login}}</h3>
      <p>{{person.bio}}</p>
      <div id="bouton-vote" @click="show()"> &#9650; {{person.votes}}</div>
    </div>
      
    </div>
    <illu2 />
  </div>
</template>

<script>
import illu2 from "./illu2.vue";
import { db } from "../utils/db";

export default {
  components: {
    illu2
  },
  methods: {
    show() {
      this.$modal.show("hello-world");
    },
    hide() {
      this.$modal.hide("hello-world");
    }
  },
  data() {
    return {
      people: []
    };
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
#person-info img{
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
    padding: 0.2em;
    margin-right: 1%;
}
#addPerson{
  position: absolute;
  top: 3.3em;
  right: 0em;
  font-size: medium;
  color: white;
  background-color: #9456b7;
  border: 1px solid #9456b7;
  border-radius: 0.5em;
  padding: 2%;
  margin: 0% 1%;
}
.v--modal-box{
  border-radius: 1em;
  
}
#div-modal{
  width: 100%;
  height: 100%;
  background-color: #f3d7f0;
  text-align: center;
  color:  #6a477d;
  padding: 1%;
}
#sign-in-vote{
  border-radius: 0.5em;
  text-align: center;
  font-size: 72%;
}
#explain{
  font-size: 86%;
  text-align: left;
  padding: 2% 5%;
}
input {
  width: 45.5%;
  font-size: 1em;
  padding: 1%;
  border-radius: 1em 1em 0em 0em;
}
input:focus {
  border-radius: 1em 1em 0em 0em;
}
button{
width: 48.5%;
  padding: 1%;
  font-size: inherit;
  background-color: #6a477d1f;
  color: #6a477d;
  border-radius: 0em 0em 1em 1em;
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
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
#addPerson:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
  background-color: #9456b7;
}
</style>
