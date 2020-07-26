<template lang="html">
  <div class="flex">
    <canvas class="ba b--gray" width="300" height="300" ref="canvas"></canvas>

    <div class="ml2 bg-light-gray pa2 flex-grow-1">
      <div class="verdana">

        <div v-if="modo == 'ejecución'">
          <button @click="detener">Detener</button>
        </div>

        <div v-if="modo == 'edición'">
          <button @click="ejecutar">Ejecutar</button>
        </div>

        <div v-if="modo == 'pausa'">

        </div>

      </div>

    </div>

  </div>

</template>

<script>
import Juego from "@/juego.js";

export default {

  data() {
    return {
      modo: "ejecución", // "ejecución", "edición" y "pausa"
    }
  },

  async mounted() {
    this.juego = new Juego();
    await this.juego.iniciar(this.$refs.canvas);

    let i = 0;
    while (i < 10) {
      this.juego.rotar(30);
      this.juego.avanzar(10);
      i++;
    }

    //this.juego.rotar(180);
    //this.juego.avanzar(1);

    this.juego.ejecutar();
  },

  computed: {},

  methods: {

    detener() {
      this.juego.detener();
      this.modo = "edición";
    },

    ejecutar() {
      this.juego.ejecutar();
      this.modo = "ejecución";
    }
  },

}
</script>
