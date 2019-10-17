<template>
  <div id="emissions">
    <div id="episodes">
      <h2 id="titreEpisodes">En construction</h2>
      
    <div id="person-info" v-bind:key="person.id" v-for="person in people">

      <div> <img :src="person.pic" alt="Logo person"> </div>
      <h2>{{person.name}}</h2>
      <h3>{{person.login}}</h3>
      <p>{{person.bio}}</p>
      <div id="bouton-vote">votes:{{person.votes}}</div>
    </div>
      
    </div>
    <illu2 />
  </div>
</template>

<script>
import illu2 from "./illu2.vue";

export default {
  components: {
    illu2
  },
  data() {
    return {
      people: [
        {
          id: 1,
          name: "NASA",
          login: "@NASA",
          bio: `Explore the universe and discover our home planet with 
@NASA
. We usually post in EDT (UTC-4)`,
          pic: "https://pbs.twimg.com/profile_images/1091070803184177153/TI2qItoi_400x400.jpg",
          votes: 12
        },    {
          id: 2,
          name: "sha",
          login: "@Sha_code",
          bio: `Explore the universe and discover our home planet with 
@NASA
. We usually post in EDT (UTC-4)`,
          pic: "https://twitter.com/NASA/photo",
          votes: 12
        }
      ]
    };
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
#person-info{
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  text-align: left;
  padding-top: 0.5em;
}
#person-info h2{
  color: black;
  margin-bottom: 0em;
  margin-top: 0em;
  font-size: 1em;
  width: 36em;
}
#person-info h3{
  color: lightgrey;
  font-weight: normal;
  font-size: 0.5em;
  margin-top: 0em;
  width: 36em;
}
#person-info p{
  color: black;
  font-weight: normal;
  font-size: 0.5em;
  width: 36em;
}
#person-info img{
  width: 4.5em;
  float: left;
}
#bouton-vote {
    border: solid 1px lightgray;
    bottom: 4em;
    position: relative;
    left: 22em;
    width: 3em;
    text-align: center;
    font-size: 78%;
    border-radius: 1em;
}


</style>
