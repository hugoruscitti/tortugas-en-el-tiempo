<template lang="html">
  <div class="">
    <canvas class="ba b--gray" width="300" height="300"></canvas>

    <div class="pv3 verdana">
      <button @click="dibujar">Dibujar</button>
    </div>

    <div class="verdana">
      X: <input min="0" max="300" type="range" v-model="x">
      Y: <input min="0" max="300" type="range" v-model="y">
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
    this.canvas = this.$el.querySelector("canvas");
    await this.crearTortuga();
    this.dibujar();
  },


  computed: {
    contexto() {
      return this.canvas.getContext("2d");
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
  },

}
</script>
