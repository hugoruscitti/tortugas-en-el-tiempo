<template lang="html">
  <div class="ph2 flex-grow-1">

    <BotonesDeEstado :error="error" :modo="modo"
      @cuandoEjecuta="ejecutar"
      @cuandoDetiene="detener"
      @cuandoPulsaPausa="pausar"
    />

    <div class="flex" :class="{'o-50': desactivado}">

      <!-- contenedor para el editor Monaco -->
      <div
        class="h5 w5 ba b--gray flex-grow-1 bg-white"
        @dragover="cuandoIntentaSoltar($event)"
        ref="contenedor"></div>

      <PanelDeFunciones :enEjecucion="desactivado" @cuandoQuiereAgregarCodigo="agregarCodigo"/>

    </div>

  </div>

</template>

<script>
import instanciaDeJuego from "@/juego.js";
import BotonesDeEstado from "@/components/BotonesDeEstado.vue";
import PanelDeFunciones from "@/components/PanelDeFunciones.vue";
import * as monaco from 'monaco-editor';
import crearIntérprete from "@/crear-interprete.js";


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

    this.editor._domElement.addEventListener("dragover", (evento) => {
      evento.preventDefault();
      evento.stopPropagation();
    });

    this.editor._domElement.addEventListener("drop", (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      let código = evento.dataTransfer.getData("text/plain");
      let posición = this.editor.getTargetAtClientPoint(evento.clientX, evento.clientY).position;

      this.agregarCodigo(código, posición);
    });

    window.editor = this.editor;

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
    ultimaLineaEjecutada: function(numeroDeLinea) {
      if (numeroDeLinea !== 0) {
        this.seleccionar(numeroDeLinea);
      } else {
        this.limpiarTextoSeleccionado();
      }
    }
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
    },
    ultimaLineaEjecutada() {
      return this.$store.state.ultimaLineaEjecutada;
    }
  },

  methods: {
    cuandoCambia(texto) {
      this.$store.commit("CAMBIAR_CÓDIGO", texto);
    },

    cuandoIntentaSoltar(evento) {
      if (evento.target.className === "view-line") {
        evento.target.classList.add("resaltar-linea");

        evento.target.parentElement.addEventListener("dragleave", () => {
          evento.target.classList.remove("resaltar-linea");
        });
      }
    },

    crearInterprete(codigo) {
      return crearIntérprete(codigo, this.juego);
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

        /** Gira hacia la derecha tantos grados como se indique en el argumento */
        declare function girarDerecha(grados: number);

        /** Gira hacia la izquierda tantos grados como se indique en el argumento */
        declare function girarIzquierda(grados: number);

        /** Desactiva el dibujado de lineas mientras avanza */
        declare function subirLapiz();

        /** Activa el dibujado de lineas mientras avanza */
        declare function bajarLapiz();
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
        let numeroDeLinea = this.obtenerLineaDesdePosicion(start);
        this.seleccionar(numeroDeLinea);
        this.$store.commit("SELECCIONAR_LINEA", numeroDeLinea);
      }
    },

    obtenerLineaDesdePosicion(start) {
      return this.codigo.slice(0, start).split("\n").length;
    },

    limpiarTextoSeleccionado() {
      let rango = new monaco.Range(1, 1, 1, 1);

      this.editor.deltaDecorations(this.decorations, [{
        range: rango,
        options: {}
      }]);
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

    /**
     * Añade código en editor cuando se pulsa en un función del panel derecho.
     */
    agregarCodigo(codigo, posición) {
      posición = posición || this.editor.getPosition();

      var selection = this.editor.getSelection();

      var texto_completo = this.editor.getModel().getValue();
      var lista = texto_completo.split('\n');

      if (lista.length === 1 && lista[0] === "") {
        lista = [];
      }

      lista = lista.
      slice(0, selection.startLineNumber).
      concat([codigo]).
      concat(lista.slice(selection.startLineNumber, lista.length))

      this.editor.getModel().setValue(lista.join("\n"));

      posición.column = 1;
      posición.lineNumber += 1;
      this.editor.setPosition(posición);
      this.editor.focus();
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
