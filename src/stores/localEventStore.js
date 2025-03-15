import {defineStore} from 'pinia'
import { useStorage } from '@vueuse/core'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";


export const LocalEventStore = defineStore('LocalEventStore', () => {


    const customEvents = useStorage('custom-events', [])

    const defaultEvent = () => {
        return {
            name: '控制键鼠', color: '#3069e5', events: [
                {
                    event: CE.SYS_POINTER_MOVE,
                    eventData: {x: 0, y: 0},
                    delay: 0
                }
            ]
        }
    }



    return {customEvents,defaultEvent}
})