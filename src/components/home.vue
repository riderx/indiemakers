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
      <div class="col-12 pt-0 px-md-5 order-3 text-white">
        <h5>Mes autres projets:</h5>
        <a
          class="text-white"
          target="_blank"
          href="https://forgr.ee"
        >Forgr.ee | Agence de creation de MVP pour entrepreneurs.</a>
        <br />
        <a
          class="text-white"
          target="_blank"
          href="https://bewise.love"
        >Bewise | Une citation par jour simple et bienveillant.</a>
        <br />
        <a
          class="text-white"
          target="_blank"
          href="https://apps.apple.com/us/app/captime-crossfit-timer/id1369288585"
        >Captime | Crossfit timer</a>
        <br />
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
        `Bonjour je suis Martin Donadieu ! Bienvenue sur Indie Maker ! Ici, tu trouveras des podcasts où j'échange avec des Makers qui ont su transformer leurs idées en en business florissant.`,
        `Au-delà de leur success-story, nous allons décrypter leur histoire, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables.`,
        `J'interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur business pérenne.`,
        `Qui que vous soyez, dans ce podcast vous apprendrez à devenir un Indie Maker, le tout sans se prendre au sérieux !`
      ],
      banner:
        "#Independant, #Makers, #AutoFormation, #Productivite, #Business, #MRR"
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
