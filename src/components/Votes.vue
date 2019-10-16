<template>
  <div id="emissions">
    <div id="episodes">
      <h2 id="titreEpisodes">En construction</h2>
    </div>
    <illu2 />
  </div>
</template>

<script>
import illu2 from "./illu2.vue";

export default {
  components: {
    illu2
  }
};
</script>

<style>
#emissions {
  width: 47vw;
  height: 68vh;
  background-color: #df99d8;
  position: absolute;
  top: 20%;
  left: 5%;
  color: rgb(35, 35, 85);
  font-size: 2em;
  text-align: center;
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  transition: box-shadow 0.3s;
  z-index: 0;
  border-radius: 10px;
  display: flex;
  flex-flow: column nowrap;
}

#emissions:hover {
  box-shadow: 0 0 11px rgba(3, 53, 148, 0.2);
}

h2 {
  font-size: 39px;
  color: white;
  font-family: "Rex Bold", "Open Sans";
  margin: 10 auto 45px auto;
}
@media only screen and (max-width: 800px) {
  #emissions {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    margin: -90px -17px;
    background-color: #df99d8;
    box-shadow: none;
    height: fit-content;
    overflow-y: auto;
  }
  #episodes {
    width: 80%;
    margin: auto;
  }
  h2 {
    color: white;
  }
}
@media only screen and (max-width: 420px) {
  #episodes {
    margin: 50px auto;
    width: 100%;
  }
}
</style>
