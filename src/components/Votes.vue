<template>
  <div id="emissions">
    <modal name="hello-world">hello, world! 
     <div id="person-email">Enter your e-mail to upvote :<input type="text"></div> 
    </modal>
    <div id="episodes">
      <h2 id="titreEpisodes">En construction</h2>
      <div id="addPerson">+ Ajouter une proposition</div>
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
  top: 5em;
  right: 0em;
  font-size: medium;
  color: #9456b7;
  border: 1px solid #9456b7;
  border-radius: 2em;
  box-shadow: 1em #df99d8;
}
#person-email{
  text-align: center;
  color:  #9456b7;

}

</style>
