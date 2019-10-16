<template>
  <div id="Accueil" class="jumbotron-fluid">
    <div id="main">
      <h1 id="titreAccueil">{{ titre }}</h1>
      <p id="message">{{ message }}</p>
      <br />
      <p id="bannière">{{ bannière }}</p>
      <button @click.passive="goEpisodes" id="button">Episodes</button>
    </div>
    <IllustrationAccueil />
  </div>
</template>

<script>
import IllustrationAccueil from "./IllustrationAccueil.vue";

export default {
  name: "TextAccueil",
  components: {
    IllustrationAccueil
  },
  data() {
    return {
      titre: "Un podcast sur les createur de business independents",
      message: `Salut je sur Martin DONADIEU, et sur Indie maker fr j’interviewe des makers qui ont fait de leur idée et side projet des business en ligne profitable.
 Plus qu’un simple success story nous allons plus loin pour comprendre leur histoire, les challenges et les tactiques derrière les makers qui ont créé depuis  zéro et fait grandir leur propre business indépendant. 
Je parle avec toute personne qui a su cree son business avec ou sans talent pour coder.\n
J’interviewe les maker qui commence, pour avoir une vision authentique et un exemple de comment commencer !
Mais je m’attaque aussi a ceux qui ont un MMR plus élevé pour comprendre comment ils continuent d’atteindre leur objectif, et les différents challenges pour continué a gardé ce revenue.
Que vous soyez en train de créer votre propre business ou que vous cherchiez a le devenir, dans ce podcast vous apprendrez par l’exemple comment devenir financièrement indépendant un indie maker, et cela sans se prendre au sérieux ! `,
      bannière:
        "#Innovation, #Entrepreunariat, #MarcheDuTravail, #AutoFormation, #Productivite, #Outils."
    };
  },
  methods: {
    goEpisodes() {
      this.$router.push("/Emissions");
    }
  }
};
</script>

<style scoped>
#Accueil2 {
  margin: auto;
  width: 100vw;
}
#main {
  width: 40%;
  display: flex;
  flex-flow: column nowrap;
  margin-right: 10px;
  padding-top: 150px;
  margin-left: 100px;
  z-index: 0;
}
#message {
  width: 100%;
  margin: 0px;
  font-size: 1em;
  color: whitesmoke;
}

#bannière {
  width: 100%;
  font-size: 1em;
  margin: 0;
  color: whitesmoke;
}

#button {
  width: 150px;
  color: black;
  background-color: white;
  border-color: black;
  transition: all 0.2s ease-in-out;
  z-index: 0;
  margin-top: 46px;
  padding: 8px;
  font-size: 1.5em;
}

h1 {
  width: 433px;
  font-size: 39px;
  color: white;
  font-family: "Rex Bold", "Open Sans";
  margin: 0 0 45px;
}

p {
  font-family: "Lato", sans-serif;
  margin-right: 200px;
  font-size: 1.5em;
  /*margin: 100px;*/
}

@media only screen and (max-width: 800px) {
  #Accueil2 {
    display: flex;
    flex-flow: column nowrap;
  }
  #main {
    width: 100%;
    margin-right: auto;
    margin-top: -50px;
    margin-left: auto;
  }

  h1 {
    width: 90%;
    margin: 0 auto 5px;
    font-size: 2.3em;
  }

  #message {
    width: 90%;
    font-size: 1.4em;
    margin: 15px auto;
  }

  #bannière {
    width: 90%;
    font-size: 1.6em;
    margin: 0 auto;
  }
  #button {
    margin: 30px auto;
  }
}

@media only screen and (max-width: 420px) {
  /* #Accueil2 {
            display: flex;
            flex-flow: column nowrap;
        } */
  #main {
    /* width: 100%;
            margin-right: auto; */
    margin-top: -150px;
    /* margin-left: auto; */
  }

  h1 {
    width: 80%;
    font-size: 1.6em;
    margin: 0 20% auto;
    /* text-align: center; */
  }

  #message {
    /* width: 90%; */
    font-size: 1em;
    margin: 15px auto 5px;
  }

  #bannière {
    width: 90%;
    font-size: 1em;
    margin: auto;
  }
  /* #button {
            margin: 30px auto;
        } */
}
</style>
