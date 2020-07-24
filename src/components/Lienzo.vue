<template lang="html">
  <div class="flex">
    <canvas class="ba b--gray" width="300" height="300" ref="canvas"></canvas>

    <div class="ml2 bg-light-gray pa3 flex-grow-1">
      <div class="verdana">
        <button @click="dibujar">Dibujar</button>
      </div>

      <div class="verdana pt3">
        X: <input min="0" max="300" type="range" v-model="x">
        Y: <input min="0" max="300" type="range" v-model="y">
      </div>

      <div class="verdana pt3">
        Contador {{contador}}


        <button @click="incrementar">++</button>
      </div>
    </div>

  </div>

</template>

<script>
import imagenes from "@/imagen_de_tortuga.js"


export default {
  data() {
    return {
      canvas: null,
      tortuga: null,
      x: 150,
      y: 150
    }
  },

  async mounted() {
    this.canvas = this.$refs.canvas;
    await this.crearTortuga();
    this.dibujar();
  },


  computed: {
    contexto() {
      return this.canvas.getContext("2d");
    },

    contador() {
      return this.$store.state.contador;
    }
  },

  methods: {
    dibujar() {
      this.limpiar();

      //this.contexto.rect(10, 10, 20, 20);
      //this.contexto.fill();
      this.contexto.drawImage(this.tortuga, this.x - 16, this.y - 16);
    },

    limpiar() {
      this.contexto.clearRect(0, 0, 300, 300);
    },

    async crearTortuga() {
      return new Promise((resolve) => {
        this.tortuga = new Image();
        this.tortuga.src = imagenes.IMAGEN_DE_TORTUGA;
        this.tortuga.onload = resolve
      })
    },

    incrementar() {
      this.$store.commit("incrementar");
    }
  },

}
</script>
