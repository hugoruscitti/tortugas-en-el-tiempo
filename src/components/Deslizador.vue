<template lang="html">
  <div class="flex items-center">
    <input v-bind:min="0" v-bind:max="pasos-1"
      :value="pasos" step="1" @input="cuandoCambia" class="w5 ml2" type="range" name="">
  </div>
</template>

<script>
import instanciaDeJuego from "@/juego.js";

export default {

  mounted() {
    this.juego = instanciaDeJuego;
    this.cantidadDePasosEnHistoria = this.juego.historia.obtenerCantidadDePasos();
    this.pasos = this.cantidadDePasosEnHistoria;
  },

  data() {
    return {
      pasos: 4
    }
  },

  methods: {
    cuandoCambia(e) {
      this.juego.redibujarPasoDesdeHistoria(e.target.value);
    }
  }
}
</script>

<style lang="css" scoped>
</style>
