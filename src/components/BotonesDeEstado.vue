<template lang="html">
  <div class="verdana mb2 flex items-center">

    <div v-if="modo == 'ejecución'">
      <button @click="$emit('cuandoDetiene')">Detener</button>
    </div>

    <div v-if="modo == 'edición'">
      <button @click="$emit('cuandoEjecuta')">Ejecutar</button>
    </div>

    <div v-if="modo == 'pausa'">
      
    </div>

    <span v-if="error" class="pl2 red">{{error}}</span>

  </div>
</template>

<script>
export default {
  props: {
    error: { type: String },
    modo: { type: String }
  }
}
</script>

<style lang="css" scoped>
</style>
