import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import Message from '@/components/Message/useMessage'

const app = createApp(App).use(router).use(createPinia());
app.config.globalProperties.$message = Message;


app.mount('#app')
