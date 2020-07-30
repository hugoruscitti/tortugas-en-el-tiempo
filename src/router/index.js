import Vue from 'vue'
import VueRouter from 'vue-router'
import Editor from '../views/Editor.vue'
import AcercaDe from "../views/AcercaDe.vue";

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Editor',
    component: Editor
  },
  {
    path: '/AcercaDe',
    name: 'AcercaDe',
    component: AcercaDe
  }
]

const router = new VueRouter({
  routes
})

export default router