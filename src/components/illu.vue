<template>
  <div class="w-100">
    <img
      id="background-home"
      src="assets/background-home.webp"
      onerror="this.onerror=null; this.src='assets/background-home.png'"
      width="100%"
      class="img-fluid"
      alt="background home"
    />
    <img
      id="woman-sit"
      src="assets/woman-sit.webp"
      onerror="this.onerror=null; this.src='assets/woman-sit.png'"
      width="100%"
      class="img-fluid"
      alt="woman sit"
    />
    <img
      id="woman-stand"
      src="assets/woman-stand.webp"
      onerror="this.onerror=null; this.src='assets/woman-stand.png'"
      width="100%"
      class="img-fluid"
      alt="woman stand"
    />
    <img id="mic" src="assets/mic.svg" width="100%" class="img-fluid" alt="mic" />
  </div>
</template>

<script>
export default {
  name: "illu"
};
</script>

<style scoped>
#background-home {
  position: fixed;
  width: 33%;
  top: 21%;
  left: 59%;
  z-index: -30;
}

#mic {
  position: fixed;
  width: 3%;
  top: 65%;
  left: 74%;
  animation: animationMic 5s;
  animation-iteration-count: 1;
  z-index: 30 !important;
}

#woman-sit {
  position: fixed;
  width: 13%;
  top: 55%;
  left: 72%;
  animation: animationFemme ease-in-out 1s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  animation-fill-mode: forwards;
  z-index: 30 !important;
}

#woman-stand {
  position: fixed;
  width: 12%;
  top: 56%;
  left: 63%;
  animation: animationFrames ease 2s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  animation-fill-mode: forwards;
  z-index: 30 !important;
}

@keyframes animationFemme {
  0% {
    transform: translate(348px, 40px);
  }
  100% {
    transform: translate(65px, 32px);
  }
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
</style>
