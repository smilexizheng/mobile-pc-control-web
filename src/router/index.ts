import { createRouter, createWebHistory } from 'vue-router'
import EventConfig from '../views/EventConfig/index.vue'
import Mouse from '../views/Mouse/index.vue'
import ScreenLive from '../views/ScreenLive/index.vue'
import MonitorWindow from '../views/MonitorWindow/index.vue'
import Transfer from '../views/Transfer/index.vue'
import Schedule from '../views/Schedule/index.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: '首页',
      // @ts-ignore
      component: () => import('../views/Home/index.vue')
    },
    {
      path: '/mouse',
      name: '远程控制',
      component: Mouse
    },
    {
      path: '/screen-live',
      name: '屏幕监视',
      component:ScreenLive
    },
    {
      path: '/event-config',
      name: '我的指令',
      component: EventConfig,
    },
    {
      path: '/monitor-window',
      name: '窗口监控',
      component: MonitorWindow,
    },
    {
      path: '/transfer',
      name: '文件共享',
      component: Transfer,
    },
    {
      path: '/schedule',
      name: '任务计划',
      component: Schedule,
    },
  ]
})

export default router
