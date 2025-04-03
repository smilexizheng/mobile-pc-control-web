import {defineStore} from 'pinia'
import { useStorage } from '@vueuse/core'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";


export const LocalEventStore = defineStore('LocalEventStore', () => {


    const customEvents = useStorage('custom-events', [])

    const defaultEvent = () => {
        return {
            name: '控制键鼠', color: '#3069e5', events: []
        }
    }

    const defaultSchedule = () => {
        return {
            name: '计划任务', color: '#3069e5', cron: '',events: [],runOnCreate:true,runOnStart:false
        }
    }



    return {customEvents,defaultEvent,defaultSchedule}
})