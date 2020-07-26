<template lang="html">
  <div class="pt2">
    <textarea
      @blur="cuandoCambia"
      :value="codigo"
      class="verdana pa2 w-100 w4 h5"></textarea>
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


<style media="screen">
</style>
