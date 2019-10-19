<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 py-5">
        <h1>{{ titre }}</h1>
        <div v-bind:key="message" v-for="message in messages">
          <p>{{ message }}</p>
          <br />
        </div>
        <p>{{ banner }}</p>
        <button type="button" class="btn btn-success text-light px-4" @click.passive="goEpisodes">
          <h3>Episodes</h3>
        </button>
      </div>
      <div class="col-12 col-md-6">
        <IllustrationAccueil />
      </div>
    </div>
  </div>
  <!-- <div id="Accueil" class="jumbotron-fluid">
    <div id="main">
      <h1 id="titreAccueil">{{ titre }}</h1>
      <p id="message">{{ message }}</p>
      <br />
      <p id="message">{{ message2 }}</p>
      <br />
      <p id="message">{{ message3 }}</p>
      <br />
      <p id="bannière">{{ bannière }}</p>
      <button @click.passive="goEpisodes" id="button">Episodes</button>
    </div>
    <IllustrationAccueil />
  </div>-->
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
      message: `Salut je suis Martin DONADIEU, et sur Indiemaker.fr j’interviewe des makers qui ont fait de leur idée et side projet des business en ligne profitable.
 Plus que leur simple success story nous allons plus loin pour comprendre leur histoire, les challenges et les tactiques derrière les makers qui ont créé depuis zéro et fait grandir leur propre business indépendant.`,
      message2: `Je parle avec toute personne qui a su cree son business avec ou sans talent pour coder.\n
J’interviewe les maker qui commence, pour avoir une vision authentique et un exemple de comment commencer !`,
      message3: `
Mais j'interviewe aussi a ceux qui ont un MMR plus élevé pour comprendre comment ils continuent d’atteindre leur objectif, et les différents challenges pour continué a gardé ce revenue.
Que vous soyez en train de créer votre propre business ou que vous cherchiez a le devenir, dans ce podcast vous apprendrez par l’exemple comment devenir financièrement indépendant un indie maker, et cela sans se prendre au sérieux ! `,
      bannière:
        "#Innovation, #Entrepreunariat, #Makers, #AutoFormation, #Productivite, #Independans, #MRR"
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
</style>
