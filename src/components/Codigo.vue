<template lang="html">
  <div class="bg-light-gray ph2 flex-grow-1">

    <div class="">
      <div class="verdana mb2 flex items-center">

        <div v-if="modo == 'ejecución'">
          <button @click="detener">Detener</button>
        </div>

        <div v-if="modo == 'edición'">
          <button @click="ejecutar">Ejecutar</button>
        </div>

        <div v-if="modo == 'pausa'">

        </div>

        <span v-if="error" class="pl2 red">{{error}}</span>

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

          <div @click="agregar('avanzar(10)')" class="truncate pointer pa2 hover-bg-black-10">Avanzar</div>
          <div @click="agregar('girarDerecha(90)')" class="truncate pointer pa2 hover-bg-black-10">Girar Hacia La Derecha</div>
        </div>

      </div>


  </div>
</template>

<script>
import instanciaDeJuego from "@/juego.js";
import agregarCodigoEnTextArea from "@/utilidades/agregar_codigo_en_textarea.js";


export default {

  data() {
    return {
      error: "" // indica si hay un error de sintaxis en el código.
    }
  },

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

    crearInterprete(codigo) {

      function inicializar(_in, contexto) {

        var avanzar = function(cantidad, cuandoTermina) {
          return instanciaDeJuego.avanzar(cantidad, cuandoTermina);
        };

        var girarDerecha = function(grados, cuandoTermina) {
          return instanciaDeJuego.girarDerecha(grados, cuandoTermina);
        }

        _in.setProperty(contexto, 'avanzar', _in.createAsyncFunction(avanzar));
        _in.setProperty(contexto, 'girarDerecha', _in.createAsyncFunction(girarDerecha));
      }

      let interprete = new Interpreter(codigo, inicializar);

      return interprete;
    },

    detener() {
      this.juego.detener();
    },

    /*
     * Añade código en el textarea.
     */
    agregar(codigo) {
      agregarCodigoEnTextArea(this.$refs.textarea, codigo)
    },

    ejecutar() {
      this.error = "";
      this.juego.ejecutar();

      const codigo = this.$store.state.codigo;
      let interprete = null;

      try {
        interprete = this.crearInterprete(codigo);
      } catch (e) {
        if (e.toString().includes("SyntaxError")) {
          let linea = e.toString().match(/(\d+):\w+/)[1];
          this.error = "Hay un error en la linea " + linea;
          return;
        } else {
          this.error = e.toString();
          return
        }
      }


      let store = this.$store;
      /*
       * Como el interprete ejecuta código asincrónico se tiene que llamar a run
       * periódicamente hasta que retorne `false`.
       */
      function ejecutarInterprete() {
        if (interprete.run()) {
          setTimeout(ejecutarInterprete, 1);
        } else {
          store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", "Esperando");
        }
      }

      ejecutarInterprete();

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
