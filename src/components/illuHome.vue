<template>
  <div class="w-100 h-100">
    <img
      id="background"
      src="assets/decor.png"
      width="100%"
      class="img-fluid"
      alt="humaaans by Pablo Stanley"
    />
    <img
      id="man"
      src="assets/homme.png"
      width="100%"
      class="img-fluid"
      alt="humaaans by Pablo Stanley"
    />
    <img
      id="woman"
      src="assets/femme.png"
      width="100%"
      class="img-fluid"
      alt="humaaans by Pablo Stanley"
    />
    <i id="mic" class="pl-1 pl-md-3 fas fa-microphone fa-3x text-primary d-none d-md-block"></i>
    <i id="mic" class="pl-1 pl-md-3 fas fa-microphone fa-2x text-primary d-md-none"></i>
  </div>
</template>

<script>
export default {
  name: "IllustrationHome"
};
</script>

<style scoped>
#background {
  position: absolute;
  width: 80%;
  z-index: -9999;
}
#mic {
  position: absolute;
  width: 4em;
  top: 40%;
  left: 50%;
  animation: animationMic 5s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
}
#man {
  position: relative;
  width: 15em;
  top: 18em;
  left: 20%;
  animation: animationFrames ease 2s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  animation-fill-mode: forwards;
}

#woman {
  position: relative;
  width: 13em;
  top: 18em;
  left: 20%;
  animation: animationFemme ease-in-out 1s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  animation-fill-mode: forwards;
}

@keyframes animationFrames {
  0% {
    opacity: 0;
    transform: translate(-1500px, 0px);
  }
  60% {
    opacity: 1;
    transform: translate(30px, 0px);
  }
  80% {
    transform: translate(-10px, 0px);
  }
  100% {
    opacity: 1;
    transform: translate(0px, 0px);
  }
}

@keyframes animationFemme {
  0% {
    transform: translate(348px, 40px);
  }
  100% {
    transform: translate(65px, 32px);
  }
}

@keyframes animationMic {
  0% {
    opacity: 0;
    transform: translate(0px, -253px);
  }
  100% {
    opacity: 1;
    transform: translate(0px, 0px);
  }
}

@media (min-width: 420px) and (max-width: 800px) {
  #man {
    position: absolute;
    width: 27%;
    top: 25%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 25%;
    left: 40%;
  }
  #background {
    position: relative;
    top: 10%;
    left: 20%;
    width: 60%;
    height: auto;
  }
  #mic {
    position: absolute;
    width: 5%;
  }
}
@media (min-width: 800px) and (max-width: 1600px) {
  #man {
    position: absolute;
    width: 27%;
    top: 15%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 15%;
    left: 40%;
  }
  #background {
    position: relative;
    top: unset;
    left: unset;
    width: 100%;
    height: auto;
  }
  #mic {
    position: absolute;
    top: 15%;
    width: 5%;
  }
}

@media only screen and (max-width: 420px) {
  #man {
    position: absolute;
    width: 27%;
    top: 25%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 25%;
    left: 40%;
  }
  #background {
    position: relative;
    top: 10%;
    left: 20%;
    width: 60%;
    height: auto;
  }
  #mic {
    width: 5%;
  }
}
</style>
