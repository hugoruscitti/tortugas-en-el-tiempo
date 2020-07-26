<template lang="html">
  <div class="bg-light-gray ph2 flex-grow-1">

    <div class="">
      <div class="verdana mb2">

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


<div class="flex">
      <textarea
        @blur="cuandoCambia"
        ref="textarea"
        :value="codigo"
        :class="{'o-50': enEjecucion}"
        class="verdana lh-copy ph2 w-100 w4 h5 flex-grow-1"></textarea>

        <div
          class="ml2 verdana truncate w5 no-user-select"
          :class=" {'o-50 no-pointer-events': enEjecucion}"
        >
          <div class="i gray ph2 pb2">
            Funciones disponibles
          </div>

          <div @click="agregar('avanzar(10);')" class="truncate pointer pa2 hover-bg-black-10">Avanzar</div>
          <div @click="agregar('girarDerecha(90);')" class="truncate pointer pa2 hover-bg-black-10">Girar Hacia La Derecha</div>
        </div>

</div>


  </div>
</template>

<script>
import instanciaDeJuego from "@/juego.js";

export default {

  mounted() {
    this.juego = instanciaDeJuego;
  },

  computed: {
    codigo() {
      return this.$store.state.codigo;
    },
    modo() {
      return this.$store.state.modo;
    },
    enEjecucion() {
      return this.$store.state.modo == "ejecución";
    }
  },

  methods: {
    cuandoCambia(e) {
      this.$store.commit("CAMBIAR_CÓDIGO", e.target.value);
    },

    detener() {
      this.juego.detener();
    },

    agregar(codigo) {
      const el = this.$refs.textarea;
      const start = el.selectionStart
      const end = el.selectionEnd
      const text = el.value
      const before = text.substring(0, start)
      const after = text.substring(end, text.length)
      el.value = (before + codigo + '\n' + after)
      el.selectionStart = el.selectionEnd = start + codigo.length + 1;
      el.focus()
    },

    ejecutar() {



      this.juego.ejecutar();

      let i = 0;

      this.juego.avanzar(10);

      while (i < 10) {
        this.juego.rotar(30);
        this.juego.avanzar(10);
        i++;
      }


    }
  }
}
</script>


<style media="screen">
.no-user-select {
  user-select: none;
}

.no-pointer-events {
  pointer-events: none;
}
</style>
