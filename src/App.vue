<template>
<div class="fondo-gris vh-100">
  <div class="pa2 verdana">
    <router-link class="link" to="/">Editor</router-link> |
    <router-link class="link" to="/AcercaDe">Acerca de...</router-link>
  </div>
  <div class="pa2">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</div>
</template>

<style media="screen">
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  position: absolute;
}
</style>
