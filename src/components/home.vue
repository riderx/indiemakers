<template>
  <div class="container-fluid pt-md-5">
    <div class="row pt-lx-5">
      <div class="col-12 col-md-6 pt-md-5 px-md-5 text-white order-2 order-md-1">
        <h1 class="pb-2">{{ title }}</h1>
        <div v-bind:key="message" v-for="message in messages">
          <p class="pb-0">{{ message }}</p>
        </div>
        <p>{{ banner }}</p>
        <div class="row">
          <div class="offset-3 offset-md-0 col-6 col-md-12 pb-5 pt-3">
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
      title: "Un podcast sur les créateurs de business indépendants",
      messages: [
        `Salut je suis Martin DONADIEU, et sur ce podcast j’interviewe des makers qui ont fait de leur idée des business profitable.`,
        `Plus que leur simple success story nous allons plus loin pour comprendre leur histoire, leur challenges et leur tactiques pour faire grandir depuis zéro leur propre business indépendant.`,
        `Je parle avec toute personne qui a su crée son business avec ou sans talent pour coder. J’interviewe les makers qui commence, pour avoir une vision authentique et un exemple de comment débuter !`,
        `Mais j'interviewe aussi ceux qui ont un MMR plus élevé pour comprendre comment ils continuent d’atteindre leur objectif, et les différents challenges pour continuer a gardé ce revenu.`,
        `Que vous soyez en train de créer votre propre business ou que vous cherchiez devenir maker, dans ce podcast vous apprendrez par l’exemple comment devenir un indie maker financièrement indépendant, et cela sans se prendre au sérieux !`
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
