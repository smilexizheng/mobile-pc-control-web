import {defineStore} from 'pinia'
import {io} from 'socket.io-client'
import {ref} from "vue";
import {CLIENT_ON_EVENTS as CO} from "@/constant/client-on.js";
import {useIntervalFn} from "@vueuse/core";


/**
 *  持续触发 任意socket某个事件
 *  startEventInterval({event:CE.KEYPRESS,eventData:{key:'pageup'}})"
 *
 */
export const useSocketStore = defineStore('socket', () => {
    const socket = ref(null)
    const isConnected = ref(false)


    const intervalData = ref(null);
    const interval = ref(50)

    const {
        pause: intervalPause,
        resume: intervalResume,
        isActive: intervalIsRun
    } = useIntervalFn((event, eventData) => {
        if (intervalData.value && isConnected.value) {
            emit(intervalData.value.event, intervalData.value.eventData)
        } else {
            intervalPause();
        }
    }, interval)

    function connect() {
        if (!socket.value) {
            socket.value = io(import.meta.env.VITE_SOCKET_URL, {
                autoConnect: true,
                transports: ['websocket']
            })

            socket.value.on('connect', () => {
                isConnected.value = true
            })

            socket.value.on('disconnect', () => {
                isConnected.value = false
            })

            socket.value.on(CO.RESPONSE, (data) => {
                console.log("response>>>>>>>>" + data)
            })
        }
    }

    function on(event, callback) {
        socket.value?.on(event, callback)
    }

    function emit(event, data) {
        socket.value?.emit(event, data)
    }




    const startEventInterval = (data) => {
        intervalData.value = {...data};
        intervalResume();
    }

    const stopEventInterval = () => {
        if (intervalIsRun) {
            intervalData.value = null;
            intervalPause();
        }
    }

    function setInterval(val) {
        interval.value = val;
    }

    function disconnect() {
        socket.value?.disconnect()
        socket.value = null
    }









    return {socket, isConnected, connect, disconnect, on, emit,startIntervalPress: startEventInterval, clearKeyEvent: stopEventInterval,  intervalIsRun}
})