<template>
  <div class="container-fluid pt-md-5">
    <div class="row pt-lx-5">
      <div class="col-12 col-md-6 pt-md-0 px-md-5 text-white order-2 order-md-1">
        <div class="row">
          <div class="col-12 pt-3 order-1">
            <h1 class="pb-2">{{ title }}</h1>
          </div>
          <div class="col-12 pt-3 order-3 order-md-2">
            <div v-for="(message, index) in messages" :key="`fruit-${index}`">
              <p class="pb-0">{{ message }}</p>
            </div>
            <p>{{ banner }}</p>
          </div>
          <div class="col-12 py-1 py-md-3 order-2 order-md-3">
            <h3>Prochain episode dans : {{nextEpisode()}} !</h3>
            <button
              type="button"
              class="btn btn-success btn-lg bnt-block text-white px-4"
              @click.passive="goEpisodes"
            >
              <i class="fas fa-headphones"></i> Episodes
            </button>
          </div>
          <div class="col-12 py-1 py-md-3 order-2 order-md-3">
            <h3>Aide moi a trouver les prochain invités !</h3>
            <button
              type="button"
              class="btn btn-success btn-lg bnt-block text-white px-4"
              @click.passive="goMakers"
            >
              Makers Hunt
            </button>
          </div>
        </div>
      </div>
      <div v-if="feed" class="offset-3 offset-md-0 col-6 col-md-6 pt-0 px-md-5 order-1 order-md-2">
        <img class="img-fluid" :alt="feed.image.title" :src="feed.image.url" />
      </div>
      <div class="col-12 pt-0 px-md-5 py-4 order-3 text-white">
        <h5>Mes autres projets:</h5>
        <div class="d-flex"> 
        <a
          class="text-white d-block px-2"
          target="_blank"
          rel="noreferrer"
          href="https://forgr.ee"
        >Forgr.ee | Agence de creation de MVP pour entrepreneurs</a>
        <a
          class="text-white d-block px-2"
          target="_blank"
          rel="noreferrer"
          href="https://bewise.love"
        >Bewise | Une citation par jour simple et bienveillante.</a>
        <a
          class="text-white d-block px-2"
          target="_blank"
          rel="noreferrer"
          href="https://apps.apple.com/us/app/captime-crossfit-timer/id1369288585"
        >Captime | Crossfit timer</a>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
const Parser = require('rss-parser');
const parser = new Parser();

export default {
  components: {
    // IllustrationHome: () => import(/* webpackPrefetch: true */ "./illuHome.vue")
  },
  data() {
    return {
      feed: null,
      title: "Le 1er podcast français qui aide les indépendants à vivre de leur business.",
      messages: [
        `Salut je suis Martin Donadieu ! Bienvenue sur Indie Makers ! Ici, tu trouveras des podcasts où j'échange avec des Makers qui ont su transformer leurs idées en en business florissant.`,
        `Au-delà de leur success-story, nous allons décrypter leur histoire, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables.`,
        `Toutes les 2 semaines, j'interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur business pérenne.`,
        `Qui que vous soyez, dans ce podcast vous apprendrez à devenir un Indie Maker, le tout sans se prendre au sérieux !`
      ],
      banner:
        "#Independant, #Makers, #AutoFormation, #Productivite, #Business, #MRR"
    };
  },
  mounted() {
 
    parser.parseURL('https://anchor.fm/s/414d1d4/podcast/rss')
    .then((feed) => {
      this.feed = feed;
      const description = feed.description.trim().split('\n');
      this.title = description.shift();
      this.messages = description;
    }).catch((error) => {
        // this.loading = false;
        console.error(error)
    })
  },
  methods: {
    goEpisodes() {
      this.$router.push("/episodes");
    },
    goMakers() {
      this.$router.push("/makers");
    },
    nextEpisode() {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2019, 10, 19);
      const now = new Date();
      const diffDays = Math.round(Math.abs((firstDate - now) / oneDay));
      const nextEp = 14 - (diffDays % 14);
      // const nextEpDate = new Date();
      // nextEpDate.setHours(10, 0, 0);
      // nextEpDate.setDate(now.getDate() + nextEp);
      return nextEp !== 14 ? `${nextEp} jours` : `DEMAIN 10 heures`;
    }
  }
};
</script>
<style scoped>
</style>
