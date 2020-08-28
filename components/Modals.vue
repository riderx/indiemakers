<template>
  <client-only>
    <div>
      <modal height="auto" adaptive name="copied">
        <div class="container-fluid">
          <div class="row bg-primary border-10 border-light">
            <div class="col-12">
              <div class="row pt-4 h-100">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Lien Copié</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="listen">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="row bg-primary border-10 border-light py-4">
                <div class="col-12 pt-1 px-1 px-md-3 text-white text-center">
                  <h3>Tu peux aussi écouter l'épisode sur :</h3>
                </div>
                <div class="col-12 pt-1 px-1 px-md-3 text-center">
                  <button
                    v-tooltip="'Ecouter l\'épisode sur spotify'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://open.spotify.com/show/6Agf3YmcAdNx4tQMJVoRQg')"
                  >
                    Spotify
                  </button>
                  <button
                    v-tooltip="'Ecouter l\'épisode sur Apple podcast'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://podcasts.apple.com/fr/podcast/indie-maker-fr/id1488437972')"
                  >
                    Apple Podcast
                  </button>
                  <button
                    v-tooltip="'Ecouter l\'épisode sur Youtube'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://www.youtube.com/channel/UCMedW_Y4K0alzeVz1bSBvjA')"
                  >
                    Youtube
                  </button>
                  <button
                    v-tooltip="'Ecouter l\'épisode sur Google podcast'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://podcasts.google.com/?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy80MTRkMWQ0L3BvZGNhc3QvcnNz')"
                  >
                    Google Podcast
                  </button>
                  <button
                    v-tooltip="'Ecouter l\'épisode sur Deezer'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://deezer.com/show/689072')"
                  >
                    Deezer
                  </button>
                  <button
                    v-tooltip="'Ecouter l\'épisode sur Podcast Addict'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://podcastaddict.com/podcast/2482236')"
                  >
                    Podcast Addict
                  </button>
                  <button
                    v-tooltip="'Ecouter l\'épisode sur Anchor'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="listenExternal('https://anchor.fm/indiemakers')"
                  >
                    Anchor
                  </button>
                  <button
                    v-tooltip="'Copier le flux RSS'"
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg text-white m-1 m-md-3 px-3 h1"
                    @click="copyTextToClipboard('https://anchor.fm/s/414d1d4/podcast/rss')"
                  >
                    RSS
                  </button>
                </div>
                <div class="col-12 pt-1 px-1 px-md-3 text-white text-center">
                  <p>Abonner toi, ça m'aide énormement !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="copied">
        <div class="container-fluid">
          <div class="row https://anchor.fm/s/414d1d4/podcast/rss">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>✅C'est fait !</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Lien Copié, je sais pas trop ce que tu compte en faire mais enjoy, c'est tout❤️</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-white px-4 h1"
                    @click="$modal.hide('copied')"
                  >
                    😎Cool
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="thanks_register">
        <div class="container-fluid">
          <div class="row bg-primary border-10 border-light">
            <div class="col-12">
              <div class="row pt-4 h-100">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Check tes emails, tu y trouveras mon premier email, si tu ne le vois pas check tes spams !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="thanks_ebook">
        <div class="container-fluid">
          <div class="row bg-primary border-10 border-light">
            <div class="col-12">
              <div class="row pt-4 h-100">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Check tes emails, tu y trouveras le lien vers l'ebook et une petite surprise, si tu ne le vois pas check tes spams !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="already_register">
        <div class="container-fluid">
          <div class="row bg-primary border-10 border-light">
            <div class="col-12">
              <div class="row pt-4 h-100">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Tu est deja inscrit ! </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="join">
        <div class="container-fluid">
          <div class="row bg-primary py-2 border-10 border-light">
            <div class="col-12">
              <h1 class="pl-2 py-2 m-0 text-white text-center">
                Mes Emails Privés !
              </h1>
              <p class="px-5 text-white">
                Un email chaque semaine avec mes conseils actionables pour lancer son side-projet, et gagner sa liberté !
              </p>
              <p class="px-5 text-white">
                Tu seras également informé de la sortie des épisodes !
              </p>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="emailInput"
                    type="text"
                    class="form-control pb-0"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon@tesla.com"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="nameInput"
                    type="text"
                    class="form-control pb-0"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon Musk"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                  @click="addEMailSub()"
                >
                  Comfirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="ebook">
        <div class="container-fluid">
          <div class="row bg-primary py-2 border-10 border-light">
            <div class="col-12">
              <h1 class="pl-2 py-2 m-0 text-white text-center">
                Le guide pour lancer ton projet !
              </h1>
              <p class="px-5 text-white">
                Reçoit mon guide en 6 étapes qui te fera éviter bien des erreurs et gagner un temps précieux !
              </p>
              <p class="px-5 text-white">
                Tu seras également informé de la sortie des épisodes !
              </p>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="emailInput"
                    type="text"
                    class="form-control pb-0"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon@tesla.com"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="nameInput"
                    type="text"
                    class="form-control pb-0"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon Musk"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                  @click="addEMailSub('ebook')"
                >
                  Comfirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="loading">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 p-5 text-center">
              <div class="spinner-grow text-primary" style="width: 6rem; height: 6rem;" role="status">
                <span class="sr-only">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive :click-to-close="isFalse" name="confirmName">
        <div class="container-fluid">
          <div class="row bg-primary py-2 border-10 border-light">
            <div class="col-12 pt-2 text-white text-center">
              <h1>😨 Mais qui est tu ?</h1>
            </div>
          </div>
          <div class="row bg-primary pt-4 h-100 border-10 border-light">
            <div class="col-12 pt-2 text-white text-center">
              <p>Ajoute ton prénom pour que je puisse savoir a qui s'adresse mes emails !</p>
            </div>
            <div class="col-12 pt-2 text-white text-center">
              <p>Si tu choisie de ne pas en mettre tu t'apelleras Bob </p>
            </div>
            <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
              <div class="form-group mb-0">
                <input
                  ref="name"
                  v-model="nameInput"
                  type="text"
                  class="form-control pb-0"
                  aria-describedby="TweetnameHelp"
                  placeholder="Elon Musk"
                  @keyup.enter="addName()"
                >
              </div>
            </div>
            <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
              <button
                type="button"
                class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                @click="addName()"
              >
                Comfirmer
              </button>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="error">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😨 Quelque chose n'as pas marché</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Essais plus tard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="found">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>Cet Episode existe !</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Grace a ton vote et ceux des autres, ce·tte maker a accepter de venir dans le podcast !</p>
                  <p>Merci ❤❤</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="openEp(guid)"
                  >
                    Ecouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="added">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>🏄‍♂️ Ajout pris en compte</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p>J'ai supposé que tu voulais aussi voter pour lui/elle, alors c'est fait .✅</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                  <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-add">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>👀Je ne trouve pas ce·tte Maker</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Je ne peut pas ajouter de Maker qui n'est pas sur Twitter pour le moment.</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="$modal.hide('fail-add')"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-vote">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😨 Hoho</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>tu as deja voté pour ce·tte Maker</p>
                  <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-exist">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😝 OUPS</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Ce·tte maker est déjà présent dans la liste, J'ai ajouté ton vote pour lui/elle.</p>
                  <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-exist-vote">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>😝 OUPS</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Ce·tte maker est déjà présent dans la liste, et tu as déjà voté pour lui/elle 😇.</p>
                  <p>Tu peux toujour twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="add">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>👌Ajouter un·e Maker</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Saisie le nom de son compte Twitter</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                  <div class="form-group mb-0">
                    <input
                      ref="maker"
                      v-model="makerInput"
                      type="text"
                      class="form-control pb-0"
                      aria-describedby="TweetnameHelp"
                      placeholder="elonmusk"
                      @keyup.enter="addMaker()"
                    >
                  </div>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="addMaker()"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="voted">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>💪Vote pris en compte</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 h-100 border-10 border-light">
                <div class="col-12 pt-2 text-white">
                  <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                  <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="checkEmail">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>✅Check ta boite email</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Tu viens de recevoir ton lien de login par email, click dessus, c'est tout❤️</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="$modal.hide('checkEmail')"
                  >
                    😎Cool
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="upgrade">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>Besoin de plus ?</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Parfois pour se lancer, un podcast, un ebook ne suffit pas</p>
                  <p>J'ai crée pour toi des outils pour passer a l'étape superieure !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="bmc()"
                  >
                    C'est parti
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="rate">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>Tu aimes cet épisode ?</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Click en dessous et note le 5 ⭐️, c'est ce qui m'aide le plus !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="rate()"
                  >
                    Noter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="share">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>Tu aimes cet épisode ?</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Fait le savoir a l'invité du podcast en partagant sur twitter </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="tweetIt()"
                  >
                    Partager
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="register">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 h-100">
              <div class="row bg-primary py-2 border-10 border-light">
                <div class="col-12 pt-2 text-white text-center">
                  <h1>🔐Pas tout de suite !</h1>
                </div>
              </div>
              <div class="row bg-primary pt-4 border-10 border-light">
                <div class="col-12 pt-2 text-white">
                  <p>Pour te tenir au courant de la sortie de l'épisode et éviter les faux votes</p>
                  <h5 class="text-center">
                    j’ai besoin que tu valides ton email
                  </h5>
                  <p>Tu ne recevras des emails seulement pour les makers pour qui tu as voté, et si j'ai une grande nouvelle a te partager.</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                  <div class="form-group mb-0">
                    <input
                      ref="register"
                      v-model="emailInput"
                      type="email"
                      class="form-control pb-0"
                      aria-describedby="emailHelp"
                      placeholder="elon@musk.com"
                      @keyup.enter="sendLogin()"
                    >
                  </div>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="btn btn-primary border-5 border-light btn-lg btn-block text-light px-4 h1"
                    @click="sendLogin()"
                  >
                    🚀VALIDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
    </div>
  </client-only>
</template>

<script>

export default {
  name: 'Modals',
  components: {
  },
  props: { name: { type: String, default: null }, epGui: { type: String, default: null }, maker: { type: String, default: null }, email: { type: String, default: null } },
  data () {
    return {
      user: null,
      isFalse: false,
      newMaker: null,
      newName: null,
      newEmail: null
    }
  },
  computed: {
    nameInput: {
      get () {
        return this.name
      },
      set (newValue) {
        this.newName = newValue
        this.$emit('update:name', newValue)
      }
    },
    makerInput: {
      get () {
        return this.maker
      },
      set (newValue) {
        this.newMaker = newValue
        this.$emit('update:maker', newValue)
      }
    },
    emailInput: {
      get () {
        return this.email
      },
      set (newValue) {
        this.newEmail = newValue
        this.$emit('update:email', newValue)
      }
    }
  },
  mounted () {
    require('../plugins/modal.client')
    this.$firebase.auth().onAuthStateChanged((user) => {
      this.user = user
    })
  },
  methods: {
    rate () {
      this.$modal.hide('rate')
      window.open('https://ratethispodcast.com/imf', '_blank')
    },
    bmc () {
      window.open(`https://www.buymeacoffee.com/${process.env.handler}`, '_blank')
    },
    addEMailSub (name) {
      this.$firebase
        .firestore()
        .collection('users')
        .doc(this.newEmail)
        .set({
          first_name: this.newName,
          email: this.newEmail
        }).then(() => {
          this.$modal.hide('join')
          if (name === 'ebook') {
            this.$modal.show('thanks_ebook')
          } else {
            this.$modal.show('thanks_register')
          }
        })
    },
    addName () {
      this.$modal.hide('confirmName')
      this.$modal.show('loading')
      this.user
        .updateProfile({
          displayName: this.newName
        })
        .then(async () => {
          try {
            await this.$firebase
              .firestore()
              .collection('users')
              .doc(this.user.email)
              .set({
                first_name: this.newName,
                email: this.user.email
              })
          } catch (err) {
            console.error('exist already', err)
          }
          this.$modal.hide('loading')
          this.$router.push('/makers')
        })
        .catch(() => {
          this.$modal.hide('loading')
        })
    },
    listenExternal (url) {
      window.open(url, '_blank')
    },
    openEp (guid) {
      this.$router.push(`/episode/${guid}`)
    },
    openRegister () {
      this.$modal.show('register')
      setTimeout(() => {
        this.$refs.register.focus()
      }, 50)
    },
    addMaker () {
      this.$modal.hide('add')
      this.$modal.show('loading')
      if (!this.user) {
        this.$modal.hide('loading')
        this.openRegister()
      } else {
        this.$firebase
          .functions().httpsCallable('addTwiterUser')({ name: this.newMaker })
          .then((addJson) => {
            const added = addJson.data
            this.$modal.hide('loading')
            if (added.error && added.error === 'Already voted') {
              this.$modal.show('fail-exist-vote')
            } else if (added.error) {
              console.error(added)
              this.$modal.show('fail-add')
            } else if (added.done && added.done === 'Voted') {
              this.$modal.show('fail-exist')
            } else {
              this.$modal.show('added')
            }
          })
          .catch((err) => {
            this.$modal.hide('loading')
            this.$modal.show('error')
            console.error(err)
          })
      }
    },
    sendLogin () {
      if (this.newEmail) {
        window.localStorage.setItem('emailForSignIn', this.newEmail)
        const actionCodeSettings = {
          url: `${process.env.domain}/login`,
          handleCodeInApp: true
        }
        this.$modal.hide('register')
        this.$modal.show('loading')
        this.$firebase
          .auth()
          .sendSignInLinkToEmail(this.newEmail, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem('emailForSignIn', this.newEmail)
            this.$modal.hide('loading')
            this.$modal.show('checkEmail')
          })
          .catch((error) => {
            this.$modal.hide('loading')
            console.error(error)
          })
      }
    },
    tweetItMaker () {
      const text = `@${this.maker}, j'aimerais beaucoup que tu sois le·a prochain invité·e du podcast @${process.env.handler} 🚀.`
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    },
    tweetIt () {
      const linkEp = `${process.env.domain}/episode/${this.epGui}`
      const tweet = `J'écoute le podcast @${process.env.handler} avec ${this.maker} ${linkEp}`
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    }
  }
}
</script>

<style scoped>

</style>
