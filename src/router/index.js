import Vue from 'vue'
import VueRouter from 'vue-router'
import Editor from '../views/Editor.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Editor',
    component: Editor
  },
  {
    path: '/AcercaDe',
    name: 'AcercaDe',
    // route level code-splitting
    // this generates a separate chunk (AcercaDe.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "AcercaDe" */ '../views/AcercaDe.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
