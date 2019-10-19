<template>
  <div class="container-fluid pt-md-5">
    <div class="row pt-md-5">
      <div class="col-12 col-md-6 pt-md-5 px-md-5 text-white order-2 order-md-1">
        <h1 class>{{ title }}</h1>
        <div v-bind:key="message" v-for="message in messages">
          <p>{{ message }}</p>
          <br />
        </div>
        <p>{{ banner }}</p>
        <div class="row">
          <div class="offset-3 offset-md-0 col-6 col-md-12">
            <button
              type="button"
              class="btn btn-success btn-lg bnt-block text-white px-4"
              @click.passive="goEpisodes"
            >Episodes</button>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 pt-0 px-md-5 order-1 order-md-2">
        <IllustrationHome />
      </div>
    </div>
  </div>
</template>

<script>
import IllustrationHome from "./illuHome.vue";

export default {
  components: {
    IllustrationHome
  },
  data() {
    return {
      title: "Un podcast sur les createur de business independents",
      messages: [
        `Salut je suis Martin DONADIEU, et sur Indiemaker.fr j’interviewe des makers qui ont fait de leur idée et side projet des business en ligne profitable.
 Plus que leur simple success story nous allons plus loin pour comprendre leur histoire, les challenges et les tactiques derrière les makers qui ont créé depuis zéro et fait grandir leur propre business indépendant.`,
        `Je parle avec toute personne qui a su cree son business avec ou sans talent pour coder.\n
J’interviewe les maker qui commence, pour avoir une vision authentique et un exemple de comment commencer !`,
        `
Mais j'interviewe aussi a ceux qui ont un MMR plus élevé pour comprendre comment ils continuent d’atteindre leur objectif, et les différents challenges pour continué a gardé ce revenue.
Que vous soyez en train de créer votre propre business ou que vous cherchiez a le devenir, dans ce podcast vous apprendrez par l’exemple comment devenir financièrement indépendant un indie maker, et cela sans se prendre au sérieux ! `
      ],
      banner:
        "#Innovation, #Entrepreunariat, #Makers, #AutoFormation, #Productivite, #Independans, #MRR"
    };
  },
  methods: {
    goEpisodes() {
      this.$router.push("/votes");
    }
  }
};
</script>

<style scoped>
</style>
