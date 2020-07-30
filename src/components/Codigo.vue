<template lang="html">
  <div class="ph2 flex-grow-1">

    <BotonesDeEstado :error="error" :modo="modo"
      @cuandoEjecuta="ejecutar"
      @cuandoDetiene="detener"
      @cuandoPulsaPausa="pausar"
    />

    <div class="flex" :class="{'o-50': desactivado}">

      <!-- contenedor para el editor Monaco -->
      <div class="h5 w5 ba b-gray flex-grow-1 bg-white" ref="contenedor"></div>

      <PanelDeFunciones :enEjecucion="desactivado" @cuandoQuiereAgregarCodigo="agregar"/>

    </div>

  </div>

</template>

<script>
import instanciaDeJuego from "@/juego.js";
import BotonesDeEstado from "@/components/BotonesDeEstado.vue";
import PanelDeFunciones from "@/components/PanelDeFunciones.vue";


import * as monaco from 'monaco-editor';


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

    this.decorations = [];
    this.configurarAutocompletado();

    this.editor = monaco.editor.create(this.$refs.contenedor, {
      value: this.codigo,
      language: 'typescript',
      autoIndent: true,
      formatOnPaste: true,
      formatOnType: true,
      scrollBeyondLastLine: true,
      contextmenu: false,
      minimap: { enabled: false },
      fontSize: 16,
      automaticLayout: true,
      hover: { enabled: false },
    });

    window.onresize = () => {
      this.editor.layout();
    };

    this.editor.onDidBlurEditorText(() => {
      this.cuandoCambia(this.editor.getModel().getValue());
    });

    window.editor = this.editor;

    //this.seleccionar(1);
    this.seleccionar(2);

    this.ajustarTamañoDelEditor();
  },

  beforeDestroy() {
    this.editor.getModel().dispose();
    this.editor.dispose();
    this.editor = null;
    clearTimeout(this.timeoutParaAjustarTamaño);
  },

  watch: {
    desactivado: function(_, nuevo) {
      this.editor.updateOptions({ readOnly: !nuevo });
    },
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
    cuandoCambia(texto) {
      this.$store.commit("CAMBIAR_CÓDIGO", texto);
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

    ajustarTamañoDelEditor() {
      this.editor.layout();

      this.timeoutParaAjustarTamaño = setTimeout(() => {
        this.ajustarTamañoDelEditor();
      }, 500);
    },

    pausar() {
      this.juego.pausar();
      this.limpiarTextoSeleccionado();
    },

    /**
     * Activa el autocompletado de las palabras reservadas de TypeScript
     * y las funciones de dibujado de la tortuga. Todas las otras API
     * del DOM, fechas o Math se desactivan por completo.
     */
    configurarAutocompletado() {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        noLib: true,
        allowNonTsExtensions: true
      });

      let data = `
        /** Se mueve hacia adelante los pasos indicados */
        declare function avanzar(pasos: number);

        /** Gira tantos grados como se indique en el argumento */
        declare function girarDerecha(grados: number);

        /** Desactiva el dibujado de lineas mientras avanza */
        declare function subirLapiz();

        /** Activa el dibujado de lineas mientras avanza */
        declare function subirLapiz();
      `;

      monaco.languages.typescript.typescriptDefaults.addExtraLib(data, 'funciones.d.ts');
    },

    resaltarLineaDeCódigoEjecutada(interprete) {
      // Obtener linea en ejecución
      var start = -1;

      // Obtiene el rango de código que se está ejecutando.
      if (interprete.stateStack.length) {
        var node = interprete.stateStack[interprete.stateStack.length - 1].node;

        // Solo intenta resaltar los llamados a funciones, todo lo demás
        // se omite.
        if (node.type !== "CallExpression") {
          return
        }

        start = node.start;
      }

      if (start !== -1) {
        this.seleccionar(this.obtenerLineaDesdePosicion(start));
      }
    },

    obtenerLineaDesdePosicion(start) {
      return this.codigo.slice(0, start).split("\n").length;
    },

    limpiarTextoSeleccionado() {
      /*
      let rango = new monaco.Range(1, 1, 1, 1);
      this.decorations = [];

      this.editor.deltaDecorations(this.decorations, [{
        range: rango,
        options: {}
      }]);
      */
    },

    seleccionar(linea) {
      let rango = new monaco.Range(1, 1, 1, 1);
      this.editor.deltaDecorations(this.decorations, [{
        range: rango,
        options: {}
      }]);

      let listado = [{
        range: new monaco.Range(linea, 1, linea, 1),
        options: {
          isWholeLine: true,
          className: "linea"
        }
      }];

      this.decorations = this.editor.deltaDecorations(this.decorations, listado);
    },

    /*
     * Añade código en el textarea.
     */
    agregar(codigo) {
      //this.limpiarTextoSeleccionado();

      var selection = this.editor.getSelection();
      var range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
      var id = { major: 1, minor: 1 };
      var text = codigo;
      var op = { identifier: id, range: range, text: text, forceMoveMarkers: true };
      this.editor.executeEdits("my-source", [op]);
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
