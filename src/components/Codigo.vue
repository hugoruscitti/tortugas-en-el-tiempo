<template lang="html">
  <div class="ph2 flex-grow-1">

    <BotonesDeEstado :error="error" :modo="modo"
      @cuandoEjecuta="ejecutar"
      @cuandoDetiene="detener"
      @cuandoPulsaPausa="pausar"
    />

    <div class="flex">

      <textarea
        @blur="cuandoCambia"
        ref="textarea"
        spellcheck="false"
        :value="codigo"
        :class="{'o-50': desactivado}"
        class="verdana lh-copy ph2 w-100 w4 h5 flex-grow-1"></textarea>

      <PanelDeFunciones :enEjecucion="desactivado" @cuandoQuiereAgregarCodigo="agregar"/>

    </div>

  </div>

</template>

<script>
import instanciaDeJuego from "@/juego.js";
import agregarCodigoEnTextArea from "@/utilidades/agregar_codigo_en_textarea.js";
import BotonesDeEstado from "@/components/BotonesDeEstado.vue";
import PanelDeFunciones from "@/components/PanelDeFunciones.vue";

export default {

  components: {
    BotonesDeEstado,
    PanelDeFunciones
  },

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
    desactivado() {
      return this.$store.state.modo == "ejecución" || this.$store.state.modo == "pausa";
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

        var subirLapiz = function(cuandoTermina) {
          return instanciaDeJuego.subirLapiz(cuandoTermina);
        }

        var bajarLapiz = function(cuandoTermina) {
          return instanciaDeJuego.bajarLapiz(cuandoTermina);
        }

        _in.setProperty(contexto, 'avanzar', _in.createAsyncFunction(avanzar));
        _in.setProperty(contexto, 'girarDerecha', _in.createAsyncFunction(girarDerecha));
        _in.setProperty(contexto, 'subirLapiz', _in.createAsyncFunction(subirLapiz));
        _in.setProperty(contexto, 'bajarLapiz', _in.createAsyncFunction(bajarLapiz));

      }

      let interprete = new Interpreter(codigo, inicializar);

      return interprete;
    },

    detener() {
      this.juego.detener();
      this.limpiarTextoSeleccionado();
    },

    pausar() {
      this.juego.pausar();
      this.limpiarTextoSeleccionado();
    },

    resaltarLineaDeCódigoEjecutada(interprete) {
      // Obtener linea en ejecución
      var start = 0;
      var end = 0;

      // Obtiene el rango de código que se está ejecutando.
      if (interprete.stateStack.length) {
        var node = interprete.stateStack[interprete.stateStack.length - 1].node;

        // Solo intenta resaltar los llamados a funciones, todo lo demás
        // se omite.
        if (node.type !== "CallExpression") {
          return
        }

        start = node.start;
        end = node.end;
      }

      this.seleccionar(start, end);
    },

    limpiarTextoSeleccionado() {
      if (document.selection) {
        document.selection.empty();
      } else {
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
      }
    },

    seleccionar(start, end) {
      var textarea = this.$refs.textarea;

      if (textarea.createTextRange) {
        var selRange = textarea.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end);
        selRange.select();
      } else if (textarea.setSelectionRange) {
        textarea.setSelectionRange(start, end);
      } else if (textarea.selectionStart) {
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
      }

      textarea.focus();
    },

    /*
     * Añade código en el textarea.
     */
    agregar(codigo) {
      this.limpiarTextoSeleccionado();
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

      /*
       * Como el interprete ejecuta código asincrónico se tiene que llamar a run
       * periódicamente hasta que retorne `false`.
       */
      let ejecutarInterprete = () => {
        let enCurso = null;
        try {
          enCurso = interprete.run();
        } catch (e) {
          this.error = e.toString();
        }

        this.resaltarLineaDeCódigoEjecutada(interprete);

        if (enCurso) {

          if (this.$store.state.modo !== "ejecución") {
            this.limpiarTextoSeleccionado();
            this.$store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", "Esperando");
            return;
          }

          setTimeout(ejecutarInterprete, 1);

        } else {
          this.limpiarTextoSeleccionado();
          this.$store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", "Esperando");
        }
      }

      ejecutarInterprete();

    }
  }
}
</script>


<style media="screen">
</style>
