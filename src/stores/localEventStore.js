import {defineStore} from 'pinia'
import { useStorage } from '@vueuse/core'


export const LocalEventStore = defineStore('LocalEventStore', () => {


    const customEvents = useStorage('custom-events', [])





    return {customEvents}
})