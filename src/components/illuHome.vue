<template>
  <div class="w-100 h-100 illu">
    <img
      id="background-pages"
      src="assets/background.webp"
      onerror="this.onerror=null; this.src='assets/background.png'"
      width="100%"
      class="img-fluid"
      alt="background"
    />
    <img
      id="man"
      src="assets/man.webp"
      onerror="this.onerror=null; this.src='assets/man.png'"
      width="100%"
      class="img-fluid"
      alt="man"
    />
    <img
      id="woman"
      src="assets/woman.webp"
      onerror="this.onerror=null; this.src='assets/woman.png'"
      width="100%"
      class="img-fluid"
      alt="woman"
    />
    <i id="mic" class="pl-1 pl-md-3 fas fa-microphone fa-3x text-primary"></i>
  </div>
</template>

<script>
export default {
  name: "IllustrationHome"
};
</script>

<style scoped>
.illu {
  max-height: 500px;
}

#mic {
  position: absolute;
  width: 4em;
  top: 50%;
  left: 45%;
  animation: animationMic 5s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
}
#man {
  position: relative;
  width: 15em;
  top: -24em;
  left: 20%;
  animation: animationFrames ease 2s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  animation-fill-mode: forwards;
}

#woman {
  position: relative;
  width: 13em;
  top: -24em;
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
@media only screen and (max-width: 420px) {
  #man {
    position: absolute;
    width: 27%;
    top: 55%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 55%;
    left: 40%;
  }

  #mic {
    /* width: 5%; */
    left: 30%;
  }
}
@media (min-width: 420px) and (max-width: 800px) {
  #man {
    position: absolute;
    width: 27%;
    top: 50%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 50%;
    left: 40%;
  }

  #mic {
    position: absolute;
    top: 50%;
    left: 30%;
    /* width: 5%; */
  }
}
@media (min-width: 800px) and (max-width: 1200px) {
  #man {
    position: absolute;
    width: 27%;
    top: 10%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 10%;
    left: 40%;
  }

  #mic {
    position: absolute;
    top: 10%;
    /* width: 5%;   */
    left: 30%;
  }
}
@media (min-width: 1200px) and (max-width: 1600px) {
  #man {
    position: absolute;
    width: 27%;
    top: 35%;
    left: 26%;
  }
  #woman {
    position: absolute;
    width: 23%;
    top: 35%;
    left: 50%;
  }

  #mic {
    position: absolute;
    top: 35%;
    left: 40%;
    /* width: 5%; */
  }
}
</style>
