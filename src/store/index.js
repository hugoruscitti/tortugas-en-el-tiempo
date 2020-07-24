import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contador: 0,
    codigo: `
    avanzar(10)
    girarDerecha(10)
    `
  },
  mutations: {
    incrementar(estado) {
      estado.contador += 1;
    },
    cambiarCódigo(estado, código) {
      estado.codigo = código;
    }
  },
  actions: {},
  modules: {}
})