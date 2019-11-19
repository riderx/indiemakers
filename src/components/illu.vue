<template>
  <div class="w-100">
    <img id="background" src="assets/Home@2x.png" width="100%" class="img-fluid" alt="humans" />
    <img id="man" src="assets/sitting-2@2x.png" width="100%" class="img-fluid" alt="humans" />
    <img id="woman" src="assets/standing-6.png" width="100%" class="img-fluid" alt="humans" />
    <i id="mic" class="pl-0 pl-md-3 fas fa-microphone fa-3x text-primary"></i>
  </div>
</template>

<script>
export default {
  name: "illu"
};
</script>

<style scoped>
#background {
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

#man {
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

#woman {
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
