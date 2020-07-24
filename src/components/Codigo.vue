<template lang="html">
  <div>
    <textarea @blur="cuandoCambia" :value="codigo" class="verdana pa2 w-100"></textarea>
  </div>
</template>

<script>
export default {
  computed: {
    codigo() {
      return this.$store.state.codigo;
    }
  },

  methods: {
    cuandoCambia(e) {
      this.$store.commit("cambiarCódigo", e.target.value);
    }
  }
}
</script>
