<template lang="html">
  <div>
    <canvas class="ba b--gray bg-white" width="300" height="300" ref="canvas"></canvas>

    <div class="">
      <div class="verdana">
        La tortuga está: {{$store.state.accionDeLaTortuga}}
      </div>
    </div>
  </div>
</template>

<script>
import instanciaDeJuego from "@/juego.js";

export default {

  async mounted() {
    this.juego = instanciaDeJuego;
    await this.juego.iniciar(this.$refs.canvas, this.$store);
  },

  computed: {},

  methods: {},

}
</script>
