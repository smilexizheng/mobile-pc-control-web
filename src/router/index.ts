import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/index.vue')
    },
    {
      path: '/mouse',
      name: 'mouse',
      component: () => import('../views/Mouse/index.vue')
    },
  ]
})

export default router
