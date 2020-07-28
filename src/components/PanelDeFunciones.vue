<template lang="html">
  <div class="ml2 verdana truncate w5 no-user-select" :class=" {'o-50 no-pointer-events': enEjecucion}">
    <div class="i gray ph2 pb2">
      Funciones disponibles
    </div>

    <div
      v-for="f in funciones" :key="f.codigo"
      class="truncate pointer pa2 hover-bg-black-10"
      @click="agregar(f.codigo)">{{f.titulo}}</div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      funciones: [
        { titulo: "Avanzar", codigo: "avanzar(10)" },
        { titulo: "Girar Hacia La Derecha", codigo: "girarDerecha(45)" },
        { titulo: "Subir el lapiz", codigo: "subirLapiz()" },
        { titulo: "Bajar el lapiz", codigo: "bajarLapiz()" },
      ]
    }
  },
  props: {
    enEjecucion: { type: Boolean }
  },
  methods: {
    agregar(codigo) {
      this.$emit("cuandoQuiereAgregarCodigo", codigo);
    }
  }
}
</script>

<style lang="css" scoped>
</style>
