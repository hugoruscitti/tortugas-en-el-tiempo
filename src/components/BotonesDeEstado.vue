<template lang="html">
  <div class="verdana mb2 flex items-center">

    <div class="flex" v-if="modo == 'ejecución'">
      <button class="boton flex" @click="$emit('cuandoDetiene')">
        <Icono nombre="detener"/>
        <div class="pl2">Detener</div>
      </button>

      <button class="ml2 boton flex" @click="$emit('cuandoPulsaPausa')">
        <Icono nombre="pausa"/>
        <div class="pl2">Pausar e inspeccionar</div>
      </button>
    </div>

    <div class="flex" v-if="modo == 'edición'">
      <button class="boton flex" @click="$emit('cuandoEjecuta')">
        <Icono nombre="ejecutar"/>
        <div class="pl2">Ejecutar</div>
      </button>
    </div>

    <div class="flex" v-if="modo == 'pausa'">
      <button class="boton flex" @click="$emit('cuandoDetiene')">
        <Icono nombre="detener"/>
        <div class="pl2">Detener</div>
      </button>

      <Deslizador/>

    </div>

    <span v-if="error" class="pl2 red">{{error}}</span>

  </div>
</template>

<script>
import Icono from "@/components/Icono.vue";
import Deslizador from "@/components/Deslizador.vue";

export default {
  props: {
    error: { type: String },
    modo: { type: String }
  },
  components: {
    Icono,
    Deslizador
  }
}
</script>

<style lang="css" scoped>
.boton {
  padding: 0.5em;
  font-size: 17px;
  line-height: 1.313rem;
  letter-spacing: 0;
  vertical-align: top;
  background-color: #e5e9e8;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #134f7f;
  background-color: #288edf;
  box-shadow: inset 0 1px rgba(255,255,255,0.36);
  color: #fff;
  font-weight: 500;
  text-shadow: 0 -1px rgba(0,0,0,0.36);
}

.boton:hover {
  background-color: #4ca1e4;
}
</style>
