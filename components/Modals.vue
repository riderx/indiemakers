<template>
  <client-only>
    <div>
      <modal height="auto" adaptive name="copied">
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('copied')">
              <span aria-hidden="true">&times;</span>
            </button>
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
        <div class="container-fluid relative">
          <div class="row">
            <div class="col-12">
              <div class="row bg-indiePurple py-5">
                <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('listen')">
                  <span aria-hidden="true">&times;</span>
                </button>
                <div class="col-12 pt-1 px-1 md:px-3 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    Écoute sur :
                  </h1>
                </div>
                <div class="col-12 pt-3 px-1 md:px-3 text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light btn-lg text-white m-1 md:m-3 px-3 py-1 h1 hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                    @click="listenExternal('https://open.spotify.com/show/6Agf3YmcAdNx4tQMJVoRQg')"
                  >
                    Spotify
                  </button>
                  <button
                    type="button"
                    class="rounded-none border-4 border-light btn-lg text-white m-1 md:m-3 px-3 py-1 h1 hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                    @click="listenExternal('https://podcasts.apple.com/fr/podcast/indie-maker-fr/id1488437972')"
                  >
                    Apple Podcast
                  </button>
                  <button
                    type="button"
                    class="rounded-none border-4 border-light btn-lg text-white m-1 md:m-3 px-3 py-1 h1 hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200"
                    @click="listenExternal('https://www.youtube.com/channel/UCMedW_Y4K0alzeVz1bSBvjA?sub_confirmation=1')"
                  >
                    Youtube
                  </button>
                </div>
                <div class="col-12 pt-3 px-1 px-md-3 text-white text-center">
                  <h5>Abonner toi, ça m'aide énormement !</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="copied">
        <div class="container-fluid">
          <div class="row bg-indiePurple pt-4">
            <div class="text-center text-white w-100">
              <h1 class="text-3xl font-indie">
                ✅C'est fait !
              </h1>
            </div>
            <div class="col-12 pt-2 text-white text-center">
              <p>Lien Copié, je sais pas trop ce que tu compte en faire mais enjoy, c'est tout❤️</p>
            </div>
            <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
              <button
                type="button"
                class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-1 text-white px-4 h1"
                @click="$modal.hide('copied')"
              >
                😎Cool
              </button>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="thanks_register">
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('thanks_register')">
              <span aria-hidden="true">&times;</span>
            </button>
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
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('thanks_ebook')">
              <span aria-hidden="true">&times;</span>
            </button>
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
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('already_register')">
              <span aria-hidden="true">&times;</span>
            </button>
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
      <modal height="auto" adaptive name="discord">
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('discord')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12">
              <h1 class="text-3xl font-indie pl-md-2 py-2 m-0 text-white text-center">
                Rejoint le Discord
              </h1>
              <p class="px-2 md:px-5 text-white">
                300 Makers là pour échanger et disponible pour répondre à tes questions !
              </p><br>
              <p class="px-2 md:px-5 text-white">
                Tu seras également informé de la sortie des épisodes !
              </p>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="email"
                    v-model="newEmail"
                    autofocus
                    type="email"
                    class="form-control p-2 text-indiePurple"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon@tesla.com"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="newName"
                    type="text"
                    class="form-control p-2 text-indiePurple"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon Musk"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light py-1 px-4 h1"
                  @click="joinDiscord()"
                >
                  Rejoindre
                </button>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="join">
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('join')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12">
              <h1 class="text-3xl font-indie pl-md-2 py-2 m-0 text-white text-center">
                Mes Emails Privés
              </h1>
              <p class="md:px-5 text-white">
                Reçoit ton email hebdomadaire avec mes conseils actionables pour lancer ton projet, et gagner ta liberté !
              </p>
              <p class="md:px-5 text-white">
                Tu seras également informé de la sortie des épisodes !
              </p>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="email"
                    v-model="newEmail"
                    autofocus
                    type="email"
                    class="form-control p-2 text-indiePurple"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon@tesla.com"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="newName"
                    type="text"
                    class="form-control p-2 text-indiePurple"
                    aria-describedby="TweetnameHelp"
                    placeholder="Elon Musk"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light py-1 px-4 h1"
                  @click="addEMailSub()"
                >
                  Recevoir mes conseils
                </button>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="ebook">
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('ebook')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12">
              <h1 class="text-3xl font-indie pl-2 py-2 m-0 text-white text-center">
                Le guide pour lancer ton projet !
              </h1>
              <p class="px-5 text-white">
                Reçoit ton guide en 6 étapes, il te fera éviter bien des erreurs et gagner un temps précieux !
              </p>
              <p class="px-5 text-white">
                Tu seras également informé de la sortie des épisodes !
              </p>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="email"
                    v-model="newEmail"
                    autofocus
                    type="email"
                    class="form-control p-2 text-indiePurple"
                    aria-describedby="Email"
                    placeholder="Elon@tesla.com"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                <div class="form-group mb-0">
                  <input
                    ref="name"
                    v-model="newName"
                    type="text"
                    class="form-control p-2 text-indiePurple"
                    aria-describedby="Ton nom"
                    placeholder="Elon Musk"
                  >
                </div>
              </div>
              <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                <button
                  type="button"
                  class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light py-1 px-4 h1"
                  @click="addEMailSub('ebook')"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="loading">
        <div class="container-fluid relative">
          <div class="row py-10">
            <div class="spinner" />
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive :click-to-close="isFalse" name="confirmName">
        <div class="container-fluid relative">
          <div class="row bg-indiePurple py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('confirmName')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 pt-2 text-white text-center">
              <h1 class="text-3xl font-indie">
                😨 Mais qui est tu ?
              </h1>
            </div>
          </div>
          <div class="row bg-indiePurple pt-4 h-100">
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
                  v-model="newName"
                  type="text"
                  class="form-control p-2 text-indiePurple"
                  aria-describedby="TweetnameHelp"
                  placeholder="Elon Musk"
                  @keyup.enter="addName()"
                >
              </div>
            </div>
            <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
              <button
                type="button"
                class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light py-1 px-4 h1"
                @click="addName()"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="error">
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('error')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    😨 Quelque chose n'as pas marché
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4 h-100">
                <div class="col-12 pt-2 pb-3 text-white text-center">
                  <p>Essais plus tard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="found">
        <div class="container-fluid relative">
          <div class="row">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('found')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    👏 Cet Épisode existe !
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white">
                  <ul class="text-center pt-2">
                    <li>Grace aux votes, ce·tte maker a accepter de venir dans le podcast !</li>
                    <li>Merci 😍</li>
                  </ul>
                </div>
                <div class="offset-md-3 col-md-6 py-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light py-2 px-4 h1"
                    @click="openEp()"
                  >
                    ❤️ Écouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="added">
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('added')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    🏄‍♂️ Ajout pris en compte
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4 h-100">
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
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 text-light py-2 px-4 h1"
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
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('fail-add')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    👀Je ne trouve pas ce·tte Maker
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4 h-100">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Je ne peut pas ajouter de Maker qui n'est pas sur Twitter pour le moment.</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
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
      <modal height="auto" adaptive name="fail-vote">
        <div class="container-fluid relative">
          <div class="row">
            <button
              type="button"
              class="absolute top-0 close text-white z-index-10 pl-2 text-3xl"
              aria-label="Close"
              @click="$modal.hide('fail-vote')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    😨 Hoho
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white text-center">
                  <p>tu as deja voté pour ce·tte Maker</p>
                  <p>Twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light px-4 py-1 h1"
                    @click="tweetItMaker()"
                  >
                    🦚 Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="fail-open-ep">
        <div class="container-fluid relative">
          <div class="row">
            <button
              type="button"
              class="absolute top-0 close text-white z-index-10 pl-2 text-3xl"
              aria-label="Close"
              @click="$modal.hide('fail-open-ep')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    😝 OUPS
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white">
                  <h5 class="text-center text-1xl">
                    Ce·tte maker a besoin de plus de force pour venir dans le podcast
                  </h5>
                  <ul class="text-center pt-2">
                    <li>Twitter pour motiver ce·tte Maker à venir!</li>
                    <li>Voici un message tout pret pour l'inviter 😎</li>
                  </ul>
                </div>
                <div class="offset-md-3 col-md-6 py-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 py-2 text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚 Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal adaptive height="auto" name="fail-exist">
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('fail-exist')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    😝 OUPS
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4 h-100">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Ce·tte maker est déjà présent dans la liste, J'ai ajouté ton vote pour lui/elle.</p>
                  <p>Twitte pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
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
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('fail-exist-vote')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    😝 OUPS
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4 h-100">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Ce·tte maker est déjà présent dans la liste, et tu as déjà voté pour lui/elle 😇.</p>
                  <p>Twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                </div>
                <div class="offset-md-3 col-md-6 pt-0 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
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
        <div class="container-fluid relative">
          <div class="row">
            <button
              type="button"
              class="absolute top-0 close text-white z-index-10 pl-2 text-3xl"
              aria-label="Close"
              @click="$modal.hide('add')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    👌 Ajouter un·e Maker
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white text-center">
                  <p>Le moyens le plus simple d'ajouter quelqu'un</p>
                  <p>C'est avec son nom Twitter</p>
                  <p>Cela permet de trouver sa photo et description d'un coup !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                  <div class="form-group mb-0">
                    <input
                      ref="maker"
                      v-model="newMaker"
                      type="text"
                      class="form-control p-2 text-indiePurple"
                      aria-describedby="TweetnameHelp"
                      placeholder="Elonmusk"
                      @keyup.enter="addMaker()"
                    >
                  </div>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light px-4 py-1 h1"
                    @click="addMaker()"
                  >
                    🎯 Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="voted">
        <div class="container-fluid relative">
          <div class="row">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('voted')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    💪 Vote pris en compte
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white text-center">
                  <p>N'hésite pas a twitter pour motiver ce·tte Maker à venir sur le podcast !</p>
                  <p class="font-weight-bold">
                    Voici un message tout pret pour l'inviter 😎
                  </p>
                  <p>Quand l'épisode sortira je t'enverrais un email pour te remercier et te partager l'épisode qui existe grâce a toi.💃</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light px-4 py-1 h1"
                    @click="tweetItMaker()"
                  >
                    🦚 Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <!-- <modal height="auto" adaptive name="voted">
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xlne" aria-label="Close" @click="$modal.hide('voted')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    💪Vote pris en compte
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4 h-100">
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
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
                    @click="tweetItMaker()"
                  >
                    🦚Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal> -->
      <modal height="auto" adaptive name="checkEmail">
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('checkEmail')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    ✅Check ta boite email
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Tu viens de recevoir ton lien de login par email, click dessus, c'est tout❤️</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
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
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('upgrade')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    Besoin de plus ?
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-4">
                <div class="col-12 pt-2 text-white text-center">
                  <p>Parfois pour se lancer, un podcast ne suffit pas</p>
                  <p>J'ai crée pour toi des outils pour passer a l'étape supérieure !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
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
      <modal height="auto" adaptive name="share_hunt">
        <div class="container-fluid relative">
          <div class="row py-5">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('rate')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    Partage le classement des makers
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white text-center">
                  <p>Voici un tweet tout prêt, pour partager la page et faire réagir tweeter</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiepurple hover:bg-gray-200 py-2 text-light px-4 h1"
                    @click="tweetItHunt()"
                  >
                    Tweeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="rate">
        <div class="container-fluid relative">
          <div class="row">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('rate')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    Soutiens le podcast
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white text-center">
                  <p>Note le 5 ⭐️, en cliquant ci dessous, ca permet au podcast d'être découvert par d'autres !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light px-4 py-1 h1"
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
        <div class="container-fluid relative">
          <div class="row">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('share')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    Tu aimes cet épisode ?
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white text-center">
                  <p>Envois du love a l'invité du podcast via twitter  !</p>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 pb-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 text-light px-4 py-1 h1"
                    @click="tweetIt()"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>
      <modal height="auto" adaptive name="register">
        <div class="container-fluid relative">
          <div class="row">
            <button type="button" class="absolute top-0 close text-white z-index-10 pl-2 text-3xl" aria-label="Close" @click="$modal.hide('register')">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="col-12 h-100">
              <div class="row bg-indiePurple py-2">
                <div class="col-12 pt-2 text-white text-center">
                  <h1 class="text-3xl font-indie">
                    🔐Pas tout de suite !
                  </h1>
                </div>
              </div>
              <div class="row bg-indiePurple pt-2">
                <div class="col-12 text-white">
                  <h5 class="text-center text-1xl">
                    j’ai besoin que tu valides ton email !
                  </h5>
                  <ul class="text-center pt-2">
                    <li>Pour éviter les faux votes</li>
                    <li>Te tenir au courant de la sortie de l'épisode</li>
                  </ul>
                </div>
                <div class="offset-md-3 col-md-6 pt-3 text-white text-center">
                  <div>
                    <label for="email" class="sr-only">Email</label>
                    <input
                      id="email"
                      ref="register"
                      v-model="newEmail"
                      autofocus
                      type="text"
                      name="email"
                      class="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-1/2"
                      placeholder="you@example.com"
                      @keyup.enter="sendLogin()"
                    >
                  </div>
                </div>
                <div class="offset-md-3 col-md-6 py-3 text-white text-center">
                  <button
                    type="button"
                    class="rounded-none border-4 border-light hover:border-gray-200 hover:text-indiePurple hover:bg-gray-200 py-2 text-light px-4 h1"
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
import { domain, ep } from '~/plugins/rss'

export default {
  name: 'Modals',
  data () {
    return {
      user: null,
      isFalse: false,
      newMaker: null,
      newName: null,
      newEmail: null
    }
  },
  mounted () {
    require('~/plugins/modal')
    this.$firebase.auth.listen((user) => {
      this.user = user
      if (user) {
        this.$sentry.setUser({ uid: user.uid })
      }
    })
  },
  methods: {
    rate () {
      this.$modal.hide('rate')
      window.open('https://ratethispodcast.com/imf', '_blank')
    },
    bmc () {
      window.open(`https://www.buymeacoffee.com/${this.$config.handler}`, '_blank')
    },
    copyTextToClipboard (text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text)
        return
      }
      navigator.clipboard.writeText(text).then(
        () => {
          // console.log("Async: Copying to clipboard was successful!");
          this.$modal.hide('listen')
          this.$modal.show('copied')
        },
        (err) => {
          console.error('Async: Could not copy text: ', err)
        }
      )
    },
    fallbackCopyTextToClipboard (text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed' // avoid scrolling to bottom
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        if (!document.execCommand('copy')) {
          console.error('unsuccessful')
        } else {
          this.$modal.hide('listen')
          this.$modal.show('copied')
        }
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      }
      document.body.removeChild(textArea)
    },
    async joinDiscord () {
      await this.addEMailSub('discord')
      window.open('https://discord.gg/2XyUn3A', '_blank')
    },
    addEMailSub (kind = 'email') {
      return this.$firebase
        .db
        .ref(`users/${this.newEmail}`)
        .set({
          kind,
          created_at: new Date(),
          first_name: this.newName,
          email: this.newEmail
        }).then(() => {
          window.localStorage.setItem('emailForNewletter', true)
          this.$modal.hide('join')
          if (kind === 'ebook') {
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
              .db
              .ref(`users/${this.user.email}`)
              .set({
                first_name: this.newName,
                email: this.user.email
              })
          } catch (err) {
            console.error('exist already', err)
          }
          this.$modal.hide('loading')
          const next = window.localStorage.getItem('nextAfterSign')
          if (next) {
            window.localStorage.removeItem('nextAfterSign')
          }
          this.$router.push(next || '/makers_hunt')
        })
        .catch(() => {
          this.$modal.hide('loading')
        })
    },
    listenExternal (url) {
      window.open(url, '_blank')
    },
    openEp () {
      const guid = window.localStorage.getItem('epFound')
      if (guid) {
        window.localStorage.removeItem('epFound')
      }
      this.$modal.hide('found')
      this.$router.push(`/episode/${guid}`)
    },
    openRegister () {
      this.$modal.show('register')
    },
    addMaker () {
      this.$modal.hide('add')
      this.$modal.show('loading')
      if (!this.user) {
        this.$modal.hide('loading')
        this.openRegister()
      } else {
        this.$firebase
          .func('addTwiterUser', { name: this.newMaker })
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
        this.$modal.hide('register')
        this.$modal.show('loading')
        const loginPage = `${window.location.protocol}//${window.location.host}/login`
        console.log('loginPage', loginPage)
        this.$firebase.emailSigning(this.newEmail, loginPage)
          .then(() => {
            window.localStorage.setItem('emailForSignIn', this.newEmail)
            window.localStorage.setItem('nextAfterSign', window.location.pathname)
            this.$modal.hide('loading')
            this.$modal.show('checkEmail')
          })
          .catch((error) => {
            this.$modal.hide('loading')
            console.error(error)
          })
      }
    },
    tweetItHunt () {
      const linkEp = 'https://indiemakers.fr/makers_hunt'
      const tweet = `Je viens de découvrir les Makers Français les plus chaud sur ${linkEp} @${this.$config.handler}`
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('share_hunt')
    },
    tweetItMaker () {
      const maker = window.localStorage.getItem('tweetMaker')
      if (maker) {
        window.localStorage.removeItem('tweetMaker')
      }
      const linkPage = `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}/makers_hunt`
      const tweet = `@${maker} j'ai voté sur ${linkPage}, j'aimerais te voir dans le podcast @${this.$config.handler} 🚀`
      const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}`
      window.open(tweetLink, '_blank')
      this.$modal.hide('added')
      this.$modal.hide('voted')
    },
    tweetIt () {
      const maker = window.localStorage.getItem('tweetMaker')
      const epGui = window.localStorage.getItem('epGui')
      if (maker) {
        window.localStorage.removeItem('tweetMaker')
      }
      if (epGui) {
        window.localStorage.removeItem('epGui')
      }
      const linkEp = `${domain(this.$config.VERCEL_URL, this.$config.DOMAIN)}/episode/${epGui}`
      const tweet = `@${this.$config.handler} et @${maker} merci pour le podcast ${linkEp} <3`
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
.spinner {
  display: block;
  margin: auto;
  height: 6em;
  width: 6em;
  border: 12px solid rgba(0, 174, 239, 0.2);
  border-top-color:#4b279b;
  border-radius: 50%;
  animation: rotation 0.6s infinite linear;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
.z-index-10 {
  z-index: 10;
}
.container-fluid {
  border-style:solid;
  border-width: 5px;
  border-color: white;
}
</style>
