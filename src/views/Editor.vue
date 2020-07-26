<template>
<div class="flex">
  <lienzo></lienzo>
  <codigo></codigo>
</div>
</template>

<script>
import Lienzo from "@/components/Lienzo.vue";
import Codigo from "@/components/Codigo.vue";

export default {
  name: 'Editor',
  components: {
    Lienzo,
    Codigo
  }
}
</script>
