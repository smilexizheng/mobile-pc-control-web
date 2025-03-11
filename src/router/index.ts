import { createRouter, createWebHistory } from 'vue-router'
import EventConfig from '../views/EventConfig/index.vue'
import Mouse from '../views/Mouse/index.vue'
import ScreenLive from '../views/ScreenLive/index.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // @ts-ignore
      component: () => import('../views/Home/index.vue')
    },
    {
      path: '/mouse',
      name: 'mouse',
      component: Mouse
    },

    {
      path: '/screen-live',
      name: 'screen-live',
      component:ScreenLive
    },

    {
      path: '/event-config',
      name: 'event-config',
      component: EventConfig,
    },
  ]
})

export default router
