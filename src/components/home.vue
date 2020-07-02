<template>
  <div class="container-fluid pt-md-5">
    <div class="row pt-lx-5">
      <div class="col-12 col-md-6 pt-md-0 px-md-5 text-white order-2 order-md-1">
        <div class="row">
          <div class="col-12 pt-3 order-1 text-center text-sm-left">
            <h1 class="pb-2">{{ title }}</h1>
          </div>
          <div class="col-12 pt-3 order-3 order-md-2 text-center text-sm-left">
            <div v-for="(message, index) in messages" :key="`fruit-${index}`">
              <p class="pb-0">{{ message }}</p>
            </div>
            <p>{{ banner }}</p>
            <p>Par <b>Martin DONADIEU</b></p>
          </div>
          <div class="col-12 py-1 py-md-3 order-2 order-md-3 text-center text-sm-left">
            <h3>Prochain episode dans : {{nextEpisode()}} !</h3>
            <button
              type="button"
              class="btn btn-primary border-5 border-light btn-lg bnt-block text-white px-4"
              @click.passive="goEpisodes"
            >
              <i class="fas fa-headphones"></i> Episodes
            </button>
          </div>
          <div class="col-12 py-1 py-md-3 order-4 order-md-3 text-center text-sm-left">
            <h3>Aide moi a trouver les prochain invités !</h3>
            <button
              type="button"
              class="btn btn-primary border-5 border-light btn-lg bnt-block text-white px-4"
              @click.passive="goMakers"
            >
              Makers Hunt
            </button>
          </div>
        </div>
      </div>
      <div v-if="feed" class="offset-3 offset-md-0 col-6 col-md-5 pt-0 px-md-5 order-1 order-md-2">
        <img class="img-fluid border-10 border-light" alt="cover IM" src="/assets/cover-imf_2-min.png" />
      </div>
      <div class="col-12 pt-0 px-md-5 py-4 order-3 text-white text-center text-sm-left">
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
const RSSURL = 'https://cors-anywhere.herokuapp.com/https://anchor.fm/s/414d1d4/podcast/rss';

export default {
  components: {
    // IllustrationHome: () => import(/* webpackPrefetch: true */ "./illuHome.vue")
  },
  data() {
    return {
      feed: null,
      title: "🚀Le 1er podcast francais qui aide les independants a vivre de leur business.",
      messages: [
        `Ici, tu trouveras des podcasts où j'échange avec ceux qui ont su transformer leurs idées en en business florissant.`,
        `Au-delà des success-story, nous décryptons leur histoire, leur stratégie, leurs challenges, afin de comprendre comment ils ont réussi à devenir profitables.`,
        `J’interroge différents types de Makers, des novices, des aguerris, toujours dans le but de comprendre comment ils se sont lancés et comment ils ont rendu leur business pérenne.`,
        `Qui que tu sois, dans ce podcast tu apprendras à devenir un Indie Maker !`,
        `Un épisode tous les 15 jours`
      ],
      banner:
        "#Independant, #Makers, #AutoFormation, #Productivite, #Business, #MRR"
    };
  },
  mounted() {
    setTimeout(() => {
      parser.parseURL(RSSURL)
      .then((feed) => {
        this.feed = feed;
        const description = feed.description.trim().split('\n');
        this.title = this.removeAccent(description.shift());
        this.messages = description;
      }).catch((error) => {
          // this.loading = false;
          console.error(error)
      })
    }, 1500);
  },
  methods: {
    removeAccent(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
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
