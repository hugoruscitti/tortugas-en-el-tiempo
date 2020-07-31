import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    contador: 0,
    ultimaLineaEjecutada: 0,
    codigo: ['avanzar(40)', 'girarDerecha(50)', 'avanzar(40)'].join("\n"),
    modo: "edición", // "ejecución", "edición" y "pausa"
    accionDeLaTortuga: "esperando",
  },

  mutations: {

    CAMBIAR_CÓDIGO(estado, código) {
      estado.codigo = código;
    },

    SELECCIONAR_LINEA(estado, numeroDeLinea) {
      estado.ultimaLineaEjecutada = numeroDeLinea;
    },

    DEFINIR_ACCION_DE_LA_TORTUGA(estado, accion) {
      estado.accionDeLaTortuga = accion.toLowerCase();
    },

    DETENER(estado) {
      estado.modo = "edición";
      estado.accionDeLaTortuga = "esperando";
    },

    EJECUTAR(estado) {
      estado.modo = "ejecución";
    },

    PAUSAR(estado) {
      estado.modo = "pausa";
      estado.accionDeLaTortuga = "esperando";
    },

  },

  actions: {},
  modules: {}
})